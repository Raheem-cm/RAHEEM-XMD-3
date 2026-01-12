 const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "chb",
    alias: ["chatbot"],
    desc: "Kuwasha au kuzima chatbot kwenye magroup.",
    category: "owner",
    use: '.chb on/off',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Hakikisha anayewasha ni Admin au Owner
        if (!isGroup) return reply("Hii command inafanya kazi kwenye group tu!")
        if (!isOwner && !isAdmins) return reply("Hii ni kwa ajili ya Admins tu!")

        if (args[0] === "on") {
            if (config.GROUP_CHATBOT === true) return reply("Chatbot tayari imeshawashwa kwenye magroup yote! ✅")
            config.GROUP_CHATBOT = true
            return reply("*CHATBOT IMEWASHWA* 🤖✅\n\nSasa bot itakuwa inajibu meseji kwenye magroup yote.")
        } else if (args[0] === "off") {
            if (config.GROUP_CHATBOT === false) return reply("Chatbot tayari imeshazimwa! ❌")
            config.GROUP_CHATBOT = false
            return reply("*CHATBOT IMEZIMWA* 🤖❌\n\nBot haitajibu tena meseji za kawaida kwenye magroup.")
        } else {
            return reply("*MATUMIZI:* \n\n◦ `.chb on` - Kuwasha Chatbot\n◦ `.chb off` - Kuzima Chatbot")
        }

    } catch (e) {
        console.log(e)
        reply("Kuna hitilafu imetokea: " + e)
    }
})
