export const checkAuth = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check`, {
        credentials: 'include', // include session cookies
      });
      const data = await res.json();
  
      if (data.loggedIn) {
        return { isLoggedIn: true, dj: data.dj };
      } else {
        return { isLoggedIn: false };
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return { isLoggedIn: false };
    }
};