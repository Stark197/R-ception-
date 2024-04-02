// استيراد المكتبات والدوال اللازمة
import fetch from 'node-fetch';
import { addExif } from '../lib/sticker.js';
import { Sticker } from 'wa-sticker-formatter';

// دالة لتحويل الصور إلى ملصقات
async function convertToSticker(imageUrl, packname, author) {
    try {
        // جلب الصورة من الرابط
        const response = await fetch(imageUrl);
        const imageData = await response.buffer();
        
        // إضافة المعرفات (Exif) وتحويلها لملصق
        const sticker = await addExif(imageData, packname, author);
        return sticker;
    } catch (error) {
        console.error("حدث خطأ أثناء تحويل الصورة إلى ملصق:", error);
        return null;
    }
}

// دالة للتحقق من الرسائل وإرسال الملصقات بناءً على الكلمات المحددة
async function autoReplyWithStickers(m) {
    try {
        // الكلمات المحددة والملصقات المرتبطة بها
        const keywordStickers = {
            "ميسي": "https://telegra.ph/file/7481e4f0e459b186e1633.jpg",
            "رونالدو": "https://telegra.ph/file/5805b7544dcb283171b4e.jpg",
            // يمكنك إضافة المزيد من الكلمات والملصقات حسب الحاجة
        };
        
        // التحقق مما إذا كانت الرسالة تحتوي على كلمة محددة
        const message = m.text.toLowerCase();
        for (const [keyword, stickerUrl] of Object.entries(keywordStickers)) {
            if (message.includes(keyword)) {
                // تحويل الصورة إلى ملصق وإرساله كرد تلقائي
                const sticker = await convertToSticker(stickerUrl, "اسم الحزمة", "اسم المؤلف");
                if (sticker) {
                    conn.sendMessage(m.chat, sticker, 'stickerMessage');
                } else {
                    console.log("لم يتمكن من تحويل الصورة إلى ملصق");
                }
                break; // توقف عند أول تطابق
            }
        }
    } catch (error) {
        console.error("حدث خطأ أثناء معالجة الرسالة:", error);
    }
}

// تصدير الدالة للاستخدام في معالج الرسائل
export { autoReplyWithStickers };
