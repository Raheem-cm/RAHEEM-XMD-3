const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu2",
    desc: "English Interactive Menu",
    category: "menu",
    react: "📑",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const sections = [
            {
                title: "PREMIUM SELECTIONS",
                rows: [
                    { title: "Main Menu", rowId: `${config.PREFIX}allmenu`, description: "Show all available commands" },
                    { title: "Check Speed", rowId: `${config.PREFIX}ping`, description: "Monitor bot latency" },
                    { title: "Owner Info", rowId: `${config.PREFIX}owner`, description: "Contact the developer" }
                ]
            },
            {
                title: "DOWNLOAD CENTER",
                rows: [
                    { title: "YouTube DL", rowId: `${config.PREFIX}yts`, description: "Search and download from YT" },
                    { title: "Social Media", rowId: `${config.PREFIX}tiktok`, description: "Download videos from TikTok/FB/IG" }
                ]
            }
        ];

        const listMessage = {
            text: `\n*RAHEEM-XMD INTERFACE* ⚡\n\n*User:* @${m.sender.split('@')[0]}\n*Mode:* ${config.MODE}\n\n_Select an option from the list below._\n`,
            footer: "© RAHEEM-TECH 2026",
            title: "〔 DASHBOARD 〕",
            buttonText: "TAP TO OPEN 🔓",
            sections
        };

        await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Critical Error: Unable to load List Menu.");
    }
});
