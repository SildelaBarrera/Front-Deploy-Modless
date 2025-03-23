export interface OrderDetail {
    id_order_detail: number;
    id_order: number;
    variant_id: number;
    variant_name: string;
    variant_image: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
    shipping_cost: number;
    discountAmount: number;
    total: number;
    status: string;
    created_at: string;
  }
  
  export interface OrderDetailsResponse {
    error: boolean;
    message: string;
    data: OrderDetail[];
  }
  