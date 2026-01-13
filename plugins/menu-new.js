const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "menu",
    desc: "Inaonyesha orodha ya amri zote za bot.",
    category: "main",
    react: "📑",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

        const menuText = ` 
╭〔 *RAHEEM-XMD-3* 〕━┈
┃
┃ 👤 *User:* @${sender.split('@')[0]}
┃ 👤 *Owner:* RAHEEM-CM
┃ 📍 *Prefix:* ${config.PREFIX}
┃ 🎛️ *Mode:* ${config.MODE}
┃ ⚡ *Vers:* 1.0.0
┃
╰━━━━━━━━━━┈

*╭┈〔 🏠 MAIN 〕┈─*
┃ ✧ \`,ping\`
┃ ✧ \`,speed\`
┃ ✧ \`,alive\`
┃ ✧ \`,uptime\`
┃ ✧ \`,owner\`
┃ ✧ \`,repo\`
┃ ✧ \`,menu\`
┃ ✧ \`,restart\`
┃ ✧ \`,today\`
┃ ✧ \`,id\`
┃ ✧ \`,advice\`
┃ ✧ \`,cs\`
┃ ✧ \`,inde\`
┃ ✧ \`,bffs\`
┃ ✧ \`,cf\`
╰──────────┈

*╭┈〔 📥 DOWNLOAD 〕┈─*
┃ ✧ \`,facebook\`
┃ ✧ \`,tiktok\`
┃ ✧ \`,instagram\`
┃ ✧ \`,twitter\`
┃ ✧ \`,mediafire\`
┃ ✧ \`,apk\`
┃ ✧ \`,img\`
┃ ✧ \`,tt2\`
┃ ✧ \`,pins\`
┃ ✧ \`,apk2\`
┃ ✧ \`,fb2\`
┃ ✧ \`,pinterest\`
┃ ✧ \`,spotify\`
┃ ✧ \`,play4\`
┃ ✧ \`,play2\`
┃ ✧ \`,audio\`
┃ ✧ \`,video\`
┃ ✧ \`,video2\`
┃ ✧ \`,ytmp3\`
┃ ✧ \`,ytmp4\`
┃ ✧ \`,song\`
┃ ✧ \`,darama\`
┃ ✧ \`,gdrive\`
┃ ✧ \`,ssweb\`
┃ ✧ \`,tiks\`
╰──────────┈

*╭┈〔 👥 GROUP 〕┈─*
┃ ✧ \`,grouplink\`
┃ ✧ \`,kickall\`
┃ ✧ \`,kickall2\`
┃ ✧ \`,kickall3\`
┃ ✧ \`,add\`
┃ ✧ \`,remove\`
┃ ✧ \`,kick\`
┃ ✧ \`,promote\`
┃ ✧ \`,demote\`
┃ ✧ \`,dismiss\`
┃ ✧ \`,revoke\`
┃ ✧ \`,setgoodbye\`
┃ ✧ \`,setwelcome\`
┃ ✧ \`,delete\`
┃ ✧ \`,getpic\`
┃ ✧ \`,ginfo\`
┃ ✧ \`,disappear\`
┃ ✧ \`,allreq\`
┃ ✧ \`,updategname\`
┃ ✧ \`,updategdesc\`
┃ ✧ \`,joinrequests\`
┃ ✧ \`,senddm\`
┃ ✧ \`,nikal\`
┃ ✧ \`,mute\`
┃ ✧ \`,unmute\`
┃ ✧ \`,lockgc\`
┃ ✧ \`,unlockgc\`
┃ ✧ \`,invite\`
┃ ✧ \`,tag\`
┃ ✧ \`,hidetag\`
┃ ✧ \`,tagall\`
┃ ✧ \`,tagadmins\`
╰───────────┈

*╭┈〔 🎉 FUN 〕┈─*
┃ ✧ \`,shapar\`
┃ ✧ \`,rate\`
┃ ✧ \`,insult\`
┃ ✧ \`,hack\`
┃ ✧ \`,ship\`
┃ ✧ \`,character\`
┃ ✧ \`,pickup\`
┃ ✧ \`,joke\`
┃ ✧ \`,hrt\`
┃ ✧ \`,hpy\`
┃ ✧ \`,syd\`
┃ ✧ \`,anger\`
┃ ✧ \`,shy\`
┃ ✧ \`,kiss\`
┃ ✧ \`,mon\`
┃ ✧ \`,cunfuzed\`
┃ ✧ \`,setpp\`
┃ ✧ \`,hand\`
┃ ✧ \`,nikal\`
┃ ✧ \`,hold\`
┃ ✧ \`,hug\`
┃ ✧ \`,hifi\`
┃ ✧ \`,poke\`
╰──────────────┈

*╭┈〔 👑 OWNER 〕┈─*
┃ ✧ \`,owner\`
┃ ✧ \`,menu\`
┃ ✧ \`,menu2\`
┃ ✧ \`,vv\`
┃ ✧ \`,listcmd\`
┃ ✧ \`,allmenu\`
┃ ✧ \`,repo\`
┃ ✧ \`,block\`
┃ ✧ \`,unblock\`
┃ ✧ \`,fullpp\`
┃ ✧ \`,setpp\`
┃ ✧ \`,restart\`
┃ ✧ \`,shutdown\`
┃ ✧ \`,updatecmd\`
┃ ✧ \`,alive\`
┃ ✧ \`,ping\`
┃ ✧ \`,gjid\`
┃ ✧ \`,jid\`
╰──────────┈

*╭┈〔 🤖 AI 〕┈*
┃ ✧ \`,ai\`
┃ ✧ \`,gpt3\`
┃ ✧ \`,gpt2\`
┃ ✧ \`,gptmini\`
┃ ✧ \`,gpt\`
┃ ✧ \`,meta\`
┃ ✧ \`,blackbox\`
┃ ✧ \`,luma\`
┃ ✧ \`,dj\`
┃ ✧ \`,khan\`
┃ ✧ \`,jawad\`
┃ ✧ \`,gpt4\`
┃ ✧ \`,bing\`
┃ ✧ \`,imagine\`
┃ ✧ \`,imagine2\`
┃ ✧ \`,copilot\`
╰──────────┈

*╭┈〔 🎌 ANIME 〕┈─*
┃ ✧ \`,fack\`
┃ ✧ \`,truth\`
┃ ✧ \`,dare\`
┃ ✧ \`,dog\`
┃ ✧ \`,awoo\`
┃ ✧ \`,garl\`
┃ ✧ \`,waifu\`
┃ ✧ \`,neko\`
┃ ✧ \`,megnumin\`
┃ ✧ \`,maid\`
┃ ✧ \`,loli\`
┃ ✧ \`,animegirl\`
┃ ✧ \`,animegirl1\`
┃ ✧ \`,animegirl2\`
┃ ✧ \`,animegirl3\`
┃ ✧ \`,animegirl4\`
┃ ✧ \`,animegirl5\`
┃ ✧ \`,anime1\`
┃ ✧ \`,anime2\`
┃ ✧ \`,anime3\`
┃ ✧ \`,anime4\`
┃ ✧ \`,anime5\`
┃ ✧ \`,animenews\`
┃ ✧ \`,foxgirl\`
┃ ✧ \`,naruto\`
╰──────────┈

*╭┈〔 🔄 CONVERT 〕┈─*
┃ ✧ \`,sticker\`
┃ ✧ \`,sticker2\`
┃ ✧ \`,emojimix\`
┃ ✧ \`,fancy\`
┃ ✧ \`,take\`
┃ ✧ \`,tomp3\`
┃ ✧ \`,tts\`
┃ ✧ \`,trt\`
┃ ✧ \`,base64\`
┃ ✧ \`,unbase64\`
┃ ✧ \`,binary\`
┃ ✧ \`,dbinary\`
┃ ✧ \`,tinyurl\`
┃ ✧ \`,urldecode\`
┃ ✧ \`,urlencode\`
┃ ✧ \`,url\`
┃ ✧ \`,repeat\`
┃ ✧ \`,ask\`
┃ ✧ \`,readmore\`
╰──────────┈

*╭┈〔 📌 OTHER 〕┈─*
┃ ✧ \`,timenow\`
┃ ✧ \`,date\`
┃ ✧ \`,count\`
┃ ✧ \`,calculate\`
┃ ✧ \`,countx\`
┃ ✧ \`,flip\`
┃ ✧ \`,coinflip\`
┃ ✧ \`,rcolor\`
┃ ✧ \`,roll\`
┃ ✧ \`,fact\`
┃ ✧ \`,cpp\`
┃ ✧ \`,rw\`
┃ ✧ \`,pair\`
┃ ✧ \`,pair2\`
┃ ✧ \`,pair3\`
┃ ✧ \`,fancy\`
┃ ✧ \`,logo\`
┃ ✧ \`,define\`
┃ ✧ \`,news\`
┃ ✧ \`,movie\`
┃ ✧ \`,weather\`
┃ ✧ \`,srepo\`
┃ ✧ \`,insult\`
┃ ✧ \`,save\`
┃ ✧ \`,wikipedia\`
┃ ✧ \`,gpass\`
┃ ✧ \`,githubstalk\`
┃ ✧ \`,yts\`
┃ ✧ \`,ytv\`
╰─────────┈

*╭┈〔 💞 REACTIONS 〕┈─*
┃ ✧ \`,bully\`
┃ ✧ \`,cuddle\`
┃ ✧ \`,cry\`
┃ ✧ \`,hug\`
┃ ✧ \`,awoo\`
┃ ✧ \`,kiss\`
┃ ✧ \`,lick\`
┃ ✧ \`,pat\`
┃ ✧ \`,smug\`
┃ ✧ \`,bonk\`
┃ ✧ \`,yeet\`
┃ ✧ \`,blush\`
┃ ✧ \`,smile\`
┃ ✧ \`,wave\`
┃ ✧ \`,highfive\`
┃ ✧ \`,handhold\`
┃ ✧ \`,nom\`
┃ ✧ \`,bite\`
┃ ✧ \`,glomp\`
┃ ✧ \`,slap\`
┃ ✧ \`,kill\`
┃ ✧ \`,happy\`
┃ ✧ \`,wink\`
┃ ✧ \`,poke\`
┃ ✧ \`,https\`
┃ ✧ \`,cringe\`
╰──────────┈
──
© ʀᴀʜᴇᴇᴍ ᴛᴇᴄʜ ᴘʀᴏᴊᴇᴄᴛs
`;

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/1xbnu5.jpg" },
            caption: menuText.trim(),
            contextInfo: {
                mentionedJid: [m.sender],
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
        reply("❌ cmd has error tell dev nyoni by using ask cmd then request you needs.");
    }
});
