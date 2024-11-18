import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Produto } from '../models/Produto';

interface CartContextProps {
  cart: Produto[];
  addToCart: (produto: Produto) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Produto[]>([]);

  const addToCart = (produto: Produto) => {
    const uniqueKey = `${produto.id}-${Date.now()}`; // Adiciona um identificador único
    setCart((prevCart) => [...prevCart, { ...produto, uniqueKey }]);
  };
  

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};