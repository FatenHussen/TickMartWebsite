import { useState, useCallback } from "react";

export function useProfileModals() {
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const [isPhoneModalOpen, setPhoneModalOpen] = useState(false);
    const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);
    const [pendingVerifyEmail, setPendingVerifyEmail] = useState<
        string | undefined
    >();
    const [pendingVerifyPhone, setPendingVerifyPhone] = useState<
        string | undefined
    >();
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

    const startEmailVerification = useCallback((email: string) => {
        setPendingVerifyEmail(email);
        setPendingVerifyPhone(undefined);
        setVerifyModalOpen(true);
    }, []);

    const startPhoneVerification = useCallback((phone: string) => {
        setPendingVerifyPhone(phone);
        setPendingVerifyEmail(undefined);
        setVerifyModalOpen(true);
    }, []);

    return {
        isPasswordModalOpen,
        setPasswordModalOpen,
        isEmailModalOpen,
        setEmailModalOpen,
        isPhoneModalOpen,
        setPhoneModalOpen,
        isVerifyModalOpen,
        setVerifyModalOpen,
        pendingVerifyEmail,
        pendingVerifyPhone,
        isLogoutModalOpen,
        setLogoutModalOpen,
        startEmailVerification,
        startPhoneVerification,
    };
}

export type ProfileModalsApi = ReturnType<typeof useProfileModals>;
