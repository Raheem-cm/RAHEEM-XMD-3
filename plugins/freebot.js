 const { cmd } = require('../command');

cmd({
    pattern: "freebot",
    alias: ["mortal", "deploy"],
    desc: "Get the MORTAL-KOMBAT-XR deployment link.",
    category: "main",
    react: "⚔️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const botLink = "https://nyoni-free-bot.onrender.com/";
        const imageUrl = "https://files.catbox.moe/8s7lxh.jpg";

        const messageContent = `
*𝙼𝙾𝚁𝚃𝙰𝙻-𝙺𝙾𝙼𝙱𝙰𝚃-𝚇𝚁* ⚔️
_t h e  u l t i m a t e  f r e e  b o t_

▫️ *Status:* \`Operational\` ✅
▫️ *Access:* \`Free for All\` 🔓
▫️ *Power:* \`Maximum Velocity\` 🚀

Click the link below to deploy your own instance of **𝙼𝙾𝚁𝚃𝙰𝙻-𝙺𝙾𝙼𝙱𝙰𝚃-𝚇𝚁** for free.

🔗 *Bot Link:* ${botLink}

> *powered by raheem-tech prestige*
`;

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: messageContent.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "𝙼𝙾𝚁𝚃𝙰𝙻-𝙺𝙾𝙼𝙱𝙰𝚃-𝚇𝚁 UPDATES",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "𝙼𝙾𝚁𝚃𝙰𝙻 - 𝙺𝙾𝙼𝙱𝙰𝚃 - 𝚇𝚁",
                    body: "Deploy Your Free Bot Now",
                    thumbnailUrl: imageUrl,
                    sourceUrl: botLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ System Error: Link not found.");
    }
});
