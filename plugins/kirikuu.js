const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch'); // Hakikisha ume-install: npm install node-fetch

cmd({
    pattern: "yt2",
    alias: ["play", "music"],
    react: "🎧",
    desc: "Premium YouTube Downloader with Buttons",
    category: "download",
    use: ".yt2 <song name>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ *Tafadhali weka jina la wimbo au URL!*");

        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return await reply("❌ *Sijapata matokeo!*");

        const fancyMsg = `\`\`\`𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐏𝐋𝐀𝐘𝐄𝐑\`\`\`
        
  ➪ *ᴛɪᴛʟᴇ:* ${data.title}
  ➪ *ᴅᴜʀᴀᴛɪᴏɴ:* ${data.timestamp}
  ➪ *ᴠɪᴇᴡꜱ:* ${data.views.toLocaleString()}

*Chagua format ya kudownload:*`;

        // Hapa tunatuma Buttons
        const buttons = [
            { buttonId: `audio_${data.url}`, buttonText: { displayText: '🎧 Audio' }, type: 1 },
            { buttonId: `video_${data.url}`, buttonText: { displayText: '📽️ Video' }, type: 1 }
        ];

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: data.thumbnail }, 
            caption: fancyMsg,
            footer: '𝕭𝖑𝖆𝖈𝖐 𝕮𝖑𝖔𝖛𝖊𝖗 ☘︎ | ⚔️🥷',
            buttons: buttons,
            headerType: 4
        }, { quoted: mek });

        // Hii ndio Logic inayopokea jibu la Button ndani ya file hilihili
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message) return;

            // Angalia kama mtumiaji amebonyeza button
            const selection = msg.message.buttonsResponseMessage?.selectedButtonId;
            
            if (selection && (selection === `audio_${data.url}` || selection === `video_${data.url}`)) {
                await m.react('📥');
                
                // API uliyotoa
                const type = selection.startsWith('audio') ? 'ytmp3' : 'ytmp4';
                const apiUrl = `https://api.davidcyriltech.my.id/download/${type}?url=${encodeURIComponent(data.url)}`;
                
                const response = await fetch(apiUrl);
                const json = await response.json();
                
                if (!json.success) return await reply("❌ *API Error! Jaribu baadae.*");

                const dlUrl = json.result.download_url;

                if (type === 'ytmp3') {
                    await conn.sendMessage(from, { audio: { url: dlUrl }, mimetype: 'audio/mpeg' }, { quoted: msg });
                } else {
                    await conn.sendMessage(from, { video: { url: dlUrl }, caption: data.title }, { quoted: msg });
                }
                await m.react('✅');
            }
        });

    } catch (e) {
        console.error(e);
        reply("❌ *Hitilafu imetokea!*");
    }
});
                
