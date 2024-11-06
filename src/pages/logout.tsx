import LogoutButton from '@/components/LogoutButton';

const Logout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
         {/* delete me eventually, just for testing */}
         <div className=''>
          <LogoutButton />
        </div>

    </div>
  );
};

export default Logout;