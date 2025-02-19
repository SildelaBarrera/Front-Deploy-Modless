import { Size } from "../models/size.model"
import { Color } from "../models/color.model"
import { Stock } from "../models/stock.model"
import { VariantImage } from "../models/image.model"


export interface Variant {
    id_variant: number;
    id_product: number; 
    id_color: number; 
    id_size: number;  
    stock: Stock;  
    images: VariantImage; 
  }