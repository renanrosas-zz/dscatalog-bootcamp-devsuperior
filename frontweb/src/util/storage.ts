const tokeyKey = 'authData';

type LoginResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    userFirstName: string;
    userId: number;
  };

export const saveAuthData = (obj: LoginResponse) => {
    localStorage.setItem(tokeyKey, JSON.stringify(obj));
  };
  
  export const getAuthData = () => {
    const str = localStorage.getItem(tokeyKey) ?? '{}';
    return JSON.parse(str) as LoginResponse;
  };
  
  export const removeAuthData = () => {
    localStorage.removeItem(tokeyKey);
  };