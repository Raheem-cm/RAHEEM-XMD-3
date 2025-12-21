const config = require('../config');
const { cmd, commands } = require('../command');
const os = require('os');

cmd({
    pattern: "alive",
    desc: "Check if the bot is active",
    category: "main",
    react: "📟",
    filename: __filename
}, async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, groupMetadata, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Mahesabu ya Uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / (24 * 3600));
        const hours = Math.floor((uptime % (24 * 3600)) / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        const secs = Math.floor(uptime % 60);
        const uptimeString = `${days}d ${hours}h ${mins}m ${secs}s`;

        const aliveMsg = `
*╭──┈〔  ${config.BOT_NAME || 'RAHEEM-XMD-3'}  〕┈──*
┃
┃ 🟢 *Status:* Online & Active
┃ 👤 *User:* ${pushname}
┃ 📍 *Prefix:* ${config.PREFIX}
┃ ⏳ *Uptime:* ${uptimeString}
┃ 🖥️ *Platform:* ${os.hostname()}
┃ 📟 *Version:* 1.0.0
┃ 🌐 *Mode:* ${config.MODE}
┃
╰━━━━━━━━━━━━━━━━━━┈

> *“Innovation distinguishes between a leader and a follower.”*

*Type ${config.PREFIX}menu to see my commands.*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/9gl0l8.jpg" }, // Picha yako ile ile kali
                caption: aliveMsg.trim(),
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363249960782857@newsletter',
                        newsletterName: "RAHEEM-XMD SUPPORT",
                        serverMessageId: 1
                    },
                    externalAdReply: {
                        title: "RAHEEM-XMD IS ALIVE",
                        body: "Multi-Device WhatsApp Bot",
                        mediaType: 1,
                        sourceUrl: "https://github.com/",
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
        reply(`❌ Error: ${e.message}`);
    }
});
