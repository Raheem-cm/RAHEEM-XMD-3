const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios'); // Hakikisha axios ipo, kama huna piga: npm install axios

cmd({
    pattern: "yt2",
    alias: ["play", "music"],
    react: "🎧",
    desc: "YouTube Downloader Fixed",
    category: "download",
    use: ".yt2 <song name>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ *Tafadhali weka jina la wimbo!*");

        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return await reply("❌ *Sikupata chochote!*");

        const fancyMsg = `
╔══════════════╗
     ♪  *𝐘𝐎𝐔𝐓𝐔𝐁𝐄  𝐏𝐋𝐀𝐘𝐄𝐑* ♪
╠══════════════╣
  ➪ *ᴛɪᴛʟᴇ:* ${data.title}
  ➪ *ᴅᴜʀᴀᴛɪᴏɴ:* ${data.timestamp}
  ➪ *ᴠɪᴇᴡꜱ:* ${data.views.toLocaleString()}
╠══════════════╣
        *CHAGUA FORMAT:*
  
  [1] ➪ 𝐀𝐮𝐝𝐢𝐨 (𝐌𝐮𝐬𝐢𝐜) 🎵
  [2] ➪ 𝐕𝐢𝐝𝐞𝐨 (𝐌𝐏𝟒) 🎥
╚══════════════╝
*Jibu na namba 1 au 2 kupata file lako*`;

        // Tuma picha na maelezo
        const sentMsg = await conn.sendMessage(from, { 
            image: { url: data.thumbnail }, 
            caption: fancyMsg 
        }, { quoted: mek });

        // Sikiliza jibu la mtumiaji
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || msg.key.remoteJid !== from) return;
            
            const userText = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").trim();
            const isReply = msg.message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;

            if (isReply && (userText === "1" || userText === "2")) {
                await conn.sendMessage(from, { react: { text: '📥', key: msg.key } });
                
                const type = userText === "1" ? 'ytmp3' : 'ytmp4';
                const apiUrl = `https://api.davidcyriltech.my.id/download/${type}?url=${encodeURIComponent(data.url)}`;
                
                try {
                    const response = await axios.get(apiUrl);
                    const res = response.data;
                    
                    if (!res.success) return await reply("❌ *API imekataa, jaribu tena!*");

                    const dlUrl = res.result.download_url;

                    if (type === 'ytmp3') {
                        await conn.sendMessage(from, { 
                            audio: { url: dlUrl }, 
                            mimetype: 'audio/mpeg' 
                        }, { quoted: msg });
                    } else {
                        await conn.sendMessage(from, { 
                            video: { url: dlUrl }, 
                            caption: data.title 
                        }, { quoted: msg });
                    }
                    await conn.sendMessage(from, { react: { text: '✅', key: msg.key } });
                } catch (err) {
                    await reply("❌ *Hitilafu ya API!*");
                }
            }
        });

    } catch (e) {
        console.error(e);
        reply("❌ *Kuna tatizo limetokea!*");
    }
});
