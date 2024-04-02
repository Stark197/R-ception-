// stickerResponder.js
module.exports = {
    name: 'stickerResponder',
    description: 'Responds with a sticker when a specific word is mentioned',
    execute(message) {
        if (message.body === 'مرحبا') {
            // استبدل 'YOUR_IMAGE_URL' برابط الصورة التي تريد إرسالها
            const imageUrl = 'https://telegra.ph/file/7481e4f0e459b186e1633.jpg';
            
            // تحميل الصورة من الرابط وإرسالها كملصق
            MessageMedia.fromUrl(imageUrl).then(media => {
                message.reply(media, { sendMediaAsSticker: true });
            }).catch(error => {
                console.log('Error downloading image:', error);
                message.reply('عذرًا، حدث خطأ أثناء محاولة إرسال الملصق.');
            });
        }
    }
};
