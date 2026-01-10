const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "fancy",
    alias: ["font", "style"],
    desc: "Convert text into fancy fonts.",
    category: "convert",
    react: "✍️",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("*Please provide the text you want to convert!* \n\n*Example:* .fancy Raheem-Xmd");

        // Fetching fancy text from a reliable API
        const response = await axios.get(`https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`);
        const data = response.data;

        if (!data.status) return reply("❌ Error fetching fonts. Please try again later.");

        let resultText = `*FANCY TEXT GENERATOR*\n\n*Original:* ${q}\n\n`;

        // Mapping the results into a slim vertical list
        data.result.forEach((font) => {
            resultText += `┃ ${font.result}\n`;
        });

        resultText += `\n> *© RAHEEM-XMD FANCY SYSTEM*`;

        await conn.sendMessage(from, { 
            text: resultText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "R A H E E M - X M D",
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ An error occurred while generating fancy text.");
    }
});
