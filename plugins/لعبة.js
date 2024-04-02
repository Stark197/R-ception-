import fetch from 'node-fetch';
import { addExif } from '../lib/sticker.js';
import { Sticker } from 'wa-sticker-formatter';

async function convertToSticker(imageUrl, packname, author) {
    try {
        const response = await fetch(imageUrl);
        const imageData = await response.buffer();
        const stickerData = await addExif(imageData, packname, author);
        const sticker = new Sticker(stickerData, {
            type: 'full',
            pack: packname,
            author: author
        });
        return sticker.toBuffer();
    } catch (error) {
        console.error("حدث خطأ أثناء تحويل الصورة إلى ملصق:", error);
        return null;
    }
}

async function autoReplyWithStickers(m) {
    try {
        const keywordStickers = {
            "صباح الخير": "https://telegra.ph/file/7481e4f0e459b186e1633.jpg",
            "مساء الخير": "https://telegra.ph/file/5805b7544dcb283171b4e.jpg",
            // يمكنك إضافة المزيد من الكلمات والملصقات حسب الحاجة
        };
        
        const message = m.text.toLowerCase();
        for (const [keyword, stickerUrl] of Object.entries(keywordStickers)) {
            if (message.includes(keyword)) {
                const sticker = await convertToSticker(stickerUrl, "اسم الحزمة", "اسم المؤلف");
                if (sticker) {
                    conn.sendMessage(m.chat, sticker, 'stickerMessage');
                } else {
                    console.log("لم يتمكن من تحويل الصورة إلى ملصق");
                }
                break;
            }
        }
    } catch (error) {
        console.error("حدث خطأ أثناء معالجة الرسالة:", error);
    }
}

export { autoReplyWithStickers };
