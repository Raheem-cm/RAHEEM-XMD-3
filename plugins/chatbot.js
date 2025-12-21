 const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

cmd({
    on: "body"
}, async (conn, mek, m, { from, body, isCmd, isGroup, pushname, reply }) => {
    // Masharti ya kuto-jibu
    if (config.CHATBOT_ON !== "true") return; // Chatbot ikiwa OFF
    if (isCmd) return; // Isijibu kama ni command (yenye .)
    if (m.key.fromMe) return; // Isijibu meseji zako mwenyewe

    try {
        // Tunatumia API ya bure ya SimSimi ambayo haihitaji Key
        const url = `https://api.simsimi.vn/v1/simtalk?text=${encodeURIComponent(body)}&lc=sw`; // 'lc=sw' ni kwa ajili ya Kiswahili
        
        const response = await axios.get(url);
        const result = response.data.message;

        if (result) {
            await conn.sendMessage(from, { 
                text: result,
                contextInfo: {
                    externalAdReply: {
                        title: "RAHEEM-XMD AI CHAT",
                        body: `Replying to ${pushname}`,
                        mediaType: 1,
                        sourceUrl: "https://github.com/Raheem-cm",
                        thumbnailUrl: "https://files.catbox.moe/2hasag.jpg",
                        renderLargerThumbnail: false,
                        showAdAttribution: true
                    }
                }
            }, { quoted: mek });
        }
    } catch (e) {
        // Kama API ya kwanza ikifeli, inatoa jibu la dharura ili bot isizime
        console.log("Chatbot Error: ", e);
    }
});
