 const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "yt2",
    alias: ["play", "music"],
    react: "🎧",
    desc: "Premium YouTube Downloader",
    category: "download",
    use: ".yt2 <song name>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ *Please provide a song name or URL!*");

        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return await reply("❌ *No results found!*");

        const fancyMsg = `
╔══════════════╗
     ♪  *𝐘𝐎𝐔𝐓𝐔𝐁𝐄  𝐏𝐋𝐀𝐘𝐄𝐑* ♪
╠══════════════╣
  ➪ *ᴛɪᴛʟᴇ:* ${data.title}
  ➪ *ᴅᴜʀᴀᴛɪᴏɴ:* ${data.timestamp}
  ➪ *ᴠɪᴇᴡꜱ:* ${data.views.toLocaleString()}
╠══════════════╣
        *ꜱᴇʟᴇᴄᴛ ꜰᴏʀᴍᴀᴛ:*
  
  [1] ➪ 𝐀𝐮𝐝𝐢𝐨 (𝐌𝐮𝐬𝐢𝐜) 🎵
  [2] ➪ 𝐃𝐨𝐜𝐮𝐦𝐞𝐧𝐭 (𝐅𝐢𝐥𝐞) 📂
  [3] ➪ 𝐕𝐨𝐢𝐜𝐞 𝐍𝐨𝐭𝐞 (𝐏𝐓𝐓) 🎤
╚══════════════╝
*Reply with the number to download*`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: data.thumbnail }, 
            caption: fancyMsg 
        }, { quoted: mek });

        // Listener for the user response (1, 2, or 3)
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;
            
            const selectedText = msg.message.extendedTextMessage.text.trim();
            const context = msg.message.extendedTextMessage.contextInfo;

            // Ensure the user is replying to the correct menu message
            if (context && context.stanzaId === sentMsg.key.id) {
                if (["1", "2", "3"].includes(selectedText)) {
                    
                    const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(data.url)}`;
                    const response = await fetch(apiUrl);
                    const json = await response.json();
                    
                    if (!json.success) return await reply("❌ *API Error! Try again later.*");

                    const downloadUrl = json.result.download_url;

                    if (selectedText === "1") {
                        await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: msg });
                    } else if (selectedText === "2") {
                        await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: 'audio/mpeg', fileName: `${data.title}.mp3` }, { quoted: msg });
                    } else if (selectedText === "3") {
                        await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: 'audio/mpeg', ptt: true }, { quoted: msg });
                    }
                }
            }
        });

    } catch (e) {
        console.error(e);
        reply("❌ *An error occurred!*");
    }
});
