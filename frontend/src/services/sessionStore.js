const tokenKey = 'urbanistica-v2.access';
export const getToken = () => sessionStorage.getItem(tokenKey);
export const setToken = (token) => sessionStorage.setItem(tokenKey, token);
export const clearSession = () => { sessionStorage.removeItem(tokenKey); sessionStorage.removeItem('urbanistica-v2.company'); };
