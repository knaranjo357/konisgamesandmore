export interface Game {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  console: string;
  console_url: string;
  rating: number;
  isBestSeller: boolean;
  description: string;
}

export interface CartItem extends Game {
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: number) => void;
  updateQuantity: (gameId: number, quantity: number) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}