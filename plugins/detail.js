 const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "detail",
    alias: ["info", "whois", "userinfo", "profile"],
    desc: "Get WhatsApp user details from replied message",
    category: "tools",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isGroup, pushName, prefix }) => {
    try {
        // Check if there's a reply
        if (!reply) {
            return await conn.sendMessage(from, { 
                text: `📝 *REPLY TO A MESSAGE!*\n\nUsage: Reply to someone's message then type:\n${prefix}detail\n\nExample:\n1. Reply to their message\n2. Type .detail\n3. Send` 
            }, { quoted: mek });
        }

        // Get the target user JID from the replied message
        const quotedMsg = mek.message.extendedTextMessage;
        let targetUserJid = null;
        
        if (quotedMsg?.contextInfo?.participant) {
            // Message in group
            targetUserJid = quotedMsg.contextInfo.participant;
        } else if (quotedMsg?.contextInfo?.remoteJid) {
            // Direct message
            targetUserJid = quotedMsg.contextInfo.remoteJid;
        } else {
            return await conn.sendMessage(from, { 
                text: "❌ *CANNOT GET USER INFO!*\n\nMake sure you replied to a valid WhatsApp message." 
            }, { quoted: mek });
        }

        // Extract phone number (may be hidden by WhatsApp)
        const phoneNumber = targetUserJid.split('@')[0];
        
        // Get user information from WhatsApp
        console.log(`Fetching details for: ${targetUserJid}`);
        
        let userInfo = {};
        let profilePicUrl = null;
        let lastSeen = null;
        let aboutText = "Not set";
        
        try {
            // Try to get profile status (About)
            const status = await conn.fetchStatus(targetUserJid).catch(() => null);
            if (status) {
                userInfo.name = status.name || "Not Available";
                aboutText = status.status || "Not set";
                lastSeen = status.time ? new Date(status.time) : null;
            }
            
            // Try to get profile picture
            profilePicUrl = await conn.profilePictureUrl(targetUserJid, 'image').catch(() => null);
            
            // Try to get presence (online status)
            const presence = await conn.presenceSubscribe(targetUserJid).catch(() => null);
            
        } catch (fetchError) {
            console.log("Some info not available:", fetchError.message);
        }

        // Get current user (you) info for comparison
        const yourNumber = sender.split('@')[0];
        const yourName = pushName || "You";
        
        // Format last seen time
        let lastSeenText = "Hidden or never set";
        if (lastSeen) {
            const now = new Date();
            const diffMs = now - lastSeen;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            
            if (diffMins < 60) {
                lastSeenText = `${diffMins} minutes ago`;
            } else if (diffHours < 24) {
                lastSeenText = `${diffHours} hours ago`;
            } else {
                lastSeenText = `${diffDays} days ago`;
            }
        }

        // Check if number is visible or hidden by WhatsApp
        const isNumberVisible = phoneNumber.length >= 9 && !phoneNumber.includes('-');
        const numberDisplay = isNumberVisible ? `+${phoneNumber}` : "Hidden by WhatsApp";
        
        // Create detailed message
        const detailMessage = `
╭───「 📋 WHATSAPP USER DETAILS 」───╮
│
│ 👤 *BASIC INFORMATION:*
│ ├ Name: ${userInfo.name || "Not Available"}
│ ├ Phone: ${numberDisplay}
│ ├ User ID: ${targetUserJid}
│ └ Account Type: ${isGroup ? "Group Member" : "Direct Contact"}
│
│ 📝 *PROFILE INFO:*
│ ├ About/Bio: ${aboutText}
│ ├ Last Seen: ${lastSeenText}
│ ├ Profile Pic: ${profilePicUrl ? "Available ✅" : "Not set ❌"}
│ └ Privacy: ${isNumberVisible ? "Some info public" : "Most info private"}
│
│ 🔍 *YOUR INFO (For comparison):*
│ ├ Your Name: ${yourName}
│ ├ Your Number: +${yourNumber}
│ └ Chat Type: ${isGroup ? "Group Chat" : "Private Chat"}
│
│ 📊 *WHATSAPP LIMITATIONS:*
│ ✅ *Available:* Name, About, Profile Pic
│ ⚠️ *Sometimes:* Last Seen, Phone Number
│ ❌ *Never:* Exact location, Call logs, Messages
│
╰─────────────────────────╯

🔒 *PRIVACY NOTES:*
• WhatsApp hides phone numbers in groups
• Users can hide Last Seen in settings
• Profile pictures can be set to private
• All info shown is what user made public

📱 *USER'S PRIVACY SETTINGS DETECTED:*
${getPrivacyAnalysis(isNumberVisible, lastSeen, profilePicUrl)}

🔄 *Try also:* ${prefix}profile - For your own profile info
        `.trim();

        // Function to analyze privacy settings
        function getPrivacyAnalysis(numVisible, seenTime, hasPic) {
            let analysis = "";
            
            if (!numVisible) analysis += "• Phone: Hidden (default)\n";
            else analysis += "• Phone: Visible (uncommon)\n";
            
            if (!seenTime) analysis += "• Last Seen: Hidden\n";
            else analysis += "• Last Seen: Visible\n";
            
            if (!hasPic) analysis += "• Profile Pic: Hidden or not set\n";
            else analysis += "• Profile Pic: Visible\n";
            
            return analysis;
        }

        // Prepare message payload
        const messagePayload = {
            contextInfo: {
                mentionedJid: [targetUserJid],
                forwardingScore: 999,
                isForwarded: true
            }
        };

        // Send with profile picture if available
        if (profilePicUrl) {
            try {
                messagePayload.image = { url: profilePicUrl };
                messagePayload.caption = detailMessage;
            } catch (imgError) {
                console.log("Could not load profile image");
                messagePayload.text = detailMessage;
            }
        } else {
            messagePayload.text = detailMessage;
        }

        // Send the details
        await conn.sendMessage(from, messagePayload, { quoted: mek });

        // Add success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

        // Log for debugging
        console.log(`Details sent for ${targetUserJid.substring(0, 10)}...`);

    } catch (error) {
        console.error("DETAIL CMD ERROR:", error);
        
        let errorMessage = "❌ *ERROR GETTING DETAILS!*\n\n";
        
        if (error.message.includes("Not authorized")) {
            errorMessage += "WhatsApp restricted this information.\n";
            errorMessage += "The user may have strict privacy settings.\n\n";
            errorMessage += "🔒 *What you can try:*\n";
            errorMessage += "1. Ask the user directly\n";
            errorMessage += "2. Check if they're in your contacts\n";
            errorMessage += "3. Some info is only for contacts\n";
        } else if (error.message.includes("404")) {
            errorMessage += "User not found or account deleted.\n";
        } else {
            errorMessage += `Technical error: ${error.message}\n`;
        }
        
        errorMessage += `\nTry: ${prefix}profile - to see your own details`;
        
        await conn.sendMessage(from, { 
            text: errorMessage 
        }, { quoted: mek });
    }
});

// ============================================
// BONUS: PROFILE COMMAND FOR YOUR OWN INFO
// ============================================

cmd({
    pattern: "profile",
    alias: ["myinfo", "mydetails", "me"],
    desc: "See your own WhatsApp profile details",
    category: "tools",
    react: "👤",
    filename: __filename
}, async (conn, mek, m, { from, sender, pushName, prefix }) => {
    try {
        const yourJid = sender;
        const yourNumber = sender.split('@')[0];
        const yourName = pushName || "Unknown";
        
        // Get your own info
        let yourAbout = "Not set";
        let yourProfilePic = null;
        let yourStatus = null;
        
        try {
            const status = await conn.fetchStatus(yourJid).catch(() => null);
            if (status) {
                yourAbout = status.status || "Not set";
                yourStatus = status;
            }
            
            yourProfilePic = await conn.profilePictureUrl(yourJid, 'image').catch(() => null);
            
        } catch (fetchError) {
            console.log("Could not fetch some profile info:", fetchError.message);
        }

        const profileMessage = `
╭───「 👤 YOUR WHATSAPP PROFILE 」───╮
│
│ 📱 *ACCOUNT INFO:*
│ ├ Name: ${yourName}
│ ├ Number: +${yourNumber}
│ ├ User ID: ${yourJid}
│ └ Bot: ${config.BOT_NAME || "Unknown"}
│
│ 📝 *PROFILE SETTINGS:*
│ ├ About/Bio: ${yourAbout}
│ ├ Profile Pic: ${yourProfilePic ? "Set ✅" : "Not set"}
│ ├ Last Updated: ${yourStatus?.time ? new Date(yourStatus.time).toLocaleString() : "Unknown"}
│ └ Privacy: Personal settings
│
│ 🔧 *BOT PERMISSIONS:*
│ ├ Read your info: ✅ Yes
│ ├ Read others' info: ⚠️ Limited
│ ├ See profile pics: ✅ If public
│ └ See contacts: ❌ No
│
│ 📊 *WHAT OTHERS SEE:*
│ • Your name: ${yourName}
│ • Your about: ${yourAbout.substring(0, 50)}${yourAbout.length > 50 ? '...' : ''}
│ • Your profile pic: ${yourProfilePic ? 'Visible' : 'Hidden/Not set'}
│ • Your number: +${yourNumber}
│
╰─────────────────────────╯

💡 *PRIVACY TIPS:*
1. Your phone number is always visible to contacts
2. You can hide Last Seen in WhatsApp Settings
3. Profile picture can be set to "Contacts only"
4. About text is public to all WhatsApp users

🔍 *See someone else's info:* ${prefix}detail (reply to their message)

⚠️ *Remember:* Respect others' privacy as you'd want yours respected.
        `.trim();

        const messagePayload = {
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        };

        // Include profile picture if available
        if (yourProfilePic) {
            try {
                messagePayload.image = { url: yourProfilePic };
                messagePayload.caption = profileMessage;
            } catch (imgError) {
                messagePayload.text = profileMessage;
            }
        } else {
            messagePayload.text = profileMessage;
        }

        await conn.sendMessage(from, messagePayload, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "👤", key: mek.key }
        });

    } catch (error) {
        console.error("PROFILE CMD ERROR:", error);
        await conn.sendMessage(from, { 
            text: `❌ Error getting your profile: ${error.message}` 
        }, { quoted: mek });
    }
});

// ============================================
// BONUS: PRIVACY CHECK COMMAND
// ============================================

cmd({
    pattern: "privacycheck",
    alias: ["privacyscan", "checkprivacy"],
    desc: "Check what info you're sharing on WhatsApp",
    category: "tools",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, sender, pushName, prefix }) => {
    try {
        const privacyMessage = `
╭───「 🔍 WHATSAPP PRIVACY CHECK 」───╮
│
│ 📱 *YOUR VISIBLE INFORMATION:*
│ 
│ 1. *ALWAYS VISIBLE TO EVERYONE:*
│    • Profile Name ✅
│    • Profile Picture ⚠️ (can hide)
│    • About/Bio ✅
│    • WhatsApp Business label (if business)
│ 
│ 2. *VISIBLE TO CONTACTS ONLY (Default):*
│    • Last Seen ✅
│    • Online Status ✅  
│    • Read Receipts ✅
│    • Live Location (when shared) ✅
│ 
│ 3. *HIDDEN BY DEFAULT:*
│    • Phone Number ❌ (except to contacts)
│    • Status Updates ❌ (24h disappear)
│    • Groups you're in ❌
│    • Block list ❌
│
│ 🔐 *HOW TO CHANGE PRIVACY SETTINGS:*
│ 
│ 📍 On WhatsApp:
│ 1. Tap ⋮ (Menu) → Settings
│ 2. Tap Account → Privacy
│ 3. Adjust each setting:
│    • Last seen: Everyone/Contacts/Nobody
│    • Profile photo: Everyone/Contacts/Nobody
│    • About: Everyone/Contacts/Nobody
│    • Groups: Everyone/My Contacts
│
╰─────────────────────────╯

⚖️ *PRIVACY LAWS (Tanzania):*
• You own your personal data
• You control who sees your info
• Companies must protect your data
• You can request data deletion

🛡️ *RECOMMENDED SETTINGS:*
• Last Seen: Contacts
• Profile Photo: Contacts  
• About: Everyone (optional)
• Groups: My Contacts
• Live Location: Share manually only

📚 *Learn more:*
• WhatsApp Privacy Policy: https://www.whatsapp.com/privacy
• Tanzania Data Protection: https://www.dpc.go.tz

${prefix}detail - See what others can see about you
        `.trim();

        await conn.sendMessage(from, { 
            text: privacyMessage 
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "🔒", key: mek.key }
        });

    } catch (error) {
        console.error("PRIVACYCHECK ERROR:", error);
    }
});
