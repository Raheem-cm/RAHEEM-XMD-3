cmd({
    pattern: "menu",
    desc: "Show bottom menu",
    category: "menu",
    react: "🔥",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {

        const caption = `
👋 *Welcome ${m.pushName || "User"}*

🤖 *${config.BOT_NAME}*
⚡ Fast • Smart • Powerful

Chagua menu hapa chini 👇
`;

        const buttons = [
            {
                buttonId: `${config.PREFIX}allmenu`,
                buttonText: { displayText: "📜 ALL MENU" },
                type: 1
            },
            {
                buttonId: `${config.PREFIX}download`,
                buttonText: { displayText: "📥 DOWNLOAD" },
                type: 1
            },
            {
                buttonId: `${config.PREFIX}groupmenu`,
                buttonText: { displayText: "👥 GROUP" },
                type: 1
            }
        ];

        const buttonMessage = {
            image: { url: "https://files.catbox.moe/8s7lxh.jpg" },
            caption: caption,
            footer: "© RAHEEM-XMD-3 • 2026",
            buttons: buttons,
            headerType: 4
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: "❌ Menu error!" }, { quoted: mek });
    }
});
