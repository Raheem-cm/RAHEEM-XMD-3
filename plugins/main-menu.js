const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Inaonyesha menu ya vitufe (buttons).",
    category: "main",
    react: "🔘",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, pushname, reply }) => {
    try {
        // Maandishi ya juu (Body text)
        const bodyText = `Hujambo ${pushname}!\n\nChagua chaguo hapa chini kutumia RAHEEM-XMD V3.`;

        // Mpangilio wa vitufe (Buttons)
        const buttons = [
            {
                buttonId: `${config.PREFIX}allmenu`,
                buttonText: { displayText: '📑 VIEW OPTIONS' },
                type: 1
            },
            {
                buttonId: `${config.PREFIX}repo`,
                buttonText: { displayText: '📂 GITHUB REPO' },
                type: 1
            }
        ];

        // Kutuma ujumbe wenye picha na vitufe
        const buttonMessage = {
            image: { url: "https://files.catbox.moe/c08e2d.mp4" }, // Unaweza kuweka picha hapa badala ya video kama unataka
            caption: bodyText,
            footer: "Powered by RAHEEM TECH",
            buttons: buttons,
            headerType: 4,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "R A H E E M - X M D",
                    serverMessageId: 1
                }
            }
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Imeshindikana kutuma menu ya vitufe.");
    }
});
