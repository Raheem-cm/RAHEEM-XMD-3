const { cmd } = require('../command');
const { createCanvas } = require('canvas'); // npm i canvas
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "meme",
    desc: "Make meme with automatic random colors",
    category: "fun",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    if (!text) return reply("*Example:* .meme kaka yangu anaenda shule...");

    await reply("🎨 *Creating meme...*");

    try {
        // Split text into lines max 40 chars each
        const lines = text.match(/.{1,40}/g) || [text];
        const width = 800;
        const height = 100 + lines.length * 50;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background black
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '30px Impact';
        ctx.textAlign = 'center';

        // Draw each line with random color
        lines.forEach((line, i) => {
            const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;
            ctx.fillStyle = color;
            ctx.fillText(line, width / 2, 60 + i * 50);
        });

        // Save temporary file
        const tempFile = path.join(__dirname, `../temp_meme_${Date.now()}.png`);
        fs.writeFileSync(tempFile, canvas.toBuffer('image/png'));

        // Send to WhatsApp
        await conn.sendMessage(from, {
            image: fs.readFileSync(tempFile),
            caption: `😂 *MEME GENERATED*\n\n> RAHEEM-XMD`
        }, { quoted: mek });

        // Cleanup
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

    } catch (e) {
        console.error(e);
        reply("❌ Failed to generate meme.");
    }
});
