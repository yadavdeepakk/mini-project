import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode'; // Corrected import

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  login: (userData, accessToken, refreshToken) => {
    set({
      user: userData,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  initializeAuth: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
      try {
        const decodedUser = jwtDecode(accessToken);
        // Check if token is expired
        if (decodedUser.exp * 1000 < Date.now()) {
          set(state => ({
            ...state,
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          }));
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return;
        }

        set({
          user: decodedUser,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error decoding access token:', error);
        // If token is invalid, clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      }
    } else {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
    }
  },
}));

export default useAuthStore;