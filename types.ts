
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface DraftOrder {
  table_number?: string;
  note?: string;
  pizza_details?: string; // Chi tiết bánh trong combo (ví dụ: "Pizza Bò L, Pizza Hải Sản L")
  items: OrderItem[];
}

export interface Order {
  id?: number;
  store_code: string;
  user_id: string; // Sẽ lưu username của nhân viên
  order_type: 'dine_in' | 'takeaway' | 'grab' | 'shopee';
  table_number: string | null;
  note: string;
  pizza_details?: string; // New field as requested
  items: Record<string, number>; 
  total: number;
  payment_method: string;
  status: 'pending' | 'paid' | 'cancelled';
  created_at?: string;
  order_source: 'staff' | 'customer';
}

export interface Store {
  code: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  store_code: string;
}
