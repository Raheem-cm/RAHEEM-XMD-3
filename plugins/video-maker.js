const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "videomake",
    desc: "Video maker without ffmpeg",
    category: "video",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    if (!text) return reply("*Example:* .videomake RAHEEM XMD");

    await reply("🎬 *Creating video online...*");

    try {
        // API ya online video generator (text → video)
        const apiUrl = "https://api.text2video.ai/generate";

        const res = await axios.post(apiUrl, {
            text: text,
            duration: 5,
            resolution: "720x720",
            background: "black",
            textColor: "white"
        }, {
            responseType: "arraybuffer"
        });

        await conn.sendMessage(
            from,
            {
                video: Buffer.from(res.data),
                caption: "✅ *Video Generated Successfully*"
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply("❌ Video service failed. Try again later.");
    }
});
