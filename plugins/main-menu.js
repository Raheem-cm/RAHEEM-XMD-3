const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Inaonyesha list menu ya machaguo yote.",
    category: "main",
    react: "📑",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, pushname, reply }) => {
    try {
        // Hapa ndipo unapoandaa list ya machaguo (Sections)
        const sections = [
            {
                title: "🏠 MAIN COMMANDS",
                rows: [
                    { title: "PING", rowId: ".ping", description: "Angalia kasi ya bot" },
                    { title: "ALIVE", rowId: ".alive", description: "Angalia kama bot iko hewani" },
                    { title: "UPTIME", rowId: ".uptime", description: "Muda ambao bot imekuwa hewani" }
                ]
            },
            {
                title: "📥 DOWNLOADER",
                rows: [
                    { title: "TIKTOK", rowId: ".tiktok", description: "Download video za TikTok" },
                    { title: "INSTAGRAM", rowId: ".instagram", description: "Download Reels/Picha" },
                    { title: "YOUTUBE", rowId: ".yt", description: "Download YT Video/Audio" }
                ]
            },
            {
                title: "🤖 AI & TOOLS",
                rows: [
                    { title: "AI", rowId: ".ai", description: "Ongea na ChatGPT" },
                    { title: "IMAGINE", rowId: ".imagine", description: "Tengeneza picha kwa AI" }
                ]
            },
            {
                title: "👑 OWNER & INFO",
                rows: [
                    { title: "OWNER", rowId: ".owner", description: "Wasiliana na RAHEEM-CM" },
                    { title: "REPO", rowId: ".repo", description: "Pata Script ya bot" }
                ]
            }
        ];

        const listMessage = {
            text: `Hujambo *${pushname}* 👋\n\nKaribu kwenye *RAHEEM-XMD V3*. Chagua kategoria unayotaka hapa chini kutumia amri zetu kwa urahisi.\n\n© ʀᴀʜᴇᴇᴍ ᴛᴇᴄʜ ᴘʀᴏᴊᴇᴄᴛs`,
            footer: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴇᴇᴍ-ᴄᴍ",
            buttonText: "VIEW OPTIONS ☰",
            sections,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "RAHEEM-XMD V3 ADVANCED",
                    body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ ᴛᴇᴄʜ",
                    mediaType: 1,
                    sourceUrl: "https://whatsapp.com/channel/0029Vaf98V62f3EG6oO98Y3I",
                    thumbnailUrl: "https://files.catbox.moe/6vej91.mp4", // Inatumia video yako kama picha ya juu
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        };

        return await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Mfumo umeshindwa kufungua menu ya machaguo.");
    }
});
