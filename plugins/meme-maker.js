const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "meme",
    desc: "Safe Meme Maker (no crash)",
    category: "fun",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    if (!text) return reply("*Example:* .meme Hii ni meme yangu ndefu sana...");

    await reply("😂 *Generating meme safely...*");

    try {
        // split text into chunks to avoid overflow
        const chunks = text.match(/.{1,80}/g).join("\n");

        const url = `https://api.memegen.link/images/custom/_/${encodeURIComponent(chunks)}.png?background=https://i.imgur.com/Z6a9F5B.png&font=impact`;

        const img = await axios.get(url, { responseType: "arraybuffer" });

        await conn.sendMessage(
            from,
            {
                image: Buffer.from(img.data),
                caption: "😂 *MEME READY*\n> RAHEEM-XMD"
            },
            { quoted: mek }
        );

    } catch (err) {
        console.log("MEME ERROR:", err.message);
        reply("❌ Meme failed but bot is SAFE.");
    }
});
