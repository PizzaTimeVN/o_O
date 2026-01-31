
import { Store } from './types';

export const STORES: Store[] = [
  { code: 'NH', name: 'Nguyễn Huệ' },
  { code: 'DH', name: 'Diên Hồng' },
  { code: 'HXH', name: 'Hồ Xuân Hương' },
  { code: 'PY', name: 'Phú Yên' },
];

export const MENU_ITEMS = [
  // ================= PIZZA =================
  { id: "p1", category: "Pizza", name: "Bò (Size S)", price: 39000 },
  { id: "p2", category: "Pizza", name: "Phô mai (Size S)", price: 39000 },
  { id: "p3", category: "Pizza", name: "Gà teriyaki (Size S)", price: 39000 },
  { id: "p4", category: "Pizza", name: "Xúc xích heo (Size S)", price: 39000 },
  { id: "p5", category: "Pizza", name: "Cá ngừ (Size S)", price: 39000 },
  { id: "p6", category: "Pizza", name: "Ba rọi xông khói (Size S)", price: 39000 },

  { id: "p7", category: "Pizza", name: "Bò (Size L)", price: 89000 },
  { id: "p8", category: "Pizza", name: "Phô mai (Size L)", price: 89000 },
  { id: "p9", category: "Pizza", name: "Gà teriyaki (Size L)", price: 89000 },
  { id: "p10", category: "Pizza", name: "Hải sản (Size L)", price: 89000 },
  { id: "p11", category: "Pizza", name: "Xúc xích heo (Size L)", price: 89000 },
  { id: "p12", category: "Pizza", name: "Pizza nấm rau củ (Size L)", price: 89000 },
  { id: "p13", category: "Pizza", name: "Xúc xích Đức (Size L)", price: 89000 },
  { id: "p14", category: "Pizza", name: "Cá ngừ (Size L)", price: 89000 },
  { id: "p15", category: "Pizza", name: "Ba rọi xông khói (Size L)", price: 89000 },

  { id: "p16", category: "Pizza", name: "Salami (Size L)", price: 109000 },
  { id: "p17", category: "Pizza", name: "Phô mai tươi (Size L)", price: 99000 },
  { id: "p18", category: "Pizza", name: "Meat Lover (Size L)", price: 109000 },
  { id: "p19", category: "Pizza", name: "Tôm thanh cua (Size L)", price: 99000 },
  { id: "p20", category: "Pizza", name: "Khô Gà - Lạp Xưởng (Size L)", price: 99000 },
  { id: "p21", category: "Pizza", name: "Thập Cẩm (Size L)", price: 109000 },
  { id: "p22", category: "Pizza", name: "Bò sốt cay (Size L)", price: 109000 },
  { id: "p23", category: "Pizza", name: "Hải sản đặc biệt (Size L)", price: 99000 },

  // ================= COMBO =================
  { id: "c1", category: "Combo", name: "Combo 1", price: 119000 },
  { id: "c2", category: "Combo", name: "Combo 2", price: 179000 },
  { id: "c3", category: "Combo", name: "Combo 3", price: 229000 },
  { id: "c4", category: "Combo", name: "Combo 4", price: 139000 },
  { id: "c5", category: "Combo", name: "Combo 5", price: 229000 },
  { id: "c6", category: "Combo", name: "Combo 6", price: 159000 },
  { id: "c7", category: "Combo", name: "Combo 7", price: 45000 },
  { id: "c8", category: "Combo", name: "Combo 8", price: 59000 },
  { id: "c9", category: "Combo", name: "Combo tiệc 1", price: 49000 },
  { id: "c10", category: "Combo", name: "Combo tiệc 2", price: 49000 },
  { id: "c11", category: "Combo", name: "Combo tiệc 3", price: 49000 },
  { id: "c12", category: "Combo", name: "Combo tiệc 4", price: 39000 },

  // ================= NƯỚC =================
  { id: "d1", category: "Nước", name: "Nước ngọt (ly)", price: 9000 },
  { id: "d2", category: "Nước", name: "Nước ngọt (lon)", price: 15000 },
  { id: "d3", category: "Nước", name: "Nước suối", price: 9000 },
  { id: "d4", category: "Nước", name: "Local Beer", price: 15000 },
  { id: "d5", category: "Nước", name: "Đá me hạt mềm", price: 15000 },
  { id: "d6", category: "Nước", name: "Trà Chanh", price: 15000 },
  { id: "d7", category: "Nước", name: "Trà Đào", price: 20000 },
  { id: "d8", category: "Nước", name: "Trà sữa Thái", price: 20000 },

  // ================= MÓN NHẸ =================
  { id: "s1", category: "Món Ăn Nhẹ", name: "Gà Sốt Cay", price: 29000 },
  { id: "s2", category: "Món Ăn Nhẹ", name: "Khoai tây chiên (nhỏ)", price: 15000 },
  { id: "s3", category: "Món Ăn Nhẹ", name: "Khoai tây chiên (lớn)", price: 25000 },
  { id: "s4", category: "Món Ăn Nhẹ", name: "Tok Lắc Phô Mai", price: 15000 },
  { id: "s5", category: "Món Ăn Nhẹ", name: "Bánh Mì Bơ Tỏi", price: 15000 },
  { id: "s6", category: "Món Ăn Nhẹ", name: "Gà lắc phô mai cay (nhỏ)", price: 25000 },
  { id: "s7", category: "Món Ăn Nhẹ", name: "Gà lắc phô mai cay (lớn)", price: 45000 },
  { id: "s8", category: "Món Ăn Nhẹ", name: "Gà rán chiên giòn (nhỏ)", price: 25000 },
  { id: "s9", category: "Món Ăn Nhẹ", name: "Gà rán chiên giòn (lớn)", price: 30000 },
  { id: "s10", category: "Món Ăn Nhẹ", name: "Mì Ý đút lò", price: 59000 },
  { id: "s11", category: "Món Ăn Nhẹ", name: "Mì Ý sốt bò bằm", price: 39000 },
  { id: "s12", category: "Món Ăn Nhẹ", name: "Salad Cá Ngừ", price: 39000 },
  { id: "s13", category: "Món Ăn Nhẹ", name: "Salad dầu giấm", price: 29000 },
  { id: "s14", category: "Món Ăn Nhẹ", name: "Bánh mì phô mai", price: 25000 },
  { id: "s15", category: "Món Ăn Nhẹ", name: "Bắp Phô Mai", price: 29000 },

  // ================= ADD-ON =================
  { id: "a1", category: "Add - on", name: "Phô mai thêm S", price: 10000 },
  { id: "a2", category: "Add - on", name: "Phô mai thêm L", price: 20000 },
  { id: "a3", category: "Add - on", name: "Bò thêm", price: 15000 },
  { id: "a4", category: "Add - on", name: "Xúc xích heo thêm", price: 10000 },
  { id: "a5", category: "Add - on", name: "Ba Rọi Xông Khói thêm", price: 10000 },
  { id: "a6", category: "Add - on", name: "Bắp thêm", price: 10000 },
  { id: "a7", category: "Add - on", name: "Bông Cải Xanh thêm", price: 10000 },
  { id: "a8", category: "Add - on", name: "Cá Ngừ thêm", price: 15000 },
  { id: "a9", category: "Add - on", name: "Thanh Cua thêm", price: 15000 },
  { id: "a10", category: "Add - on", name: "Nấm thêm", price: 10000 },
  { id: "a11", category: "Add - on", name: "Thơm thêm", price: 10000 },
  { id: "a12", category: "Add - on", name: "Gà thêm", price: 15000 },
  { id: "a13", category: "Add - on", name: "Xúc xích Đức thêm", price: 15000 },
  { id: "a14", category: "Add - on", name: "Đổi bánh đặc biệt", price: 10000 },
  { id: "a15", category: "Add - on", name: "Đổi trà đào", price: 10000 },
  { id: "a16", category: "Add - on", name: "Phí ship", price: 5000 }
];
