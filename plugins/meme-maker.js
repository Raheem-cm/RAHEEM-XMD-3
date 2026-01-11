const { cmd } = require('../command');
const Jimp = require('jimp');
const axios = require('axios');

cmd({
    pattern: "meme",
    desc: "Meme Maker with your own image",
    category: "fun",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, quoted }) => {

    if (!text && !quoted) return reply("*Usage:* send an image with caption:\n.meme Your text here");

    await reply("😂 *Generating meme...*");

    try {
        let imageBuffer;

        // Get image from quoted or attached
        if (quoted && quoted.imageMessage) {
            const url = await conn.downloadMediaMessage(quoted);
            imageBuffer = url;
        } else {
            return reply("❌ Please send an image with your text!");
        }

        const image = await Jimp.read(imageBuffer);

        // Load font
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

        // Split text into multiple lines
        const lines = text.match(/.{1,40}/g); // 40 chars per line
        let y = 10;

        lines.forEach((line) => {
            image.print(font, 10, y, {
                text: line,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_TOP
            }, image.bitmap.width - 20); // width margin
            y += 40;
        });

        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        await conn.sendMessage(
            from,
            { image: buffer, caption: `😂 *MEME READY*\n> RAHEEM-XMD` },
            { quoted: mek }
        );

    } catch (err) {
        console.log("MEME ERROR:", err);
        reply("❌ Meme failed but bot is SAFE.");
    }
});
