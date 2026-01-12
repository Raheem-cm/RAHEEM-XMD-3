
const { cmd } = require('../command');

cmd({
    pattern: "news",
    desc: 'Send the latest channel updates',
    category: "generated",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const responseText = "*MORTAL-KOMBAT-XR SYSTEM*\n\n*Command:* news\n*Task:* Send the latest channel updates";
        await conn.sendMessage(from, { text: responseText }, { quoted: mek });
    } catch (e) {
        console.error(e);
    }
});

