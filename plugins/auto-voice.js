const { cmd } = require('../command');

// --- DATABASE: KEYWORDS & AUDIO LINKS ---
const voiceDatabase = {
    "hello": "https://files.catbox.moe/mydizf.mp3",
    "bot": "https://files.catbox.moe/nettm1.mp3",
    "raheem": "https://files.catbox.moe/nettm1.mp3",
    "owner": "https://files.catbox.moe/7p8shf.mp3",
    "system": "https://files.catbox.moe/nettm1.mp3"
};

// Global Switch
let isAutoVoiceActive = true; 

// LISTENER MIDDLEWARE
module.exports.middleware = async (conn, mek, m, { body, from }) => {
    if (!isAutoVoiceActive || !body) return false;

    const input = body.toLowerCase();

    for (const keyword in voiceDatabase) {
        if (input.includes(keyword)) {
            await conn.sendMessage(from, {
                audio: { url: voiceDatabase[keyword] },
                mimetype: 'audio/mp4',
                ptt: true // Sends as a Voice Note (Blue Mic)
            }, { quoted: mek });
            return true; 
        }
    }
    return false;
};

// MANAGEMENT COMMAND
cmd({
    pattern: "autovoice",
    alias: ["av"],
    desc: "Manage automatic voice responses.",
    category: "owner",
    react: "🎙️",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, prefix }) => {
    // Only the bot owner can trigger this
    if (!m.key.fromMe) return reply("*ACCESS DENIED* ❌");

    if (!text) return reply(`
*R A H E E M - X M D   V O I C E* 🎙️
_S y s t e m   C o n t r o l_

▫️ *Status:* ${isAutoVoiceActive ? 'ACTIVE' : 'DISABLED'}
▫️ *Usage:* ▸ \`${prefix}autovoice on\`
  ▸ \`${prefix}autovoice off\`

> *powered by raheem-tech*`);

    const action = text.toLowerCase();

    if (action === 'on') {
        isAutoVoiceActive = true;
        return reply(`*AUTO-VOICE ENABLED* ✅\n_The system is now responding to keywords._`);
    }

    if (action === 'off') {
        isAutoVoiceActive = false;
        return reply(`*AUTO-VOICE DISABLED* ❌\n_The system is now silent._`);
    }
});
