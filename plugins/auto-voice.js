const { cmd } = require('../command');

// --- SECURE & TESTED AUDIO LINKS ---
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
        // Stop if no message, if it's a command, or if it's from the bot itself
        if (!body || isCmd || m.key.fromMe) return;

        const text = body.toLowerCase().trim();

        for (const key in voiceData) {
            if (text.includes(key)) {
                // 1. Show "recording" status so you know it's working
                await conn.sendPresenceUpdate('recording', from);

                // 2. Send the audio with the most compatible settings
                await conn.sendMessage(from, {
                    audio: { url: voiceData[key] },
                    mimetype: 'audio/mpeg', 
                    ptt: true,
                    waveform: [0,0,50,100,50,0,50,100,50,0] // Makes it look premium
                }, { quoted: mek });
                
                break; 
            }
        }
    } catch (e) {
        console.error("AutoVoice Critical Error:", e);
    }
});

// SYSTEM STATUS PANEL
cmd({
    pattern: "autovoice",
    desc: "Monitor Auto-Voice status",
    category: "owner",
    react: "🎙️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const status = `
*R A H E E M - X M D   S Y S T E M* 🎙️
_S t a t u s   D i a g n o s t i c_

▫️ *System:* \`Online & Monitoring\` ✅
▫️ *Engine:* \`V1.1.0 Stable (Elite)\`
▫️ *Keywords:* \`hello, mambo, bot, test, nyoni\`

> *powered by raheem-tech prestige*`;

    return reply(status.trim());
});
