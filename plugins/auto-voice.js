const { cmd } = require('../command');

// --- SETTINGS (FIXED SYNTAX) ---
const voiceData = {
    "hello": "https://files.catbox.moe/nettm1.mp3",
    "mambo": "https://files.catbox.moe/7pscrj.mp3",
    "bot": "https://files.catbox.moe/6hfp3a.mp3",
    "test": "https://files.catbox.moe/3pq2zb.mp3",
    "nyoni": "https://files.catbox.moe/3pq2zb.mp3"
};

cmd({
    on: "body" 
}, async (conn, mek, m, { body, from, isCmd }) => {
    try {
        if (!body || isCmd || m.key.fromMe) return; 

        const text = body.toLowerCase();

        for (const key in voiceData) {
            if (text.includes(key)) {
                await conn.sendMessage(from, {
                    audio: { url: voiceData[key] },
                    mimetype: 'audio/mpeg', // Fixed mimetype for stability
                    ptt: true 
                }, { quoted: mek });
                break; 
            }
        }
    } catch (e) {
        console.log("AutoVoice Error: ", e);
    }
});

// STATUS COMMAND (ENGLISH PRESTIGE)
cmd({
    pattern: "autovoice",
    desc: "Check system status",
    category: "owner",
    react: "🎤",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    return reply(`
*R A H E E M - X M D   V O I C E* 🎙️
_S y s t e m   O p e r a t i o n a l_

▫️ *Status:* \`System Online\` ✅
▫️ *Keywords:* \`hello, mambo, bot, test, nyoni\`
▫️ *Engine:* \`V1.0.0 Stable\`

> *powered by raheem-tech*`);
});
