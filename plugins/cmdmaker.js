const { cmd } = require('../command');

cmd({
    pattern: "makecmd",
    alias: ["gen"],
    desc: "Generates a fancy, decorated menu command code.",
    category: "owner",
    react: "🛠️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.includes(':')) {
            return reply("*Mortal-Kombat-XR* 🛠️\n\n*Usage:* `.makecmd name:instruction` ");
        }

        let [name, ...descParts] = q.split(':');
        let cmdName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        let cmdInstruction = descParts.join(':').trim().replace(/'/g, "\\'").replace(/`/g, "");

        // Hapa ndio urembo unapotengenezwa kiotomatiki
        const generatedCode = `const { cmd } = require('../command');

cmd({
    pattern: "${cmdName}",
    desc: '${cmdInstruction}',
    category: "generated",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, pushName }) => {
    try {
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        
        const fancyMenu = \`
╔════════════════════════╗
      ⚡ *MORTAL-KOMBAT-XR* ⚡
╚════════════════════════╝
👤 *User:* \${pushName}
📅 *Date:* \${date}
⌚ *Time:* \${time}
👑 *Owner:* Nyoni XMD

*───「 INFO 」───*
📍 *Task:* ${cmdInstruction}

*───「 SYSTEM 」───*
🚀 *Status:* Online
🛡️ *Security:* Active

> *Powered by Nyoni XMD Engine*
\`;

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
});`;

        await conn.sendMessage(from, { 
            text: `*✅ FANCY MENU CODE GENERATED!*\n\n\`\`\`javascript\n${generatedCode}\n\`\`\`` 
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error fixing the generator.");
    }
});
