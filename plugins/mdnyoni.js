 const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "detail",
    desc: "Get user details from replied message (works in both group and DM)",
    category: "tools",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isGroup }) => {
    try {
        // 1. CHECK: Is there a reply?
        if (!reply) {
            return await conn.sendMessage(from, { 
                text: `📝 *Reply to a message to get user details!*\n\nExample: .detail (when replying to a message)` 
            }, { quoted: mek });
        }

        // 2. GET: Message info from reply
        const quotedMsg = mek.message.extendedTextMessage;
        const targetUserJid = quotedMsg.contextInfo.participant || quotedMsg.contextInfo.remoteJid;
        
        if (!targetUserJid) {
            return await conn.sendMessage(from, { 
                text: "❌ *Unable to get user information!*\n\nMake sure you replied to a valid message." 
            }, { quoted: mek });
        }

        // 3. GET: User information
        const userNumber = targetUserJid.split('@')[0];
        const userInfo = await conn.fetchStatus(targetUserJid).catch(() => ({name: 'Not Available', status: 'No Status'}));
        const profilePic = await conn.profilePictureUrl(targetUserJid, 'image').catch(() => null);
        
        // 4. FORMAT: User details display
        const detailMessage = `
╭───「 📋 USER DETAILS 」───╮
│
│ 👤 *NAME:* ${userInfo.name || 'Not Available'}
│ 📞 *PHONE:* WhatsApp Privacy Restricted
│ 🔑 *USER ID:* ${targetUserJid}
│ 📝 *ABOUT:* ${userInfo.status || 'No Status'}
│ 📅 *LAST SEEN:* ${userInfo.time ? new Date(userInfo.time).toLocaleString() : 'Unknown'}
│ 🌐 *TYPE:* ${isGroup ? 'Group Member' : 'Direct Contact'}
│
╰─────────────────────────╯

💡 *Note:* WhatsApp restricts phone number access for privacy reasons.
📸 *Profile Picture:* ${profilePic ? 'Available below' : 'Not available or private'}
        `.trim();

        // 5. SEND: Message with or without picture
        if (profilePic) {
            await conn.sendMessage(
                from,
                {
                    image: { url: profilePic },
                    caption: detailMessage,
                    contextInfo: {
                        mentionedJid: [targetUserJid],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                },
                { quoted: mek }
            );
        } else {
            await conn.sendMessage(
                from,
                {
                    text: detailMessage,
                    contextInfo: {
                        mentionedJid: [targetUserJid],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                },
                { quoted: mek }
            );
        }

        // 6. ADD: Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        console.error("DETAIL COMMAND ERROR:", error);
        
        await conn.sendMessage(from, { 
            text: `❌ *Error getting details!*\n\nReason: ${error.message || 'Unknown error'}\n\nTry again or contact support if issue persists.` 
        }, { quoted: mek });
    }
});
