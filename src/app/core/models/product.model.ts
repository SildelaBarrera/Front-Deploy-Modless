import { Variant } from "./variant.model"

export interface Product {
    id_product: number;
    name: string;
    category: string;
    description: string;
    price: number;
    composition: string;
    garment_care: string;
    image?: string;
    variants: Variant [];
    
  }