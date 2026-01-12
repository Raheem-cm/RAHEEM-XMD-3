const { cmd } = require('../command');

cmd({
    pattern: "makecmd",
    alias: ["gen"],
    desc: "Fixed version: Generates crash-proof commands.",
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
        // We escape single quotes and remove any accidental backticks from the user input
        let cmdInstruction = descParts.join(':').trim().replace(/'/g, "\\'").replace(/`/g, "");

        const generatedCode = `const { cmd } = require('../command');

cmd({
    pattern: "${cmdName}",
    desc: '${cmdInstruction}',
    category: "generated",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const responseText = "*MORTAL-KOMBAT-XR SYSTEM*\\n\\n*Command:* ${cmdName}\\n*Task:* ${cmdInstruction}";
        await conn.sendMessage(from, { text: responseText }, { quoted: mek });
    } catch (e) {
        console.error(e);
    }
});`;

        await conn.sendMessage(from, { 
            text: `*✅ CRASH-PROOF CODE GENERATED!*\n\n\`\`\`javascript\n${generatedCode}\n\`\`\`` 
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error fixing the generator.");
    }
});
