const { cmd } = require('../command');

cmd({
    pattern: "makecmd",
    desc: "Tengeneza kodi bila makosa ya syntax.",
    category: "owner",
    react: "🛠️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.includes(':')) return reply("❌ Tumia hivi: .makecmd jina:maelezo");

        const [name, ...descParts] = q.split(':');
        const cmdName = name.trim().toLowerCase();
        const cmdDesc = descParts.join(':').trim();

        const code = `const { cmd } = require('../command');

cmd({
    pattern: "${cmdName}",
    desc: "${cmdDesc}",
    category: "manual",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await reply("Hii command ya ${cmdName} inafanya kazi!");
    } catch (e) {
        console.error(e);
    }
});`;

        await conn.sendMessage(from, { 
            text: `*✅ KODI TAYARI (Copy yote hapa chini):*\n\n\`\`\`javascript\n${code}\n\`\`\`` 
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Kuna tatizo limetokea!");
    }
});
