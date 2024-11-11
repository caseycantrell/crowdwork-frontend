import LogoutButton from '@/components/LogoutButton';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

const Logout: React.FC = () => {

  const router = useRouter()

  const handleLogout = async () => {

    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch {
      console.log("An error occurred during logout. Please try again.", true);
    }
};
  return (
    <div className="p-8">
      <LogoutButton handleLogout={handleLogout} />
    </div>
  );
};

export default Logout;