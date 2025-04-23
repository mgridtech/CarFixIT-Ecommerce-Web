export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const setAuth = (isLoggedIn, userId = null) => {
  console.log('setAuth called with:', { isLoggedIn, userId });
  console.trace('setAuth called from:');
  localStorage.setItem('isLoggedIn', isLoggedIn);
  if (isLoggedIn && userId) {
    localStorage.setItem('userId', userId); // Store userId when logged in
  } else {
    localStorage.removeItem('userId'); // Remove userId when logged out
  }
};

export const getUserId = () => {
  const userId = localStorage.getItem('userId');
  console.log('Retrieved userId from localStorage:', userId);
  return userId;
};

export const getAuth = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const clearAuth = () => {
  localStorage.removeItem('isLoggedIn');
};