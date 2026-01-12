const { cmd } = require('../command');

cmd({
    pattern: "menu4",
    react: "⚔️",
    category: "generated",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushName }) => {
    try {
        
    const body = `╔════════════════════════╗\n  🔥 *Kirikuu* 🔥\n╚════════════════════════╝\n👤 *User:* ${pushName}\n📞 *Contact:* 255760003443\n\n*───「 INFO 」───*\n  Ping\n  alive\n  uptime\n  repo\n  Chr`;
    await conn.sendMessage(from, { text: body });
        await conn.sendMessage(from, { 
            contextInfo: {
                externalAdReply: {
                    title: "Kirikuu",
                    body: "Created by Nyoni-xmd",
                    thumbnailUrl: " https://files.catbox.moe/8s7lxh.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VbAffhD2ZjChG9DX922r",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (e) { console.error(e); }
});
