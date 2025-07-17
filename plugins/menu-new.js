 const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu",
    desc: "Show full main menu (vertical stylish box)",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const menuCaption = `
╭──❖  ${config.BOT_NAME || '𝑹𝑨𝑯𝑬𝑬𝑴-𝑿𝑴𝑫-3'}  ❖──╮
┃ 👑 Owner: ${config.OWNER_NAME}
┃ 🛠️ Mode: ${config.MODE}
┃ 🕒 Version: 2.0.0
┃ 🧭 Time: ${config.Time}
┃ 🔖 Prefix: ${config.PREFIX}
╰────────────────────────────╯ powerd by *sir Raheem-cm*
         
╭─❖ *🏠 MAIN COMMANDS* ❖─╮
┃ ping
┃ ping2
┃ speed
┃ live
┃ alive
┃ runtime
┃ uptime
┃ repo
┃ owner
┃ menu
┃ menu2
┃ restart
╰────────────────────────────╯ powerd by *sir Raheem-cm*

╭─❖ *📥 DOWNLOAD MENU* ❖─╮
┃ facebook
┃ mediafire
┃ tiktok
┃ twitter
┃ insta
┃ apk
┃ img
┃ tt2
┃ pins
┃ apk2
┃ fb2
┃ pinterest
┃ spotify
┃ play
┃ play2
┃ audio
┃ video
┃ video2
┃ ytmp3
┃ ytmp4
┃ song
┃ darama
┃ gdrive
┃ ssweb
┃ tiks
╰────────────────────────────╯ powerd by *sir Raheem-cm*

╭─❖ *👥 GROUP MENU* ❖─╮
┃ grouplink
┃ kickall
┃ kickall2
┃ kickall3
┃ add
┃ remove
┃ kick
┃ promote
┃ demote
┃ dismiss
┃ revoke
┃ setgoodbye
┃ setwelcome
┃ delete
┃ getpic
┃ ginfo
┃ disappear on
┃ disappear off
┃ disappear 7D,24H
┃ allreq
┃ updategname
┃ updategdesc
┃ joinrequests
┃ senddm
┃ nikal
┃ mute
┃ unmute
┃ lockgc
┃ unlockgc
┃ invite
┃ tag
┃ hidetag
┃ tagall
┃ tagadmins
╰────────────────────────────╯ powerd by *sir Raheem-cm*

╭─❖ *🎉 FUN MENU* ❖─╮
┃ shapar
┃ rate
┃ insult
┃ hack
┃ ship
┃ character
┃ pickup
┃ joke
┃ hrt
┃ hpy
┃ syd
┃ anger
┃ shy
┃ kiss
┃ mon
┃ cunfuzed
┃ setpp
┃ hand
┃ nikal
┃ hold
┃ hug
┃ hifi
┃ poke
╰────────────────────────────╯ powerd by *sir Raheem-cm*

╭─❖ *👑 OWNER MENU* ❖─╮
┃ owner
┃ menu
┃ menu2
┃ vv
┃ listcmd
┃ allmenu
┃ repo
┃ block
┃ unblock
┃ fullpp
┃ setpp
┃ restart
┃ shutdown
┃ updatecmd
┃ alive
┃ ping
┃ gjid
┃ jid
╰────────────────────────────╯ powerd by *sir Raheem-cm*

╭─❖ *🤖 AI MENU* ❖─╮
┃ ai
┃ gpt3
┃ gpt2
┃ gptmini
┃ gpt
┃ meta
┃ blackbox
┃ luma
┃ dj
┃ khan
┃ jawad
┃ gpt4
┃ bing
┃ imagine
┃ imagine2
┃ copilot
╰────────────────────────────╯ powerd by *sir Raheem-cm*

╭─❖ *🖌️ ANIME MENU* ❖─╮
┃ fack
┃ truth
┃ dare
┃ dog
┃ awoo
┃ garl
┃ waifu
┃ neko
┃ megnumin
┃ maid
┃ loli
┃ animegirl
┃ animegirl1
┃ animegirl2
┃ animegirl3
┃ animegirl4
┃ animegirl5
┃ anime1
┃ anime2
┃ anime3
┃ anime4
┃ anime5
┃ animenews
┃ foxgirl
┃ naruto
╰────────────────────────────╯ powerd by *sir Raheem-cm*

╭─❖ *🔄 CONVERT MENU* ❖─╮
┃ sticker
┃ sticker2
┃ emojimix
┃ fancy
┃ take
┃ tomp3
┃ tts
┃ trt
┃ base64
┃ unbase64
┃ binary
┃ dbinary
┃ tinyurl
┃ urldecode
┃ urlencode
┃ url
┃ repeat
┃ ask
┃ readmore
╰────────────────────────────╯ powerd by *sir Raheem-cm*

╭─❖ *📌 OTHER MENU* ❖─╮
┃ timenow
┃ date
┃ count
┃ calculate
┃ countx
┃ flip
┃ coinflip
┃ rcolor
┃ roll
┃ fact
┃ cpp
┃ rw
┃ pair
┃ pair2
┃ pair3
┃ fancy
┃ logo <text>
┃ define
┃ news
┃ movie
┃ weather
┃ srepo
┃ insult
┃ save
┃ wikipedia
┃ gpass
┃ githubstalk
┃ yts
┃ ytv
╰────────────────────────────╯ powerd by *sir Raheem-cm*

╭─❖ *💞 REACTIONS MENU* ❖─╮
┃ bully
┃ cuddle
┃ cry
┃ hug
┃ awoo
┃ kiss
┃ lick
┃ pat
┃ smug
┃ bonk
┃ yeet
┃ blush
┃ smile
┃ wave
┃ highfive
┃ handhold
┃ nom
┃ bite
┃ glomp
┃ slap
┃ kill
┃ happy
┃ wink
┃ poke
┃ dance
┃ cringe
╰────────────────────────────╯ powerd by *sir Raheem-cm*

_✨ Powered by RAHEEM-CM🎗${config.OWNER_NAME} ✨_
        `.trim();

        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [m.sender]
        };

        // Send menu image with caption
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/9gl0l8.jpg' },
            caption: menuCaption,
            contextInfo
        });

        // Send background song after menu
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/2yvmq5.mp3' },
            mimetype: 'audio/mp4',
            ptt: false, // true = voice note style
            contextInfo
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: "❌ Error sending menu or audio." });
    }
});
