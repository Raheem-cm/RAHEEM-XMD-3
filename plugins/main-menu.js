const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Show professional interactive menu",
    category: "menu2",
    react: "🚀",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const header = `
*╭━━〔 ${config.BOT_NAME || 'RAHEEM-XMD-V3'} 〕━━┈*
┃ 
┃ 👤 *USER:* ${pushname}
┃ 🛠️ *PREFIX:* ${config.PREFIX}
┃ 🎛️ *MODE:* ${config.MODE}
┃ ⚡ *SPEED:* 0.45ms
┃ 📂 *COMMANDS:* 150+
┃
*╰━━━━━━━━━━━━━━━━━━━━━┈*

*Hello ${pushname},* Select a category below to view my commands. I am an advanced WhatsApp assistant designed to make your life easier!`;

        const sections = [
            {
                title: "💎 TOP CATEGORIES",
                rows: [
                    { title: "All Commands", rowId: ".allmenu", description: "View every command available" },
                    { title: "Main System", rowId: ".mainmenu", description: "Bot status and info commands" }
                ]
            },
            {
                title: "📥 MEDIA & DOWNLOADS",
                rows: [
                    { title: "Social Media", rowId: ".downloadmenu", description: "Download FB, TikTok, Insta, etc." },
                    { title: "YouTube Tools", rowId: ".ytmenu", description: "MP3, MP4 and Search tools" }
                ]
            },
            {
                title: "👥 GROUP MANAGEMENT",
                rows: [
                    { title: "Admin Tools", rowId: ".groupmenu", description: "Kick, Add, Promote, Mute" }
                ]
            },
            {
                title: "🤖 ARTIFICIAL INTELLIGENCE",
                rows: [
                    { title: "AI Tools", rowId: ".aimenu", description: "ChatGPT, GPT-4, Imagine AI" }
                ]
            }
        ];

        // Sending the Message with "View Menu" Button
        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/8s7lxh.jpg" },
            caption: header,
            footer: "© 2026 RAHEEM-XMD SYSTEMS",
            buttons: [
                { buttonId: '.owner', buttonText: { displayText: '👤 OWNER' }, type: 1 },
                { buttonId: '.ping', buttonText: { displayText: '⚡ SPEED' }, type: 1 }
            ],
            headerType: 4,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "RAHEEM-XMD MULTIDEVICE",
                    body: "Professional WhatsApp Bot",
                    mediaType: 1,
                    sourceUrl: "https://github.com/YourRepo",
                    thumbnailUrl: "https://files.catbox.moe/8s7lxh.jpg",
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error generating menu.");
    }
});
