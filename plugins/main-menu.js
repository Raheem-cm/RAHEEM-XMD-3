const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Show professional English menu",
    category: "menu2",
    react: "⭐",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // High-quality formatted menu text
        const menuText = `
*╭━━〔 ${config.BOT_NAME || 'RAHEEM-XMD'} 〕━━┈*
┃ 
┃ 👤 *USER:* ${pushname}
┃ 📍 *PREFIX:* ${config.PREFIX}
┃ 🎛️ *MODE:* ${config.MODE}
┃ ⏳ *UPTIME:* ${process.uptime().toFixed(0)}s
┃ 📂 *COMMANDS:* 150+
┃
*╰━━━━━━━━━━━━━━━━━━━━━┈*

*Hello ${pushname}, use the commands below:*

*🏠 MAIN MENU*
✧ .ping | .alive | .owner | .repo

*📥 DOWNLOADS*
✧ .song | .video | .fb | .tiktok
✧ .insta | .ytmp3 | .ytmp4 | .apk

*👥 GROUP TOOLS*
✧ .kick | .add | .promote | .mute
✧ .tagall | .hidetag | .link

*🤖 AI & TOOLS*
✧ .ai | .gpt4 | .imagine | .trt
✧ .sticker | .fancy | .ebase64

*🎉 FUN & ANIME*
✧ .hack | .ship | .waifu | .joke

> 💻 *Powered by RAHEEM-XMD-V3*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/8s7lxh.jpg" },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363399470975987@newsletter',
                        newsletterName: "RAHEEM-XMD OFFICIAL",
                        serverMessageId: 1
                    },
                    externalAdReply: {
                        title: `RAHEEM-XMD V3: ${pushname}'s Panel`,
                        body: "Select a command to begin",
                        mediaType: 1,
                        sourceUrl: "https://github.com/YourRepoLink", // Put your link here
                        thumbnailUrl: "https://files.catbox.moe/8s7lxh.jpg",
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply("❌ Menu Error: " + e.message);
    }
});
