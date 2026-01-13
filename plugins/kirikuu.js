const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "yt2",
    alias: ["play", "music", "playvid"],
    react: "🎧",
    desc: "YouTube Downloader with Buttons",
    category: "download",
    use: ".yt2 <song name>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply, usedPrefix, command }) => {
    try {
        if (!q) return await reply("❌ *Tafadhali weka jina la wimbo!*");

        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return await reply("❌ *Haikupatikana!*");

        const body = `\`\`\`${video.title}\`\`\`
        
*CHAGUA MFUMO WA KUDOWNLOAD:*
🎧 *Audio* au 📽️ *Video*`;

        // Kutuma ujumbe wenye Buttons
        // Kumbuka: Kama namba yako haina support ya buttons, ujumbe utafeli. 
        // Kama itafeli, inabidi utumie mfumo wa "List" au "Template Message".
        
        const buttons = [
            { buttonId: `.ytmp3 ${video.url}`, buttonText: { displayText: '🎧 AUDIO' }, type: 1 },
            { buttonId: `.ytmp4 ${video.url}`, buttonText: { displayText: '📽️ VIDEO' }, type: 1 },
            { buttonId: `.ytmp3doc ${video.url}`, buttonText: { displayText: '📂 AUDIO DOC' }, type: 1 }
        ];

        const buttonMessage = {
            image: { url: video.thumbnail },
            caption: body,
            footer: '𝕭𝖑𝖆𝖈𝖐 𝕮𝖑𝖔𝖛𝖊𝖗 ☘︎ | ⚔️🥷',
            buttons: buttons,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: '📡 DESCARGAS CLOVER',
                    body: '✡︎ Dev • TheCarlos',
                    mediaType: 2,
                    thumbnail: { url: video.thumbnail },
                    sourceUrl: video.url
                }
            }
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });
        await m.react('✅');

    } catch (e) {
        console.error(e);
        reply("❌ *Hitilafu imetokea!*");
    }
});
