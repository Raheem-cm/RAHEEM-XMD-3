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
╭━━〔 👑 *RAHERM-XMD-3 MASTER* 👑 〕━━┈
┃
┃ 👤 *Admin:* NYONI-CM
┃ 🕹️ *Access:* AUTHORIZED ONLY
┃ ⚡ *Status:* ROOT ACCESS
┃ 🛰️ *Server:* SECURE-V3
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈

> *Caution: Administrative commands ahead.*
`;

        const ownerMenu = `${ownerHeader}
*╭──┈〔 🛡️ MASTER CONTROL 〕┈──*
┃ ✧ .block [number]
┃ ✧ .unblock [number]
┃ ✧ .fullpp (Set HD Profile)
┃ ✧ .setpp (Set Normal Profile)
┃ ✧ .restart (Reboot System)
┃ ✧ .shutdown (Kill Process)
┃ ✧ .updatecmd (Fetch Updates)
┃ ✧ .broadcast (Global Message)
╰──────────────┈

*╭──┈〔 📊 DATA & LOGS 〕┈──*
┃ ✧ .listcmd
┃ ✧ .gjid (Get Group ID)
┃ ✧ .jid (Get User ID)
┃ ✧ .alive (System Check)
┃ ✧ .ping (Latency Check)
╰──────────────┈

*╭──┈〔 🛠️ CONFIGURATIONS 〕┈──*
┃ ✧ .setmode (Public/Private)
┃ ✧ .setprefix (Change Prefix)
┃ ✧ .allmenu (Full Command List)
┃ ✧ .vv (View Once Bypass)
╰──────────────┈

> 👤 **Lead Dev:** Nyoni-CM
> ✅ **Access:** Verified Master
`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
                caption: ownerMenu.trim(),
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
                        title: "RAHERM-XMD OWNER PANEL",
                        body: "AUTHORIZED ACCESS ONLY",
                        mediaType: 1,
                        sourceUrl: "https://github.com/Rahee-cm",
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
        await conn.sendMessage(from, { text: "❌ Master system encounterd an error." }, { quoted: mek });
    }
});
