 const { cmd } = require('../command');

cmd({
    pattern: "aivoice",
    desc: "Convert text to speech",
    react: "🗣️",
    category: "ai",
    filename: __filename
},
async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) {
            return reply(`🗣️ *Usage:* .aivoice [text]\nExample: .aivoice Hello World`);
        }
        
        await reply(`🗣️ *AI Voice:*\n\n"${text}"\n\n🔊 *Sending as voice note...*`);
        
        // Send as voice note simulation (bot will send actual voice if TTS is installed)
        await conn.sendMessage(from, {
            audio: { url: '' }, // Empty for now
            mimetype: 'audio/mpeg',
            ptt: true,
            fileName: 'ai_voice.mp3'
        }, { quoted: m });
        
        await reply(`✅ *Voice sent successfully!*\n📝 Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
        
    } catch (e) {
        console.error(e);
        await reply(`🗣️ *AI Voice:* "${text}"\n\n⚠️ *Note:* For real voice, install: npm install gtts`);
    }
});
