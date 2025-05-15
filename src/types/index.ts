export interface Game {
  id: number;
  row_number: number;
  name: string;
  cover: string;
  game: string;
  manual: string;
  cover_case_game: string;
  complete_with_game: string;
  price1: string;
  price2: string;
  price3: string;
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
  selectedType: PriceCategory;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (game: Game, selectedType: PriceCategory) => void;
  removeFromCart: (gameId: number, selectedType: PriceCategory) => void;
  updateQuantity: (gameId: number, selectedType: PriceCategory, quantity: number) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}

export type PriceCategory = 'cover' | 'game' | 'manual' | 'cover_case_game' | 'complete_with_game' | 'price1' | 'price2' | 'price3';

export const PRICE_CATEGORIES: { value: PriceCategory; label: string }[] = [
  { value: 'cover', label: 'Cover' },
  { value: 'game', label: 'Game' },
  { value: 'manual', label: 'Manual' },
  { value: 'cover_case_game', label: 'Cover + Case + Game' },
  { value: 'complete_with_game', label: 'Complete with Game' }
];