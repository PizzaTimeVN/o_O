
import { User, Order } from '../types';

// Cấu hình kết nối Supabase
// QUAN TRỌNG: Hãy đảm bảo bạn đã điền đúng URL và Anon Key của dự án Supabase của mình
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://mhmvtywqtaqikaubhhmf.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_lTDNdWmRZaO2VF-oCs2zvg_7NSzJpCa';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

export const supabaseService = {
  async login(username: string, password_hash: string, store_code: string): Promise<User | null> {
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Chưa cấu hình Supabase URL hoặc Key. Vui lòng kiểm tra lại môi trường.");
      }

      const u = username.trim();
      const p = password_hash.trim();
      
      // Query bảng staff_orders đúng theo yêu cầu của bạn
      const queryUrl = `${SUPABASE_URL}/rest/v1/staff_orders?username=eq.${encodeURIComponent(u)}&password_hash=eq.${encodeURIComponent(p)}&select=*`;

      const response = await fetch(queryUrl, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Lỗi xác thực: API Key của Supabase không đúng hoặc bị chặn (RLS).");
        }
        if (response.status === 404) {
          throw new Error("Lỗi: Không tìm thấy bảng 'staff_orders' trong Supabase.");
        }
        const errorMsg = await response.text();
        throw new Error(`Lỗi từ Supabase (${response.status}): ${errorMsg}`);
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const staff = data[0];
        // Kiểm tra trạng thái hoạt động (chấp nhận cả bool, string hoặc number)
        const isActive = staff.is_active === true || staff.is_active === 'true' || staff.is_active === 1;
        
        if (!isActive) {
          throw new Error("Tài khoản này đang bị khóa.");
        }
        
        return {
          id: staff.id,
          username: staff.username,
          store_code: store_code
        };
      }
      
      return null;
    } catch (error: any) {
      console.error("Login Exception:", error);
      throw error;
    }
  },

  async createOrder(order: Order): Promise<Order> {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Không thể lưu đơn hàng.");
      }

      const data = await response.json();
      return data[0];
    } catch (error: any) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  async getRecentOrders(store_code: string): Promise<Order[]> {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?store_code=eq.${store_code}&order=created_at.desc&limit=20&select=*`,
        { method: 'GET', headers }
      );
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  }
};
