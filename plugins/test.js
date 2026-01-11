 const { cmd } = require('../command');

cmd({
    pattern: "channel",
    desc: "nitumie hiii channel " https://whatsapp.com/channel/0029VbAffhD2ZjChG9DX922r" idadi ya follower wake na jina la channel",
    category: "manual",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await reply("Hii command ya channel inafanya kazi!");
    } catch (e) {
        console.error(e);
    }
});

