const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu2",
    alias: ["buttons", "panel"],
    desc: "Interactive command menu",
    category: "menu",
    react: "🔘",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const menuHeader = `
*RAHEEM-XMD : INTERACTIVE* ⚡
_Select a button below to navigate_

👤 *User:* @${m.sender.split('@')[0]}
🛠️ *Prefix:* ${config.PREFIX}
📂 *Status:* Online
`;

        // Huu ndio muundo wa Button za kinyamwezi
        const buttons = [
            { buttonId: `${config.PREFIX}menu`, buttonText: { displayText: '🏠 MAIN MENU' }, type: 1 },
            { buttonId: `${config.PREFIX}ping`, buttonText: { displayText: '🚀 SPEED TEST' }, type: 1 },
            { buttonId: `${config.PREFIX}owner`, buttonText: { displayText: '👤 OWNER INFO' }, type: 1 }
        ];

        const buttonMessage = {
            image: { url: "https://files.catbox.moe/8s7lxh.jpg" },
            caption: menuHeader,
            footer: "© RAHEEM-TECH PRESTIGE",
            buttons: buttons,
            headerType: 4,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "R A H E E M - X M D",
                    serverMessageId: 1
                }
            }
        };

        return await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        // Ikitokea simu ya mtumiaji haisupport Buttons, itatuma menu ya kawaida
        reply("❌ Error! Simu yako inaweza kuwa haisupport mfumo wa Buttons.");
    }
});
