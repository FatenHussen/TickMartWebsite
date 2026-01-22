import { HiChevronUpDown } from "react-icons/hi2";
import { cn } from "@/shared/lib/utils";
import type { Order, OrderStatus } from "../types";

type OrdersTableProps = {
  orders: Order[];
  onViewDetails: (orderId: number | string) => void;
  onTrackOrder?: (orderId: number | string) => void;
  onReorder?: (orderId: number | string) => void;
  onAddComplaint?: (orderId: number | string) => void;
};

const getStatusVariant = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "bg-custom-tertiary text-custom-secondary";
    case "preparing":
      return "bg-custom-accent-light text-custom-accent";
    // TODO: out_for_delivery uses yellow color not in design system - using accent as closest semantic equivalent
    case "out_for_delivery":
      return "bg-custom-accent-light text-custom-accent";
    // TODO: delivered uses green color - using CSS variable inline style
    case "delivered":
      return "";
    // TODO: cancelled uses red color not in design system - using closest semantic equivalent
    case "cancelled":
      return "bg-custom-tertiary text-custom-secondary";
    default:
      return "bg-custom-tertiary text-custom-secondary";
  }
};

const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "preparing":
      return "Preparing";
    case "out_for_delivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

export default function OrdersTable({
  orders,
  onViewDetails,
  onTrackOrder,
  onReorder,
  onAddComplaint,
}: OrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-custom-secondary">
            <th className="text-left py-3 px-4 text-sm font-semibold text-custom-primary">
              <div className="flex items-center gap-2">
                ORDER
                <HiChevronUpDown className="w-4 h-4 text-custom-tertiary" />
              </div>
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-custom-primary">
              STORE
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-custom-primary">
              ITEMS
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-custom-primary">
              STATUS
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-custom-primary">
              AMOUNT
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-custom-primary">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className={cn(
                "border-b border-custom-secondary hover:bg-custom-hover transition-colors",
                index === orders.length - 1 && "border-b-0"
              )}
            >
              {/* ORDER */}
              <td className="py-4 px-4">
                <div>
                  <div className="font-semibold text-custom-primary">
                    Order #{order.orderNumber}
                  </div>
                  <div className="text-sm text-custom-secondary mt-0.5">
                    {order.dateTime}
                  </div>
                </div>
              </td>

              {/* STORE */}
              <td className="py-4 px-4 text-sm text-custom-primary">
                {order.items[0]?.store || "-"}
              </td>

              {/* ITEMS */}
              <td className="py-4 px-4 text-sm text-custom-primary">
                {order.items.length} {order.items.length === 1 ? "item" : "items"}
                {order.additionalInfo && <span className="text-custom-secondary ml-1">{order.additionalInfo}</span>}
              </td>

              {/* STATUS */}
              <td className="py-4 px-4">
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                    getStatusVariant(order.status)
                  )}
                  style={order.status === "delivered" ? { backgroundColor: 'var(--color-accent-light-bg)', color: 'var(--color-green)' } : order.status === "out_for_delivery" ? { backgroundColor: 'var(--color-accent-light-bg)' } : undefined}
                >
                  {getStatusLabel(order.status)}
                </span>
              </td>

              {/* AMOUNT */}
              <td className="py-4 px-4 font-semibold text-custom-primary">
                {order.total}
              </td>

              {/* ACTIONS */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-4">
                  {order.actions.viewDetails && (
                    <button
                      type="button"
                      onClick={() => onViewDetails(order.id)}
                      className="text-sm font-medium text-custom-accent hover:underline"
                    >
                      View Details
                    </button>
                  )}
                  {order.actions.trackOrder && onTrackOrder && (
                    <button
                      type="button"
                      onClick={() => onTrackOrder(order.id)}
                      className="text-sm font-medium text-custom-accent hover:underline"
                    >
                      Track Order
                    </button>
                  )}
                  {order.actions.reorder && onReorder && (
                    <button
                      type="button"
                      onClick={() => onReorder(order.id)}
                      className="text-sm font-medium text-custom-accent hover:underline"
                    >
                      Reorder
                    </button>
                  )}
                  {order.actions.addComplaint && onAddComplaint && (
                    <button
                      type="button"
                      onClick={() => onAddComplaint(order.id)}
                      className="text-sm font-medium text-custom-secondary hover:underline"
                    >
                      Add Complaint
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

