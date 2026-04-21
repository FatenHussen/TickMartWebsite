import { useProfile } from "../hooks/useProfile";
import { ProfileLoadingView } from "../components/profile/ProfileLoadingView";
import { ProfileErrorView } from "../components/profile/ProfileErrorView";
import { ProfilePageContent } from "../components/profile/ProfilePageContent";

export default function Profile() {
    const { data: profileData, isLoading, error } = useProfile();

    if (isLoading) return <ProfileLoadingView />;
    if (error || !profileData) return <ProfileErrorView />;

    return <ProfilePageContent profileData={profileData} />;
}
