const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Open bottom list menu",
    category: "menu",
    react: "🔽",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const sections = [
            {
                title: "🏠 NYUMBANI",
                rows: [
                    { title: "Bot Status", rowId: `${config.PREFIX}ping`, description: "Angalia kasi ya bot" },
                    { title: "Main Menu", rowId: `${config.PREFIX}menu`, description: "Commands zote hapa" }
                ]
            },
            {
                title: "📥 DOWNLOADER",
                rows: [
                    { title: "YouTube Menu", rowId: `${config.PREFIX}yt`, description: "Download YT Audio/Video" },
                    { title: "Social Media", rowId: `${config.PREFIX}social`, description: "FB, TikTok, IG" }
                ]
            },
            {
                title: "🤖 AI & TOOLS",
                rows: [
                    { title: "ChatGPT", rowId: `${config.PREFIX}ai`, description: "Uliza chochote" },
                    { title: "Imagine", rowId: `${config.PREFIX}imagine`, description: "Tengeneza picha" }
                ]
            },
            {
                title: "⚙️ SETTINGS",
                rows: [
                    { title: "Owner Info", rowId: `${config.PREFIX}owner`, description: "Wasiliana na Boss" },
                    { title: "Restart", rowId: `${config.PREFIX}restart`, description: "Washa bot upya" }
                ]
            }
        ];

        const listMessage = {
            text: `\n*RAHEEM-XMD BOTTOM INTERFACE* ⚡\n\n_Bofya kitufe cha "BONYEZA HAPA" hapo chini ili kuona kundi la command unazotaka._\n`,
            footer: "© RAHEEM-TECH PRESTIGE",
            title: "〔 MASTER PANEL 〕",
            buttonText: "BONYEZA HAPA 📑",
            sections
        };

        // Tunatuma kama List Message
        await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        // Kama list itagoma (baadhi ya matoleo ya WA yanazingua), inatuma text ya kinyamwezi
        reply("*RAHEEM-XMD SELECT*\n\n1. .menu\n2. .ping\n3. .owner\n\n_Reply na namba upate huduma._");
    }
});
