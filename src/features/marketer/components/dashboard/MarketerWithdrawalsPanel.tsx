import { useTranslation } from "react-i18next";
import type { WithdrawRequest } from "@/features/marketer/types";

interface MarketerWithdrawalsPanelProps {
    requests: WithdrawRequest[] | undefined;
    isRTL: boolean;
}

function withdrawalStatusBadgeClass(status: WithdrawRequest["status"]): string {
    if (status === "approved") return "bg-status-success-bg text-success";
    if (status === "rejected") return "bg-status-error-bg text-error";
    return "bg-warning-bg text-warning-dark";
}

export function MarketerWithdrawalsPanel({ requests, isRTL }: MarketerWithdrawalsPanelProps) {
    const { t } = useTranslation();

    return (
        <div className="overflow-hidden rounded-2xl border border-custom-primary bg-custom-card shadow-sm">
            <div className="flex items-center justify-between border-b border-custom-primary p-6">
                <h3 className="font-semibold text-text-primary">
                    {t("marketer.dashboard.withdrawHistory", "Withdrawal History")}
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm" dir={isRTL ? "rtl" : "ltr"}>
                    <thead>
                        <tr className="bg-custom-light">
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">#</th>
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">
                                {t("marketer.dashboard.amount", "Amount")}
                            </th>
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">
                                {t("marketer.dashboard.status", "Status")}
                            </th>
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">
                                {t("marketer.dashboard.note", "Note")}
                            </th>
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">
                                {t("marketer.dashboard.date", "Date")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-custom-primary ">
                        {!requests?.length ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-text-secondary">
                                    {t("marketer.dashboard.noWithdrawals", "No withdrawal requests yet")}
                                </td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr key={request.id} className="transition-colors hover:bg-custom-light">
                                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">#{request.id}</td>
                                    <td className="px-4 py-3 font-semibold text-text-primary">
                                        {request.amount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${withdrawalStatusBadgeClass(request.status)}`}
                                        >
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-text-secondary">{request.note ?? "—"}</td>
                                    <td className="px-4 py-3 text-xs text-text-secondary">
                                        {new Date(request.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
