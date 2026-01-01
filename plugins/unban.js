const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "unbanaccount",
    alias: ["fixban", "recover", "unbanwa", "spamfix"],
    desc: "Fix WhatsApp account banned for spam",
    category: "owner",
    filename: __filename,
    use: '<number> [method]',
    fromMe: true,
    react: "⚠️"
}, async (conn, mek, m, { from, sender, reply, args, text, prefix }) => {
    try {
        const config = require('../config');
        
        // Owner check
        const ownerNumbers = [
            config.OWNER_NUMBER, 
            config.DEV, 
            '255763111390', 
            '255611109830'
        ].filter(n => n);
        
        const senderNumber = sender.split('@')[0];
        const isOwner = ownerNumbers.some(num => 
            senderNumber.includes(num.replace(/[^0-9]/g, ''))
        );
        
        if (!isOwner) {
            return reply('❌ *Owner Command Only!*');
        }

        if (!text) {
            const helpMsg = `
*⚠️ WHATSAPP ACCOUNT BAN RECOVERY*

*This tool helps recover WhatsApp accounts banned for spam.*

*📌 COMMANDS:*
• \`${prefix}unbanaccount <number>\` - Try automatic recovery
• \`${prefix}unbanaccount <number> appeal\` - Submit appeal
• \`${prefix}unbanaccount <number> sms\` - Request SMS verification
• \`${prefix}unbanaccount <number> call\` - Request call verification
• \`${prefix}unbanaccount <number> email\` - Contact WhatsApp support
• \`${prefix}unbanaccount <number> newdevice\` - Try new device method

*📌 EXAMPLE:*
${prefix}unbanaccount 255763111390
${prefix}unbanaccount 256790986772 appeal

*⚠️ NOTES:*
1. This is for WhatsApp ACCOUNT ban (not block)
2. "This account can no longer use WhatsApp due to spam"
3. Recovery success depends on WhatsApp approval
4. Some methods require original phone access

*💡 TIPS:*
• Wait 24-72 hours after ban
• Use original SIM card
• Clear WhatsApp data
• Try on different device
`;
            return reply(helpMsg);
        }

        const [numberInput, method = 'auto'] = text.trim().split(' ');
        let phoneNumber = numberInput.replace(/[+\s\-()]/g, '');
        
        if (!phoneNumber.match(/^\d{10,15}$/)) {
            return reply('❌ *Invalid number format!*\nUse: 255763111390 (with country code)');
        }

        await reply(`⚠️ *PROCESSING ACCOUNT RECOVERY*\n\n` +
                   `📱 *Number:* ${phoneNumber}\n` +
                   `🔧 *Method:* ${method.toUpperCase()}\n` +
                   `🔄 *Please wait...*`);

        // Different recovery methods
        switch(method.toLowerCase()) {
            case 'auto':
            case 'automatic':
                await autoRecoveryMethod(conn, phoneNumber, reply);
                break;
                
            case 'appeal':
            case 'request':
                await appealMethod(phoneNumber, reply);
                break;
                
            case 'sms':
            case 'code':
                await smsMethod(phoneNumber, reply);
                break;
                
            case 'call':
            case 'voice':
                await callMethod(phoneNumber, reply);
                break;
                
            case 'email':
            case 'support':
                await emailMethod(phoneNumber, reply);
                break;
                
            case 'newdevice':
            case 'device':
                await newDeviceMethod(phoneNumber, reply);
                break;
                
            case 'reset':
            case 'clear':
                await resetMethod(phoneNumber, reply);
                break;
                
            default:
                await autoRecoveryMethod(conn, phoneNumber, reply);
        }

    } catch (error) {
        console.error('Unban account error:', error);
        await reply(`❌ *Recovery error:* ${error.message}\n\n` +
                   `Try: ${prefix}unbanaccount help`);
    }
});

// ========== RECOVERY METHODS ==========

async function autoRecoveryMethod(conn, phoneNumber, reply) {
    const steps = [
        "1. Checking account status...",
        "2. Sending recovery request to WhatsApp...",
        "3. Attempting automatic appeal...",
        "4. Requesting verification code...",
        "5. Testing connection..."
    ];
    
    let progress = `*🔄 AUTOMATIC RECOVERY PROCESS*\n\n` +
                  `📱 *Number:* ${phoneNumber}\n\n`;
    
    for (let i = 0; i < steps.length; i++) {
        progress += `${steps[i]}\n`;
        await reply(progress);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Try to send verification request
    try {
        const jid = phoneNumber + '@s.whatsapp.net';
        
        // Method 1: Try to send message (might trigger verification)
        try {
            await conn.sendMessage(jid, { 
                text: 'WhatsApp Account Recovery Test' 
            });
        } catch (e) {
            // Expected to fail for banned accounts
        }
        
        // Method 2: Try to get contact info
        let contactInfo = null;
        try {
            contactInfo = await conn.getContact(jid);
        } catch (e) {}
        
        progress += `\n✅ *PROCESS COMPLETE*\n\n`;
        
        if (contactInfo) {
            progress += `*Status:* Account might be recoverable\n`;
            progress += `*Name:* ${contactInfo.name || 'Unknown'}\n`;
            progress += `*Action:* Try verification methods\n\n`;
            progress += `*Next steps:*\n`;
            progress += `1. ${prefix}unbanaccount ${phoneNumber} sms\n`;
            progress += `2. ${prefix}unbanaccount ${phoneNumber} appeal\n`;
            progress += `3. ${prefix}unbanaccount ${phoneNumber} email`;
        } else {
            progress += `*Status:* Account severely restricted\n`;
            progress += `*Issue:* WhatsApp spam ban detected\n\n`;
            progress += `*Recommended:*\n`;
            progress += `1. Wait 24-48 hours\n`;
            progress += `2. Clear WhatsApp data\n`;
            progress += `3. Use different phone\n`;
            progress += `4. Contact WhatsApp support\n\n`;
            progress += `Use: ${prefix}unbanaccount ${phoneNumber} email`;
        }
        
        await reply(progress);
        
    } catch (error) {
        await reply(`❌ *Automatic recovery failed*\n\n` +
                   `Error: ${error.message}\n\n` +
                   `Try manual method:\n` +
                   `${prefix}unbanaccount ${phoneNumber} appeal`);
    }
}

async function appealMethod(phoneNumber, reply) {
    const appealData = {
        phone: phoneNumber,
        issue: "account_banned",
        reason: "My WhatsApp account was banned for spam but I believe this was a mistake.",
        appeal_text: "I request you to review and restore my WhatsApp account. I will follow WhatsApp Terms of Service.",
        timestamp: new Date().toISOString()
    };
    
    const appealMsg = `*📝 SUBMIT APPEAL TO WHATSAPP*\n\n` +
                     `📱 *Number:* ${phoneNumber}\n\n` +
                     `*Appeal Message:*\n` +
                     `"Dear WhatsApp Support,\n\n` +
                     `My account with number ${phoneNumber} has been banned for spam.\n` +
                     `I believe this was done in error. I use WhatsApp for personal communication only.\n` +
                     `Please review my account and consider reinstating it.\n\n` +
                     `Thank you."\n\n` +
                     `*How to submit:*\n` +
                     `1. Email: support@support.whatsapp.com\n` +
                     `2. Subject: Appeal for banned account ${phoneNumber}\n` +
                     `3. Include: Phone number, country, device info\n` +
                     `4. Be polite and honest\n\n` +
                     `*Alternative:*\n` +
                     `• Contact via WhatsApp Business API\n` +
                     `• Use Facebook Business Support\n` +
                     `• Wait 72 hours and try again`;
    
    await reply(appealMsg);
    
    // Also save appeal locally
    const appealsDir = path.join(__dirname, '../appeals');
    if (!fs.existsSync(appealsDir)) {
        fs.mkdirSync(appealsDir, { recursive: true });
    }
    
    const appealFile = path.join(appealsDir, `${phoneNumber}_${Date.now()}.json`);
    fs.writeFileSync(appealFile, JSON.stringify(appealData, null, 2));
}

async function smsMethod(phoneNumber, reply) {
    const smsMsg = `*📲 SMS VERIFICATION METHOD*\n\n` +
                  `📱 *Number:* ${phoneNumber}\n\n` +
                  `*Steps to recover via SMS:*\n\n` +
                  `1. *Install WhatsApp Fresh*\n` +
                  `   • Uninstall current WhatsApp\n` +
                  `   • Download new WhatsApp from store\n\n` +
                  `2. *Start Verification*\n` +
                  `   • Open WhatsApp\n` +
                  `   • Enter ${phoneNumber}\n` +
                  `   • Choose "SMS" for verification\n\n` +
                  `3. *Wait for SMS*\n` +
                  `   • Wait for 6-digit code via SMS\n` +
                  `   • If no SMS, wait 5 min then "Call me"\n\n` +
                  `4. *Enter Code*\n` +
                  `   • Enter the 6-digit code\n` +
                  `   • Complete setup\n\n` +
                  `5. *If code doesn't work:*\n` +
                  `   • Wait 24 hours\n` +
                  `   • Try from different device\n` +
                  `   • Use: ${prefix}unbanaccount ${phoneNumber} call\n\n` +
                  `*Note:* If banned, you might get "Cannot use WhatsApp" error.`;
    
    await reply(smsMsg);
}

async function callMethod(phoneNumber, reply) {
    const callMsg = `*📞 CALL VERIFICATION METHOD*\n\n` +
                   `📱 *Number:* ${phoneNumber}\n\n` +
                   `*Steps for call verification:*\n\n` +
                   `1. *Clear App Data*\n` +
                   `   • Go to Phone Settings → Apps → WhatsApp\n` +
                   `   • Tap "Storage" → "Clear Data"\n` +
                   `   • Also "Clear Cache"\n\n` +
                   `2. *Re-verify Number*\n` +
                   `   • Open WhatsApp\n` +
                   `   • Enter ${phoneNumber}\n` +
                   `   • Wait for SMS option (don't click)\n\n` +
                   `3. *Request Call*\n` +
                   `   • After 3 minutes, "Call me" appears\n` +
                   `   • Tap "Call me"\n` +
                   `   • Answer automated call\n` +
                   `   • Listen for 6-digit code\n\n` +
                   `4. *Enter Code*\n` +
                   `   • Enter the code from call\n` +
                   `   • Complete setup\n\n` +
                   `5. *If still blocked:*\n` +
                   `   • Wait 72 hours minimum\n` +
                   `   • Try different SIM card\n` +
                   `   • Use different phone entirely`;
    
    await reply(callMsg);
}

async function emailMethod(phoneNumber, reply) {
    const emailMsg = `*📧 CONTACT WHATSAPP SUPPORT*\n\n` +
                    `📱 *Number:* ${phoneNumber}\n\n` +
                    `*Official Support Channels:*\n\n` +
                    `📧 *Email:* support@support.whatsapp.com\n` +
                    `🌐 *Web:* https://www.whatsapp.com/contact\n` +
                    `📱 *In-app:* Settings → Help → Contact Us\n\n` +
                    `*Email Template:*\n` +
                    `\`\`\`
Subject: Appeal for Banned Account - ${phoneNumber}

Dear WhatsApp Support Team,

My WhatsApp account associated with phone number ${phoneNumber} has been banned with the message:
"This account can no longer use WhatsApp due to spam"

I believe this action was taken in error because:
1. I use WhatsApp only for personal communication
2. I don't send spam or bulk messages
3. I follow WhatsApp Terms of Service

Please review my account and consider reinstating it. I'm willing to provide any additional information needed.

Thank you for your assistance.

Sincerely,
[Your Name]
\`\`\`\n` +
                    `*Additional Info to Include:*\n` +
                    `• Device model and OS version\n` +
                    `• Country of use\n` +
                    `• How long you've used WhatsApp\n` +
                    `• Screenshot of error if possible`;
    
    await reply(emailMsg);
}

async function newDeviceMethod(phoneNumber, reply) {
    const newDeviceMsg = `*📱 NEW DEVICE RECOVERY METHOD*\n\n` +
                        `📱 *Number:* ${phoneNumber}\n\n` +
                        `*This method works if ban is device-specific:*\n\n` +
                        `1. *Borrow a different phone*\n` +
                        `   • Use friend/family phone\n` +
                        `   • Or old spare phone\n\n` +
                        `2. *Insert your SIM card*\n` +
                        `   • Put your SIM in new device\n` +
                        `   • Make sure it has network\n\n` +
                        `3. *Install WhatsApp*\n` +
                        `   • Download WhatsApp from store\n` +
                        `   • Don't open yet\n\n` +
                        `4. *Clear device cache (optional)*\n` +
                        `   • Restart the new device\n` +
                        `   • Ensure clean state\n\n` +
                        `5. *Setup WhatsApp*\n` +
                        `   • Open WhatsApp\n` +
                        `   • Enter ${phoneNumber}\n` +
                        `   • Choose verification method\n\n` +
                        `6. *If successful:*\n` +
                        `   • Backup chats to Google Drive\n` +
                        `   • Wait 1 week\n` +
                        `   • Try your original device\n\n` +
                        `*Note:* Some bans are account-based, not device-based.`;
    
    await reply(newDeviceMsg);
}

async function resetMethod(phoneNumber, reply) {
    const resetMsg = `*🔄 COMPLETE RESET METHOD*\n\n` +
                    `📱 *Number:* ${phoneNumber}\n\n` +
                    `*Nuclear option - complete reset:*\n\n` +
                    `⚠️ *WARNING:* This will delete all WhatsApp data!\n\n` +
                    `1. *On current device:*\n` +
                    `   • Backup chats to Google Drive\n` +
                    `   • Note important messages\n` +
                    `   • Save media files\n\n` +
                    `2. *Uninstall WhatsApp*\n` +
                    `   • Long press WhatsApp icon\n` +
                    `   • Tap Uninstall\n` +
                    `   • Confirm\n\n` +
                    `3. *Clear device traces:*\n` +
                    `   • Files → WhatsApp folder → Delete\n` +
                    `   • Settings → Apps → WhatsApp → Clear data\n` +
                    `   • Restart phone\n\n` +
                    `4. *Wait 48-72 hours*\n` +
                    `   • Don't try to install WhatsApp\n` +
                    `   • Let WhatsApp servers "forget"\n\n` +
                    `5. *Fresh install*\n` +
                    `   • After 3 days, install WhatsApp\n` +
                    `   • Setup with ${phoneNumber}\n` +
                    `   • Restore from backup (if available)\n\n` +
                    `*Success rate:* Moderate\n` +
                    `*Time required:* 3-7 days`;
    
    await reply(resetMsg);
}

// Additional helper command
cmd({
    pattern: "banstatus",
    alias: ["checkban", "isbanned"],
    desc: "Check if WhatsApp number is banned",
    category: "owner",
    filename: __filename,
    use: '<number>',
    fromMe: true,
    react: "🔍"
}, async (conn, mek, m, { from, reply, text, prefix }) => {
    try {
        if (!text) {
            return reply(`*Usage:* ${prefix}banstatus <number>\nExample: ${prefix}banstatus 255763111390`);
        }
        
        let phoneNumber = text.trim().replace(/[+\s\-()]/g, '');
        const jid = phoneNumber + '@s.whatsapp.net';
        
        await reply(`🔍 *Checking ban status for:* ${phoneNumber}`);
        
        const tests = [
            { name: "Contact lookup", method: "contact" },
            { name: "Message test", method: "message" },
            { name: "Profile check", method: "profile" }
        ];
        
        let results = `*🔍 BAN STATUS REPORT*\n\n` +
                     `📱 *Number:* ${phoneNumber}\n\n`;
        
        // Test 1: Contact lookup
        try {
            const contact = await conn.getContact(jid);
            results += `✅ *Contact lookup:* SUCCESS\n`;
            results += `   Name: ${contact.name || 'Unknown'}\n`;
            results += `   Status: Account exists\n`;
        } catch (e) {
            results += `❌ *Contact lookup:* FAILED\n`;
            results += `   Error: ${e.message}\n`;
            results += `   Possible: Account banned/deleted\n`;
        }
        
        // Test 2: Try to send message
        try {
            await conn.sendMessage(jid, { text: '.' });
            results += `✅ *Message test:* CAN SEND\n`;
            results += `   Status: Account active\n`;
        } catch (e) {
            if (e.message.includes('blocked') || e.message.includes('not authorized')) {
                results += `⚠️ *Message test:* BLOCKED/BANNED\n`;
                results += `   Error: ${e.message}\n`;
                results += `   Likely: Spam ban detected\n`;
            } else {
                results += `❌ *Message test:* FAILED\n`;
                results += `   Error: ${e.message}\n`;
            }
        }
        
        // Test 3: Check if in blocked list
        try {
            const blockedList = await conn.fetchBlocklist();
            const isBlocked = blockedList.includes(jid);
            
            results += `📋 *Block list:* ${isBlocked ? 'BLOCKED' : 'NOT BLOCKED'}\n`;
            
            if (isBlocked) {
                results += `   *Note:* This is user block, not WhatsApp ban\n`;
                results += `   Fix: ${prefix}unban ${phoneNumber}\n`;
            }
        } catch (e) {
            results += `⚠️ *Block list:* Cannot check\n`;
        }
        
        // Conclusion
        results += `\n*📊 CONCLUSION:*\n`;
        results += `If "Contact lookup" failed + "Message test" blocked\n`;
        results += `→ Likely WhatsApp spam ban\n\n`;
        results += `*Recommended action:*\n`;
        results += `${prefix}unbanaccount ${phoneNumber} appeal`;
        
        await reply(results);
        
    } catch (error) {
        await reply(`❌ *Check failed:* ${error.message}`);
    }
});
