const fs = require('fs');
const { exec } = require('child_process');

let handler = m => m
handler.all = async function (m) {

    if (m.messageStubType == 9 && m.message) { // Check if it's a sticker message
        let stickerId = m.message.stickerMessage.fileSha256.toString('base64');
        let stickerUrl = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerId}/android/sticker.png`;
        this.sendFile(m.chat, stickerUrl, 'sticker.png', '🤖', m);
        return true; // Return true to indicate message is handled
    }

    if (/^مزه$/i.test(m.text) ) {
        let image = 'https://telegra.ph/file/4f9b6575446086b75dbc6.jpg'
        let imageFilename = 'morning.jpg';
        let stickerFilename = 'morning_sticker.png';
        await convertToSticker(imageFilename, stickerFilename);
        this.sendFile(m.chat, stickerFilename, 'sticker.png', '🌅', m);
        fs.unlinkSync(stickerFilename); // Delete the temporary sticker file after sending
        return true; // Return true to indicate message is handled
    }

    if (/^سونغ$/i.test(m.text) ) {
        let image = 'https://telegra.ph/file/7e509caadfccd6dd0bff0.jpg'
        let imageFilename = 'afternoon.jpg';
        let stickerFilename = 'afternoon_sticker.png';
        await convertToSticker(imageFilename, stickerFilename);
        this.sendFile(m.chat, stickerFilename, 'sticker.png', '🌞', m);
        fs.unlinkSync(stickerFilename); // Delete the temporary sticker file after sending
        return true; // Return true to indicate message is handled
    }

    if (/^كانيكي$/i.test(m.text) ) {
        let image = 'https://telegra.ph/file/e28fbb1405ff4f4520fad.jpg'
        let imageFilename = 'night.jpg';
        let stickerFilename = 'night_sticker.png';
        await convertToSticker(imageFilename, stickerFilename);
        this.sendFile(m.chat, stickerFilename, 'sticker.png', '🌙', m);
        fs.unlinkSync(stickerFilename); // Delete the temporary sticker file after sending
        return true; // Return true to indicate message is handled
    }
  
    return false; // Return false if message is not handled
}

async function convertToSticker(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        exec(`convert ${inputFile} -resize 512x512! ${outputFile}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error converting image to sticker: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Error converting image to sticker: ${stderr}`);
                reject(stderr);
                return;
            }
            resolve();
        });
    });
}

export default handler;
