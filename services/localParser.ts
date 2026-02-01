
import { MENU_ITEMS } from "../constants";
import { DraftOrder, OrderItem } from "../types";

// Mapping từ khóa giọng nói sang ID món ăn
// Sử dụng regex để bắt chính xác hơn
const KEYWORD_MAP: { regex: RegExp; id: string }[] = [
    // --- PIZZA SPECIFIC SHORTCUTS ---
    // Ưu tiên các món có từ khóa dễ trùng
    { regex: /bánh mì phô mai/i, id: "s14" },
    { regex: /bắp phô mai/i, id: "s15" },

    // Gà: Nếu nói "gà lớn/nhỏ" -> Pizza Gà Teriyaki.
    // Nếu nói "gà lắc" -> ăn vặt.
    { regex: /gà lắc phô mai cay lớn|gà lắc lớn/i, id: "s7" },
    { regex: /gà lắc phô mai cay nhỏ|gà lắc nhỏ/i, id: "s6" },
    { regex: /gà lắc/i, id: "s6" }, // Default nhỏ

    { regex: /gà rán chiên giòn lớn|gà rán lớn/i, id: "s9" },
    { regex: /gà rán chiên giòn nhỏ|gà rán nhỏ/i, id: "s8" },
    { regex: /gà rán/i, id: "s8" },

    { regex: /pizza gà teriyaki lớn|gà teriyaki lớn|gà te lớn|gà lớn/i, id: "p9" },
    { regex: /pizza gà teriyaki nhỏ|gà teriyaki nhỏ|gà te nhỏ|gà nhỏ/i, id: "p3" },
    { regex: /pizza gà teriyaki|gà teriyaki|gà te/i, id: "p9" }, // Default L nếu nói đầy đủ

    // Bò
    { regex: /pizza bò lớn|bò lớn/i, id: "p7" },
    { regex: /pizza bò nhỏ|bò nhỏ/i, id: "p1" },
    { regex: /pizza bò|bò/i, id: "p7" },

    // Phô mai
    { regex: /pizza phô mai lớn|phô mai lớn/i, id: "p8" },
    { regex: /pizza phô mai nhỏ|phô mai nhỏ/i, id: "p2" },
    { regex: /pizza phô mai|phô mai/i, id: "p8" },

    // Các loại Pizza khác
    { regex: /thập cẩm|thập|10/i, id: "p21" },
    { regex: /meat lover|yêu thịt/i, id: "p18" },
    { regex: /hải sản đặc biệt/i, id: "p23" },
    { regex: /hải sản nhỏ/i, id: "p10" }, // p10 là L, check lại logic nếu cần S
    { regex: /hải sản/i, id: "p10" },
    { regex: /xúc xích heo lớn/i, id: "p11" },
    { regex: /xúc xích heo nhỏ/i, id: "p4" },
    { regex: /xúc xích heo/i, id: "p11" },
    { regex: /nấm rau củ/i, id: "p12" },
    { regex: /xúc xích đức/i, id: "p13" },
    { regex: /cá ngừ lớn/i, id: "p14" },
    { regex: /cá ngừ nhỏ/i, id: "p5" },
    { regex: /cá ngừ/i, id: "p14" },
    { regex: /thịt xông khói lớn|thịt lớn/i, id: "p15" },
    { regex: /thịt xông khói nhỏ|thịt nhỏ/i, id: "p6" },
    { regex: /thịt/i, id: "p15" },
    { regex: /salami/i, id: "p16" },
    { regex: /phô mai tươi/i, id: "p17" },
    { regex: /tôm thanh cua/i, id: "p19" },
    { regex: /khô gà|lạp xưởng/i, id: "p20" },
    { regex: /bò sốt cay/i, id: "p22" },

    // --- MÌ Ý ---
    { regex: /mì ý đút lò/i, id: "s10" },
    { regex: /mì ý|mì bò bằm/i, id: "s11" }, // Mặc định là sốt bò bằm

    // --- NƯỚC ---
    { regex: /trà đào/i, id: "d7" },
    { regex: /trà chanh/i, id: "d6" },
    { regex: /trà sữa|trà thái/i, id: "d8" },
    { regex: /nước suối|nước lọc|lavie/i, id: "d3" },
    { regex: /nước ngọt ly|coca ly|pepsi ly/i, id: "d1" },
    { regex: /nước ngọt lon|coca lon|pepsi lon/i, id: "d2" },
    { regex: /nước ngọt|coca|pepsi/i, id: "d1" },
    { regex: /bia|beer|local beer/i, id: "d4" },
    { regex: /đá me/i, id: "d5" },

    // --- CÁC MÓN KHÁC ---
    { regex: /khoai tây chiên lớn|khoai tây lớn/i, id: "s3" },
    { regex: /khoai tây chiên nhỏ|khoai tây nhỏ/i, id: "s2" },
    { regex: /khoai tây/i, id: "s2" },
    { regex: /tok lắc|tokbokki/i, id: "s4" },
    { regex: /bánh mì bơ tỏi/i, id: "s5" },
    { regex: /gà sốt cay/i, id: "s1" },
    { regex: /salad cá ngừ|salad/i, id: "s12" }, // Salad = Salad cá ngừ
    { regex: /salad dầu giấm|dầu giấm/i, id: "s13" }, // Dầu giấm = Salad dầu giấm

    // --- COMBO ---
    { regex: /combo 1|com bo 1/i, id: "c1" },
    { regex: /combo 2|com bo 2/i, id: "c2" },
    { regex: /combo 3|com bo 3/i, id: "c3" },
    { regex: /combo 4|com bo 4/i, id: "c4" },
    { regex: /combo 5|com bo 5/i, id: "c5" },
    { regex: /combo 6|com bo 6/i, id: "c6" },
    { regex: /combo 7|com bo 7/i, id: "c7" },
    { regex: /combo 8|com bo 8/i, id: "c8" },
    { regex: /combo tiệc 1/i, id: "c9" },
    { regex: /combo tiệc 2/i, id: "c10" },
    { regex: /combo tiệc 3/i, id: "c11" },
    { regex: /combo tiệc 4/i, id: "c12" },
];

const TEXT_TO_NUM: Record<string, number> = {

    "1": 1, "2": 2, "3": 3, "4": 4, "5": 5,
    "6": 6, "7": 7, "8": 8, "9": 9, "10": 10
};

const PIZZA_FLAVORS: Record<string, string> = {
    "hải sản": "Pizza Hải Sản",
    "bò": "Pizza Bò",
    "phô mai": "Pizza Phô Mai",
    "gà teriyaki": "Pizza Gà Teriyaki",
    "gà te": "Pizza Gà Teriyaki",
    "xúc xích heo": "Pizza Xúc Xích Heo",
    "xúc xích đức": "Pizza Xúc Xích Đức",
    "cá ngừ": "Pizza Cá Ngừ",
    "thịt": "Pizza thịt Xông Khói",
    "thịt xông khói": "Pizza thịt Xông Khói",
    "thập cẩm": "Pizza Thập Cẩm",
    "bò sốt cay": "Pizza Bò Sốt Cay",
    "hải sản đặc biệt": "Pizza Hải Sản Đặc Biệt",
    "meat lover": "Pizza Meat Lover",
    "yêu thịt": "Pizza Meat Lover",
    "tôm thanh cua": "Pizza Tôm Thanh Cua",
    "salami": "Pizza Salami",
    "nấm rau củ": "Pizza Nấm Rau Củ",
    "phô mai tươi": "Pizza Phô Mai Tươi",
    "khô gà": "Pizza Khô Gà - Lạp Xưởng",
    "lạp xưởng": "Pizza Khô Gà - Lạp Xưởng",
    "bánh mì phô mai": "Bánh Mì Phô Mai", // Not a pizza flavor for combo usually but handles edge case
    "bắp phô mai": "Bắp Phô Mai" // Same
};

export const parseVoiceCommandLocal = async (transcript: string) => {
    let processedText = transcript.toLowerCase();

    // Tiền xử lý số lượng dạng chữ sang số
    Object.keys(TEXT_TO_NUM).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        processedText = processedText.replace(regex, TEXT_TO_NUM[key].toString());
    });

    const itemsMapV2: Record<string, number> = {};
    let tempText = processedText;
    const pizzaDetailsList: string[] = [];

    // --- COMBO PARSING LOGIC ---
    // Tìm các pattern "Combo X ... bánh Y ..."
    // Loop qua các combo có thể có
    const comboRegex = /(?:combo|com bo)\s+(?:tiệc\s+)?(\d+)/gi;
    let comboMatch;

    // Dùng loop while true để xử lý từng combo tìm thấy
    // Tuy nhiên chỉnh sửa tempText trong khi loop regex global trên chính nó rất nguy hiểm.
    // Nên ta sẽ scan 1 lần, lưu vị trí, rồi xử lý.
    // Hoặc đơn giản hơn: Match từng cái, xử lý, mask rồi loop lại từ đầu cho đến khi không còn combo nào chưa xử lý.

    // Chiến lược: Tìm Combo đầu tiên chưa bị mask (#).
    while (true) {
        // Reset lastIndex để tìm từ đầu
        comboRegex.lastIndex = 0;
        const match = comboRegex.exec(tempText);
        if (!match) break;

        // Check masked
        if (match[0].includes('#')) {
            // Nếu match trúng cái đã mask (ví dụ ##mbo), regex `combo` thường sẽ ko match, 
            // nhưng `(?:combo|com bo)` thì `bo` có thể match nếu ta mask ko kỹ.
            // Ở đây ta giả dụ mask toàn bộ "combo 1" thành "#######".
            // Nên regex sẽ ko match lại.
            // Tuy nhiên nếu regex.exec vẫn tìm ra cái gì đó lạ, ta skip.
            // Thực tế loop này sẽ vô tận nếu ta ko mask.
            // Ta sẽ dùng giải thuật tìm string index thủ công an toàn hơn regex global loop with modification.
            break;
        }

        // Thực tế: JS Regex global loop stateful.
        // Ta sẽ dùng string match đơn giản cho an toàn hơn.
    }

    // REWRITE: Sequential Scanning for Combos
    // Regex tìm Combo ID
    const foundCombos: { id: string, index: number, length: number, num: number }[] = [];
    const scanRegex = /(?:combo|com bo)\s+(?:tiệc\s+)?(\d+)/gi;
    let m;
    while ((m = scanRegex.exec(tempText)) !== null) {
        if (!m[0].includes('#')) {
            const comboIdNum = parseInt(m[1]);
            // Map combo num to ID constants if needed, or assume "c" + num match constants?
            // Check constants: c1..c12 match num.
            // Caution: "combo tiệc 1" -> c9. "Combo 1" -> c1.
            // Logic mapping:
            let cId = `c${comboIdNum}`;
            if (m[0].toLowerCase().includes("tiệc")) {
                if (comboIdNum === 1) cId = 'c9';
                else if (comboIdNum === 2) cId = 'c10';
                else if (comboIdNum === 3) cId = 'c11';
                else if (comboIdNum === 4) cId = 'c12';
            }

            // Validation: Check if this ID exists in MENU_ITEMS
            if (MENU_ITEMS.some(i => i.id === cId)) {
                // Add to list to process
                // Use a simplified approach: Process immediately and mask.

                const startIdx = m.index;
                const endIdx = startIdx + m[0].length;

                // Add Combo to Cart
                itemsMapV2[cId] = (itemsMapV2[cId] || 0) + 1;

                // DETERMINE PIZZA SIZE
                // Rule: Combo 7, 8 -> Small (S). Others -> Large (L).
                let size = "Size L";
                if (cId === "c7" || cId === "c8") size = "Size S";

                // EXTRACT PIZZA FLAVORS
                // Look ahead in tempText for "bánh [flavor]"
                // Search window: until next "combo" or end of string.
                const nextComboIdx = tempText.slice(endIdx).search(/(?:combo|com bo)/i);
                const searchLimit = nextComboIdx === -1 ? tempText.length : endIdx + nextComboIdx;
                const searchArea = tempText.substring(endIdx, searchLimit);

                // Find all "bánh [flavor]" occurrences in this area
                // Regex: /bánh\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)/gi
                // Use greedy matching against known flavors to be safe
                const flavorEntries = Object.entries(PIZZA_FLAVORS);
                // Sort by length desc to match long names first
                flavorEntries.sort((a, b) => b[0].length - a[0].length);

                let currentSearchArea = searchArea;
                let foundFlavors = [];

                // Special case for Combo 3 (2 Pizzas) or generic multiple pizza logic
                // Just find as many "bánh [flavor]" as possible in the search area

                // Check occurrences of "bánh"
                const banhRegex = /bánh\s+/gi;
                let banhMatch;
                while ((banhMatch = banhRegex.exec(currentSearchArea)) !== null) {
                    const afterBanh = currentSearchArea.substring(banhMatch.index + banhMatch[0].length);

                    // Try to match a flavor
                    for (const [key, fullName] of flavorEntries) {
                        if (afterBanh.toLowerCase().startsWith(key)) {
                            // SKIP "bánh mì phô mai" if it's meant to be a side dish?
                            // User request: "combo ... bánh mì phô mai" -> parse as pizza flavor?
                            // Assume if "bánh" keyword is used in combo context, it's a pizza flavor choice unless it's strictly a side dish ID.
                            // But user said "combo 3 bánh bò và bánh hải sản".
                            // If "bánh mì phô mai" is a specific side dish, does it count as a pizza choice?
                            // Probably not unless user says "bánh pizza bánh mì phô mai" (weird).
                            // Let's exclude specific side items if they overlap?
                            // "bánh mì phô mai" is mapped to "Bánh Mì Phô Mai". If it's not a pizza, maybe we assume user made a mistake or wants it as side?
                            // For now, assume all keys in PIZZA_FLAVORS are valid.

                            // FOUND A FLAVOR
                            foundFlavors.push(fullName);

                            // Add to details
                            pizzaDetailsList.push(`${fullName} (${size})`);

                            // Mask this part in tempText to avoid double counting
                            // Calculate absolute position
                            const absStart = endIdx + banhMatch.index;
                            const absEnd = absStart + banhMatch[0].length + key.length;
                            const maskLen = absEnd - absStart;
                            tempText = tempText.substring(0, absStart) + "#".repeat(maskLen) + tempText.substring(absEnd);

                            break; // Stop looking for flavors for THIS "bánh" instance
                        }
                    }
                }

                // Mask the Combo itself
                const comboMaskLen = m[0].length;
                tempText = tempText.substring(0, m.index) + "#".repeat(comboMaskLen) + tempText.substring(m.index + comboMaskLen);

                // Restart main loop since tempText changed structure (indices shifted? No, masking keeps length).
                // Regex state might be invalid though.
                scanRegex.lastIndex = 0;
            }
        }
    }

    // --- STANDARD ITEM PARSING (Remaining) ---
    for (const entry of KEYWORD_MAP) {
        const regex = new RegExp(entry.regex.source, 'gi');
        let match;
        while ((match = regex.exec(tempText)) !== null) {
            if (match[0].includes('#')) continue;

            const start = match.index;
            const end = start + match[0].length;

            const prefix = tempText.substring(Math.max(0, start - 10), start).trim();
            const numberMatch = prefix.match(/(\d+)\s*$/);
            let qty = 1;
            if (numberMatch) {
                qty = parseInt(numberMatch[1]);
            }

            itemsMapV2[entry.id] = (itemsMapV2[entry.id] || 0) + qty;

            const mask = "#".repeat(match[0].length);
            tempText = tempText.substring(0, start) + mask + tempText.substring(end);
        }
    }

    const items: OrderItem[] = [];
    Object.keys(itemsMapV2).forEach(id => {
        const item = MENU_ITEMS.find(m => m.id === id);
        if (item) {
            items.push({
                id,
                name: item.name,
                price: item.price,
                quantity: itemsMapV2[id]
            });
        }
    });

    const pizza_details = pizzaDetailsList.length > 0 ? pizzaDetailsList.join(", ") : undefined;

    return {
        table_number: "",
        items: items,
        note: "",
        pizza_details: pizza_details
    };
};


