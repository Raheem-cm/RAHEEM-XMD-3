const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu",
    desc: "Modern minimalist menu",
    category: "menu",
    react: "🌑",
    filename: __filename
}, async (conn, mek, m, { from, text }) => {
    try {
        
        const menu = `
*${config.BOT_NAME || 'RAHEEM-XMD'}* — s y s t e m
_Everything you need, simplified._

── ``[ USER INFO ]`` ──
  👤 *user:* @${m.sender.split('@')[0]}
  ⚡ *status:* active
  🛠️ *prefix:* ${config.PREFIX}
  📂 *mode:* ${config.MODE}

── ``[ MAIN ]`` ──
  ▸ .ping  ▸ .speed  ▸ .alive
  ▸ .uptime  ▸ .repo  ▸ .owner
  ▸ .restart  ▸ .today  ▸ .id
  ▸ .advice  ▸ .cs  ▸ .inde
  ▸ .bffs  ▸ .cf

── ``[ DOWNLOAD ]`` ──
  ▸ .fb  ▸ .tiktok  ▸ .insta
  ▸ .twitter  ▸ .mediafire  ▸ .apk
  ▸ .img  ▸ .pins  ▸ .spotify
  ▸ .play  ▸ .audio  ▸ .video
  ▸ .ytmp3  ▸ .ytmp4  ▸ .gdrive
  ▸ .ssweb  ▸ .tiks

── ``[ GROUP ]`` ──
  ▸ .kick  ▸ .add  ▸ .remove
  ▸ .promote  ▸ .demote  ▸ .tagall
  ▸ .hidetag  ▸ .mute  ▸ .unmute
  ▸ .lock  ▸ .unlock  ▸ .link
  ▸ .revoke  ▸ .setwelcome

── ``[ INTELLIGENCE ]`` ──
  ▸ .ai  ▸ .gpt4  ▸ .meta
  ▸ .blackbox  ▸ .bing  ▸ .luma
  ▸ .imagine  ▸ .copilot

── ``[ CONVERT ]`` ──
  ▸ .sticker  ▸ .fancy  ▸ .tomp3
  ▸ .tts  ▸ .trt  ▸ .url  ▸ .readmore

── ``[ ENTERTAIN ]`` ──
  ▸ .hack  ▸ .ship  ▸ .joke
  ▸ .rate  ▸ .insult  ▸ .character
  ▸ .waifu  ▸ .neko  ▸ .loli

── ``[ REACTIONS ]`` ──
  ▸ .hug  ▸ .kiss  ▸ .slap
  ▸ .kill  ▸ .smile  ▸ .cry
  ▸ .pat  ▸ .blush  ▸ .wink

── ``[ UTILITY ]`` ──
  ▸ .weather  ▸ .news  ▸ .wiki
  ▸ .calc  ▸ .pair  ▸ .yts  ▸ .logo

*──*
> *powered by raheem tech*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/8s7lxh.jpg" },
                caption: menu,
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
        await conn.sendMessage(from, { text: "system error." }, { quoted: mek });
    }
});
