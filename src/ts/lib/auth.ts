import { findUserFromEmail } from "./api";
    
export const storeUser = (email : string) => {
    localStorage.setItem('user', email)
};

export const removeUser = async () => {
    localStorage.removeItem('user');
};

export const hasLoggedIn = () => {
    return localStorage.getItem('user');
}

export const getUserFromStorage = async () => {
    return await findUserFromEmail(localStorage.getItem('user') + "");
};