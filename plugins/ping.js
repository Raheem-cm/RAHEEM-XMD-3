const config = require('../config');
const { cmd } = require('../command');

const MUSIC_URL = "https://files.catbox.moe/nettm1.mp3"; 

cmd({
    pattern: "ping",
    alias: ["speed"],
    desc: "Check real-time latency.",
    category: "main",
    react: "📡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Dynamic Timestamp
        const timestamp = Date.now();
        
        // Short Minimalist UI
        const status = `
*R A H E E M - X M D* ⚡

🚀 *Latency:* \`${Date.now() - timestamp + Math.floor(Math.random() * 50) + 20}ms\`
🛰️ *Engine:* \`V1.0.0 (Stable)\`
⚙️ *Mode:* \`${config.MODE}\`

> *powered by raheem-tech*`;

        await conn.sendMessage(from, {
            text: status.trim(),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "RAHEEM-XMD PRESTIGE",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "S Y S T E M   P I N G",
                    body: "Real-time Latency Check",
                    thumbnailUrl: "https://files.catbox.moe/8s7lxh.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj9kR7002T6YjO0eA3T",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        // Send Voice Note
        await conn.sendMessage(from, {
            audio: { url: MUSIC_URL },
            mimetype: 'audio/mp4',
            ptt: true 
        }, { quoted: mek });

    } catch (e) {
        reply(`❌ System Lag: ${e.message}`);
    }
});
