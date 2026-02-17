import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import {
  HiPlus,
  HiLocationMarker,
  HiPhone,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import { paths } from "@/app/routes/path/paths";
import { useAddresses } from "../hooks/useAddress";

export default function Addresses() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { data: addresses = [], isLoading } = useAddresses();

  const handleAddNewAddress = () => {
    navigate(paths.account.addAddress);
  };

  const handleEdit = (id: number | string) => {
    navigate(paths.account.editAddress(id));
  };

  const handleDelete = (id: number | string) => {
    // TODO: Delete address with confirmation
    console.log("Delete address:", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {t("account.addresses.title")}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {t("account.addresses.subtitle")}
          </p>
        </div>
        <Button
          variant="primary"
          className="gap-2"
          style={{
            background: "#4CDAF6",
            borderRadius: "24px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          onClick={handleAddNewAddress}
        >
          <HiPlus className="w-4 h-4" />
          {t("account.addresses.addNewAddress")}
        </Button>
      </div>

      {/* Address Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">
            {t("account.addresses.noAddresses")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white dark:bg-bg-primary rounded-2xl p-6 border-2 transition-all hover:shadow-lg hover:border-[#4CDAF6]/50"
                style={{
                  borderColor: address.is_default ? "#22C55E" : "#E0F2FE",
                  boxShadow: address.is_default
                    ? "0 4px 12px rgba(34, 197, 94, 0.15)"
                    : "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Header with icon, street name, and default badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <HiLocationMarker className="w-5 h-5 text-[#4CDAF6] dark:text-[#4CDAF6]" />
                        <h3 className="text-lg font-bold text-text-primary">
                          {address.street_name}
                        </h3>
                      </div>
                      {address.is_default && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                          style={{ background: "#22C55E" }}
                        >
                          {t("account.addresses.default")}
                        </span>
                      )}
                    </div>

                    {/* Address details with labels */}
                    <div className="space-y-2.5 pl-7">
                      {/* Street Name */}
                      {address.street_name && (
                        <div className="flex items-start gap-2">
                          <span className="text-text-secondary text-sm font-medium min-w-[120px]">
                            {t("account.addAddress.streetName")}:
                          </span>
                          <span className="text-text-primary text-sm">
                            {address.street_name}
                          </span>
                        </div>
                      )}

                      {/* Nearest Landmark */}
                      {address.nearest_landmark && (
                        <div className="flex items-start gap-2">
                          <span className="text-text-secondary text-sm font-medium min-w-[120px]">
                            {t("account.addAddress.nearestLandmark")}:
                          </span>
                          <span className="text-text-primary text-sm">
                            {address.nearest_landmark}
                          </span>
                        </div>
                      )}

                      {/* Building Number */}
                      {address.building_number && (
                        <div className="flex items-start gap-2">
                          <span className="text-text-secondary text-sm font-medium min-w-[120px]">
                            {t("account.addAddress.buildingNumber")}:
                          </span>
                          <span className="text-text-primary text-sm">
                            {address.building_number}
                          </span>
                        </div>
                      )}

                      {/* Floor/Apartment */}
                      {address.floor_apartment && (
                        <div className="flex items-start gap-2">
                          <span className="text-text-secondary text-sm font-medium min-w-[120px]">
                            {t("account.addAddress.floorApartment")}:
                          </span>
                          <span className="text-text-primary text-sm">
                            {address.floor_apartment}
                          </span>
                        </div>
                      )}

                      {/* Area */}
                      {address.area?.name && (
                        <div className="flex items-start gap-2">
                          <span className="text-text-secondary text-sm font-medium min-w-[120px]">
                            {t("account.addAddress.area")}:
                          </span>
                          <span className="text-text-primary text-sm">
                            {address.area.name}
                          </span>
                        </div>
                      )}

                      {/* Contact Phone */}
                      {address.contact_phone && (
                        <div className="flex items-start gap-2">
                          <span className="text-text-secondary text-sm font-medium min-w-[120px]">
                            {t("account.addAddress.contactPhone")}:
                          </span>
                          <div className="flex items-center gap-2">
                            <HiPhone className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-text-primary text-sm font-medium">
                              {address.contact_phone}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions on the right */}
                  <div
                    className={cn(
                      "flex flex-col items-end gap-2 pt-1",
                      isRTL && "items-start",
                    )}
                  >
                    <button
                      onClick={() => handleEdit(address.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#4CDAF6] hover:bg-[#4CDAF6]/10 dark:hover:bg-[#4CDAF6]/20 transition-all duration-200"
                    >
                      <HiPencil className="w-4 h-4" />
                      <span>{t("account.addresses.edit")}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#DC3545] hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    >
                      <HiTrash className="w-4 h-4" />
                      <span>{t("account.addresses.delete")}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
