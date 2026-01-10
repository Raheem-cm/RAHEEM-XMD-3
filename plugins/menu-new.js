const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu",
    desc: "Clean vertical command list",
    category: "menu",
    react: "📑",
    filename: __filename
}, async (conn, mek, m, { from, text }) => {
    try {
        
        const menu = `
*${config.BOT_NAME || 'RAHEEM-XMD'}* — _v1.0.0_

*〔 👤 USER INFO 〕*
  ▫️ *user:* @${m.sender.split('@')[0]}
  ▫️ *mode:* ${config.MODE}
  ▫️ *prefix:* ${config.PREFIX}

*〔 🏠 MAIN 〕*
  ┃ > ◦ .ping
  ┃ ◦ .speed
  ┃ ◦ .alive
  ┃ ◦ .uptime
  ┃ ◦ .owner
  ┃ ◦ .repo
  ┃ ◦ .restart
  ┃ ◦ .today
  ┃ ◦ .id

*〔 📥 DOWNLOAD 〕*
  ┃ > ◦ .facebook
  ┃ ◦ .tiktok
  ┃ ◦ .instagram
  ┃ ◦ .twitter
  ┃ ◦ .mediafire
  ┃ ◦ .apk
  ┃ ◦ .img
  ┃ ◦ .pins
  ┃ ◦ .spotify
  ┃ ◦ .play
  ┃ ◦ .audio
  ┃ ◦ .video
  ┃ ◦ .ytmp3
  ┃ ◦ .ytmp4
  ┃ ◦ .gdrive
  ┃ ◦ .tiks

*〔 👥 GROUP 〕*
  ┃ ◦ .kick
  ┃ ◦ .add
  ┃ ◦ .remove
  ┃ ◦ .promote
  ┃ ◦ .demote
  ┃ ◦ .tagall
  ┃ ◦ .hidetag
  ┃ ◦ .mute
  ┃ ◦ .unmute
  ┃ ◦ .lock
  ┃ ◦ .unlock
  ┃ ◦ .link
  ┃ ◦ .setwelcome
  ┃ ◦ .setgoodbye

*〔 🤖 AI & TOOLS 〕*
  ┃ ◦ .ai
  ┃ ◦ .gpt4
  ┃ ◦ .meta
  ┃ ◦ .blackbox
  ┃ ◦ .bing
  ┃ ◦ .imagine
  ┃ ◦ .copilot
  ┃ ◦ .luma

*〔 🔄 CONVERT 〕*
  ┃ ◦ .sticker
  ┃ ◦ .fancy
  ┃ ◦ .tomp3
  ┃ ◦ .tts
  ┃ ◦ .trt
  ┃ ◦ .url
  ┃ ◦ .base64

*〔 🎌 ANIME 〕*
  ┃ ◦ .waifu
  ┃ ◦ .neko
  ┃ ◦ .loli
  ┃ ◦ .naruto
  ┃ ◦ .animenews
  ┃ ◦ .foxgirl

*〔 🎉 FUN & GAME 〕*
  ┃ ◦ .hack
  ┃ ◦ .ship
  ┃ ◦ .rate
  ┃ ◦ .joke
  ┃ ◦ .insult
  ┃ ◦ .character
  ┃ ◦ .pickup

*〔 💞 REACTIONS 〕*
  ┃ ◦ .hug
  ┃ ◦ .kiss
  ┃ ◦ .slap
  ┃ ◦ .kill
  ┃ ◦ .smile
  ┃ ◦ .cry
  ┃ ◦ .pat
  ┃ ◦ .blush

*〔 📌 OTHERS 〕*
  ┃ ◦ .weather
  ┃ ◦ .news
  ┃ ◦ .wikipedia
  ┃ ◦ .calculate
  ┃ ◦ .pair
  ┃ ◦ .yts
  ┃ ◦ .logo

*──*
> *© raheem tech projects*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/8s7lxh.jpg" },
                caption: menu.trim(),
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363399470975987@newsletter',
                        newsletterName: "R A H E E M - X M D",
                        serverMessageId: 1
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: "❌ system failure." }, { quoted: mek });
    }
});
