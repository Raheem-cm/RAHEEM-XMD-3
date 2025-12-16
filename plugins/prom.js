 const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "promo",
    alias: ["offer", "freebot", "deployoffer"],
    desc: "Promote free bot deployment offer for 3 people",
    category: "promotion",
    react: "🎁",
    filename: __filename
}, async (conn, mek, m, { from, sender, prefix, isGroup }) => {
    try {
        // 1. CHECK: Only works in groups
        if (!isGroup) {
            return await conn.sendMessage(from, { 
                text: `⚠️ *This promotion is for groups only!*\n\nShare this in your groups to find interested people.` 
            }, { quoted: mek });
        }

        // 2. PROMOTION DETAILS
        const promoNumber = "255760003443";
        const botName = config.BOT_NAME || "RAHEEM-XMD-3";
        const offerDuration = 15; // minutes
        const slotsAvailable = 3;
        
        // 3. CALCULATE: Expiry time
        const now = new Date();
        const expiryTime = new Date(now.getTime() + (offerDuration * 60 * 1000));
        const expiryTimeStr = expiryTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });

        // 4. CREATE: Urgent promotion message
        const promoMessage = `
╔═══════════════════════════════════╗
║        🚨 *URGENT OFFER!* 🚨       ║
╚═══════════════════════════════════╝

🎁 *FREE BOT DEPLOYMENT*
🤖 *Bot:* ${botName}
👥 *Slots:* ${slotsAvailable} PEOPLE ONLY!
⏰ *Duration:* ${offerDuration} MINUTES ONLY!
🕐 *Expires:* ${expiryTimeStr}

═══════════════════════════════════

📋 *REQUIREMENTS:*
1. Must have active WhatsApp number
2. Basic knowledge of bot usage
3. Willing to test and provide feedback

═══════════════════════════════════

📞 *HOW TO APPLY:*
1. *INBOX* this number: *${promoNumber}*
2. Message: "FREE BOT DEPLOYMENT"
3. Include your name and timezone
4. Wait for deployment instructions

═══════════════════════════════════

⚡ *IMMEDIATE PROCESS:*
• First ${slotsAvailable} valid requests
• Bot setup within 15 minutes
• Full guidance provided
• 100% FREE - No charges!

═══════════════════════════════════

📢 *SHARE THIS MESSAGE!*
Tag friends who need a WhatsApp bot!

🔁 *Use* ${prefix}promo *to repost*
🎯 *Limited to first ${slotsAvailable} people!*

═══════════════════════════════════

💡 *Note:* This is a promotional offer by ${botName} team.
    `.trim();

        // 5. SEND: Promotion message with mention all
        await conn.sendMessage(
            from,
            {
                text: promoMessage,
                contextInfo: {
                    mentionedJid: await getAllParticipants(conn, from),
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

        // 6. ADD: Countdown reminder (optional)
        setTimeout(async () => {
            try {
                await conn.sendMessage(from, {
                    text: `⏰ *OFFER ENDING SOON!*\n\nOnly ${offerDuration} minutes left for FREE bot deployment!\n\nMessage *${promoNumber}* NOW!`
                });
            } catch (e) {
                console.log("Reminder not sent");
            }
        }, (offerDuration - 5) * 60 * 1000); // 5 minutes before end

        // 7. LOG: Promotion activity
        console.log(`📢 Promotion posted by ${sender} in group ${from}`);

    } catch (error) {
        console.error("PROMO COMMAND ERROR:", error);
        await conn.sendMessage(from, { 
            text: `❌ *Promotion failed!*\n\nError: ${error.message}` 
        }, { quoted: mek });
    }
});

// Helper function to get all participants
async function getAllParticipants(conn, groupJid) {
    try {
        const groupMetadata = await conn.groupMetadata(groupJid);
        return groupMetadata.participants.map(p => p.id);
    } catch (error) {
        return [];
    }
}

// ====================
// BONUS: SLOTS CHECKER
// ====================

const applications = new Map();

cmd({
    pattern: "slots",
    alias: ["checkoffer", "availability"],
    desc: "Check available slots for free bot deployment",
    category: "promotion",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from, isGroup }) => {
    try {
        if (!isGroup) {
            return await conn.sendMessage(from, { 
                text: "📊 *Check group slots only*" 
            }, { quoted: mek });
        }

        const slotsAvailable = 3;
        const usedSlots = applications.get(from) || 0;
        const remainingSlots = Math.max(0, slotsAvailable - usedSlots);

        const slotsMessage = `
╭───「 🎯 SLOTS AVAILABILITY 」───╮
│
│ 🤖 *Bot:* ${config.BOT_NAME || "RAHEEM-XMD-3"}
│ 📞 *Contact:* 255760003443
│
│ 📊 *STATUS:*
│ ├ Total Slots: ${slotsAvailable}
│ ├ Used Slots: ${usedSlots}
│ └ Remaining: ${remainingSlots}
│
│ ${remainingSlots > 0 ? 
    `✅ *SLOTS AVAILABLE!*\n│ Message 255760003443 NOW!` : 
    `❌ *ALL SLOTS TAKEN!*\n│ Wait for next promotion`}
│
╰─────────────────────────────╯

${remainingSlots > 0 ? 
`⚡ *Hurry!* ${remainingSlots} slot${remainingSlots > 1 ? 's' : ''} remaining!` :
`📅 Next promotion coming soon...`}
        `.trim();

        await conn.sendMessage(from, { 
            text: slotsMessage 
        }, { quoted: mek });

    } catch (error) {
        console.error("SLOTS CHECK ERROR:", error);
    }
});

// ====================
// BONUS: APPLY COMMAND
// ====================

cmd({
    pattern: "apply",
    alias: ["requestbot", "iwantbot"],
    desc: "Apply for free bot deployment",
    category: "promotion",
    react: "📝",
    filename: __filename
}, async (conn, mek, m, { from, sender, name, isGroup }) => {
    try {
        const userName = name || "User";
        const userNumber = sender.split('@')[0];
        const promoNumber = "255760003443";
        
        const applyMessage = `
╭───「 📝 APPLICATION RECEIVED 」───╮
│
│ 👤 *Applicant:* ${userName}
│ 📞 *Number:* +${userNumber}
│ 🕐 *Time:* ${new Date().toLocaleTimeString()}
│
╰──────────────────────────────╯

✅ *YOUR APPLICATION IS RECORDED!*

📋 *NEXT STEPS:*
1. Message *${promoNumber}* on WhatsApp
2. Say "Applied via ${config.BOT_NAME || 'XMD-3'} Bot"
3. Wait for deployment instructions

⏰ *Response within 15 minutes*

🔔 *You'll receive confirmation soon!*
        `.trim();

        // Track application
        const groupApps = applications.get(from) || 0;
        applications.set(from, groupApps + 1);

        await conn.sendMessage(from, { 
            text: applyMessage,
            contextInfo: {
                mentionedJid: [sender]
            }
        }, { quoted: mek });

        // Send to applicant privately too
        try {
            await conn.sendMessage(sender, {
                text: `📬 *Application Confirmation*\n\nThank you for applying! Please message ${promoNumber} to complete your free bot deployment request.`
            });
        } catch (e) {
            // Can't message privately
        }

    } catch (error) {
        console.error("APPLY ERROR:", error);
    }
});
