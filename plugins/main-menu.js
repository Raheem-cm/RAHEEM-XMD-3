 const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu2",
    desc: "Show command categories",
    category: "menu2",
    react: "📑",
    filename: __filename
}, async (conn, mek, m, { from, text }) => {
    try {
        const listMsg = `
╭━━〔 *${config.BOT_NAME}* 〕━━┈
┃
┃ 👤 *User:* @${m.sender.split('@')[0]}
┃ 📑 *Select a category by replying with its number:*
┃
┃ 1️⃣ *MAIN MENU*
┃ 2️⃣ *DOWNLOAD MENU*
┃ 3️⃣ *GROUP MENU*
┃ 4️⃣ *FUN MENU*
┃ 5️⃣ *OWNER MENU*
┃ 6️⃣ *AI MENU*
┃ 7️⃣ *ANIME MENU*
┃ 8️⃣ *CONVERT MENU*
┃ 9️⃣ *REACTION MENU*
┃
╰━━━━━━━━━━━━━━━┈

> *Reply with a number to see commands!*
`;

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
            caption: listMsg.trim(),
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
