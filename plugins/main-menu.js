const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Displays an organized interactive list menu.",
    category: "main",
    react: "📑",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, pushname, reply }) => {
    try {
        const sections = [
            {
                title: "🏠 MAIN COMMANDS",
                rows: [
                    { title: "PING", rowId: config.PREFIX + "ping", description: "Check bot response speed" },
                    { title: "ALIVE", rowId: config.PREFIX + "alive", description: "Check if the bot is online" },
                    { title: "UPTIME", rowId: config.PREFIX + "uptime", description: "See how long the bot has been running" },
                    { title: "OWNER", rowId: config.PREFIX + "owner", description: "Contact the developer" }
                ]
            },
            {
                title: "📥 DOWNLOADER",
                rows: [
                    { title: "SOCIAL MEDIA", rowId: config.PREFIX + "list download", description: "FB, IG, TikTok, Twitter downloaders" },
                    { title: "YOUTUBE", rowId: config.PREFIX + "yt", description: "Download YT Video and Audio" },
                    { title: "FILES/APK", rowId: config.PREFIX + "apk", description: "Download apps and documents" }
                ]
            },
            {
                title: "👥 GROUP MANAGEMENT",
                rows: [
                    { title: "ADMIN TOOLS", rowId: config.PREFIX + "list group", description: "Kick, Add, Promote, Mute tools" },
                    { title: "TAG ALL", rowId: config.PREFIX + "tagall", description: "Mention everyone in the group" }
                ]
            },
            {
                title: "🤖 AI & CONVERT",
                rows: [
                    { title: "AI CHAT", rowId: config.PREFIX + "ai", description: "Chat with GPT models" },
                    { title: "STICKER", rowId: config.PREFIX + "sticker", description: "Convert image/video to sticker" }
                ]
            },
            {
                title: "🎌 ANIME & FUN",
                rows: [
                    { title: "ANIME", rowId: config.PREFIX + "list anime", description: "Waifu, Neko, and Anime news" },
                    { title: "GAMES", rowId: config.PREFIX + "list fun", description: "Rate, Ship, and Fun commands" }
                ]
            }
        ];

        const listMessage = {
            text: `*Hello ${pushname}!* 👋\n\nWelcome to *RAHEEM-XMD V3*. Please click the button below to view all available command categories.\n\n*User:* @${sender.split('@')[0]}\n*Mode:* ${config.MODE}\n*Prefix:* ${config.PREFIX}`,
            footer: "© RAHEEM TECH PROJECTS",
            buttonText: "VIEW OPTIONS ☰",
            sections,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "RAHEEM-XMD V3 ADVANCED",
                    body: "POWERED BY RAHEEM-CM",
                    mediaType: 1,
                    sourceUrl: "https://whatsapp.com/channel/0029Vaf98V62f3EG6oO98Y3I",
                    thumbnailUrl: "https://files.catbox.moe/6vej91.mp4",
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        };

        return await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error: The system failed to load the list menu.");
    }
});
