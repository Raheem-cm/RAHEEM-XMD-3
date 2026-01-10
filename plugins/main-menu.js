const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Show interactive list menu",
    category: "menu2",
    react: "📑",
    filename: __filename
}, async (conn, mek, m, { from, pushName }) => {
    try {
        const bodyText = `👋 *Hello ${pushName || "User"}*\n\nWelcome to *${config.BOT_NAME}*.\nClick the button below to view all available command categories.`;

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
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "TAP TO SELECT ITEM",
                                sections: [
                                    {
                                        title: "💎 MAIN CATEGORIES",
                                        rows: [
                                            { title: "All Menu", rowId: ".allmenu", description: "View all commands list" },
                                            { title: "Bot Info", rowId: ".alive", description: "Check bot status & uptime" }
                                        ]
                                    },
                                    {
                                        title: "📥 DOWNLOADER",
                                        rows: [
                                            { title: "Social Media", rowId: ".downloadmenu", description: "FB, TikTok, Insta downloads" },
                                            { title: "YouTube Tools", rowId: ".ytmenu", description: "Download MP3 & MP4" }
                                        ]
                                    },
                                    {
                                        title: "👥 GROUP & ADMIN",
                                        rows: [
                                            { title: "Group Management", rowId: ".groupmenu", description: "Admin control commands" }
                                        ]
                                    },
                                    {
                                        title: "🤖 AI TOOLS",
                                        rows: [
                                            { title: "ChatGPT / AI", rowId: ".aimenu", description: "Advanced AI assistants" }
                                        ]
                                    }
                                ]
                            })
                        }
                    ],
                }
            }
        };

        await conn.relayMessage(from, {
            viewOnceMessage: {
                message: message
            }
        }, {});

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: "❌ Error: Your WhatsApp version may not support list menus." }, { quoted: mek });
    }
});
