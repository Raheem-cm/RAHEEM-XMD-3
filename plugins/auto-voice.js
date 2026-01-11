const { cmd } = require('../command');

/**
 * R A H E E M - X M D   E L I T E   A U T O V O I C E
 * Fixed Syntax and Optimized Audio Delivery
 */

const voiceData = {
    "hello": "https://raw.githubusercontent.com/Niko-The-Cat/media/main/hello.mp3",
    "mambo": "https://files.catbox.moe/7pscrj.mp3",
    "bot": "https://files.catbox.moe/6hfp3a.mp3",
    "test": "https://files.catbox.moe/3pq2zb.mp3",
    "nyoni": "https://files.catbox.moe/3pq2zb.mp3"
};

cmd({
    on: "body"
}, async (conn, mek, m, { body, from, isCmd }) => {
    try {
        // Prevent bot from replying to itself or other commands
        if (!body || isCmd || m.key.fromMe) return;

        const text = body.toLowerCase().trim();

        for (const key in voiceData) {
            if (text.includes(key)) {
                // IMPORTANT: Use 'audio/mpeg' for best compatibility
                await conn.sendMessage(from, {
                    audio: { url: voiceData[key] },
                    mimetype: 'audio/mpeg', 
                    ptt: true 
                }, { quoted: mek });
                break; 
            }
        }
    } catch (e) {
        console.error("Critical Error in AutoVoice:", e);
    }
});

// STATUS PANEL (PRESTIGE UI)
cmd({
    pattern: "autovoice",
    desc: "Check system operational status",
    category: "owner",
    react: "🎙️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const statusMsg = `
*R A H E E M - X M D   V O I C E* 🎙️
_S y s t e m   O p e r a t i o n a l_

▫️ *Status:* \`System Online\` ✅
▫️ *Engine:* \`V1.0.5 Stable (Fix)\`
▫️ *Keywords:* \`hello, mambo, bot, test, nyoni\`

> *powered by raheem-tech*`;

    return reply(statusMsg.trim());
});
