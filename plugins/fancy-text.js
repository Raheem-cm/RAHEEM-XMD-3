const axios = require('axios');
const { cmd, commands } = require('../command');

cmd({
    pattern: "fancy",
    alias: ["font", "style"],
    desc: "Convert text into fancy fonts.",
    category: "convert",
    react: "🎨",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        if (!q) return reply("*Yow, andika maandishi unayotaka kubadili!*\n\n*Mfano:* .fancy Raheem-Xmd");

        // Tunatumia API ya haraka na ya kuaminika
        let response = await axios.get(`https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`);
        let data = response.data;

        if (!data.status) return reply("❌ Samahani, nimeshindwa kupata font kwa sasa.");

        let fancyTexts = data.result;
        let menuText = `*FANCY TEXT STYLES* ⚡\n_Result for: ${q}_\n\n`;

        // Tunapanga matokeo mmoja mmoja kwa mstari
        fancyTexts.forEach((font, index) => {
            menuText += `*${index + 1}* ➪ \`\`\`${font.result}\`\`\`\n\n`;
        });

        menuText += `> *© RAHEEM-TECH*`;

        await conn.sendMessage(from, {
            text: menuText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "R A H E E M - X M D",
                    body: "Fancy Text Generator",
                    thumbnailUrl: "https://files.catbox.moe/8s7lxh.jpg",
                    sourceUrl: "https://github.com",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error! Jaribu tena baadae.");
    }
});
