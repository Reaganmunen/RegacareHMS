import db from "@/lib/db";
import { Table } from "../tables/table";
import { Payment } from "@prisma/client";
import { format } from "date-fns";
import { ViewAction } from "../action-options";
import { checkRole } from "@/utils/roles";
import { ActionDialog } from "../action-dialog";
import { PaymentAction } from "../payment-dialog";


const columns = [
  { header: "No", key: "id" },
  { header: "Bill Date", key: "bill_date" },
  { header: "Payment Date", key: "pay_date", className: "hidden md:table-cell" },
  { header: "Total", key: "total" },
  { header: "Discount", key: "discount", className: "hidden xl:table-cell" },
  { header: "Payable", key: "payable", className: "hidden xl:table-cell" },
  { header: "Paid", key: "paid", className: "hidden xl:table-cell" },
  { header: "Status", key: "status", className: "hidden xl:table-cell" },
  { header: "Actions", key: "action" },
];

export const PaymentsContainer = async ({
  patientId,
}: {
  patientId: string;
}) => {
  const data = await db.payment.findMany({
    where: { patient_id: patientId },
  });

  if (!data) return null;

  const isAdmin = await checkRole("Admin");
  const isCashier = await checkRole("Cashier");
  const isDoctor = await checkRole("Doctor");

  const renderRow = (item: Payment) => {
    const payable = item.total_amount - item.discount;
    const amountDue = payable - item.amount_paid;

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
        <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
          #{item?.id}
        </td>
        <td className="lowercase">{format(item?.bill_date, "MMM d, yyyy")}</td>
        <td className="hidden items-center py-2 md:table-cell">
          {format(item?.payment_date, "MMM d, yyyy")}
        </td>
        <td>{item?.total_amount.toFixed(2)}</td>
        <td className="hidden xl:table-cell">{item?.discount.toFixed(2)}</td>
        <td className="hidden xl:table-cell">{payable.toFixed(2)}</td>
        <td className="hidden xl:table-cell">{item?.amount_paid.toFixed(2)}</td>
        <td className="hidden xl:table-cell">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.payment_status === "Paid"
                ? "bg-green-100 text-green-700"
                : item.payment_status === "Part"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.payment_status}
          </span>
        </td>
        <td>
          <div className="flex items-center gap-1">
            <ViewAction
              href={`/record/appointments/${item?.appointment_id}?cat=bills`}
            />

            {/* Show payment button only if not fully paid and user is cashier or admin */}
            {(isAdmin || isCashier || isDoctor) && item.payment_status !== "Paid" && (
              <PaymentAction
                paymentId={item.id}
                amountDue={amountDue}
              />
            )}

            {isAdmin && (
              <ActionDialog
                type="delete"
                deleteType="payment"
                id={item?.id.toString()}
              />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl p-2 md:p-4 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <p className="text-2xl font-semibold">{data?.length ?? 0}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total records
          </span>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};