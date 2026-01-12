const { cmd } = require('../command');

cmd({
    pattern: "makecmd",
    alias: ["supergen"],
    desc: "Smart AI-Like Command Generator",
    category: "owner",
    react: "🧠",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.includes(':')) {
            return reply("❌ *MK-XR ERROR*\n\nAndika hivi: `.makecmd jina:maelezo` ");
        }

        let [name, ...descParts] = q.split(':');
        let cmdName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        let instruction = descParts.join(':').trim().toLowerCase();

        let generatedCode = "";

        // LOGIC 1: Ikitambua unataka PING au SPEED
        if (instruction.includes("ping") || instruction.includes("speed")) {
            generatedCode = `const { cmd } = require('../command');
cmd({
    pattern: "${cmdName}",
    react: "⚡",
    desc: "Auto-calculated Speed/Ping Command",
    category: "system",
    filename: __filename
}, async (conn, mek, m, { from, pushName }) => {
    const start = new Date().getTime();
    const msg = await conn.sendMessage(from, { text: '*Calculating...*' }, { quoted: mek });
    const end = new Date().getTime();
    const ping = end - start;
    const date = new Date().toLocaleDateString();
    
    const menu = \`╔════════════════════════╗\\n      ⚡ *MORTAL-KOMBAT-XR* ⚡\\n╚════════════════════════╝\\n👤 *User:* \${pushName}\\n🚀 *Speed:* \${ping}ms\\n📅 *Date:* \${date}\\n👑 *Owner:* Nyoni XMD\\n\\n> *Real-time Speed Check*\`;
    
    await conn.sendMessage(from, { text: menu, edit: msg.key });
});`;

        // LOGIC 2: Ikitambua unataka MENU au LIST
        } else if (instruction.includes("menu") || instruction.includes("list")) {
            generatedCode = `const { cmd } = require('../command');
cmd({
    pattern: "${cmdName}",
    react: "📜",
    desc: "Dynamic Fancy Menu",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, pushName }) => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const menu = \`╔════════════════════════╗\\n      🌟 *MK-XR MAIN MENU* 🌟\\n╚════════════════════════╝\\n👤 *User:* \${pushName}\\n📅 *Date:* \${date}\\n⌚ *Time:* \${time}\\n\\n*───「 COMMAND LIST 」───*\\n🔥 .ping4 - Speed Check\\n🔥 .news - Updates\\n🔥 .steal - Profile Pic\\n\\n> *Powered by Nyoni XMD Engine*\`;
    
    await conn.sendMessage(from, { 
        text: menu,
        contextInfo: { externalAdReply: { title: "𝙼𝙾𝚁𝚃𝙰𝙻-𝙺𝙾𝙼𝙱𝙰𝚃-𝚇𝚁", body: "Professional Bot Menu", thumbnailUrl: "https://telegra.ph/file/dcce2a3952975107ee010.jpg", mediaType: 1, renderLargerThumbnail: true }}
    });
});`;

        // LOGIC 3: Kwa amri zingine zote za kawaida
        } else {
            generatedCode = `const { cmd } = require('../command');
cmd({
    pattern: "${cmdName}",
    react: "✅",
    desc: "${instruction}",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { text: "*MK-XR SYSTEM*\\n\\n${instruction.toUpperCase()}" }, { quoted: mek });
    } catch (e) { console.error(e); }
});`;
        }

        await conn.sendMessage(from, { 
            text: `*✅ AI-GENERATED CODE READY!*\n\n\`\`\`javascript\n${generatedCode}\n\`\`\`` 
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error generating smart code.");
    }
});
