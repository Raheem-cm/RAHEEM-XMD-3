
const { cmd } = require('../command');

cmd({
    pattern: "ping4",
    desc: 'hapa ndipo utaona speed ya bot',
    category: "generated",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, pushName }) => {
    try {
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        
        const fancyMenu = `
╔════════════════════════╗
      ⚡ *MORTAL-KOMBAT-XR* ⚡
╚════════════════════════╝
👤 *User:* ${pushName}
📅 *Date:* ${date}
⌚ *Time:* ${time}
👑 *Owner:* Nyoni XMD

*───「 INFO 」───*
📍 *Task:* hapa ndipo utaona speed ya bot

*───「 SYSTEM 」───*
🚀 *Status:* Online
🛡️ *Security:* Active

> *Powered by Nyoni XMD Engine*
`;

        await conn.sendMessage(from, { 
            text: fancyMenu,
            contextInfo: {
                externalAdReply: {
                    title: "𝙼𝙾𝚁𝚃𝙰𝙻-𝙺𝙾𝙼𝙱𝙰𝚃-𝚇𝚁 𝚂𝚈𝚂𝚃𝙴𝙼",
                    body: "Auto Generated Command",
                    thumbnailUrl: "https://telegra.ph/file/dcce2a3952975107ee010.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VbAffhD2ZjChG9DX922r",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
    } catch (e) {
        console.error(e);
    }
});
