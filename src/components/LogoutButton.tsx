// components/LogoutButton.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

const LogoutButton = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include', // include cookies for session handling
    });

    const data = await response.json();
    
    if (response.ok) {
      setMessage(data.message);
      // redirect to login page after logout
      router.push('/login');
    } else {
      setMessage('Logout failed');
    }
  };

  return (
    <div>
      <button onClick={handleLogout} className='text-xl font-bold'>Logout</button>
      <p>{message}</p>
    </div>
  );
};

export default LogoutButton;
