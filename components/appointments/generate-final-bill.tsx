"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { generateBill } from "@/app/actions/medical";
import {
  PaymentSchema,
  PaymentFormInput,
  PaymentFormOutput,
} from "@/lib/schema";

import { Button } from "../ui/button";
import { CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { CustomInput } from "../ui/custom-input";

interface DataProps {
  id?: string | number;
  total_bill: number;
}

export const GenerateFinalBills = ({ id, total_bill }: DataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<PaymentFormInput>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      id: id?.toString() ?? "",
      // IMPORTANT: HTML date input expects string
      bill_date: new Date().toISOString().split("T")[0],
      discount: "0",
      total_amount: total_bill.toString(),
    },
  });

  const handleOnSubmit: SubmitHandler<PaymentFormInput> = async (values) => {
    try {
      setIsLoading(true);

      // After resolver runs, values are parsed by Zod
      const parsedValues: PaymentFormOutput =
        PaymentSchema.parse(values);

      const resp = await generateBill(parsedValues);

      if (resp.success) {
        toast.success("Patient bill generated successfully!");
        router.refresh();
        form.reset();
      } else if (resp.error) {
        toast.error(resp.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-sm font-normal">
          <Plus size={22} className="text-gray-400" />
          Generate Final Bill
        </Button>
      </DialogTrigger>

      <DialogContent>
        <CardHeader className="px-0">
          <DialogTitle>Patient Medical Bill</DialogTitle>
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="space-y-6"
          >
            <div>
              <span className="text-sm text-gray-500">Total Bill</span>
              <p className="text-3xl font-semibold">
                {total_bill?.toFixed(2)}
              </p>
            </div>

            <CustomInput
              control={form.control}
              name="discount"
              placeholder="eg.: 5"
              label="Discount (%)" type={"input"}            />

            <CustomInput
              control={form.control}
              name="bill_date"
              label="Bill Date"
              inputType="date" type={"input"}            />

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 w-full"
            >
              {isLoading ? "Generating..." : "Generate Bill"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};