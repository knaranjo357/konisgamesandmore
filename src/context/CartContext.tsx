import React, { createContext, useContext, useState } from 'react';
import { Game, CartItem, CartContextType } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (game: Game) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === game.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === game.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...game, quantity: 1 }];
    });
  };

  const removeFromCart = (gameId: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== gameId));
  };

  const updateQuantity = (gameId: number, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === gameId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      isCartOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};