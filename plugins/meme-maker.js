const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "meme",
    desc: "Safe meme on image",
    category: "fun",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, quoted }) => {
    if (!text && !quoted) return reply("Send image with .meme <text>");

    await reply("😂 *Generating meme safely...*");

    try {
        let imageUrl;

        if (quoted && quoted.imageMessage) {
            imageUrl = await conn.downloadMediaMessage(quoted, "buffer");
            // Upload to temp image host if needed (catbox, imgbb etc)
            // For demo we assume user provides a URL
            return reply("❌ On self-hosted image, API upload required. Use text only method first.");
        }

        // Safe text only meme
        const chunks = text.match(/.{1,80}/g).join("\n");
        const url = `https://api.memegen.link/images/custom/_/${encodeURIComponent(chunks)}.png?background=https://i.imgur.com/Z6a9F5B.png&font=impact`;

        const img = await axios.get(url, { responseType: "arraybuffer" });

        await conn.sendMessage(from, {
            image: Buffer.from(img.data),
            caption: "😂 *MEME READY*\n> RAHEEM-XMD"
        }, { quoted: mek });

    } catch (err) {
        console.log("MEME ERROR:", err.message);
        reply("❌ Meme failed but bot is SAFE.");
    }
});
