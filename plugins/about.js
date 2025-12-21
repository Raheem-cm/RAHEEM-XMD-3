const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: ".",
    desc: "Show information about the developer",
    category: "main",
    react: "ℹ️",
    filename: __filename
}, async (conn, mek, m, { from, text }) => {
    try {
        
        const aboutBody = `
*╭═══〔 👤 BIOGRAPHY 〕═══╮*
┃
┃ ◦ *Lead Dev:* RAHEEM-CM
┃ ◦ *Real Name:* ABDULRAHIM
┃ ◦ *Nickname:* CM18
┃ ◦ *Age:* Undefined
┃ ◦ *City:* Undefined
┃ ◦ *Role:* Passionate WhatsApp Dev
┃
*╰━━━━━━━━━━━━━━━━━━━━╯*

*╭═══〔 🛠️ DEVELOPMENT 〕═══╮*
┃
┃ ◦ *Project:* RAHEEM-XMD
┃ ◦ *Collaborators:* 2 Developers
┃ ◦ *Main Dev:* RAHEEM-CM
┃ ◦ *Status:* Active & Secure
┃
*╰━━━━━━━━━━━━━━━━━━━━╯*

> *“Coding is not just a hobby, it's a lifestyle.”*
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴇᴇᴍ-ᴄᴍ*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
                caption: aboutBody.trim(),
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
                        title: "RAHEEM-XMD DEVELOPER INFO",
                        body: "MEET THE BRAIN BEHIND RAHEEM-XMD",
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
        await conn.sendMessage(from, { text: "❌ About system error!" }, { quoted: mek });
    }
});
