 const { cmd } = require('../command');

cmd({
    pattern: "id",
    desc: "Onyesha taarifa za ID",
    react: "🆔",
    category: "mkuu",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const idKiswahili = `
🆔 *TAARIFA ZA ID*

👤 *ID YAKO*: \`${sender || m.sender}\`
💬 *ID YA MUUNGANO*: \`${m.chat}\`

👑 *MMEJENGEA*:
• *name*: Abdulrahim
• *phone*: +255763111390
• *Instagram*:  https://www.instagram.com/nyoni.xmd?igsh=MTR3eWN5NnB3OTV0eg==

🤖 *BOT*: RAHEEM-CM
⚡ *created by*: Abdulrahim
`;
        
        return reply(idKiswahili);
        
    } catch (e) {
        console.error("Hitilafu ya ID:", e);
        return reply("⚠️ Samahani, kuna hitilafu katika kuona ID.");
    }
});
