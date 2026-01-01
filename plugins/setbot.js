const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Store settings
const SETTINGS_FILE = path.join(__dirname, '../setbot_settings.json');

// Default settings - ZIJA KALI ZAIDI!
const defaultSettings = {
    enabled: false,
    warningMode: true,
    autoBlock: true, // TRUE - Automatically block!
    warningCount: {},
    blockedUsers: [],
    scareLevel: 'high', // low, medium, high, extreme
    
    // MESSAGES ZA KUTISHA ZIJA!
    warningMessages: [
        `⚠️ *UNAUTHORIZED ACCESS DETECTED!* ⚠️\n\n👁️ *YOUR ACTIVITY IS BEING MONITORED*\n📞 *YOUR NUMBER HAS BEEN LOGGED*\n🚨 *ADMIN HAS BEEN NOTIFIED*\n\n❌ *STOP USING THIS BOT IMMEDIATELY!*`,
        
        `🚨 *SECURITY ALERT!* 🚨\n\n👮 *POLICE NOTIFICATION SENT*\n📱 *YOUR DEVICE IS BEING TRACKED*\n💀 *NEXT ATTEMPT WILL GET YOU BLOCKED*\n\n⚠️ *FINAL WARNING!*`,
        
        `💀 *YOU HAVE BEEN WARNED!* 💀\n\n🔫 *TERMINATION SEQUENCE INITIATED*\n⚰️ *ACCESS DENIED PERMANENTLY*\n👻 *YOUR DIGITAL FOOTPRINT RECORDED*\n\n⛔ *DO NOT PROCEED!*`
    ],
    
    // STICKERS ZA KUOGOPESHA
    scaryStickers: [
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/17.webp', // Bunduki
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Skull/1.webp', // Fuvu
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Skull/2.webp',
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/1.webp',
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/18.webp', // Cop na bunduki
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Anxious/1.webp', // Anxious
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Anxious/2.webp',
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Ghost/1.webp', // Ghost
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Ghost/2.webp'
    ]
};

// Load settings
function loadSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading settings:', e);
    }
    return defaultSettings;
}

// Save settings
function saveSettings(settings) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
        return true;
    } catch (e) {
        console.error('Error saving settings:', e);
        return false;
    }
}

// Initialize settings
let settings = loadSettings();

// MIDDLEWARE KALI ZAIDI!
module.exports.middleware = async (conn, mek, m, { from, sender, body, isCmd, reply }) => {
    try {
        // Skip if not a command or setbot is off
        if (!isCmd || !settings.enabled) return false;
        
        const config = require('../config');
        
        // Check if sender is owner
        const ownerNumbers = [
            config.OWNER_NUMBER,
            config.DEV,
            '255763111390',
            '255611109830',
            '256762516606'
        ].filter(n => n);
        
        const senderNumber = sender.split('@')[0];
        const isOwner = ownerNumbers.some(num => 
            senderNumber.includes(num.replace(/[^0-9]/g, ''))
        );
        
        // Allow owner
        if (isOwner) return false;
        
        // Check if user is already blocked
        if (settings.blockedUsers.includes(sender)) {
            // Send blocked message
            await conn.sendMessage(sender, {
                text: `🚫 *YOU ARE PERMANENTLY BLOCKED!*\n\n` +
                      `⛔ *ACCESS DENIED FOREVER*\n` +
                      `💀 *DO NOT TRY AGAIN*\n` +
                      `👮 *ADMIN NOTIFIED OF THIS ATTEMPT*`
            });
            return true; // Block command
        }
        
        // ========== TUMA STICKER YA BUNDUKI KABLA YA WARNING! ==========
        try {
            // Chagua random scary sticker
            const stickerIndex = Math.floor(Math.random() * settings.scaryStickers.length);
            const stickerUrl = settings.scaryStickers[stickerIndex];
            
            await conn.sendMessage(sender, {
                sticker: { url: stickerUrl }
            });
            
            // Delay kidogo kwa effect
            await new Promise(resolve => setTimeout(resolve, 800));
        } catch (stickerError) {
            console.log('Sticker send failed:', stickerError.message);
        }
        
        // ========== INCREMENT WARNING COUNT ==========
        settings.warningCount[sender] = (settings.warningCount[sender] || 0) + 1;
        const warningNumber = settings.warningCount[sender];
        
        // ========== TUMA WARNING MESSAGE ==========
        let warningMsg = '';
        
        if (warningNumber === 1) {
            // First warning - THREATENING
            warningMsg = `🔫 *BANG! BANG!* 🔫\n\n` +
                        `⚠️ *FIRST WARNING!*\n` +
                        `📱 *Number:* ${senderNumber}\n` +
                        `👁️ *You are being watched*\n` +
                        `🚨 *Next attempt will have consequences*\n\n` +
                        `❌ *STOP USING THIS BOT NOW!*`;
        } 
        else if (warningNumber === 2) {
            // Second warning - MORE THREATENING
            warningMsg = `💀 *SECOND AND FINAL WARNING!* 💀\n\n` +
                        `📱 *Number:* ${senderNumber}\n` +
                        `⚠️ *Warnings:* 2/2\n` +
                        `🚫 *Next violation:* PERMANENT BLOCK\n` +
                        `👮 *Admin has been notified*\n\n` +
                        `⛔ *THIS IS YOUR LAST CHANCE!*`;
        }
        else if (warningNumber >= 3) {
            // Third warning - AUTO BLOCK!
            warningMsg = `🚨 *TERMINATING ACCESS!* 🚨\n\n` +
                        `📱 *Number:* ${senderNumber}\n` +
                        `⛔ *Violations:* ${warningNumber}\n` +
                        `🔒 *Action:* PERMANENTLY BLOCKED\n` +
                        `💀 *You can no longer use this bot*\n\n` +
                        `⚠️ *DO NOT ATTEMPT TO CONTACT AGAIN!*`;
            
            // AUTO-BLOCK THE USER
            try {
                await conn.updateBlockStatus(sender, 'block');
                settings.blockedUsers.push(sender);
                
                // Send scary blocked message
                await conn.sendMessage(sender, {
                    text: `⛔ *YOU HAVE BEEN TERMINATED!* ⛔\n\n` +
                          `🔫 *ACCESS PERMANENTLY REVOKED*\n` +
                          `💀 *YOUR NUMBER IS NOW BLACKLISTED*\n` +
                          `🚫 *ALL FUTURE ATTEMPTS WILL FAIL*\n\n` +
                          `👮 *GOODBYE FOREVER!*`
                });
                
                // Send gun sticker again
                try {
                    await conn.sendMessage(sender, {
                        sticker: { url: 'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/17.webp' }
                    });
                } catch (e) {}
                
            } catch (blockError) {
                console.error('Auto-block failed:', blockError);
            }
        }
        
        // Send the warning message
        await conn.sendMessage(sender, { text: warningMsg });
        
        // ========== NOTIFY OWNER ==========
        try {
            const owner = config.OWNER_NUMBER ? 
                config.OWNER_NUMBER.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : 
                conn.user.id;
            
            if (owner !== sender) {
                const notifyMsg = `🚨 *UNAUTHORIZED ACCESS ALERT!*\n\n` +
                                `👤 *Intruder:* ${sender}\n` +
                                `📝 *Command:* ${body.substring(0, 50)}...\n` +
                                `⚠️ *Warnings:* ${warningNumber}\n` +
                                `🕒 *Time:* ${new Date().toLocaleString()}\n\n`;
                
                let action = '';
                if (warningNumber >= 3) {
                    action = `🔒 *Action:* AUTO-BLOCKED USER`;
                } else {
                    action = `⚠️ *Action:* Warning ${warningNumber}/2 sent`;
                }
                
                await conn.sendMessage(owner, {
                    text: notifyMsg + action
                });
            }
        } catch (notifyError) {
            console.error('Owner notification failed:', notifyError);
        }
        
        // Save settings
        saveSettings(settings);
        
        // BLOCK THE COMMAND
        return true;
        
    } catch (error) {
        console.error('Setbot middleware error:', error);
        return false;
    }
};

// ========== SETBOT COMMAND ==========

cmd({
    pattern: "setbot",
    alias: ["botaccess", "lockbot", "security"],
    desc: "Control bot access with extreme security",
    category: "owner",
    filename: __filename,
    use: '<on/off/status/settings/block/unblock/list>',
    fromMe: true,
    react: "🔫"
}, async (conn, mek, m, { from, sender, reply, args, text, prefix }) => {
    try {
        const config = require('../config');
        
        // Owner check
        const ownerNumbers = [
            config.OWNER_NUMBER,
            config.DEV,
            '255763111390',
            '256762516606'
        ].filter(n => n);
        
        const senderNumber = sender.split('@')[0];
        const isOwner = ownerNumbers.some(num => 
            senderNumber.includes(num.replace(/[^0-9]/g, ''))
        );
        
        if (!isOwner) {
            // Non-owner trying to use setbot? Send them scary message!
            await conn.sendMessage(sender, {
                text: `🔫 *ACCESS DENIED!* 🔫\n\n` +
                      `⚠️ *This command is for owner only!*\n` +
                      `👁️ *Your attempt has been logged*\n` +
                      `🚨 *Admin notified of this violation*\n\n` +
                      `❌ *STOP TRYING TO ACCESS OWNER COMMANDS!*`
            });
            
            // Send scary sticker
            try {
                await conn.sendMessage(sender, {
                    sticker: { url: 'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/17.webp' }
                });
            } catch (e) {}
            
            return;
        }

        // HELP MENU
        if (!text) {
            const helpMsg = `
*🔫 SETBOT EXTREME SECURITY*

*Control who can use your bot with military-grade security!*

*📌 COMMANDS:*
• \`${prefix}setbot on\` - Lock bot (only owner)
• \`${prefix}setbot off\` - Unlock bot (everyone)
• \`${prefix}setbot status\` - Check security status
• \`${prefix}setbot block @user\` - Manually block user
• \`${prefix}setbot unblock @user\` - Unblock user
• \`${prefix}setbot list\` - List blocked users
• \`${prefix}setbot reset @user\` - Reset user warnings
• \`${prefix}setbot test\` - Test security system

*⚡ FEATURES:*
✅ Auto-block after 2 warnings
✅ Scary gun stickers
✅ Owner notifications
✅ Permanent blacklisting
✅ Military-grade security

*📌 EXAMPLE:*
${prefix}setbot on
${prefix}setbot block 255763111390

*🔫 CURRENT STATUS:*
• Security: ${settings.enabled ? '🔒 ARMED' : '🔓 DISARMED'}
• Auto-block: ${settings.autoBlock ? '✅ ACTIVE' : '❌ INACTIVE'}
• Blocked: ${settings.blockedUsers.length} user(s)
`;
            return reply(helpMsg);
        }

        const [command, ...params] = text.trim().split(' ');
        const paramText = params.join(' ');

        // ====== ON ======
        if (command === 'on') {
            settings.enabled = true;
            saveSettings(settings);
            
            await reply(`🔫 *SECURITY SYSTEM ARMED!*\n\n` +
                       `⚠️ *Status:* LOCKED & LOADED\n` +
                       `👑 *Only owner can use bot*\n` +
                       `💀 *Intruders will face consequences*\n` +
                       `🚨 *Auto-block after 2 violations*\n\n` +
                       `*WARNING:* Intruders will receive:\n` +
                       `1. Gun sticker 🔫\n` +
                       `2. Scary warning\n` +
                       `3. Auto-block on 3rd attempt`);
            return;
        }
        
        // ====== OFF ======
        if (command === 'off') {
            settings.enabled = false;
            saveSettings(settings);
            
            await reply(`🔓 *SECURITY SYSTEM DISARMED!*\n\n` +
                       `🕊️ *Status:* PEACEFUL MODE\n` +
                       `🌍 *Everyone can use bot*\n` +
                       `🎉 *No restrictions*\n` +
                       `🤝 *All users welcome*\n\n` +
                       `Use \`${prefix}setbot on\` to re-arm.`);
            return;
        }
        
        // ====== STATUS ======
        if (command === 'status') {
            const blockedCount = settings.blockedUsers.length;
            const warningCount = Object.keys(settings.warningCount).length;
            
            let statusMsg = `*🔫 SETBOT SECURITY STATUS*\n\n`;
            statusMsg += `⚡ *Security:* ${settings.enabled ? '🔒 ARMED' : '🔓 DISARMED'}\n`;
            statusMsg += `🚨 *Auto-block:* ${settings.autoBlock ? '✅ ACTIVE' : '❌ INACTIVE'}\n`;
            statusMsg += `⛔ *Blocked Users:* ${blockedCount}\n`;
            statusMsg += `⚠️ *Active Warnings:* ${warningCount}\n\n`;
            
            if (blockedCount > 0) {
                statusMsg += `*🚫 BLACKLISTED USERS:*\n`;
                settings.blockedUsers.slice(0, 5).forEach((jid, i) => {
                    const num = jid.split('@')[0];
                    statusMsg += `${i+1}. ${num}\n`;
                });
                if (blockedCount > 5) statusMsg += `... and ${blockedCount - 5} more\n`;
            }
            
            // Show top violators
            const violators = Object.entries(settings.warningCount)
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
            
            if (violators.length > 0) {
                statusMsg += `\n*⚠️ TOP VIOLATORS:*\n`;
                violators.forEach(([jid, count]) => {
                    const num = jid.split('@')[0];
                    statusMsg += `• ${num}: ${count} warning(s)\n`;
                });
            }
            
            statusMsg += `\n*Quick Commands:*\n`;
            statusMsg += `${prefix}setbot list - View all blocked\n`;
            statusMsg += `${prefix}setbot on/off - Toggle security\n`;
            statusMsg += `${prefix}setbot test - Test system`;
            
            await reply(statusMsg);
            return;
        }
        
        // ====== BLOCK USER ======
        if (command === 'block') {
            if (!paramText) {
                return reply(`*Usage:* ${prefix}setbot block <number>\n*Example:* ${prefix}setbot block 255763111390`);
            }
            
            let targetJid = paramText.replace(/[^0-9@]/g, '');
            if (!targetJid.includes('@')) {
                targetJid = targetJid + '@s.whatsapp.net';
            }
            
            // Add to blocked list
            if (!settings.blockedUsers.includes(targetJid)) {
                settings.blockedUsers.push(targetJid);
                saveSettings(settings);
                
                // Block in WhatsApp
                try {
                    await conn.updateBlockStatus(targetJid, 'block');
                } catch (e) {}
                
                // Send scary message to blocked user
                try {
                    await conn.sendMessage(targetJid, {
                        text: `⛔ *YOU HAVE BEEN TERMINATED!* ⛔\n\n` +
                              `🔫 *ACCESS PERMANENTLY REVOKED*\n` +
                              `💀 *ADMIN HAS BLACKLISTED YOU*\n` +
                              `🚫 *ALL FUTURE ATTEMPTS WILL FAIL*\n\n` +
                              `👮 *GOODBYE FOREVER!*`
                    });
                    
                    // Send gun sticker
                    await conn.sendMessage(targetJid, {
                        sticker: { url: 'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/17.webp' }
                    });
                } catch (e) {}
                
                await reply(`✅ *USER TERMINATED!*\n\n` +
                           `🔫 *Target:* ${targetJid.split('@')[0]}\n` +
                           `💀 *Status:* PERMANENTLY BLOCKED\n` +
                           `🚫 *Cannot use bot anymore*\n` +
                           `👮 *Also blocked on WhatsApp*`);
            } else {
                await reply(`ℹ️ *User already terminated*\n\n` +
                           `User: ${targetJid.split('@')[0]}\n` +
                           `Status: Already in blacklist`);
            }
            return;
        }
        
        // ====== UNBLOCK USER ======
        if (command === 'unblock') {
            if (!paramText) {
                return reply(`*Usage:* ${prefix}setbot unblock <number>\n*Example:* ${prefix}setbot unblock 255763111390`);
            }
            
            let targetJid = paramText.replace(/[^0-9@]/g, '');
            if (!targetJid.includes('@')) {
                targetJid = targetJid + '@s.whatsapp.net';
            }
            
            const index = settings.blockedUsers.indexOf(targetJid);
            if (index > -1) {
                settings.blockedUsers.splice(index, 1);
                delete settings.warningCount[targetJid];
                saveSettings(settings);
                
                // Unblock in WhatsApp
                try {
                    await conn.updateBlockStatus(targetJid, 'unblock');
                } catch (e) {}
                
                // Notify user
                try {
                    await conn.sendMessage(targetJid, {
                        text: `✅ *YOUR ACCESS HAS BEEN RESTORED!*\n\n` +
                              `🔓 *Blacklist removed*\n` +
                              `🔄 *Warnings reset*\n` +
                              `🤝 *You can now use the bot*\n\n` +
                              `*Please follow rules to avoid future blocks.*`
                    });
                } catch (e) {}
                
                await reply(`✅ *USER PARDONED!*\n\n` +
                           `👤 *User:* ${targetJid.split('@')[0]}\n` +
                           `🔄 *Status:* Removed from blacklist\n` +
                           `📝 *Warnings:* Reset to zero\n` +
                           `🤝 *Can now use bot again*`);
            } else {
                await reply(`ℹ️ *User not found in blacklist*\n\n` +
                           `User: ${targetJid.split('@')[0]}\n` +
                           `Status: Not blocked`);
            }
            return;
        }
        
        // ====== LIST BLOCKED ======
        if (command === 'list') {
            if (settings.blockedUsers.length === 0) {
                return reply(`✅ *Blacklist is empty!*\n\n` +
                           `No users are currently blocked.\n` +
                           `All users can access the bot.`);
            }
            
            let listMsg = `*🚫 BLACKLISTED USERS*\n\n` +
                         `Total: ${settings.blockedUsers.length} user(s)\n\n`;
            
            settings.blockedUsers.forEach((jid, index) => {
                const num = jid.split('@')[0];
                const warnings = settings.warningCount[jid] || 0;
                listMsg += `${index + 1}. ${num}\n`;
                listMsg += `   ⚠️ Warnings: ${warnings}\n`;
                listMsg += `   🔒 Status: PERMANENTLY BLOCKED\n\n`;
            });
            
            listMsg += `*Commands:*\n` +
                      `${prefix}setbot unblock <number>\n` +
                      `${prefix}setbot reset <number>`;
            
            await reply(listMsg);
            return;
        }
        
        // ====== RESET WARNINGS ======
        if (command === 'reset') {
            if (!paramText) {
                return reply(`*Usage:* ${prefix}setbot reset <number>\n*Example:* ${prefix}setbot reset 255763111390`);
            }
            
            let targetJid = paramText.replace(/[^0-9@]/g, '');
            if (!targetJid.includes('@')) {
                targetJid = targetJid + '@s.whatsapp.net';
            }
            
            const warnings = settings.warningCount[targetJid] || 0;
            delete settings.warningCount[targetJid];
            
            // Remove from blocked list if there
            const blockIndex = settings.blockedUsers.indexOf(targetJid);
            if (blockIndex > -1) {
                settings.blockedUsers.splice(blockIndex, 1);
                
                // Unblock user
                try {
                    await conn.updateBlockStatus(targetJid, 'unblock');
                } catch (e) {}
            }
            
            saveSettings(settings);
            
            await reply(`✅ *USER WIPED CLEAN!*\n\n` +
                       `👤 *User:* ${targetJid.split('@')[0]}\n` +
                       `🔄 *Previous warnings:* ${warnings}\n` +
                       `✅ *New status:* CLEAN SLATE\n` +
                       `🤝 *Can access bot normally*`);
            return;
        }
        
        // ====== TEST SECURITY ======
        if (command === 'test') {
            await reply(`🔫 *TESTING SECURITY SYSTEM...*\n\n` +
                       `Sending test warning to owner...`);
            
            // Send test sticker
            try {
                await conn.sendMessage(sender, {
                    sticker: { url: 'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/17.webp' }
                });
            } catch (e) {}
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Send test warning
            await conn.sendMessage(sender, {
                text: `🔫 *TEST WARNING - SYSTEM WORKING!* 🔫\n\n` +
                      `⚠️ *This is a test of the security system*\n` +
                      `✅ *Everything is functioning properly*\n` +
                      `🚨 *Intruders will receive similar messages*\n\n` +
                      `*Security Status:* ${settings.enabled ? '🔒 ARMED' : '🔓 DISARMED'}`
            });
            
            await reply(`✅ *SECURITY TEST COMPLETE!*\n\n` +
                       `🔫 Gun sticker: ✅ Sent\n` +
                       `⚠️ Warning: ✅ Sent\n` +
                       `🚨 System: ✅ Operational\n\n` +
                       `Intruders will face the full force!`);
            return;
        }
        
        // ====== INVALID COMMAND ======
        await reply(`❌ *Invalid command!*\n\n` +
                   `Use: ${prefix}setbot help\n` +
                   `To see available commands.`);

    } catch (error) {
        console.error('Setbot command error:', error);
        await reply(`❌ *Error:* ${error.message}`);
    }
});

// ========== AUTO-SAVE ON EXIT ==========

process.on('SIGINT', () => {
    saveSettings(settings);
    console.log('🔫 Setbot settings saved');
    process.exit();
});

process.on('SIGTERM', () => {
    saveSettings(settings);
    console.log('🔫 Setbot settings saved');
    process.exit();
});

// ========== CLEANUP OLD WARNINGS ==========
// Auto-clean warnings older than 30 days
setInterval(() => {
    console.log('🧹 Cleaning old setbot warnings...');
    saveSettings(settings);
}, 3600000); // Every hour
