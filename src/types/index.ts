export interface Game {
  id: number;
  row_number: number;
  name: string;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
  console: string;
  console_url: string;
  isBestSeller: boolean;
  description: string;
  price1: string;
  price2: string;
  price3: string;
  price4: string;
  price5: string;
  price6: string;
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

export type PriceCategory = 'price1' | 'price2' | 'price3' | 'price4' | 'price5'| 'price6';

export const PRICE_CATEGORIES: { value: PriceCategory; label: string }[] = [
  { value: 'price1', label: 'Category 1' },
  { value: 'price2', label: 'Category 2' },
  { value: 'price3', label: 'Category 3' },
  { value: 'price4', label: 'Category 4' },
  { value: 'price5', label: 'Category 5' },
  { value: 'price6', label: 'Category 6' }
];