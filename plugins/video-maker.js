const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "videomake",
    desc: "Animated text (GIF fallback)",
    category: "video",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    if (!text) return reply("*Example:* .videomake hi bro");

    await reply("🎬 *Creating animation...*");

    try {
        // Simple text → GIF generator
        const url = `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(text)}`;
        const img = await axios.get(url, { responseType: "arraybuffer" });

        await conn.sendMessage(
            from,
            {
                image: Buffer.from(img.data),
                caption: `🎞 *ANIMATED PREVIEW*\n\n${text}\n\n> RAHEEM-XMD`
            },
            { quoted: mek }
        );

    } catch (e) {
        reply("❌ Failed to generate preview.");
    }
});
