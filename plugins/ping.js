 const config = require('../config');
const { cmd } = require('../command');

const MUSIC_URL = "https://files.catbox.moe/ah3kxe.mp3";
const IMAGE_URL = "https://files.catbox.moe/9gl0l8.jpg";

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    desc: "Check bot's response speed.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = new Date().getTime();

        // Random emoji reaction
        const emojis = ['⚡', '🚀', '📡', '🎯', '📟', '🛸'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        await conn.sendMessage(from, { react: { text: emoji, key: mek.key } });

        const end = new Date().getTime();
        const latency = (end - start);

        // Modern English Styles (Slim & Sexy)
        const styles = [
`*🏓 PONG!*

╭━━〔 *RAHEEM-XMD SPEED* 〕━━┈
┃
┃ ⚡ *Latency:* ${latency}ms
┃ 👤 *Admin:* ${config.OWNER_NAME}
┃ 📡 *Status:* Stable
┃ 🛰️ *Server:* Secure-V3
┃
╰━━━━━━━━━━━━━━━━━━━━━━━┈
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴇᴇᴍ-ᴄᴍ*`,

`╭━━━〔 ⚡ *NYONI-XMD SPEED* 〕━━━┈
┃
┃ 🚀 *Response:* ${latency}ms
┃ 🕹️ *Mode:* ${config.MODE}
┃ 📟 *Vers:* 4.0.0
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━┈
> *Speed is the heart of RAHEEM-XMD*`
        ];

        const caption = styles[Math.floor(Math.random() * styles.length)];

        await conn.sendMessage(from, {
            image: { url: IMAGE_URL },
            caption: caption.trim(),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "RAHEEM-XMD OFFICIAL",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: `LATENCY: ${latency}MS`,
                    body: "SYSTEM STATUS: ONLINE",
                    mediaType: 1,
                    sourceUrl: "https://github.com/Raheem-cm/RAHEEM-XMD-3",
                    thumbnailUrl: IMAGE_URL,
                    renderLargerThumbnail: false,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

        // Optional Audio
        await conn.sendMessage(from, {
            audio: { url: MUSIC_URL },
            mimetype: 'audio/mpeg',
            ptt: true // Set true to send as voice note
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});
