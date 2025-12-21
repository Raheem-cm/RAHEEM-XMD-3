const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "owner",
    desc: "Show Owner Control Menu",
    category: "owner",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, text }) => {
    try {
        
        const ownerHeader = `
╭━━〔 👑 *NYONI-XMD CONTROL* 👑 〕━━┈
┃
┃ 🛡️ *System Admin:* Nyoni-CM
┃ 🕹️ *Access:* Authorized Only
┃ ⚡ *Status:* Root Access
┃ 🛰️ *Server:* Secure-V3
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈

> *Warning: These commands can modify bot behavior.*
`;

        const ownerMenu = `${ownerHeader}
*╭──┈〔 👑 MASTER CMDS 〕┈──*
┃ ✧ .block [namba]
┃ ✧ .unblock [namba]
┃ ✧ .fullpp (Weka PP kubwa)
┃ ✧ .setpp (Weka PP kawaida)
┃ ✧ .restart (Washa upya bot)
┃ ✧ .shutdown (Zima bot)
┃ ✧ .updatecmd (Update kodi)
┃ ✧ .broadcast (Tuma ujumbe wote)
╰──────────────┈

*╭──┈〔 📊 DATA & LOGS 〕┈──*
┃ ✧ .listcmd
┃ ✧ .gjid (Pata ID ya Group)
┃ ✧ .jid (Pata ID ya User)
┃ ✧ .alive (Check system)
┃ ✧ .ping (Check Speed)
╰──────────────┈

*╭──┈〔 🛠️ CONFIGS 〕┈──*
┃ ✧ .setmode (Public/Private)
┃ ✧ .setprefix (Badili prefix)
┃ ✧ .allmenu (View everything)
┃ ✧ .vv (View Once bypass)
╰──────────────┈

> 👤 **Owner:** Nyoni-CM
> ✅ **Access:** Verified Admin
`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
                caption: ownerMenu.trim(),
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 1,
                    isForwarded: true,
                    externalAdReply: {
                        title: "NYONI-XMD OWNER PANEL",
                        body: "Authorized Personnel Only",
                        mediaType: 1,
                        sourceUrl: "https://github.com/Nyoni-xmd",
                        thumbnailUrl: "https://files.catbox.moe/9gl0l8.jpg",
                        renderLargerThumbnail: false,
                        showAdAttribution: true
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: "❌ Owner system error!" }, { quoted: mek });
    }
});
