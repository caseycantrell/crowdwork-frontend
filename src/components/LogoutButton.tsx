// components/LogoutButton.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

const LogoutButton = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch('http://localhost:3002/api/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies for session handling
    });

    const data = await response.json();
    
    if (response.ok) {
      setMessage(data.message);
      // Redirect to login page after logout
      router.push('/login');
    } else {
      setMessage('Logout failed');
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <p>{message}</p>
    </div>
  );
};

export default LogoutButton;
