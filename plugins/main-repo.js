const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    desc: "Get bot repository link",
    category: "main",
    react: "📁",
    filename: __filename
}, async (conn, mek, m, { from, text }) => {
    try {
        const repoInfo = `
╭━━〔 *RAHEEM-XMD-3 REPO* 〕━━┈
┃
┃ 📂 *Repository:* RAHEEM-XMD-3
┃ 👤 *Owner:* Raheem-cm
┃ 🌟 *Stars:* Auto-fetching...
┃ 🍴 *Forks:* Auto-fetching...
┃ 🛠️ *Language:* JavaScript
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈

> *Click the card above or the button below to view the source code.*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
                caption: repoInfo.trim(),
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363399470975987@newsletter',
                        newsletterName: "NYONI-XMD OFFICIAL",
                        serverMessageId: 1
                    },
                    externalAdReply: {
                        title: "VIEW RAHEEM-XMD-3 REPOSITORY",
                        body: "Source Code & Deployment Guide",
                        mediaType: 1,
                        sourceUrl: "https://github.com/Raheem-cm/RAHEEM-XMD-3",
                        thumbnailUrl: "https://files.catbox.moe/9gl0l8.jpg",
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: "❌ Failed to fetch repository info." }, { quoted: mek });
    }
});
