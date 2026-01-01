const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Store settings
const SETTINGS_FILE = path.join(__dirname, '../setbot_settings.json');

// Default settings - KALI ZAIDI!
const defaultSettings = {
    enabled: false,
    warningMode: true,
    autoBlock: true, // TRUE - Automatically block after 2 warnings!
    warningCount: {},
    blockedUsers: [],
    scareLevel: 'extreme',
    
    // MESSAGES ZA KUTISHA
    warningMessages: [
        `⚠️ *UNAUTHORIZED ACCESS DETECTED!* ⚠️\n\n` +
        `👁️ *YOUR ACTIVITY IS BEING MONITORED*\n` +
        `📞 *YOUR NUMBER HAS BEEN LOGGED*\n` +
        `🚨 *ADMIN HAS BEEN NOTIFIED*\n\n` +
        `❌ *STOP USING THIS BOT IMMEDIATELY!*`,

        `🚨 *FINAL WARNING!* 🚨\n\n` +
        `💀 *NEXT ATTEMPT WILL GET YOU BLOCKED*\n` +
        `🔫 *TERMINATION SEQUENCE READY*\n` +
        `⛔ *THIS IS YOUR LAST CHANCE*\n\n` +
        `*DO NOT TEST ME AGAIN!*`
    ],
    
    // STICKER PATHS - WEKA HAPA STICKER ZAKO
    scaryStickers: [
        '../assets/wanteds',      // STICKER YAKO YA WANTED
        '../assets/wanted.json',      // AU HII KAMA NI JSON
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/17.webp', // Fallback 1
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Skull/1.webp',   // Fallback 2
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/18.webp'  // Fallback 3
    ]
};

// Load settings
function loadSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading settinSTK- e);
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

// Function ya kutuma sticker - IMPROVED!
async function sendScarySticker(conn, sender, warningNumber) {
    try {
        let stickerSent = false;
        
        // JARIBU STICKER ZAKO KWAANZA
        for (const stickerPath of settings.scaryStickers) {
            try {
                // Check if local file exists
                if (stickerPath.startsWith('../') || stickerPath.startsWith('./')) {
                    const fullPath = path.join(__dirname, stickerPath);
                    if (fs.existsSync(fullPath)) {
                        // Read local sticker file
                        const stickerBuffer = fs.readFileSync(fullPath);
                        await conn.sendMessage(sender, {
                            sticker: stickerBuffer
                        });
                        stickerSent = true;
                        console.log(`✅ Sent local sticker: ${stickerPath}`);
                        break;
                    }
                } 
                // Jaribu URL
                else if (stickerPath.startsWith('http')) {
                    await conn.sendMessage(sender, {
                        sticker: { url: stickerPath }
                    });
                    stickerSent = true;
                    console.log(`✅ Sent URL sticker: ${stickerPath}`);
                    break;
                }
            } catch (stickerError) {
                console.log(`❌ Failed to send sticker ${stickerPath}:`, stickerError.message);
                // Continue to next sticker
            }
        }
        
        // Fallback kama stickers zote zimeshindwa
        if (!stickerSent) {
            // Send text as fallback
            await conn.sendMessage(sender, {
                text: `🔫 *BANG!* 🔫\n` +
                      `⚠️ *Security Violation Detected!*`
            });
        }
        
    } catch (error) {
        console.error('Sticker sending error:', error);
    }
}

// MIDDLEWARE - KALI ZAIDI!
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
            await sendScarySticker(conn, sender, 'blocked');
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            await conn.sendMessage(sender, {
                text: `🚫 *YOU ARE PERMANENTLY BLOCKED!*\n\n` +
                      `⛔ *ACCESS DENIED FOREVER*\n` +
                      `💀 *DO NOT TRY AGAIN*\n` +
                      `👮 *ADMIN NOTIFIED OF THIS ATTEMPT*\n\n` +
                      `*BLOCK REASON:* Multiple security violations`
            });
            return true;
        }
        
        // ========== INCREMENT WARNING COUNT ==========
        settings.warningCount[sender] = (settings.warningCount[sender] || 0) + 1;
        const warningNumber = settings.warningCount[sender];
        
        // ========== TUMA STICKER KABLA YA WARNING ==========
        await sendScarySticker(conn, sender, warningNumber);
        
        // Delay kidogo kwa dramatic effect
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // ========== TUMA WARNING MESSAGE ==========
        let warningMsg = '';
        let shouldBlock = false;
        
        if (warningNumber === 1) {
            // First warning
            warningMsg = `🔫 *SECURITY VIOLATION!* 🔫\n\n` +
                        `⚠️ *FIRST WARNING!*\n` +
                        `📱 *Violator:* ${senderNumber}\n` +
                        `👁️ *You are being watched*\n` +
                        `📝 *Command attempted:* ${body.substring(0, 30)}...\n\n` +
                        `🚨 *NEXT ATTEMPT = PERMANENT BLOCK!*\n\n` +
                        `❌ *STOP USING THIS BOT NOW!*`;
        } 
        else if (warningNumber >= 2) {
            // SECOND WARNING = AUTO-BLOCK!
            warningMsg = `💀 *FINAL WARNING VIOLATED!* 💀\n\n` +
                        `📱 *Violator:* ${senderNumber}\n` +
                        `⛔ *Violations:* ${warningNumber}\n` +
                        `🔫 *Action:* PERMANENTLY BLOCKED\n` +
                        `🚫 *You can no longer use this bot*\n\n` +
                        `*BLOCK REASON:* Exceeded warning limit`;
            
            shouldBlock = true;
        }
        
        // Send the warning/block message
        await conn.sendMessage(sender, { text: warningMsg });
        
        // ========== AUTO-BLOCK KAMA WARNING 2 AU ZAIDI ==========
        if (shouldBlock) {
            try {
                // 1. Block on WhatsApp
                await conn.updateBlockStatus(sender, 'block');
                
                // 2. Add to blocked list
                settings.blockedUsers.push(sender);
                
                // 3. Send final scary message
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                await conn.sendMessage(sender, {
                    text: `⛔ *YOU HAVE BEEN TERMINATED!* ⛔\n\n` +
                          `🔫 *ACCESS PERMANENTLY REVOKED*\n` +
                          `💀 *YOUR NUMBER IS NOW BLACKLISTED*\n` +
                          `🚫 *ALL FUTURE ATTEMPTS WILL FAIL*\n\n` +
                          `👮 *GOODBYE FOREVER!*\n` +
                          `*Violations:* ${warningNumber}\n` +
                          `*Block time:* ${new Date().toLocaleString()}`
                });
                
                // 4. Send another sticker for final effect
                await new Promise(resolve => setTimeout(resolve, 500));
                await sendScarySticker(conn, sender, 'final');
                
            } catch (blockError) {
                console.error('Auto-block failed:', blockError);
            }
        }
        
        // ========== NOTIFY OWNER ==========
        try {
            const owner = config.OWNER_NUMBER ? 
                config.OWNER_NUMBER.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : 
                conn.user.id;
            
            if (owner !== sender) {
                let notifyMsg = `🚨 *SECURITY ALERT!*\n\n`;
                notifyMsg += `👤 *Intruder:* ${sender}\n`;
                notifyMsg += `📝 *Command:* ${body.substring(0, 50)}...\n`;
                notifyMsg += `⚠️ *Warnings:* ${warningNumber}/2\n`;
                notifyMsg += `🕒 *Time:* ${new Date().toLocaleString()}\n\n`;
                
                if (shouldBlock) {
                    notifyMsg += `🔒 *Action:* AUTO-BLOCKED USER\n`;
                    notifyMsg += `⛔ *Status:* PERMANENTLY BLACKLISTED`;
                } else {
                    notifyMsg += `⚠️ *Action:* Warning sent\n`;
                    notifyMsg += `🚨 *Next violation:* AUTO-BLOCK`;
                }
                
                await conn.sendMessage(owner, { text: notifyMsg });
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
    desc: "Extreme bot security - 2 warnings then block!",
    category: "owner",
    filename: __filename,
    use: '<on/off/status/block/unblock/list>',
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
            // Send scary response to non-owner
            await sendScarySticker(conn, sender, 'unauthorized');
            
            await conn.sendMessage(sender, {
                text: `🔫 *OWNER COMMAND ONLY!* 🔫\n\n` +
                      `⚠️ *This command is for owner only!*\n` +
                      `👁️ *Your attempt has been logged*\n` +
                      `🚨 *Admin notified of this violation*\n\n` +
                      `❌ *STOP TRYING TO ACCESS OWNER COMMANDS!*`
            });
            return;
        }

        // HELP MENU
        if (!text || text === 'help') {
            const helpMsg = `
*🔫 SETBOT EXTREME SECURITY*

*Military-grade bot protection!*

*📌 COMMANDS:*
• \`${prefix}setbot on\` - Arm security system
• \`${prefix}setbot off\` - Disarm security
• \`${prefix}setbot status\` - Check security status
• \`${prefix}setbot block <num>\` - Manually block user
• \`${prefix}setbot unblock <num>\` - Unblock user
• \`${prefix}setbot list\` - List blocked users
• \`${prefix}setbot reset <num>\` - Reset warnings
• \`${prefix}setbot test\` - Test security

*⚡ SECURITY RULES:*
1️⃣ First violation: Warning + Sticker
2️⃣ Second violation: AUTO-BLOCK + Blacklist
⛔ Blocked permanently from bot & WhatsApp

*🔫 CURRENT STATUS:*
• System: ${settings.enabled ? '🔒 ARMED' : '🔓 DISARMED'}
• Blocked: ${settings.blockedUsers.length} user(s)
• Stickers: ${settings.scaryStickers.length} loaded
`;
            return reply(helpMsg);
        }

        const [command, ...params] = text.trim().split(' ');
        const paramText = params.join(' ');

        // ====== ON ======
        if (command === 'on') {
            settings.enabled = true;
            saveSettings(settings);
            
            // Send confirmation with sticker
            await sendScarySticker(conn, sender, 'armed');
            
            await reply(`🔫 *SECURITY SYSTEM ARMED!*\n\n` +
                       `⚠️ *Status:* LOCKED & LOADED\n` +
                       `💀 *Intruders will face consequences*\n` +
                       `🚨 *Auto-block after 2 warnings*\n` +
                       `⛔ *Permanent blacklisting enabled*\n\n` +
                       `*WARNING TO INTRUDERS:*\n` +
                       `• Sticker sent immediately\n` +
                       `• 2 warnings then block\n` +
                       `• WhatsApp blocking enabled`);
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
            statusMsg += `⚡ *System:* ${settings.enabled ? '🔒 ARMED' : '🔓 DISARMED'}\n`;
            statusMsg += `🚨 *Auto-block:* ${settings.autoBlock ? '✅ ACTIVE' : '❌ INACTIVE'}\n`;
            statusMsg += `⛔ *Blacklisted:* ${blockedCount} user(s)\n`;
            statusMsg += `⚠️ *Active Warnings:* ${warningCount}\n`;
            statusMsg += `🔫 *Stickers:* ${settings.scaryStickers.length} loaded\n\n`;
            
            // Show recently blocked (last 3)
            if (blockedCount > 0) {
                statusMsg += `*🚫 RECENTLY TERMINATED:*\n`;
                const recent = settings.blockedUsers.slice(-3).reverse();
                recent.forEach((jid, i) => {
                    const num = jid.split('@')[0];
                    const warnings = settings.warningCount[jid] || 2;
                    statusMsg += `${i+1}. ${num} (${warnings} violations)\n`;
                });
                if (blockedCount > 3) statusMsg += `... and ${blockedCount - 3} more\n`;
                statusMsg += `\n`;
            }
            
            // Show potential violators
            const violators = Object.entries(settings.warningCount)
                .filter(([jid, count]) => count === 1 && !settings.blockedUsers.includes(jid))
                .slice(0, 3);
            
            if (violators.length > 0) {
                statusMsg += `*⚠️ USERS AT RISK (1 warning):*\n`;
                violators.forEach(([jid, count]) => {
                    const num = jid.split('@')[0];
                    statusMsg += `• ${num} - Next violation = BLOCK\n`;
                });
            }
            
            statusMsg += `\n*Quick Commands:*\n`;
            statusMsg += `\`${prefix}setbot list\` - View all blocked\n`;
            statusMsg += `\`${prefix}setbot on/off\` - Toggle security\n`;
            statusMsg += `\`${prefix}setbot test\` - Test system`;
            
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
            
            // Check if already blocked
            if (!settings.blockedUsers.includes(targetJid)) {
                // Add to blocked list
                settings.blockedUsers.push(targetJid);
                settings.warningCount[targetJid] = 2; // Mark as violated twice
                saveSettings(settings);
                
                // Block in WhatsApp
                try {
                    await conn.updateBlockStatus(targetJid, 'block');
                } catch (e) {
                    console.log('WhatsApp block failed:', e.message);
                }
                
                // Send termination message to user
                await sendScarySticker(conn, targetJid, 'manual-block');
                
                await conn.sendMessage(targetJid, {
                    text: `⛔ *MANUALLY TERMINATED BY ADMIN!* ⛔\n\n` +
                          `🔫 *ACCESS PERMANENTLY REVOKED*\n` +
                          `💀 *ADMIN HAS BLACKLISTED YOU*\n` +
                          `🚫 *ALL FUTURE ATTEMPTS WILL FAIL*\n\n` +
                          `*Reason:* Manual termination by owner\n` +
                          `*Time:* ${new Date().toLocaleString()}`
                });
                
                await reply(`✅ *USER TERMINATED MANUALLY!*\n\n` +
                           `🔫 *Target:* ${targetJid.split('@')[0]}\n` +
                           `💀 *Status:* PERMANENTLY BLACKLISTED\n` +
                           `🚫 *Cannot use bot anymore*\n` +
                           `👮 *WhatsApp block attempted*`);
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
                // Remove from lists
                settings.blockedUsers.splice(index, 1);
                delete settings.warningCount[targetJid];
                saveSettings(settings);
                
                // Unblock in WhatsApp
                try {
                    await conn.updateBlockStatus(targetJid, 'unblock');
                } catch (e) {}
                
                // Notify user
                await conn.sendMessage(targetJid, {
                    text: `✅ *YOUR ACCESS HAS BEEN RESTORED!*\n\n` +
                          `🔓 *Admin has pardoned you*\n` +
                          `🔄 *Blacklist removed*\n` +
                          `🤝 *You can now use the bot*\n\n` +
                          `*Please follow rules to avoid future blocks.*\n` +
                          `*Pardoned by:* Owner\n` +
                          `*Time:* ${new Date().toLocaleString()}`
                });
                
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
                           `Peace mode activated. 🕊️`);
            }
            
            let listMsg = `*🚫 BLACKLISTED USERS*\n\n`;
            listMsg += `Total terminated: ${settings.blockedUsers.length}\n\n`;
            
            settings.blockedUsers.forEach((jid, index) => {
                const num = jid.split('@')[0];
                const warnings = settings.warningCount[jid] || 2;
                listMsg += `${index + 1}. ${num}\n`;
                listMsg += `   ⚠️ Violations: ${warnings}\n`;
                listMsg += `   🔒 Status: TERMINATED\n`;
                listMsg += `   ⛔ WhatsApp: BLOCKED\n\n`;
            });
            
            listMsg += `*Commands:*\n`;
            listMsg += `\`${prefix}setbot unblock <number>\` - Pardon user\n`;
            listMsg += `\`${prefix}setbot reset <number>\` - Full reset`;
            
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
            const wasBlocked = settings.blockedUsers.includes(targetJid);
            
            // Full reset
            delete settings.warningCount[targetJid];
            
            // Remove from blocked list
            const blockIndex = settings.blockedUsers.indexOf(targetJid);
            if (blockIndex > -1) {
                settings.blockedUsers.splice(blockIndex, 1);
                
                // Unblock user
                try {
                    await conn.updateBlockStatus(targetJid, 'unblock');
                } catch (e) {}
            }
            
            saveSettings(settings);
            
            let resetMsg = `✅ *USER FULLY RESET!*\n\n`;
            resetMsg += `👤 *User:* ${targetJid.split('@')[0]}\n`;
            resetMsg += `🔄 *Previous warnings:* ${warnings}\n`;
            
            if (wasBlocked) {
                resetMsg += `🔓 *Was:* BLACKLISTED (now removed)\n`;
                resetMsg += `🤝 *Status:* FULL ACCESS RESTORED`;
                
                // Notify user
                try {
                    await conn.sendMessage(targetJid, {
                        text: `🔄 *YOUR RECORD HAS BEEN CLEARED!*\n\n` +
                              `✅ *Admin has reset your warnings*\n` +
                              `🔓 *Blacklist removed*\n` +
                              `🤝 *Full access restored*\n\n` +
                              `*Please use the bot responsibly.*`
                    });
                } catch (e) {}
            } else {
                resetMsg += `✅ *New status:* CLEAN SLATE\n`;
                resetMsg += `📝 *All warnings cleared*`;
            }
            
            await reply(resetMsg);
            return;
        }
        
        // ====== TEST ======
        if (command === 'test') {
            await reply(`🔫 *TESTING SECURITY SYSTEM...*\n\n` +
                       `Sending test sticker & warning...`);
            
            // Test sticker
            await sendScarySticker(conn, sender, 'test');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Test warning
            await conn.sendMessage(sender, {
                text: `⚠️ *TEST WARNING - SYSTEM ACTIVE!* ⚠️\n\n` +
                      `🔫 Sticker: ✅ SENT\n` +
                      `🚨 Warning: ✅ SENT\n` +
                      `💀 Auto-block: ✅ READY\n` +
                      `⛔ Blacklist: ✅ ACTIVE\n\n` +
                      `*Security Status:* ${settings.enabled ? '🔒 ARMED' : '🔓 DISARMED'}\n` +
                      `*Intruders will face:*\n` +
                      `1. Warning sticker\n` +
                      `2. Final warning\n` +
                      `3. AUTO-BLOCK & BLACKLIST`
            });
            
            await reply(`✅ *SECURITY TEST COMPLETE!*\n\n` +
                       `🔫 System: ✅ OPERATIONAL\n` +
                       `🚨 Response: ✅ IMMEDIATE\n` +
                       `💀 Threat level: ✅ EXTREME\n\n` +
                       `Intruders beware! 2 warnings = BLOCKED!`);
            return;
        }
        
        // ====== INVALID ======
        await reply(`❌ *Invalid command!*\n\n` +
                   `Use: ${prefix}setbot help for commands.`);

    } catch (error) {
        console.error('Setbot command error:', error);
        await reply(`❌ *Error:* ${error.message}`);
    }
});

// Auto-save
process.on('SIGINT', () => {
    saveSettings(settings);
    process.exit();
});

process.on('SIGTERM', () => {
    saveSettings(settings);
    process.exit();
});
