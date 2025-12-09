 const { cmd } = require('../command');

cmd({
    pattern: "prp",
    desc: "Get profile picture of user",
    react: "🖼️",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, reply, text, sender, mentionedJid }) => {
    try {
        let targetUser = "";
        
        // If text is provided (mention or number)
        if (text) {
            // Check if it's a mention
            if (mentionedJid && mentionedJid.length > 0) {
                targetUser = mentionedJid[0];
            } else {
                // Check if it's a phone number
                const phoneRegex = /^[0-9+]+$/;
                if (phoneRegex.test(text)) {
                    // Remove + if present and add @s.whatsapp.net
                    const cleanNumber = text.replace('+', '');
                    targetUser = `${cleanNumber}@s.whatsapp.net`;
                } else {
                    // Assume it's a saved contact name
                    const contacts = conn.contacts;
                    for (const [jid, contact] of Object.entries(contacts)) {
                        if (contact.name && contact.name.toLowerCase().includes(text.toLowerCase())) {
                            targetUser = jid;
                            break;
                        }
                    }
                }
            }
        } else {
            // No text, use sender
            targetUser = sender;
        }
        
        if (!targetUser) {
            return reply(`❌ User not found!\n\nUsage:\n• .prp @mention\n• .prp 255xxxxxxxx\n• .prp [name]\n• .prp (for your own)`);
        }
        
        await reply(`🖼️ *Getting profile picture...*\n⏳ Please wait...`);
        
        try {
            // Get profile picture URL
            const ppUrl = await conn.profilePictureUrl(targetUser, 'image');
            
            if (!ppUrl) {
                return reply(`❌ No profile picture found for this user.`);
            }
            
            // Download the image
            const axios = require('axios');
            const response = await axios.get(ppUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');
            
            // Get user info
            const userInfo = await conn.contacts[targetUser] || {};
            const userName = userInfo.name || userInfo.notify || "Unknown User";
            const userNumber = targetUser.split('@')[0];
            
            // Send the image
            await conn.sendMessage(from, {
                image: imageBuffer,
                caption: `🖼️ *PROFILE PICTURE*\n\n👤 *Name:* ${userName}\n📞 *Number:* ${userNumber}\n📅 *Saved:* ${new Date().toLocaleDateString()}`
            }, { quoted: m });
            
            // Send additional info
            const infoMsg = `
✅ *Profile Picture Downloaded Successfully!*

📋 *User Details:*
• Name: ${userName}
• Number: ${userNumber}
• JID: \`${targetUser}\`

💡 *Tip:* Use .prp without text to get your own profile picture.
`;
            
            await reply(infoMsg);
            
        } catch (fetchError) {
            console.error("Profile picture fetch error:", fetchError);
            
            // Try alternative method
            try {
                // Get user info first
                const userInfo = await conn.contacts[targetUser] || {};
                const userName = userInfo.name || userInfo.notify || "Unknown";
                const userNumber = targetUser.split('@')[0];
                
                return reply(`❌ Cannot get profile picture for ${userName} (${userNumber})\n\nPossible reasons:\n1. User has no profile picture\n2. Privacy settings\n3. User blocked the bot\n\n💡 Try mentioning the user directly: .prp @user`);
            } catch (e) {
                return reply("❌ Error fetching profile picture. User may have privacy settings enabled.");
            }
        }
        
    } catch (e) {
        console.error("PRP Command Error:", e);
        await reply("⚠️ Error getting profile picture. Make sure:\n1. User is in your contacts\n2. User has a profile picture\n3. Bot has necessary permissions");
    }
});
