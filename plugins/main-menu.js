const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Interactive Menu with List",
    category: "menu2",
    react: "⭐",
    filename: __filename
}, async (conn, mek, m, { from, pushName, reply }) => {
    try {
        // Maandishi ya utangulizi (English)
        const captionText = `
*╭━━〔 ${config.BOT_NAME || 'RAHEEM-XMD'} 〕━━┈*
┃ 
┃ 👤 *USER:* ${pushName}
┃ 📍 *PREFIX:* ${config.PREFIX}
┃ 🎛️ *MODE:* ${config.MODE}
┃ ⏳ *UPTIME:* ${process.uptime().toFixed(0)}s
┃
*╰━━━━━━━━━━━━━━━━━━━━━┈*

*Hello ${pushName}!* Click the button below to open the command menu list.`;

        // Kutengeneza muundo wa List (Kama kwenye picha uliyotuma)
        const msg = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: captionText },
                        footer: { text: "© RAHEEM-XMD-3 • 2026" },
                        header: {
                            hasVideoMessage: false,
                            hasImageMessage: true,
                            imageMessage: (await conn.prepareMessageMedia({ image: { url: "https://files.catbox.moe/8s7lxh.jpg" } }, { upload: conn.waUploadToServer })).imageMessage,
                            title: "",
                            subtitle: "",
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "📑 OPEN COMMAND LIST",
                                        sections: [
                                            {
                                                title: "⭐ TOP SELECTION",
                                                rows: [
                                                    { title: "All Commands", rowId: ".allmenu", description: "Show every command available" },
                                                    { title: "Bot Status", rowId: ".ping", description: "Check bot response speed" }
                                                ]
                                            },
                                            {
                                                title: "📥 DOWNLOADER",
                                                rows: [
                                                    { title: "Social Media", rowId: ".downloadmenu", description: "TikTok, FB, Insta, etc." },
                                                    { title: "YouTube Menu", rowId: ".ytmenu", description: "Download Songs & Videos" }
                                                ]
                                            },
                                            {
                                                title: "👥 GROUP TOOLS",
                                                rows: [
                                                    { title: "Admin Menu", rowId: ".groupmenu", description: "Manage your group efficiently" }
                                                ]
                                            },
                                            {
                                                title: "🤖 ARTIFICIAL INTELLIGENCE",
                                                rows: [
                                                    { title: "AI Assistants", rowId: ".aimenu", description: "ChatGPT, GPT-4, & More" }
                                                ]
                                            }
                                        ]
                                    })
                                }
                            ],
                        }
                    }
                }
            }
        };

        // Tunatumia relayMessage ili kuhakikisha inafika bila kuzuiliwa na version ya WhatsApp
        return await conn.relayMessage(from, msg, {});

    } catch (e) {
        console.log(e);
        // Kama bado ikigoma kabisa, itatuma menu ya kawaida ya maandishi ili bot isikwame
        reply("❌ Button Menu is not compatible with your WhatsApp version. Please update or use a different version.");
    }
});
