import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import Button from "@/shared/ui/Button";
import { PremiumAppLoader } from "@/shared/component/loading";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";
import {
  useApproveCustomOrder,
  useCancelCustomOrder,
  useCustomOrderDetails,
} from "../hooks/useCustomOrders";
import CustomOrderStatusBadge from "../components/CustomOrderStatusBadge";
import CustomOrderPricingTable from "../components/CustomOrderPricingTable";
import {
  getLinkedOrderId,
  isCancelledStatus,
  resolveCustomOrderImageUrl,
} from "../utils/customOrderHelpers";

export default function CustomOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const { data: request, isLoading, isError, refetch } = useCustomOrderDetails(id);
  const approveMutation = useApproveCustomOrder();
  const cancelMutation = useCancelCustomOrder();

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  if (isLoading) {
    return <PremiumAppLoader minHeight="min-h-[400px]" />;
  }

  if (isError || !request) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <p className="text-custom-secondary">{t("customOrder.notFound")}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => (isError ? refetch() : navigate(paths.client.customOrders))}
        >
          {isError ? t("errors.retry") : t("customOrder.backToList")}
        </Button>
      </div>
    );
  }

  const canApprove = Boolean(request.actions?.can_approve);
  const canCancel = Boolean(request.actions?.can_cancel);
  const status = request.status;
  const linkedOrderId = getLinkedOrderId(request.order);
  const images = (request.images ?? [])
    .map((img) => resolveCustomOrderImageUrl(img))
    .filter((url): url is string => Boolean(url));

  const handleApprove = () => {
    approveMutation.mutate(request.id, {
      onSuccess: (res) => {
        toast.success(getApiSuccessMessage(res, t("customOrder.approveSuccess")));
        const orderId = getLinkedOrderId(res.data.order) ?? linkedOrderId;
        if (orderId) {
          navigate(paths.client.trackOrderById(orderId));
        } else {
          refetch();
        }
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, t("customOrder.approveFailed")));
      },
    });
  };

  const handleCancel = () => {
    cancelMutation.mutate(request.id, {
      onSuccess: (res) => {
        toast.success(getApiSuccessMessage(res, t("customOrder.cancelSuccess")));
        setConfirmCancel(false);
        refetch();
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, t("customOrder.cancelFailed")));
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6" dir={isRTL ? "rtl" : "ltr"}>
      <button
        type="button"
        onClick={() => navigate(paths.client.customOrders)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-custom-secondary hover:text-primary"
      >
        <BackIcon className="h-4 w-4" />
        {t("customOrder.backToList")}
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-custom-primary">
            <Zap className="h-6 w-6 text-primary" aria-hidden />
            {t("customOrder.requestNumber", { id: request.id })}
          </h1>
          {request.created_at && (
            <time className="mt-1 block text-xs text-custom-tertiary">
              {new Date(request.created_at).toLocaleString()}
            </time>
          )}
        </div>
        <CustomOrderStatusBadge status={status} />
      </div>

      <section className="mb-6 rounded-2xl border border-custom-primary/12 bg-custom-card p-5">
        <h2 className="mb-2 text-sm font-semibold text-custom-secondary">
          {t("customOrder.description")}
        </h2>
        <p className="whitespace-pre-wrap text-custom-primary">{request.description}</p>

        {images.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-3">
            {images.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  <img
                    src={url}
                    alt=""
                    className="h-28 w-28 rounded-xl object-cover border border-custom-primary/10"
                  />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {status === "pending_pricing" && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-custom-primary"
        >
          {t("customOrder.pendingPricingNotice")}
        </div>
      )}

      {status === "waiting_approval" && request.order && (
        <section className="mb-6 space-y-4">
          <h2 className="text-lg font-bold text-custom-primary">
            {t("customOrder.pricedOrder")}
          </h2>
          <CustomOrderPricingTable order={request.order} />
        </section>
      )}

      {status === "approved" && (
        <section className="mb-6 rounded-2xl border border-success/25 bg-success/10 p-5">
          <p className="font-medium text-custom-primary">{t("customOrder.approvedNotice")}</p>
          {linkedOrderId && (
            <Link
              to={paths.client.trackOrderById(linkedOrderId)}
              className="mt-3 inline-flex font-semibold text-primary hover:underline"
            >
              {t("customOrder.viewSystemOrder")}
              {request.order?.status ? ` (${t(`orders.${request.order.status}`, request.order.status)})` : ""}
            </Link>
          )}
        </section>
      )}

      {isCancelledStatus(status) && (
        <section className="mb-6 rounded-2xl border border-[color-mix(in_srgb,var(--color-ui-red-500)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-ui-red-500)_8%,var(--color-bg-card))] p-5">
          <p className="font-medium text-custom-primary">{t("customOrder.cancelledNotice")}</p>
          {request.rejection_reason && (
            <p className="mt-2 text-sm text-custom-secondary">
              <span className="font-semibold">{t("customOrder.rejectionReason")}: </span>
              {request.rejection_reason}
            </p>
          )}
        </section>
      )}

      {(canApprove || canCancel) && (
        <div className="flex flex-wrap gap-3 border-t border-custom-primary/10 pt-6">
          {canApprove && (
            <Button
              type="button"
              variant="primary"
              isLoading={approveMutation.isPending}
              disabled={cancelMutation.isPending}
              onClick={handleApprove}
              className="min-h-11 rounded-xl px-6"
            >
              {t("customOrder.approve")}
            </Button>
          )}
          {canCancel && !confirmCancel && (
            <Button
              type="button"
              variant="danger"
              disabled={approveMutation.isPending}
              onClick={() => setConfirmCancel(true)}
              className="min-h-11 rounded-xl px-6"
            >
              {t("customOrder.cancel")}
            </Button>
          )}
          {canCancel && confirmCancel && (
            <div className="flex w-full flex-wrap items-center gap-3 rounded-xl bg-custom-tertiary/40 p-4">
              <p className="flex-1 text-sm text-custom-primary">
                {t("customOrder.cancelConfirm")}
              </p>
              <Button
                type="button"
                variant="danger"
                isLoading={cancelMutation.isPending}
                onClick={handleCancel}
                className="min-h-10 rounded-xl"
              >
                {t("customOrder.confirmCancel")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmCancel(false)}
                className="min-h-10"
              >
                {t("common.back", "Back")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
