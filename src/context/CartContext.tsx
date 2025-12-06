import React, { createContext, useContext, useState } from 'react';
import { Game, CartItem, CartContextType, PriceCategory } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (game: Game, selectedType: PriceCategory) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.id === game.id && item.selectedType === selectedType
      );
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === game.id && item.selectedType === selectedType
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentItems, { ...game, quantity: 1, selectedType }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (gameId: number, selectedType: PriceCategory) => {
    setItems(currentItems => 
      currentItems.filter(item => !(item.id === gameId && item.selectedType === selectedType))
    );
  };

  const updateQuantity = (gameId: number, selectedType: PriceCategory, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === gameId && item.selectedType === selectedType
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