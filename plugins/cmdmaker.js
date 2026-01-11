const { cmd } = require('../command');

cmd({
    pattern: "makecmd",
    alias: ["cmdmaker", "gen-cmd"],
    desc: "Tengeneza kodi za maandishi (Text) kwa ajili ya plugins.",
    category: "owner",
    react: "🛠️",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("*Mortal-Kombat-XR Command Maker* 🛠️\n\n*Matumizi:* `.makecmd jina:maelezo`\n\n*Mfano:* `.makecmd picha:itume picha ya simba` ");

        const data = q.split(':');
        if (data.length < 2) return reply("❌ Tafadhali tumia format hii -> `jina:kazi` ");

        const cmdName = data[0].trim().toLowerCase();
        const cmdDesc = data[1].trim();

        // Tunatengeneza kodi hapa
        const generatedCode = `const { cmd } = require('../command');

cmd({
    pattern: "${cmdName}",
    desc: "${cmdDesc}",
    category: "generated",
    react: "🔥",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        // Hii command imetengenezwa na MK-XR Maker
        return reply("Hii ni command ya ${cmdName} imefanikiwa!");
    } catch (e) {
        console.log(e);
        reply("❌ Error!");
    }
});`;

        // TUNATUMIA 'conn.sendMessage' BADALA YA 'reply' ILI KUEPUKA AUTO-VOICE
        await conn.sendMessage(from, { 
            text: `*✅ COMMAND GENERATED!* \n\n*Jina:* ${cmdName}\n\n\`\`\`javascript\n${generatedCode}\n\`\`\`\n\n> *Nakili (Copy) maandishi hayo hapo juu na uweke kwenye file jipya.*` 
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ System Crash!");
    }
});
