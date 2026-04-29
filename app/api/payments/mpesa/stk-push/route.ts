// app/api/payments/mpesa/stk-push/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const MPESA_BASE_URL =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

/** Normalize any Kenyan number to 254XXXXXXXXX */
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("+254")) return cleaned.slice(1);
  if (cleaned.startsWith("254")) return cleaned;
  if (cleaned.startsWith("0")) return "254" + cleaned.slice(1);
  return cleaned;
}

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  if (!res.ok) throw new Error("Failed to get M-Pesa access token");
  const data = await res.json();
  return data.access_token;
}

function getTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
}

function getDarajaPassword(timestamp: string): string {
  return Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, paymentId } = await req.json();

    if (!phone || !amount || !paymentId) {
      return NextResponse.json(
        { message: "phone, amount, and paymentId are required" },
        { status: 400 }
      );
    }

    // Verify payment exists and is not already fully paid
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

    const normalizedPhone = normalizePhone(String(phone));
    const token = await getAccessToken();
    const timestamp = getTimestamp();

    const stkPayload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: getDarajaPassword(timestamp),
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(Number(amount)),
      PartyA: normalizedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/mpesa/callback`,
      AccountReference: `BILL-${paymentId}`,
      TransactionDesc: `Payment for bill #${paymentId}`,
    };

    const stkRes = await fetch(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPayload),
      }
    );

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== "0") {
      throw new Error(stkData.CustomerMessage || "STK push rejected by Safaricom");
    }

    // Persist pending transaction for callback reconciliation
    await db.mpesaTransaction.create({
      data: {
        payment_id: Number(paymentId),
        checkout_request_id: stkData.CheckoutRequestID,
        merchant_request_id: stkData.MerchantRequestID ?? null,
        phone: normalizedPhone,
        amount: Math.ceil(Number(amount)),
        status: "PENDING",
      },
    });

    return NextResponse.json({
      message: "STK push sent successfully",
      checkoutRequestId: stkData.CheckoutRequestID,
    });
  } catch (err: any) {
    console.error("[MPESA STK-PUSH ERROR]", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}