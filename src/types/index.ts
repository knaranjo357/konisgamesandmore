export interface Game {
  id: number;
  row_number: number;
  name: string;
  cover: string;
  game: string;
  manual: string;
  cover_case_game: string;
  complete_with_game: string;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
  console: string;
  console_url: string;
  rating: number;
  isBestSeller: boolean;
  description: string;
}

export interface CartItem extends Game {
  quantity: number;
  selectedType: 'cover' | 'game' | 'manual' | 'cover_case_game' | 'complete_with_game';
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: number) => void;
  updateQuantity: (gameId: number, quantity: number) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}

export type PriceCategory = 'cover' | 'game' | 'manual' | 'cover_case_game' | 'complete_with_game';

export const PRICE_CATEGORIES: { value: PriceCategory; label: string }[] = [
  { value: 'cover', label: 'Cover Only' },
  { value: 'game', label: 'Game Only' },
  { value: 'manual', label: 'Manual Only' },
  { value: 'cover_case_game', label: 'Cover + Case + Game' },
  { value: 'complete_with_game', label: 'Complete with Game' }
];