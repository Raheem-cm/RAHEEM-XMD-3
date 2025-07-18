const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const axios = require('axios');

function toSmallCaps(str) {
  const smallCaps = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.toUpperCase().split('').map(c => smallCaps[c] || c).join('');
}

cmd({
  pattern: "mp4",
  alias: ["mp4", "raheem"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "📜",
  filename: __filename
},
async (raheem, mek, m, { from, reply }) => {
  try {
    const totalCommands = commands.length;
    const date = moment().tz("Africa/Dar es salaam").format("dddd, DD MMMM YYYY");

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let raheemmenu = `╭══⪨ RAHEEM-XMD-2🇹🇿 ⪩══╮
┃😎 𝗨𝗦𝗘𝗥 : @${m.sender.split("@")[0]}
┃⌚ 𝗧𝗜𝗠𝗘 : ${uptime()}
┃👔 𝗠𝗢𝗗𝗘 : *${config.MODE}*
┃🐯 𝗣𝗥𝗘𝗙𝗜𝗫 : [${config.PREFIX}]
┃✌️ 𝗣𝗟𝗨𝗚𝗜𝗡 :  ${totalCommands}
┃💪 𝗗𝗘𝗩 : RAHEEM-CM 
┃👌 𝗩𝗘𝗥𝗦𝗜𝗢𝗡 : 𝟮.𝟬.𝟬
╰══════════════════╯

*WELCOME TO RAHEEM-XMD-2*
-------------------------------------------------

╭━⪨👥𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔 ⪩━┈⊷
├❒╭───────────────·๏🇹🇿
├❒┃👉  grouplink
├❒┃👉  kickall
├❒┃👉  kickall2
├❒┃👉  kickall3
├❒┃👉  add
├❒┃👉  remove
├❒┃👉  kick
├❒┃👉  promote
├❒┃👉  demote
├❒┃👉  dismiss
├❒┃👉  revoke
├❒┃👉  setgoodbye
├❒┃👉  setwelcome
├❒┃👉  delete
├❒┃👉  getpic
├❒┃👉  ginfo
├❒┃👉  disappear on
├❒┃👉  disappear off
├❒┃👉  disappear 7D,24H
├❒┃👉  allreq
├❒┃👉  updategname
├❒┃👉  updategdesc
├❒┃👉  joinrequests
├❒┃👉  senddm
├❒┃👉  nikal
├❒┃👉  mute
├❒┃👉  unmute
├❒┃👉  lockgc
├❒┃👉  unlockgc
├❒┃👉  invite
├❒┃👉  tag
├❒┃👉  hidetag
├❒┃👉  tagall
├❒┃👉  tagadmins
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨📥𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐌𝐄𝐍𝐔 ⪩━┈⊷🇹🇿
├❒╭────────────────·๏🇹🇿
├❒┃👉  facebook
├❒┃👉  mediafire
├❒┃👉  tiktok
├❒┃👉  twitter
├❒┃👉  insta
├❒┃👉  apk
├❒┃👉  img
├❒┃👉  tt2
├❒┃👉  pins
├❒┃👉  apk2
├❒┃👉  fb2
├❒┃👉  pinterest
├❒┃👉  spotify
├❒┃👉  play
├❒┃👉  play2
├❒┃👉  audio
├❒┃👉  video
├❒┃👉  video2
├❒┃👉  ytmp3
├❒┃👉  ytmp4
├❒┃👉  song
├❒┃👉  darama
├❒┃👉 gdrive
├❒┃👉  ssweb
├❒┃👉  tiks
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨🎭𝐑𝐄𝐀𝐂𝐓𝐈𝐎𝐍𝐒 𝐌𝐄𝐍𝐔 ⪩━┈⊷🇹🇿
├❒╭───────────────·๏🇹🇿
├❒┃👉  bully 
├❒┃👉  cuddle 
├❒┃👉  cry 
├❒┃👉  hug
├❒┃👉  awoo 
├❒┃👉  kiss 
├❒┃👉  lick 
├❒┃👉  pat 
├❒┃👉  smug 
├❒┃👉  bonk 
├❒┃👉  yeet 
├❒┃👉  blush 
├❒┃👉  smile 
├❒┃👉  wave 
├❒┃👉  highfive 
├❒┃👉  handhold 
├❒┃👉  nom 
├❒┃👉  bite 
├❒┃👉  glomp 
├❒┃👉  slap 
├❒┃👉  kill 
├❒┃👉  happy 
├❒┃👉  wink 
├❒┃👉  poke 
├❒┃👉  dance 
├❒┃👉  cringe 
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨🎨𝐋𝐎𝐆𝐎 𝐌𝐀𝐊𝐄𝐑 ⪩━┈⊷🇹🇿
├❒╭───────────────·๏🇹🇿
├❒┃👉  neonlight
├❒┃👉  blackpink
├❒┃👉  dragonball
├❒┃👉  3dcomic
├❒┃👉  america
├❒┃👉  naruto
├❒┃👉  sadgirl
├❒┃👉  clouds
├❒┃👉  futuristic
├❒┃👉  3dpaper
├❒┃👉  eraser
├❒┃👉  sunset
├❒┃👉  leaf
├❒┃👉  galaxy
├❒┃👉  sans
├❒┃👉  boom
├❒┃👉  hacker
├❒┃👉  devilwings
├❒┃👉  nigeria
├❒┃👉  bulb
├❒┃👉  angelwing
├❒┃👉  zodiac
├❒┃👉  luxury
├❒┃👉  paint
├❒┃👉  frozen
├❒┃👉  castle
├❒┃👉  tatoo
├❒┃👉  valorant
├❒┃👉  bear
├❒┃👉  typography
├❒┃👉  birthday
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨👑𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔 ⪩━┈⊷🇹🇿
├❒╭───────────────·๏🇹🇿
├❒┃👉  owner
├❒┃👉  menu
├❒┃👉  menu2
├❒┃👉  vv
├❒┃👉  listcmd
├❒┃👉  allmenu
├❒┃👉  repo
├❒┃👉  block
├❒┃👉  unblock
├❒┃👉  fullpp
├❒┃👉  setpp
├❒┃👉  restart
├❒┃👉  shutdown
├❒┃👉  updatecmd
├❒┃👉  alive
├❒┃👉  ping
├❒┃👉  gjid
├❒┃👉  jid
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨🎉𝐅𝐔𝐍 𝐌𝐄𝐍𝐔 ⪩━┈⊷🇹🇿
├❒╭───────────────·๏🇹🇿
├❒┃👉  shapar
├❒┃👉  rate
├❒┃👉  insult
├❒┃👉  hack
├❒┃👉  ship
├❒┃👉  character
├❒┃👉  pickup
├❒┃👉  joke
├❒┃👉  hrt
├❒┃👉  hpy
├❒┃👉  syd
├❒┃👉  anger
├❒┃👉  shy
├❒┃👉  kiss
├❒┃👉  mon
├❒┃👉  cunfuzed
├❒┃👉  setpp
├❒┃👉  hand
├❒┃👉  nikal
├❒┃👉  hold
├❒┃👉  hug
├❒┃👉  nikal
├❒┃👉  hifi
├❒┃👉  poke
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨💱𝐂𝐎𝐍𝐕𝐄𝐑𝐓 𝐌𝐄𝐍𝐔 ⪩━┈⊷🇹🇿
├❒╭────────────────·๏🇹🇿
├❒┃👉  sticker
├❒┃👉  sticker2
├❒┃👉  emojimix
├❒┃👉  fancy
├❒┃👉  take
├❒┃👉  tomp3
├❒┃👉  tts
├❒┃👉  trt
├❒┃👉  base64
├❒┃👉  unbase64
├❒┃👉  binary
├❒┃👉  dbinary
├❒┃👉  tinyurl
├❒┃👉  urldecode
├❒┃👉  urlencode
├❒┃👉  url
├❒┃👉  repeat
├❒┃👉  ask
├❒┃👉  readmore
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨🤖𝐀𝐈 𝐌𝐄𝐍𝐔 ⪩━┈⊷
├❒╭───────────────·๏🇹🇿
├❒┃👉  raheem
├❒┃👉  gpt3
├❒┃👉  gpt2
├❒┃👉  gptmini
├❒┃👉  raheem 
├❒┃👉  meta
├❒┃👉  blackbox
├❒┃👉  luma
├❒┃👉  dj
├❒┃👉  raheem
├❒┃👉  deep
├❒┃👉  gpt4
├❒┃👉  bing
├❒┃👉  imagine
├❒┃👉  imagine2
├❒┃👉  copilot
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨👻𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 ⪩━┈⊷🇹🇿
├❒╭───────────────·๏🇹🇿
├❒┃👉  ping
├❒┃👉  ping2
├❒┃👉  speed
├❒┃👉  live
├❒┃👉  alive
├❒┃👉  runtime
├❒┃👉  uptime
├❒┃👉  repo
├❒┃👉  owner
├❒┃👉  menu
├❒┃👉  menu2
├❒┃👉  restart
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨🎎𝐀𝐍𝐈𝐌𝐄 𝐌𝐄𝐍𝐔 ⪩━┈⊷🇹🇿
├❒╭───────────────·๏🇹🇿
├❒┃👉  fack
├❒┃👉  truth
├❒┃👉  dare
├❒┃👉  dog
├❒┃👉  awoo
├❒┃👉  garl
├❒┃👉  waifu
├❒┃👉  neko
├❒┃👉  megnumin
├❒┃👉  neko
├❒┃👉  maid
├❒┃👉  loli
├❒┃👉  animegirl
├❒┃👉  animegirl1
├❒┃👉  animegirl2
├❒┃👉  animegirl3
├❒┃👉  animegirl4
├❒┃👉  animegirl5
├❒┃👉  anime1
├❒┃👉  anime2
├❒┃👉  anime3
├❒┃👉  anime4
├❒┃👉  anime5
├❒┃👉  animenews
├❒┃👉  foxgirl
├❒┃👉  naruto
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿

╭━⪨🇹🇿𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔 ⪩━┈⊷🇹🇿
├❒╭───────────────·๏🇹🇿
├❒┃👉  timenow
├❒┃👉  date
├❒┃👉  count
├❒┃👉  calculate
├❒┃👉  countx
├❒┃👉  flip
├❒┃👉  coinflip
├❒┃👉  rcolor
├❒┃👉  roll
├❒┃👉  fact
├❒┃👉  cpp
├❒┃👉  rw
├❒┃👉  pair
├❒┃👉  pair2
├❒┃👉  pair3
├❒┃👉  fancy
├❒┃👉  logo <text>
├❒┃👉  define
├❒┃👉  news
├❒┃👉  movie
├❒┃👉  weather
├❒┃👉  srepo
├❒┃👉  insult
├❒┃👉  save
├❒┃👉  wikipedia
├❒┃👉  gpass
├❒┃👉  githubstalk
├❒┃👉  yts
├❒┃👉  ytv
├❒╰───────────────┈⊷🇹🇿
╰━━━━━━━━━━━━━━━━━┈⊷🇹🇿
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ RAHEEM-CM*`;
    
await raheem.sendMessage(from, {
      image: { url:'https://files.catbox.moe/far7x9.jpg`},
      caption: raheemmenu,
      contextInfo: {
        mentionedJid: [m.sender],
        audio: { url: 'https://files.catbox.moe/t7ul1u.mp3' },
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '255763111390@s.whatsapp.net',
          newsletterName: 'RAHEEM-CM',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    
  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
