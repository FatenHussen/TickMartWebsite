import type { ChangeEvent, RefObject } from "react";
import { User, Camera } from "lucide-react";

interface ProfileAvatarBannerProps {
    avatarSrc: string;
    displayName: string;
    displayEmail: string;
    isEditing: boolean;
    fileInputRef: RefObject<HTMLInputElement | null>;
    onAvatarFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    profileTitleLabel: string;
}

export function ProfileAvatarBanner({
    avatarSrc,
    displayName,
    displayEmail,
    isEditing,
    fileInputRef,
    onAvatarFileChange,
    profileTitleLabel,
}: ProfileAvatarBannerProps) {
    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 mb-8 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] to-transparent p-4 sm:p-5">
            <div className="relative shrink-0 mx-auto sm:mx-0">
                <div className="relative rounded-full p-[3px] bg-gradient-to-br from-primary via-primary-light to-primary/40 shadow-lg shadow-primary/15">
                    <div className="w-[76px] h-[76px] rounded-full overflow-hidden border-2 border-custom-card bg-custom-card">
                        {avatarSrc ? (
                            <img
                                src={avatarSrc}
                                alt={displayName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-bg-secondary dark:bg-bg-tertiary flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                        )}
                    </div>
                </div>
                <span className="absolute bottom-1 start-1 w-4 h-4 bg-[var(--color-ui-green-500)] border-2 border-custom-card rounded-full shadow-sm" />
                {isEditing && (
                    <button
                        type="button"
                        onClick={openFilePicker}
                        className="absolute -bottom-1 -end-1 w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-colors shadow-md ring-2 ring-custom-card"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onAvatarFileChange}
                    className="hidden"
                />
            </div>
            <div className="text-center sm:text-start min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary/90 mb-1">
                    {profileTitleLabel}
                </p>
                <h2 className="text-xl font-bold text-custom-primary truncate">
                    {displayName}
                </h2>
                <a
                    href={`mailto:${displayEmail}`}
                    className="text-sm text-custom-secondary underline underline-offset-2 hover:text-primary transition-colors break-all"
                >
                    {displayEmail}
                </a>
            </div>
        </div>
    );
}
