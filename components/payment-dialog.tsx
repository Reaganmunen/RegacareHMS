"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Banknote,
  Smartphone,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

type PaymentMethod = "mpesa" | "cash" | null;
type PaymentStatus = "idle" | "loading" | "success" | "failed";

interface PaymentActionProps {
  paymentId: number;
  amountDue: number;
  patientPhone?: string;
}

export const PaymentAction = ({
  paymentId,
  amountDue,
  patientPhone = "",
}: PaymentActionProps) => {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [phone, setPhone] = useState(patientPhone);
  const [amount, setAmount] = useState(amountDue.toFixed(2));
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [mpesaRef, setMpesaRef] = useState("");

  const reset = () => {
    setMethod(null);
    setStatus("idle");
    setMpesaRef("");
    setAmount(amountDue.toFixed(2));
    setPhone(patientPhone);
  };

  const handleClose = (val: boolean) => {
    if (!val) reset();
    setOpen(val);
  };

  // ── M-Pesa STK Push ──────────────────────────────────────────────────────
  const handleMpesaPay = async () => {
    const cleaned = phone.replace(/\s+/g, "");
    if (!/^(07|01|\+2547|\+2541|2547|2541)\d{7,8}$/.test(cleaned)) {
      toast.error("Enter a valid Safaricom phone number");
      return;
    }
    if (Number(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/payments/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleaned,
          amount: Math.ceil(Number(amount)),
          paymentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "STK push failed");

      setMpesaRef(data.checkoutRequestId ?? "");
      setStatus("success");
      toast.success("M-Pesa prompt sent! Check your phone.");
    } catch (err: any) {
      setStatus("failed");
      toast.error(err.message || "M-Pesa request failed");
    }
  };

  // ── Cash Payment ─────────────────────────────────────────────────────────
  const handleCashPay = async () => {
    if (Number(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/payments/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, amount: Number(amount) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cash payment failed");

      setStatus("success");
      toast.success("Cash payment recorded successfully");
    } catch (err: any) {
      setStatus("failed");
      toast.error(err.message || "Failed to record cash payment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <button
          title="Record Payment"
          className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
        >
          <Banknote size={14} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Record Payment
          </DialogTitle>
        </DialogHeader>

        {/* ── Success screen ── */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="text-green-500" size={48} />
            <p className="font-semibold text-gray-800">
              {method === "mpesa"
                ? "M-Pesa prompt sent! The payment will confirm automatically."
                : "Cash payment recorded successfully!"}
            </p>
            {mpesaRef && (
              <p className="text-xs text-gray-500">Ref: {mpesaRef}</p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
          </div>
        )}

        {/* ── Failed screen ── */}
        {status === "failed" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <XCircle className="text-red-500" size={48} />
            <p className="font-semibold text-gray-800">Payment failed</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatus("idle")}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* ── Main form ── */}
        {(status === "idle" || status === "loading") && (
          <>
            {/* Method selector */}
            {!method && (
              <div className="flex flex-col gap-3 py-2">
                <p className="text-sm text-gray-500 mb-1">
                  Amount due:{" "}
                  <span className="font-semibold text-gray-800">
                    KES {amountDue.toFixed(2)}
                  </span>
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Select payment method
                </p>

                <button
                  onClick={() => setMethod("mpesa")}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Smartphone size={20} className="text-green-700" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">M-Pesa</p>
                    <p className="text-xs text-gray-500">
                      STK push to mobile phone
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setMethod("cash")}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Banknote size={20} className="text-blue-700" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">Cash</p>
                    <p className="text-xs text-gray-500">
                      Record a cash payment
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* M-Pesa form */}
            {method === "mpesa" && (
              <div className="flex flex-col gap-4 py-2">
                <button
                  onClick={() => setMethod(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 self-start"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Smartphone size={18} className="text-green-700 shrink-0" />
                  <p className="text-sm font-medium text-green-800">
                    M-Pesa STK Push
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="mpesa-phone">Safaricom Phone Number</Label>
                  <Input
                    id="mpesa-phone"
                    placeholder="e.g. 0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="mpesa-amount">Amount (KES)</Label>
                  <Input
                    id="mpesa-amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={status === "loading"}
                  />
                </div>

                <Button
                  onClick={handleMpesaPay}
                  disabled={status === "loading"}
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Sending prompt…
                    </>
                  ) : (
                    "Send M-Pesa Prompt"
                  )}
                </Button>
              </div>
            )}

            {/* Cash form */}
            {method === "cash" && (
              <div className="flex flex-col gap-4 py-2">
                <button
                  onClick={() => setMethod(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 self-start"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Banknote size={18} className="text-blue-700 shrink-0" />
                  <p className="text-sm font-medium text-blue-800">
                    Cash Payment
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cash-amount">Amount Received (KES)</Label>
                  <Input
                    id="cash-amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={status === "loading"}
                  />
                </div>

                <Button
                  onClick={handleCashPay}
                  disabled={status === "loading"}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Recording…
                    </>
                  ) : (
                    "Record Cash Payment"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};