import { useContext } from 'react';

// Create contexts
const LanguageContext = React.createContext();
const CartContext = React.createContext();

export const useLanguage = () => useContext(LanguageContext);
export const useCart = () => useContext(CartContext);

export { LanguageContext, CartContext };
