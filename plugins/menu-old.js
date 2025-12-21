 const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu3",
    desc: "Show professional commands menu",
    category: "menu",
    react: "💎",
    filename: __filename
}, async (conn, mek, m, { from, text }) => {
    try {
        
        const header = `
┏━━━━━━━⬣  *${config.BOT_NAME || 'RAHEEM-XMD-3'}* ⬣━━━━━━━┓
┃
┃  👤 *User:* @${m.sender.split('@')[0]}
┃  📍 *Prefix:* ${config.PREFIX}
┃  🎛️ *Mode:* ${config.MODE}
┃  ⚡ *Status:* Active
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`;

        const menu = `${header}
┃
┣━━〔 *🏠 MAIN SYSTEM* 〕━━
┃ ▫️ .ping
┃ ▫️ .speed
┃ ▫️ .alive
┃ ▫️ .uptime
┃ ▫️ .owner
┃ ▫️ .repo
┃ ▫️ .menu
┃ ▫️ .restart
┃ ▫️ .today
┃ ▫️ .id
┃ ▫️ .advice
┃ ▫️ .cs
┃ ▫️ .inde
┃ ▫️ .bffs
┃ ▫️ .cf
┃
┣━━〔 *📥 DOWNLOADER* 〕━━
┃ ▫️ .facebook
┃ ▫️ .tiktok
┃ ▫️ .instagram
┃ ▫️ .twitter
┃ ▫️ .mediafire
┃ ▫️ .apk
┃ ▫️ .img
┃ ▫️ .tt2
┃ ▫️ .pins
┃ ▫️ .apk2
┃ ▫️ .fb2
┃ ▫️ .pinterest
┃ ▫️ .spotify
┃ ▫️ .play
┃ ▫️ .play2
┃ ▫️ .audio
┃ ▫️ .video
┃ ▫️ .video2
┃ ▫️ .ytmp3
┃ ▫️ .ytmp4
┃ ▫️ .song
┃ ▫️ .darama
┃ ▫️ .gdrive
┃ ▫️ .ssweb
┃ ▫️ .tiks
┃
┣━━〔 *👥 GROUP* 〕━━
┃ ▫️ .grouplink
┃ ▫️ .kickall
┃ ▫️ .add
┃ ▫️ .remove
┃ ▫️ .kick
┃ ▫️ .promote
┃ ▫️ .demote
┃ ▫️ .dismiss
┃ ▫️ .revoke
┃ ▫️ .setgoodbye
┃ ▫️ .setwelcome
┃ ▫️ .delete
┃ ▫️ .ginfo
┃ ▫️ .mute
┃ ▫️ .unmute
┃ ▫️ .lockgc
┃ ▫️ .tagall
┃ ▫️ .hidetag
┃
┣━━〔 *🤖 ARTIFICIAL INT* 〕━━
┃ ▫️ .ai
┃ ▫️ .gpt3
┃ ▫️ .meta
┃ ▫️ .blackbox
┃ ▫️ .luma
┃ ▫️ .gpt4
┃ ▫️ .bing
┃ ▫️ .imagine
┃ ▫️ .copilot
┃
┣━━〔 *🔄 CONVERTER* 〕━━
┃ ▫️ .sticker
┃ ▫️ .sticker2
┃ ▫️ .emojimix
┃ ▫️ .fancy
┃ ▫️ .take
┃ ▫️ .tomp3
┃ ▫️ .tts
┃ ▫️ .trt
┃ ▫️ .base64
┃ ▫️ .url
┃
┣━━〔 *👑 OWNER ONLY* 〕━━
┃ ▫️ .block
┃ ▫️ .unblock
┃ ▫️ .fullpp
┃ ▫️ .setpp
┃ ▫️ .shutdown
┃ ▫️ .updatecmd
┃ ▫️ .gjid
┃ ▫️ .jid
┃
┣━━〔 *🎌 ANIME* 〕━━
┃ ▫️ .waifu
┃ ▫️ .neko
┃ ▫️ .megnumin
┃ ▫️ .maid
┃ ▫️ .loli
┃ ▫️ .animegirl
┃ ▫️ .animenews
┃ ▫️ .naruto
┃
┣━━〔 *💞 REACTIONS* 〕━━
┃ ▫️ .bully
┃ ▫️ .cuddle
┃ ▫️ .cry
┃ ▫️ .hug
┃ ▫️ .kiss
┃ ▫️ .pat
┃ ▫️ .smug
┃ ▫️ .slap
┃ ▫️ .happy
┃ ▫️ .dance
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> *Created by Raheem-CM*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
                caption: menu.trim(),
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 1,
                    isForwarded: true,
                    externalAdReply: {
                        title: "RAHEEM-XMD V1.0.0",
                        body: "MULTI-DEVICE WHATSAPP BOT",
                        mediaType: 1,
                        sourceUrl: "https://github.com/",
                        thumbnailUrl: "https://files.catbox.moe/9gl0l8.jpg",
                        renderLargerThumbnail: false,
                        showAdAttribution: true
                    }
                }
            },
            { quoted: mek } // Hii inahakikisha bot inajibu (reply) ujumbe uliotuma
        );

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: "❌ Error loading Menu3" }, { quoted: mek });
    }
});
