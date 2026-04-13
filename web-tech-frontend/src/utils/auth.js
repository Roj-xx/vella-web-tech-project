export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};