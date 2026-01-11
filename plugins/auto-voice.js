const { cmd } = require('../command');

// --- SETTINGS (FIXED SYNTAX & YOUR LINKS) ---
const voiceData = {
    "hello": "https://files.catbox.moe/nettm1.mp3",
    "mambo": "https://files.catbox.moe/7pscrj.mp3",
    "bot": "https://files.catbox.moe/6hfp3a.mp3",
    "test": "https://files.catbox.moe/3pq2zb.mp3",
    "nyoni": "https://files.catbox.moe/3pq2zb.mp3"
};

cmd({
    on: "body" // This makes the bot listen to every message
}, async (conn, mek, m, { body, from, isGroup, isCmd }) => {
    try {
        // Stop if no message, if it's a command, or if it's from the bot itself
        if (!body || isCmd || m.key.fromMe) return; 

        const text = body.toLowerCase().trim();

        for (const key in voiceData) {
            if (text.includes(key)) {
                // Show recording status for a professional feel
                await conn.sendPresenceUpdate('recording', from);

                await conn.sendMessage(from, {
                    audio: { url: voiceData[key] },
                    mimetype: 'audio/mpeg', // MPEG is more stable for WhatsApp
                    ptt: true // Sends as a Voice Note
                }, { quoted: mek });
                break; // Stop after finding one match
            }
        }
    } catch (e) {
        console.log("AutoVoice Error: ", e);
    }
});

// COMMAND TO CHECK STATUS (ENGLISH STYLE)
cmd({
    pattern: "autovoice",
    desc: "Check auto-voice status",
    category: "owner",
    react: "🎤",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    return reply(`
*R A H E E M - X M D   V O I C E* 🎙️
_S y s t e m   O p e r a t i o n a l_

▫️ *Status:* \`System Online\` ✅
▫️ *Keywords:* \`hello, mambo, bot, test, nyoni\`
▫️ *Engine:* \`V1.1.0 Stable\`

> *powered by raheem-tech prestige*`);
});
