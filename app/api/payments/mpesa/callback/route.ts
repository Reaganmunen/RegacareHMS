// app/api/payments/mpesa/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const stkCallback = body?.Body?.stkCallback;

    if (!stkCallback) {
      return NextResponse.json({ message: "Invalid callback body" }, { status: 400 });
    }

    const {
      CheckoutRequestID: checkoutRequestId,
      ResultCode: resultCode,
      ResultDesc: resultDesc,
      CallbackMetadata,
    } = stkCallback;

    // Find the pending transaction  saved during STK push
    const mpesaTx = await db.mpesaTransaction.findUnique({
      where: { checkout_request_id: checkoutRequestId },
      include: { payment: true },
    });

    if (!mpesaTx) {
      console.error(`[MPESA CALLBACK] No transaction found for CheckoutRequestID: ${checkoutRequestId}`);
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    if (resultCode === 0) {
      // ── Payment successful ──────────────────────────────────────────────

      // Extract metadata items Safaricom sends back
      const meta: Record<string, any> = {};
      CallbackMetadata?.Item?.forEach((item: { Name: string; Value: any }) => {
        meta[item.Name] = item.Value;
      });

      const amountPaid: number = meta.Amount ?? mpesaTx.amount;
      const mpesaReceipt: string | null = meta.MpesaReceiptNumber ?? null;

      const payment = mpesaTx.payment;
      const newAmountPaid = payment.amount_paid + amountPaid;
      const payable = payment.total_amount - payment.discount;

      // Determine the new PaymentStatus based on  schema's enum:
      // Paid | Unpaid | Part
      let newPaymentStatus: "Paid" | "Unpaid" | "Part" = "Part";
      if (newAmountPaid >= payable) {
        newPaymentStatus = "Paid";
      } else if (newAmountPaid <= 0) {
        newPaymentStatus = "Unpaid";
      }

      await db.$transaction([
        // Mark the mpesa transaction as successful
        db.mpesaTransaction.update({
          where: { id: mpesaTx.id },
          data: {
            status: "SUCCESS",
            mpesa_receipt: mpesaReceipt,
            result_desc: resultDesc,
          },
        }),

        // Update the Payment record using your actual schema fields:
        // amount_paid, payment_method (Mpesa from enum), payment_status, payment_date
        db.payment.update({
          where: { id: mpesaTx.payment_id },
          data: {
            amount_paid: newAmountPaid,
            payment_method: "Mpesa",        // PaymentMethods enum value we added
            payment_status: newPaymentStatus, // PaymentStatus enum: Paid | Part | Unpaid
            payment_date: new Date(),
          },
        }),
      ]);

      console.log(
        `[MPESA CALLBACK] Payment ${mpesaTx.payment_id} updated — receipt: ${mpesaReceipt}, status: ${newPaymentStatus}`
      );
    } else {
      // ── Payment failed or cancelled by user ─────────────────────────────
      await db.mpesaTransaction.update({
        where: { id: mpesaTx.id },
        data: {
          status: "FAILED",
          result_desc: resultDesc,
        },
      });

      console.log(
        `[MPESA CALLBACK] Payment ${mpesaTx.payment_id} FAILED — ${resultDesc}`
      );
    }

    // Always return 200 to Safaricom or they will keep retrying
    return NextResponse.json({ message: "Callback received" }, { status: 200 });
  } catch (err: any) {
    console.error("[MPESA CALLBACK ERROR]", err);
    // Still return 200 so Safaricom doesn't retry endlessly
    return NextResponse.json({ message: "Server error" }, { status: 200 });
  }
}