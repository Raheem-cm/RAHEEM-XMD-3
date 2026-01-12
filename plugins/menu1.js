

const { cmd, commands } = require('../command');

cmd({
    pattern: "menu1",
    desc: "Advanced Plugin for Nyoni-xmd",
    category: "main",
    react: "🛡️",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, makeid, pushName, reply }) => {
    try {
        
    let menu = "┏━━━━━━━━━━━━━━┓\n";
    menu += "   *NYONI-XMD MENU*\n";
    menu += "┗━━━━━━━━━━━━━━┛\n\n";
    menu += "👤 *User:* " + pushName + "\n";
    menu += "🕒 *Status:* Online\n\n";
    menu += "┃ 1. 🔥 *MENU*\n┃ 2. 🔥 *PING*\n┃ 3. 🔥 *REPO*\n┃ 4. 🔥 *OWNER*\n┃ 5. 🔥 *AI*\n┃ 6. 🔥 *ALIVE*\n\n";
    menu += "┗━━━━━━━━━━━━━━┛";
    
    await conn.sendMessage(from, { text: menu }, { quoted: mek });

        // Add Video/Image Ad-Reply
        await conn.sendMessage(from, {
            contextInfo: {
                externalAdReply: {
                    title: "Nyoni-xmd - SYSTEM ACTIVE",
                    body: "OWNER: Nyoni",
                    thumbnailUrl: " https://files.catbox.moe/8s7lxh.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VbAffhD2ZjChG9DX922r",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

    } catch (e) {
        console.log(e);
        reply("*❌ Error Details:*\n" + e.message);
    }
});
