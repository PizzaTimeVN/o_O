import { GoogleGenAI, Type } from "@google/genai";
import { MENU_ITEMS } from "../constants";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("❌ Missing VITE_API_KEY");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const parseVoiceCommand = async (transcript: string) => {
  // Gửi ID và Tên để AI map món. KHÔNG GỬI GIÁ để tiết kiệm token.
  const compressedMenu = MENU_ITEMS.map(i => `${i.id}|${i.name}`).join(";");

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash-002",
    contents: `Đơn: "${transcript}"`,
    config: {
      systemInstruction: `Bạn là trợ lý nhận đơn chuyên nghiệp.
Nhiệm vụ: Trích xuất "items" từ văn bản giọng nói. KHÔNG BẮT SỐ BÀN.

DANH MỤC THỰC ĐƠN (ID|Tên):
${compressedMenu}

QUY TẮC QUAN TRỌNG:
1. ĐỒ UỐNG & BIA:
   - "bia", "beer" -> khớp chính xác d10 (Local Beer).
   - "đá me" -> khớp chính xác d5.
   - "nước ngọt" -> ưu tiên d1 (ly), nếu khách nói lon thì chọn d2.
   - "trà đào", "trà chanh", "trà sữa" -> khớp chính xác d7, d6, d8.
   - "nước suối", "la vie" -> d3.
2. PIZZA:
   - "bò/gà/phô mai nhỏ" -> Size S (p1, p3, p2).
   - "bò/gà/phô mai lớn" -> Size L (p7, p9, p8).
   - "thập cẩm" -> p21.
3. MÓN NHẸ & COMBO:
   - "mì ý", "10 ý" -> s11.
   - "combo" -> ID bắt đầu bằng c.
4. SỐ LƯỢNG: Nếu khách không đọc số lượng -> Mặc định là 1.
5. TOPPING PHỤ (extra_toppings):
   - Nếu món Pizza có yêu cầu thêm topping (ví dụ: "thêm phô mai", "thêm xúc xích")
   - Trả về dạng OBJECT, VÍ DỤ: {"p2": 1, "s4": 1}
   - KHÔNG trả về dạng string JSON escaped

TRẢ VỀ JSON DUY NHẤT: { "items": [{ "id": string, "quantity": number, "extra_toppings"?: object }] }`,
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                extra_toppings: { 
                  type: Type.OBJECT,
                  nullable: true
                }
              },
              required: ["id", "quantity"]
            }
          }
        },
        required: ["items"]
      }
    }
  });

  const rawData = JSON.parse(response.text());

  // Hydrate data (Client-side lookup)
  const hydratedItems = rawData.items.map((item: any) => {
    const originalItem = MENU_ITEMS.find(m => m.id === item.id);
    if (!originalItem) return null;
    
    // Xử lý extra_toppings: đảm bảo nó là object, không phải string
    let extraToppings = item.extra_toppings;
    if (extraToppings) {
      // Nếu AI trả về string thay vì object, parse nó
      if (typeof extraToppings === 'string') {
        try {
          extraToppings = JSON.parse(extraToppings);
        } catch (e) {
          console.warn('Failed to parse extra_toppings:', extraToppings);
          extraToppings = {};
        }
      }
    }
    
    return {
      id: item.id,
      name: originalItem.name,
      quantity: item.quantity,
      price: originalItem.price,
      ...(extraToppings && Object.keys(extraToppings).length > 0 && { extra_toppings: extraToppings })
    };
  }).filter((i: any) => i !== null);

  return {
    table_number: "",
    items: hydratedItems
  };
};
