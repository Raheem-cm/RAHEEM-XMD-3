const { cmd } = require('../command');

cmd({
    pattern: "preply",
    alias: ["pvt", "dmreply"],
    desc: "Send a private message to a group member.",
    category: "group",
    use: ".preply @user <message> or reply to a message",
    react: "📩",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, text, args, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");

        // Identify the target user (Tagged, Replied, or via Number)
        let targetUser = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
        
        // Extract the message text
        let messageText = text;
        if (m.mentionedJid[0]) {
            // Remove the tag from the text to get only the message
            messageText = text.replace(/@(\d+)/g, "").trim();
        }

        if (!targetUser) return reply("❌ Please *tag* someone or *reply* to their message to send a private reply.");
        if (!messageText) return reply("❌ Please provide a message to send.");

        // 1. Send message to the target user's private chat
        const privateMsg = `
📬 *PRIVATE REPLY FROM GROUP*

*From Group:* ${m.groupMetadata ? m.groupMetadata.subject : "Group Chat"}
*Sender:* ${m.pushName}

*Message:*
${messageText}

> *Sent via RAHEEM-XMD System*
`;

        await conn.sendMessage(targetUser, { text: privateMsg });

        // 2. Confirm to the group that the message was sent
        return await reply(`✅ Message has been sent privately to @${targetUser.split('@')[0]}`, {
            mentions: [targetUser]
        });

    } catch (e) {
        console.error(e);
        reply("❌ Failed to send private message. The user may have blocked the bot.");
    }
});
