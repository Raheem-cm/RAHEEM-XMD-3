const { cmd } = require('../command');

// --- SETTINGS ---
const voiceData = {
    "hello": "https://files.catbox.moe/nettm1.mp3",
    "mambo": "https://files.catbox.moe/7pscrj.mp3",
    "bot": "https://files.catbox.moe/6hfp3a.mp3",
    "test": "https://files.catbox.moe/3pq2zb.mp3"
    "nyoni": "https://files.catbox.moe/3pq2zb.mp3",
 };

cmd({
    on: "body" // This makes the bot listen to every message
}, async (conn, mek, m, { body, from, isGroup, isCmd }) => {
    try {
        if (!body || isCmd) return; // Don't trigger if it's a command

        const text = body.toLowerCase();

        for (const key in voiceData) {
            if (text.includes(key)) {
                await conn.sendMessage(from, {
                    audio: { url: voiceData[key] },
                    mimetype: 'audio/mp4',
                    ptt: true // Sends as a Voice Note
                }, { quoted: mek });
                break; // Stop after finding one match
            }
        }
    } catch (e) {
        console.log(e);
    }
});

// COMMAND TO CHECK STATUS
cmd({
    pattern: "autovoice",
    desc: "Check auto-voice status",
    category: "owner",
    react: "🎤",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    return reply("*R A H E E M - X M D   V O I C E* 🎙️\n\n*Status:* `System Online` ✅\n*Keywords:* `hello, mambo, bot, test, nyoni`\n\n> *v1.0.0 Stable*");
});
