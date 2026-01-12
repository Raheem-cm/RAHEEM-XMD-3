const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Inaonyesha list menu yenye machaguo mengi.",
    category: "main",
    react: "📑",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, pushname, reply }) => {
    try {
        const sections = [
            {
                title: "🏠 NYUMBANI",
                rows: [
                    { title: "PING", rowId: config.PREFIX + "ping", description: "Angalia kasi ya bot" },
                    { title: "ALIVE", rowId: config.PREFIX + "alive", description: "Angalia kama bot iko hewani" }
                ]
            },
            {
                title: "📥 DOWNLOADER",
                rows: [
                    { title: "TIKTOK", rowId: config.PREFIX + "tiktok", description: "Download video za TikTok" },
                    { title: "INSTAGRAM", rowId: config.PREFIX + "ig", description: "Download reels/picha za IG" },
                    { title: "YOUTUBE", rowId: config.PREFIX + "yt", description: "Download video/audio za YT" }
                ]
            },
            {
                title: "⚙️ SETTINGS & INFO",
                rows: [
                    { title: "OWNER", rowId: config.PREFIX + "owner", description: "Wasiliana na mmiliki" },
                    { title: "REPO", rowId: config.PREFIX + "repo", description: "Pata kodi ya bot (Script)" }
                ]
            }
        ];

        const listMessage = {
            text: `Hujambo *${pushname}* 👋\n\nKaribu kwenye *RAHEEM-XMD V3*. Chagua huduma unayotaka hapa chini kwenye kitufe cha "VIEW OPTIONS".\n\n© ʀᴀʜᴇᴇᴍ ᴛᴇᴄʜ ᴘʀᴏᴊᴇᴄᴛs`,
            footer: "Powered by RAHEEM-CM",
            buttonText: "VIEW OPTIONS ☰",
            sections,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "RAHEEM-XMD V3 ADVANCED",
                    body: "Powered by POPKID TECH",
                    mediaType: 1,
                    sourceUrl: "https://whatsapp.com/channel/0029Vaf98V62f3EG6oO98Y3I",
                    thumbnailUrl: "https://files.catbox.moe/pe8tid.mp4", // Inatumia video yako kama thumbnail
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        };

        return await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Imeshindikana kufungua menu ya machaguo.");
    }
});
