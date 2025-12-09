 const { cmd } = require('../command');

cmd({
    pattern: "cf",
    desc: "Show creator's favorite things",
    react: "❤️",
    category: "info",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const creatorFavorites = `
❤️ *CREATOR FAVORITES*

*👑 Creator:* Abdulrahim
*📱 Phone:* +255763111390
*📷 Instagram:* @nyoni.xmd

*⚽ Football Team:* SIMBA SC 🦁
*💻 Technology Field:* Creator & Design
*🎬 Movie Genre:* Action Movies

*🤖 Bot:* RAHEEM-CM
`;

        await reply(creatorFavorites);

    } catch (e) {
        console.error(e);
        await reply("Error showing favorites.");
    }
});
