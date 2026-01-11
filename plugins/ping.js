const config = require('../config');
const { cmd } = require('../command');

const MUSIC_URL = "https://files.catbox.moe/nettm1.mp3"; 

cmd({
    pattern: "ping",
    alias: ["speed"],
    desc: "Check system latency.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();
        const end = Date.now();
        const latency = (end - start) / 1000;

        // Minimalist Ghost UI (English)
        const ghostUI = `
*R A H E E M - X M D* ⚡
_p r e s t i g e  s y s t e m_

▫️ *Latency:* \`${latency.toFixed(3)}s\`
▫️ *Status:* \`Operational\`
▫️ *Host:* \`Private Server\`

> *powered by raheem-tech*`;

        await conn.sendMessage(from, {
            text: ghostUI.trim(),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "RAHEEM-XMD : PRESTIGE",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "S Y S T E M   L A T E N C Y",
                    body: "Version 1.0.0 • Stable",
                    thumbnailUrl: "https://files.catbox.moe/8s7lxh.jpg",
                    sourceUrl: "https://github.com",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        // Send Audio as Voice Note (PTT) for a smoother feel
        await conn.sendMessage(from, {
            audio: { url: MUSIC_URL },
            mimetype: 'audio/mp4',
            ptt: true 
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ System Error: ${e.message}`);
    }
});

// ✅ ping2 (The "Thin" Sticker Style)
cmd({
    pattern: "ping2",
    desc: "High-speed latency check.",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();
        const ping = Date.now() - startTime;

        const stickerStyle = `*R A H E E M - X M D* 🛸\n\n🚀 *Speed:* \`${ping}ms\`\n📡 *Engine:* \`V8 Stable\`\n\n> *prestige edition*`;

        await conn.sendMessage(from, { 
            text: stickerStyle,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "RAHEEM-XMD NEWS",
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: MUSIC_URL },
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});
