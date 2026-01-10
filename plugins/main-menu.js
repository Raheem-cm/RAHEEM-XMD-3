const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu",
    desc: "Open the modern list menu",
    category: "menu",
    react: "🔽",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const sections = [
            {
                title: "🏠 HOME STATION",
                rows: [
                    { title: "Main Menu", rowId: ".allmenu", description: "View all commands in one list" },
                    { title: "Bot Status", rowId: ".ping", description: "Check bot response speed" },
                    { title: "System Info", rowId: ".uptime", description: "See how long bot has been active" }
                ]
            },
            {
                title: "📥 MEDIA DOWNLOADER",
                rows: [
                    { title: "YouTube", rowId: ".ytmenu", description: "Download YT Audio/Video" },
                    { title: "Social Media", rowId: ".social", description: "TikTok, FB, Insta, Twitter" }
                ]
            },
            {
                title: "🤖 AI CHATBOTS",
                rows: [
                    { title: "ChatGPT", rowId: ".ai", description: "Chat with GPT-4 Model" },
                    { title: "AI Image", rowId: ".imagine", description: "Generate images from text" }
                ]
            }
        ];

        const listMessage = {
            text: `\n*RAHEEM-XMD INTERFACE* ⚡\n\n*User:* @${m.sender.split('@')[0]}\n*Status:* Premium\n\n_Click the button below to view categories._\n`,
            footer: "© RAHEEM-TECH PRESTIGE",
            title: "〔 MENU SELECTION 〕",
            buttonText: "SELECT HERE 📑",
            sections
        };

        await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ System Error! Please try again.");
    }
});
