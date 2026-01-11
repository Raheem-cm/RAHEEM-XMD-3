const { cmd } = require('../command');

// --- NEW STABLE LINKS ---
const voiceData = {
    "hello": "https://github.com/PRINCE-GDS/THE-PRINCE-BOT/raw/main/Voices/hello.mp3",
    "mambo": "https://github.com/PRINCE-GDS/THE-PRINCE-BOT/raw/main/Voices/mambo.mp3",
    "bot": "https://github.com/PRINCE-GDS/THE-PRINCE-BOT/raw/main/Voices/bot.mp3",
    "test": "https://github.com/PRINCE-GDS/THE-PRINCE-BOT/raw/main/Voices/test.mp3"
};

cmd({
    on: "body" 
}, async (conn, mek, m, { body, from, isCmd }) => {
    try {
        if (!body || isCmd) return; 

        const text = body.toLowerCase();

        for (const key in voiceData) {
            if (text.includes(key)) {
                await conn.sendMessage(from, {
                    audio: { url: voiceData[key] },
                    mimetype: 'audio/mpeg', // Changed to mpeg for better compatibility
                    ptt: true 
                }, { quoted: mek });
                break; 
            }
        }
    } catch (e) {
        console.log("Audio Error: ", e);
    }
});

// STATUS COMMAND
cmd({
    pattern: "autovoice",
    desc: "Check system status",
    category: "owner",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    return reply("*R A H E E M - X M D   V O I C E* 🎙️\n\n*Status:* `Fix Applied` ✅\n*Mimetype:* `audio/mpeg`\n\n> *Try typing 'hello' now.*");
});
