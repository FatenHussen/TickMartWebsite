import { HiPencil } from "react-icons/hi";
import { API_SECOND_BUTTON_CLASS } from "./apiPaletteClasses";

interface ProfilePageHeaderProps {
    title: string;
    subtitle: string;
    editProfileLabel: string;
    onToggleEditMode: () => void;
}

export function ProfilePageHeader({
    title,
    subtitle,
    editProfileLabel,
    onToggleEditMode,
}: ProfilePageHeaderProps) {
    return (
        <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
                <h1 className="text-2xl font-bold text-custom-primary">{title}</h1>
                <p className="text-sm text-custom-secondary mt-0.5">{subtitle}</p>
            </div>
            <button
                type="button"
                onClick={onToggleEditMode}
                className={API_SECOND_BUTTON_CLASS}
            >
                <HiPencil className="w-4 h-4" />
                {editProfileLabel}
            </button>
        </div>
    );
}
