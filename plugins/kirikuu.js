const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "yt2",
    alias: ["play", "music"],
    react: "🎧",
    desc: "YouTube Player with Working Buttons",
    category: "download",
    use: ".yt2 <song name>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ *Tafadhali weka jina la wimbo!*");

        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return await reply("❌ *Sijapata matokeo!*");

        const caption = `
╔══════════════╗
     ♪  *𝐘𝐎𝐔𝐓𝐔𝐁𝐄  𝐏𝐋𝐀𝐘𝐄𝐑* ♪
╠══════════════╣
  ➪ *ᴛɪᴛʟᴇ:* ${video.title}
  ➪ *ᴅᴜʀᴀᴛɪᴏɴ:* ${video.timestamp}
  ➪ *ᴠɪᴇᴡꜱ:* ${video.views.toLocaleString()}
╚══════════════╝
_Chagua format hapo chini:_`;

        // Mpangilio wa Buttons (Mfumo mpya)
        const buttons = [
            { buttonId: `.ytmp3 ${video.url}`, buttonText: { displayText: '🎵 AUDIO' }, type: 1 },
            { buttonId: `.ytmp4 ${video.url}`, buttonText: { displayText: '🎥 VIDEO' }, type: 1 },
            { buttonId: `.ytmp3doc ${video.url}`, buttonText: { displayText: '📂 DOCUMENT' }, type: 1 }
        ];

        const buttonMessage = {
            image: { url: video.thumbnail },
            caption: caption,
            footer: '𝕭𝖑𝖆𝖈𝖐 𝕮𝖑𝖔𝖛𝖊ʳ ☘︎ | ⚔️🥷',
            buttons: buttons,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: '📡 CLOVER DOWNLOADS',
                    body: '✡︎ Powered by David Cyril',
                    mediaType: 2,
                    thumbnail: { url: video.thumbnail },
                    sourceUrl: video.url
                }
            }
        };

        // Kutuma ujumbe
        await conn.sendMessage(from, buttonMessage, { quoted: mek });
        await m.react('✅');

    } catch (e) {
        console.error(e);
        reply("❌ *Kuna hitilafu kwenye mfumo wa buttons!*");
    }
});
