const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Show bottom menu",
    category: "menu2",
    react: "🔥",
    filename: __filename
}, async (conn, mek, m, { from, pushName }) => {
    try {
        const bodyText = `👋 *Welcome ${pushName || "User"}*\n\n🤖 *${config.BOT_NAME || "RAHEEM-XMD"}*\n⚡ Fast • Smart • Powerful\n\nSelect a category below to explore my features:`;

        const message = {
            interactiveMessage: {
                header: {
                    hasVideoMessage: false,
                    hasImageMessage: true,
                    imageMessage: (await conn.prepareMessageMedia({ image: { url: "https://files.catbox.moe/8s7lxh.jpg" } }, { upload: conn.waUploadToServer })).imageMessage,
                    title: "",
                    subtitle: "RAHEEM-XMD",
                },
                body: { text: bodyText },
                footer: { text: "© RAHEEM-XMD-3 • 2026" },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📜 ALL MENU",
                                id: ".allmenu"
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📥 DOWNLOAD",
                                id: ".download"
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "👥 GROUP",
                                id: ".groupmenu"
                            })
                        }
                    ],
                }
            }
        };

        // Tunatuma kama viewOnce ili ionekane vizuri kwenye matoleo yote
        await conn.relayMessage(from, {
            viewOnceMessage: {
                message: message
            }
        }, {});

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: "❌ System Error: Buttons are not supported on this version of WhatsApp." }, { quoted: mek });
    }
});
