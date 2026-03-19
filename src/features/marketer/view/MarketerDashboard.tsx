import { useState } from"react";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { toast } from"sonner";
import {
 HiTrendingUp,
 HiShoppingBag,
 HiCheckCircle,
 HiCurrencyDollar,
 HiClock,
 HiDownload,
 HiExternalLink,
 HiClipboardCopy,
 HiChevronLeft,
 HiChevronRight,
} from"react-icons/hi";
import {
 useMarketerStatistics,
 useMarketerProfile,
 useMarketerOrders,
 useMonthlyOrders,
 useMarketerTransactions,
 useMarketerWithdrawRequests,
 useCreateWithdrawRequest,
} from"../hooks/useMarketer";

// ==================== Stat Card ====================
function StatCard({
 icon: Icon,
 label,
 value,
 color,
 subLabel,
}: {
 icon: React.ElementType;
 label: string;
 value: string | number;
 color: string;
 subLabel?: string;
}) {
 return (
 <div className="bg-custom-card rounded-2xl p-5 shadow-sm border border-custom-primary flex items-start gap-4">
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
 <Icon className="w-6 h-6 text-white"/>
 </div>
 <div className="min-w-0">
 <p className="text-sm text-text-secondary mb-1 truncate">{label}</p>
 <p className="text-xl font-bold text-text-primary">{value}</p>
 {subLabel && <p className="text-xs text-text-secondary mt-0.5">{subLabel}</p>}
 </div>
 </div>
 );
}

// ==================== Monthly Bar Chart ====================
const MONTH_KEYS = [
"January","February","March","April","May","June",
"July","August","September","October","November","December",
];

const MONTH_LABELS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_LABELS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

function MonthlyChart({ data, isRTL }: { data: Record<string, { completed_orders: number; earned_commission: number }> | undefined; isRTL: boolean }) {
 const { t } = useTranslation();
 const [hovered, setHovered] = useState<number | null>(null);

 const values = MONTH_KEYS.map((m) => data?.[m]?.earned_commission ?? 0);
 const maxVal = Math.max(...values, 1);
 const labels = isRTL ? MONTH_LABELS_AR : MONTH_LABELS_EN;

 return (
 <div className="bg-custom-card rounded-2xl p-6 shadow-sm border border-custom-primary">
 <h3 className="font-semibold text-text-primary mb-6">
 {t("marketer.dashboard.monthlyPerformance","Monthly Performance")}
 </h3>
 <div className="flex items-end gap-1.5 h-40"dir="ltr">
 {values.map((val, i) => {
 const heightPct = (val / maxVal) * 100;
 const isActive = hovered === i;
 return (
 <div
 key={i}
 className="flex flex-col items-center flex-1 gap-1 group cursor-pointer"
 onMouseEnter={() => setHovered(i)}
 onMouseLeave={() => setHovered(null)}
 >
 {/* Tooltip */}
 <div className={`text-xs font-semibold px-2 py-1 rounded-lg transition-all duration-200 whitespace-nowrap ${isActive ?"opacity-100 bg-primary text-white":"opacity-0"}`}>
 {val.toLocaleString()}
 </div>
 {/* Bar */}
 <div className="w-full relative flex items-end"style={{ height:"100px"}}>
 <div
 className={`w-full rounded-t-md transition-all duration-300 ${
 isActive
 ?"bg-primary"
 : val > 0
 ?"bg-primary-light/70"
 :"bg-custom-tertiary"
 }`}
 style={{ height: `${Math.max(heightPct, val > 0 ? 4 : 2)}%` }}
 />
 </div>
 {/* Month label */}
 <span className="text-[10px] text-text-secondary leading-none">
 {labels[i]}
 </span>
 </div>
 );
 })}
 </div>
 </div>
 );
}

// ==================== Orders Table ====================
function OrdersTable({
 items,
 pagination,
 page,
 onPage,
 isLoading,
 isRTL,
}: {
 items: any[];
 pagination: any;
 page: number;
 onPage: (p: number) => void;
 isLoading: boolean;
 isRTL: boolean;
}) {
 const { t } = useTranslation();

 const statusBadge = (status: string) => {
 const map: Record<string, string> = {
 delivered:"bg-green-100 text-green-700",
 pending:"bg-yellow-100 text-yellow-700",
 cancelled:"bg-red-100 text-red-700",
 preparing:"bg-blue-100 text-blue-700",
 out_delivery:"bg-orange-100 text-orange-700",
 };
 return map[status] ??"bg-custom-tertiary text-custom-secondary";
 };

 return (
 <div className="bg-custom-card rounded-2xl shadow-sm border border-custom-primary overflow-hidden">
 <div className="p-6 border-b border-custom-primary">
 <h3 className="font-semibold text-text-primary">
 {t("marketer.dashboard.recentOrders","Recent Orders")}
 </h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-sm"dir={isRTL ?"rtl":"ltr"}>
 <thead>
 <tr className="bg-custom-light">
 <th className="px-4 py-3 text-start font-medium text-text-secondary">#</th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.customer","Customer")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.total","Total")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.commission","Commission")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.source","Source")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.status","Status")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.date","Date")}
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-custom-primary ">
 {isLoading ? (
 Array.from({ length: 5 }).map((_, i) => (
 <tr key={i}>
 {Array.from({ length: 7 }).map((__, j) => (
 <td key={j} className="px-4 py-3">
 <div className="h-4 bg-custom-tertiary rounded animate-pulse"/>
 </td>
 ))}
 </tr>
 ))
 ) : items.length === 0 ? (
 <tr>
 <td colSpan={7} className="px-4 py-10 text-center text-text-secondary">
 {t("marketer.dashboard.noOrders","No orders yet")}
 </td>
 </tr>
 ) : (
 items.map((order) => {
 const commission = (order.total * order.affiliate_rate) / 100;
 return (
 <tr
 key={order.id}
 className="hover:bg-custom-light transition-colors"
 >
 <td className="px-4 py-3 text-text-secondary font-mono text-xs">
 #{order.id}
 </td>
 <td className="px-4 py-3">
 <div>
 <p className="font-medium text-text-primary">{order.user.name}</p>
 <p className="text-xs text-text-secondary">{order.user.phone}</p>
 </div>
 </td>
 <td className="px-4 py-3 font-semibold text-text-primary">
 {order.total.toLocaleString()}
 </td>
 <td className="px-4 py-3 font-semibold text-green-600">
 +{commission.toLocaleString()}
 </td>
 <td className="px-4 py-3">
 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
 order.affiliate_source ==="coupon"
 ?"bg-purple-100 text-purple-700"
 :"bg-blue-100 text-blue-700"
 }`}>
 {order.affiliate_source ==="coupon"
 ? t("marketer.dashboard.coupon","Coupon")
 : t("marketer.dashboard.link","Link")}
 </span>
 </td>
 <td className="px-4 py-3">
 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(order.status)}`}>
 {order.status}
 </span>
 </td>
 <td className="px-4 py-3 text-text-secondary text-xs">
 {new Date(order.created_at).toLocaleDateString()}
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 {pagination && pagination.last_page > 1 && (
 <div className="p-4 border-t border-custom-primary flex items-center justify-between">
 <span className="text-sm text-text-secondary">
 {t("marketer.dashboard.page","Page")} {pagination.current_page} / {pagination.last_page}
 </span>
 <div className="flex gap-2">
 <button
 disabled={page <= 1}
 onClick={() => onPage(page - 1)}
 className="p-2 rounded-lg border border-custom-primary disabled:opacity-40 hover:bg-custom-light transition-colors"
 >
 {isRTL ? <HiChevronRight className="w-4 h-4"/> : <HiChevronLeft className="w-4 h-4"/>}
 </button>
 <button
 disabled={page >= pagination.last_page}
 onClick={() => onPage(page + 1)}
 className="p-2 rounded-lg border border-custom-primary disabled:opacity-40 hover:bg-custom-light transition-colors"
 >
 {isRTL ? <HiChevronLeft className="w-4 h-4"/> : <HiChevronRight className="w-4 h-4"/>}
 </button>
 </div>
 </div>
 )}
 </div>
 );
}

// ==================== Withdraw Modal ====================
function WithdrawModal({
 availableBalance,
 onClose,
 onSubmit,
 isPending,
}: {
 availableBalance: number;
 onClose: () => void;
 onSubmit: (amount: number) => void;
 isPending: boolean;
}) {
 const { t } = useTranslation();
 const [amount, setAmount] = useState("");

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 const num = parseFloat(amount);
 if (!num || num <= 0) {
 toast.error(t("marketer.dashboard.invalidAmount","Enter a valid amount"));
 return;
 }
 if (num > availableBalance) {
 toast.error(t("marketer.dashboard.insufficientBalance","Amount exceeds available balance"));
 return;
 }
 onSubmit(num);
 };

 return (
 <>
 <div className="fixed inset-0 bg-black/50 z-40"onClick={onClose} />
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div
 className="bg-custom-card rounded-2xl shadow-xl max-w-sm w-full p-6"
 onClick={(e) => e.stopPropagation()}
 >
 <h3 className="text-lg font-bold text-text-primary mb-4">
 {t("marketer.dashboard.withdrawTitle","Request Withdrawal")}
 </h3>
 <p className="text-sm text-text-secondary mb-4">
 {t("marketer.dashboard.availableBalance","Available balance")}:{""}
 <span className="font-semibold text-green-600">{availableBalance.toLocaleString()}</span>
 </p>
 <form onSubmit={handleSubmit} className="space-y-4">
 <input
 type="number"
 value={amount}
 onChange={(e) => setAmount(e.target.value)}
 placeholder={t("marketer.dashboard.enterAmount","Enter amount")}
 min={1}
 max={availableBalance}
 step="0.01"
 className="w-full px-4 py-3 rounded-xl border border-custom-primary bg-custom-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
 />
 <div className="flex gap-3">
 <button
 type="button"
 onClick={onClose}
 className="flex-1 py-3 rounded-xl border border-custom-primary text-text-secondary hover:bg-custom-light transition-colors"
 >
 {t("common.cancel","Cancel")}
 </button>
 <button
 type="submit"
 disabled={isPending}
 className="flex-1 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
 >
 {isPending
 ? t("common.loading","Loading...")
 : t("marketer.dashboard.withdraw","Withdraw")}
 </button>
 </div>
 </form>
 </div>
 </div>
 </>
 );
}

// ==================== Main Dashboard ====================
export default function MarketerDashboard() {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const [ordersPage, setOrdersPage] = useState(1);
 const [showWithdraw, setShowWithdraw] = useState(false);
 const [activeTab, setActiveTab] = useState<"orders"|"transactions"|"withdrawals">("orders");
 const [txType, setTxType] = useState<string>("");
 const [txPage, setTxPage] = useState(1);

 const { data: stats, isLoading: statsLoading } = useMarketerStatistics();
 const { data: profile, isLoading: profileLoading } = useMarketerProfile();
 const { data: ordersData, isLoading: ordersLoading } = useMarketerOrders({
 per_page: 10,
 page: ordersPage,
 });
 const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyOrders();
 const { data: txData, isLoading: txLoading } = useMarketerTransactions({
 per_page: 10,
 type: txType || undefined,
 page: txPage,
 });
 const { data: withdrawals } = useMarketerWithdrawRequests({ per_page: 10 });
 const withdrawMutation = useCreateWithdrawRequest();

 const handleCopyLink = () => {
 if (profile?.affiliate_link) {
 navigator.clipboard.writeText(profile.affiliate_link);
 toast.success(t("marketer.dashboard.linkCopied","Link copied!"));
 }
 };

 const handleWithdraw = (amount: number) => {
 withdrawMutation.mutate(amount, {
 onSuccess: () => setShowWithdraw(false),
 });
 };

 return (
 <div className="space-y-6"dir={isRTL ?"rtl":"ltr"}>
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 className="text-2xl font-bold text-text-primary">
 {t("marketer.dashboard.title","Marketer Dashboard")}
 </h1>
 <p className="text-text-secondary text-sm mt-1">
 {t("marketer.dashboard.subtitle","Track your performance and earnings")}
 </p>
 </div>
 {(stats?.available_balance ?? 0) > 0 && (
 <button
 onClick={() => setShowWithdraw(true)}
 className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
 >
 <HiDownload className="w-5 h-5"/>
 {t("marketer.dashboard.requestWithdraw","Request Withdraw")}
 </button>
 )}
 </div>

 {/* Affiliate Link & Info Card */}
 {(profileLoading || profile) && (
 <div
 className="rounded-2xl p-6 text-white"
 style={{ background:"linear-gradient(135deg, #2C8090 0%, #4CDAF6 100%)"}}
 >
 {profileLoading ? (
 <div className="animate-pulse space-y-3">
 <div className="h-5 bg-custom-card/20 rounded w-1/3"/>
 <div className="h-4 bg-custom-card/20 rounded w-2/3"/>
 </div>
 ) : profile ? (
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div className="space-y-2">
 <div className="flex items-center gap-2">
 <span className="text-white/80 text-sm">
 {t("marketer.dashboard.affiliateId","Affiliate ID")}:
 </span>
 <span className="font-bold text-lg">{profile.affiliate_id}</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-white/80 text-sm">
 {t("marketer.dashboard.commissionRate","Commission Rate")}:
 </span>
 <span className="font-bold text-xl">{profile.rate}%</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-white/80 text-sm">
 {t("marketer.dashboard.totalVisits","Total Visits")}:
 </span>
 <span className="font-semibold">{profile.total_visites.toLocaleString()}</span>
 </div>
 {profile.coupon && (
 <div className="flex items-center gap-2">
 <span className="text-white/80 text-sm">
 {t("marketer.dashboard.couponCode","Coupon")}:
 </span>
 <span className="font-bold bg-custom-card/20 px-2 py-0.5 rounded">
 {profile.coupon.code}
 </span>
 </div>
 )}
 </div>

 <div className="flex flex-col gap-2">
 <button
 onClick={handleCopyLink}
 className="flex items-center gap-2 bg-custom-card/20 hover:bg-custom-card/30 text-white px-4 py-2.5 rounded-xl transition-colors text-sm font-medium"
 >
 <HiClipboardCopy className="w-4 h-4"/>
 {t("marketer.dashboard.copyLink","Copy Affiliate Link")}
 </button>
 <a
 href={profile.affiliate_link}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-2 bg-custom-card/10 hover:bg-custom-card/20 text-white px-4 py-2.5 rounded-xl transition-colors text-sm"
 >
 <HiExternalLink className="w-4 h-4"/>
 {t("marketer.dashboard.viewLink","View Link")}
 </a>
 </div>
 </div>
 ) : null}
 </div>
 )}

 {/* Stats Grid */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {statsLoading ? (
 Array.from({ length: 7 }).map((_, i) => (
 <div key={i} className="bg-custom-card rounded-2xl p-5 animate-pulse">
 <div className="flex gap-4">
 <div className="w-12 h-12 bg-custom-tertiary rounded-xl"/>
 <div className="flex-1 space-y-2 py-1">
 <div className="h-3 bg-custom-tertiary rounded"/>
 <div className="h-5 bg-custom-tertiary rounded w-2/3"/>
 </div>
 </div>
 </div>
 ))
 ) : stats ? (
 <>
 <StatCard
 icon={HiShoppingBag}
 label={t("marketer.dashboard.totalOrders","Total Orders")}
 value={stats.total_orders.toLocaleString()}
 color="bg-blue-500"
 />
 <StatCard
 icon={HiCheckCircle}
 label={t("marketer.dashboard.deliveredOrders","Delivered")}
 value={stats.delivered_orders.toLocaleString()}
 color="bg-green-500"
 />
 <StatCard
 icon={HiTrendingUp}
 label={t("marketer.dashboard.totalSales","Total Sales")}
 value={stats.total_sales.toLocaleString()}
 color="bg-purple-500"
 />
 <StatCard
 icon={HiCurrencyDollar}
 label={t("marketer.dashboard.earnedCommission","Earned Commission")}
 value={stats.earned_commission.toLocaleString()}
 color="bg-teal-500"
 />
 <StatCard
 icon={HiClock}
 label={t("marketer.dashboard.pendingEarnings","Pending Earnings")}
 value={stats.pending_earnings.toLocaleString()}
 color="bg-orange-400"
 />
 <StatCard
 icon={HiDownload}
 label={t("marketer.dashboard.withdrawn","Withdrawn")}
 value={stats.withdrawn.toLocaleString()}
 color="bg-custom-hover"
 />
 <div className="col-span-2">
 <StatCard
 icon={HiCurrencyDollar}
 label={t("marketer.dashboard.availableBalance","Available Balance")}
 value={stats.available_balance.toLocaleString()}
 color="bg-primary"
 subLabel={t("marketer.dashboard.readyToWithdraw","Ready to withdraw")}
 />
 </div>
 </>
 ) : null}
 </div>

 {/* Monthly Chart */}
 {monthlyLoading ? (
 <div className="bg-custom-card rounded-2xl p-6 animate-pulse h-48"/>
 ) : (
 <MonthlyChart
 data={monthlyData?.monthly_performance}
 isRTL={isRTL}
 />
 )}

 {/* Tabs */}
 <div className="flex gap-2 flex-wrap">
 {(["orders","transactions","withdrawals"] as const).map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
 activeTab === tab
 ?"bg-primary text-white shadow-sm"
 :"bg-custom-card text-text-secondary border border-custom-primary hover:border-primary"
 }`}
 >
 {tab ==="orders"
 ? t("marketer.dashboard.orders","Orders")
 : tab ==="transactions"
 ? t("marketer.dashboard.transactions","Transactions")
 : t("marketer.dashboard.withdrawals","Withdrawals")}
 </button>
 ))}
 </div>

 {/* Orders Table */}
 {activeTab ==="orders"&& (
 <OrdersTable
 items={ordersData?.items ?? []}
 pagination={ordersData?.pagination}
 page={ordersPage}
 onPage={setOrdersPage}
 isLoading={ordersLoading}
 isRTL={isRTL}
 />
 )}

 {/* Transactions Table */}
 {activeTab ==="transactions"&& (
 <div className="bg-custom-card rounded-2xl shadow-sm border border-custom-primary overflow-hidden">
 <div className="p-4 border-b border-custom-primary flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
 <h3 className="font-semibold text-text-primary">
 {t("marketer.dashboard.transactions","Transactions")}
 </h3>
 <div className="flex gap-2">
 {(["","commission","withdraw"] as const).map((type) => (
 <button
 key={type}
 onClick={() => { setTxType(type); setTxPage(1); }}
 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
 txType === type
 ?"bg-primary text-white"
 :"bg-custom-tertiary text-text-secondary hover:bg-primary/10"
 }`}
 >
 {type ===""? t("orders.all","All") : type ==="commission"? t("marketer.dashboard.commission","Commission") : t("marketer.dashboard.withdraw","Withdraw")}
 </button>
 ))}
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-sm"dir={isRTL ?"rtl":"ltr"}>
 <thead>
 <tr className="bg-custom-light">
 <th className="px-4 py-3 text-start font-medium text-text-secondary">#</th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.transactionType","Type")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.amount","Amount")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.status","Status")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.orderId","Order")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.date","Date")}
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-custom-primary ">
 {txLoading ? (
 Array.from({ length: 5 }).map((_, i) => (
 <tr key={i}>
 {Array.from({ length: 6 }).map((__, j) => (
 <td key={j} className="px-4 py-3">
 <div className="h-4 bg-custom-tertiary rounded animate-pulse"/>
 </td>
 ))}
 </tr>
 ))
 ) : !txData?.items?.length ? (
 <tr>
 <td colSpan={6} className="px-4 py-10 text-center text-text-secondary">
 {t("marketer.dashboard.noTransactions","No transactions yet")}
 </td>
 </tr>
 ) : (
 txData.items.map((tx) => (
 <tr key={tx.id} className="hover:bg-custom-light transition-colors">
 <td className="px-4 py-3 text-text-secondary font-mono text-xs">#{tx.id}</td>
 <td className="px-4 py-3">
 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
 tx.type ==="commission"
 ?"bg-green-100 text-green-700"
 :"bg-orange-100 text-orange-700"
 }`}>
 {tx.type ==="commission"
 ? t("marketer.dashboard.commission","Commission")
 : t("marketer.dashboard.withdraw","Withdraw")}
 </span>
 </td>
 <td className={`px-4 py-3 font-semibold ${tx.type ==="commission"?"text-green-600":"text-orange-500"}`}>
 {tx.type ==="commission"?"+":"-"}{Number(tx.amount).toLocaleString()}
 </td>
 <td className="px-4 py-3">
 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
 {tx.status}
 </span>
 </td>
 <td className="px-4 py-3 text-text-secondary text-xs">
 {tx.order_id ? `#${tx.order_id}` :"—"}
 </td>
 <td className="px-4 py-3 text-text-secondary text-xs">
 {new Date(tx.created_at).toLocaleDateString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 {txData?.pagination && txData.pagination.last_page > 1 && (
 <div className="p-4 border-t border-custom-primary flex items-center justify-between">
 <span className="text-sm text-text-secondary">
 {t("marketer.dashboard.page","Page")} {txData.pagination.current_page} / {txData.pagination.last_page}
 </span>
 <div className="flex gap-2">
 <button
 disabled={txPage <= 1}
 onClick={() => setTxPage(txPage - 1)}
 className="p-2 rounded-lg border border-custom-primary disabled:opacity-40 hover:bg-custom-light transition-colors"
 >
 {isRTL ? <HiChevronRight className="w-4 h-4"/> : <HiChevronLeft className="w-4 h-4"/>}
 </button>
 <button
 disabled={txPage >= txData.pagination.last_page}
 onClick={() => setTxPage(txPage + 1)}
 className="p-2 rounded-lg border border-custom-primary disabled:opacity-40 hover:bg-custom-light transition-colors"
 >
 {isRTL ? <HiChevronLeft className="w-4 h-4"/> : <HiChevronRight className="w-4 h-4"/>}
 </button>
 </div>
 </div>
 )}
 </div>
 )}

 {/* Withdrawals Table */}
 {activeTab ==="withdrawals"&& (
 <div className="bg-custom-card rounded-2xl shadow-sm border border-custom-primary overflow-hidden">
 <div className="p-6 border-b border-custom-primary flex items-center justify-between">
 <h3 className="font-semibold text-text-primary">
 {t("marketer.dashboard.withdrawHistory","Withdrawal History")}
 </h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-sm"dir={isRTL ?"rtl":"ltr"}>
 <thead>
 <tr className="bg-custom-light">
 <th className="px-4 py-3 text-start font-medium text-text-secondary">#</th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.amount","Amount")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.status","Status")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.note","Note")}
 </th>
 <th className="px-4 py-3 text-start font-medium text-text-secondary">
 {t("marketer.dashboard.date","Date")}
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-custom-primary ">
 {!withdrawals?.items?.length ? (
 <tr>
 <td colSpan={5} className="px-4 py-10 text-center text-text-secondary">
 {t("marketer.dashboard.noWithdrawals","No withdrawal requests yet")}
 </td>
 </tr>
 ) : (
 withdrawals.items.map((req) => (
 <tr
 key={req.id}
 className="hover:bg-custom-light transition-colors"
 >
 <td className="px-4 py-3 text-text-secondary font-mono text-xs">#{req.id}</td>
 <td className="px-4 py-3 font-semibold text-text-primary">
 {req.amount.toLocaleString()}
 </td>
 <td className="px-4 py-3">
 <span
 className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
 req.status ==="approved"
 ?"bg-green-100 text-green-700"
 : req.status ==="rejected"
 ?"bg-red-100 text-red-700"
 :"bg-yellow-100 text-yellow-700"
 }`}
 >
 {req.status}
 </span>
 </td>
 <td className="px-4 py-3 text-text-secondary text-xs">
 {req.note ??"—"}
 </td>
 <td className="px-4 py-3 text-text-secondary text-xs">
 {new Date(req.created_at).toLocaleDateString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* Withdraw Modal */}
 {showWithdraw && (
 <WithdrawModal
 availableBalance={stats?.available_balance ?? 0}
 onClose={() => setShowWithdraw(false)}
 onSubmit={handleWithdraw}
 isPending={withdrawMutation.isPending}
 />
 )}
 </div>
 );
}
