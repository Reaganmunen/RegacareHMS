// app/api/payments/cash/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { paymentId, amount } = await req.json();

    if (!paymentId || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { message: "paymentId and a positive amount are required" },
        { status: 400 }
      );
    }

    const payment = await db.payment.findUnique({
      where: { id: Number(paymentId) },
    });

    if (!payment) {
      return NextResponse.json(
        { message: "Payment record not found" },
        { status: 404 }
      );
    }

    const amountDue = payment.total_amount - payment.discount - payment.amount_paid;
    if (amountDue <= 0) {
      return NextResponse.json(
        { message: "This bill is already fully paid" },
        { status: 400 }
      );
    }

    const newAmountPaid = payment.amount_paid + Number(amount);
    const payable = payment.total_amount - payment.discount;

    // Determine PaymentStatus using your schema's enum: Paid | Unpaid | Part
    let newPaymentStatus: "Paid" | "Unpaid" | "Part" = "Part";
    if (newAmountPaid >= payable) {
      newPaymentStatus = "Paid";
    } else if (newAmountPaid <= 0) {
      newPaymentStatus = "Unpaid";
    }

    await db.payment.update({
      where: { id: Number(paymentId) },
      data: {
        amount_paid: newAmountPaid,
        payment_method: "Cash",           // PaymentMethods enum value
        payment_status: newPaymentStatus, // PaymentStatus enum: Paid | Part | Unpaid
        payment_date: new Date(),
      },
    });

    return NextResponse.json({ message: "Cash payment recorded successfully" });
  } catch (err: any) {
    console.error("[CASH PAYMENT ERROR]", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}