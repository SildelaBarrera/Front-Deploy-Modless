import { Size } from "../models/size.model"
import { Color } from "../models/color.model"
import { Stock } from "../models/stock.model"
import { VariantImage } from "../models/image.model"


export interface Variant {
    id_variant: number;
    id_product: number;  // ID del producto al que pertenece
    size: Size;  // Talla (S, M, L, etc.)
    color: Color;  // Color de la variante
    stock: Stock;  // Información de stock
    images: VariantImage;  // Imágenes asociadas a la variante
  }