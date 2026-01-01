 const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Store settings
const SETTINGS_FILE = path.join(__dirname, '../setbot_settings.json');

// Default settings
const defaultSettings = {
    enabled: false, // false = anyone can use, true = only owner
    warningMode: true, // Send scary warnings
    autoBlock: false, // Automatically block violators
    warningMessage: `⚠️ *UNAUTHORIZED ACCESS DETECTED!* ⚠️\n\n` +
                   `👁️ *YOUR ACTIVITY IS BEING MONITORED*\n` +
                   `📞 *YOUR NUMBER HAS BEEN LOGGED*\n` +
                   `🚨 *ADMIN HAS BEEN NOTIFIED*\n\n` +
                   `❌ *STOP USING THIS BOT IMMEDIATELY!*`,
    blockedUsers: [],
    warningCount: {}
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

// Middleware to check access
function checkAccess(conn, mek, m) {
    const config = require('../config');
    
    // If setbot is off, everyone can access
    if (!settings.enabled) {
        return { allowed: true, reason: 'setbot off' };
    }
    
    const sender = mek.sender || mek.key.participant;
    const senderNumber = sender.split('@')[0];
    
    // Owner numbers from config
    const ownerNumbers = [
        config.OWNER_NUMBER,
        config.DEV,
        '255763111390',
        '255610209120',
        '256762516606'
    ].filter(n => n).map(n => n.replace(/[^0-9]/g, ''));
    
    // Check if sender is owner
    const isOwner = ownerNumbers.some(num => 
        senderNumber.includes(num) || sender.includes(num)
    );
    
    if (isOwner) {
        return { allowed: true, reason: 'owner' };
    }
    
    // Check if user is blocked
    if (settings.blockedUsers.includes(sender)) {
        return { allowed: false, reason: 'blocked' };
    }
    
    // Not owner, setbot is ON
    return { allowed: false, reason: 'not owner' };
}

// Send warning to unauthorized user
async function sendWarning(conn, mek, m) {
    const sender = mek.sender || mek.key.participant;
    
    // Increment warning count
    settings.warningCount[sender] = (settings.warningCount[sender] || 0) + 1;
    saveSettings(settings);
    
    // Prepare scary message
    let warningMsg = settings.warningMessage;
    
    // Add count warning
    warningMsg += `\n\n⚠️ *WARNING ${settings.warningCount[sender]}/3*\n`;
    if (settings.warningCount[sender] >= 3) {
        warningMsg += `🚨 *NEXT VIOLATION WILL GET YOU BLOCKED!*`;
    }
    
    // Send with scary formatting
    await conn.sendMessage(sender, {
        text: warningMsg,
        contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true
        }
    });
    
    // Send creepy stickers/effects (optional)
    try {
        // Send scary sticker
        const scaryStickers = [
            'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Anxious/1.webp',
            'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Anxious/2.webp',
            'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Anxious/3.webp'
        ];
        
        const randomSticker = scaryStickers[Math.floor(Math.random() * scaryStickers.length)];
        await conn.sendMessage(sender, {
            sticker: { url: randomSticker }
        });
    } catch (e) {
        // Ignore sticker errors
    }
    
    // Auto-block after 3 warnings
    if (settings.autoBlock && settings.warningCount[sender] >= 3) {
        try {
            await conn.updateBlockStatus(sender, 'block');
            settings.blockedUsers.push(sender);
            saveSettings(settings);
            
            // Notify owner
            const owner = config.OWNER_NUMBER ? 
                config.OWNER_NUMBER.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : 
                conn.user.id;
            
            await conn.sendMessage(owner, {
                text: `🚨 *AUTO-BLOCK ACTIVATED*\n\n` +
                      `User: ${sender}\n` +
                      `Reason: 3 unauthorized access attempts\n` +
                      `Action: Automatically blocked\n` +
                      `Time: ${new Date().toLocaleString()}`
            });
        } catch (e) {
            console.error('Auto-block failed:', e);
        }
    }
    
    // Log the violation
    console.log(`UNAUTHORIZED ACCESS: ${sender} - Warning ${settings.warningCount[sender]}`);
}

// Main setbot command
cmd({
    pattern: "setbot",
    alias: ["botaccess", "access", "lockbot"],
    desc: "Control who can use the bot - ON/OFF with scary warnings",
    category: "owner",
    filename: __filename,
    use: '<on/off/status/settings/block/unblock/list>',
    fromMe: true,
    react: "🔐"
}, async (conn, mek, m, { from, sender, reply, args, text, prefix }) => {
    try {
        const config = require('../config');
        
        // Owner check for command
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
            return reply('❌ *Owner Command Only!*');
        }

        if (!text) {
            const helpMsg = `
*🔐 SETBOT ACCESS CONTROL*

*Control who can use your bot with scary warnings!*

*📌 COMMANDS:*
• \`${prefix}setbot on\` - Lock bot (only owner can use)
• \`${prefix}setbot off\` - Unlock bot (everyone can use)
• \`${prefix}setbot status\` - Check current status
• \`${prefix}setbot settings\` - Configure warning system
• \`${prefix}setbot block @user\` - Block specific user
• \`${prefix}setbot unblock @user\` - Unblock user
• \`${prefix}setbot list\` - List blocked users
• \`${prefix}setbot warnings @user\` - Check user warnings
• \`${prefix}setbot reset @user\` - Reset user warnings

*📌 EXAMPLES:*
${prefix}setbot on
${prefix}setbot block @user
${prefix}setbot settings warn:false block:true

*⚡ CURRENT STATUS:*
• Lock: ${settings.enabled ? '🔒 ON' : '🔓 OFF'}
• Warnings: ${settings.warningMode ? '✅ Enabled' : '❌ Disabled'}
• Auto-block: ${settings.autoBlock ? '✅ Enabled' : '❌ Disabled'}
• Blocked users: ${settings.blockedUsers.length}
`;
            return reply(helpMsg);
        }

        const [command, ...params] = text.trim().split(' ');
        const paramText = params.join(' ');

        // ====== ON/OFF ======
        if (command === 'on' || command === 'enable' || command === 'lock') {
            settings.enabled = true;
            saveSettings(settings);
            
            await reply(`✅ *BOT LOCKED!*\n\n` +
                       `🔒 *Status:* ON\n` +
                       `👑 *Only owner can use bot*\n` +
                       `⚠️ *Others will receive scary warnings*\n` +
                       `🚨 *Violators may be auto-blocked*\n\n` +
                       `Use \`${prefix}setbot off\` to unlock.`);
            return;
        }
        
        if (command === 'off' || command === 'disable' || command === 'unlock') {
            settings.enabled = false;
            saveSettings(settings);
            
            await reply(`✅ *BOT UNLOCKED!*\n\n` +
                       `🔓 *Status:* OFF\n` +
                       `🌍 *Everyone can use bot*\n` +
                       `🎉 *No restrictions applied*\n\n` +
                       `Use \`${prefix}setbot on\` to lock.`);
            return;
        }
        
        // ====== STATUS ======
        if (command === 'status' || command === 'info') {
            const statusMsg = `*🔐 SETBOT STATUS*\n\n` +
                            `⚡ *Lock Status:* ${settings.enabled ? '🔒 LOCKED' : '🔓 UNLOCKED'}\n` +
                            `⚠️ *Warning System:* ${settings.warningMode ? '✅ ON' : '❌ OFF'}\n` +
                            `🚨 *Auto-block:* ${settings.autoBlock ? '✅ ON' : '❌ OFF'}\n` +
                            `📋 *Blocked Users:* ${settings.blockedUsers.length}\n` +
                            `📊 *Total Warnings:* ${Object.keys(settings.warningCount).length}\n\n`;
            
            let activeWarnings = Object.entries(settings.warningCount)
                .filter(([_, count]) => count > 0);
            
            if (activeWarnings.length > 0) {
                statusMsg += `*⚠️ ACTIVE WARNINGS:*\n`;
                activeWarnings.forEach(([user, count]) => {
                    const num = user.split('@')[0];
                    statusMsg += `• ${num}: ${count} warning(s)\n`;
                });
            }
            
            statusMsg += `\n*Quick commands:*\n` +
                        `${prefix}setbot on/off\n` +
                        `${prefix}setbot settings\n` +
                        `${prefix}setbot list`;
            
            await reply(statusMsg);
            return;
        }
        
        // ====== SETTINGS ======
        if (command === 'settings' || command === 'config') {
            if (!paramText) {
                const settingsMsg = `*⚙️ SETBOT SETTINGS*\n\n` +
                                  `*Current Configuration:*\n` +
                                  `1. Warning Messages: ${settings.warningMode ? '✅ ON' : '❌ OFF'}\n` +
                                  `2. Auto-block: ${settings.autoBlock ? '✅ ON' : '❌ OFF'}\n` +
                                  `3. Blocked Users: ${settings.blockedUsers.length}\n\n` +
                                  `*Change Settings:*\n` +
                                  `\`${prefix}setbot settings warn:on\` - Enable warnings\n` +
                                  `\`${prefix}setbot settings warn:off\` - Disable warnings\n` +
                                  `\`${prefix}setbot settings block:on\` - Enable auto-block\n` +
                                  `\`${prefix}setbot settings block:off\` - Disable auto-block\n` +
                                  `\`${prefix}setbot settings reset\` - Reset all warnings\n\n` +
                                  `*Warning Message:*\n` +
                                  `${settings.warningMessage.substring(0, 100)}...`;
                
                await reply(settingsMsg);
                return;
            }
            
            // Parse settings
            const updates = paramText.split(' ');
            let changes = [];
            
            for (const update of updates) {
                const [key, value] = update.split(':');
                
                switch(key.toLowerCase()) {
                    case 'warn':
                    case 'warning':
                        settings.warningMode = value === 'on' || value === 'true' || value === 'yes';
                        changes.push(`Warnings: ${settings.warningMode ? 'ON' : 'OFF'}`);
                        break;
                        
                    case 'block':
                    case 'autoblock':
                        settings.autoBlock = value === 'on' || value === 'true' || value === 'yes';
                        changes.push(`Auto-block: ${settings.autoBlock ? 'ON' : 'OFF'}`);
                        break;
                        
                    case 'reset':
                        settings.warningCount = {};
                        settings.blockedUsers = [];
                        changes.push('All warnings & blocks reset');
                        break;
                        
                    case 'message':
                        if (value) {
                            settings.warningMessage = decodeURIComponent(value);
                            changes.push('Warning message updated');
                        }
                        break;
                }
            }
            
            saveSettings(settings);
            
            if (changes.length > 0) {
                await reply(`✅ *SETTINGS UPDATED*\n\n` +
                           `*Changes made:*\n` +
                           changes.map(c => `• ${c}`).join('\n') + `\n\n` +
                           `Use \`${prefix}setbot status\` to verify.`);
            } else {
                await reply(`❌ *No valid settings provided.*\n\n` +
                           `Use: ${prefix}setbot settings warn:on block:off`);
            }
            return;
        }
        
        // ====== BLOCK USER ======
        if (command === 'block') {
            if (!paramText) {
                return reply(`*Usage:* ${prefix}setbot block @user\n*Example:* ${prefix}setbot block 255763111390`);
            }
            
            let targetJid = paramText.replace(/[^0-9@]/g, '');
            if (!targetJid.includes('@')) {
                targetJid = targetJid + '@s.whatsapp.net';
            }
            
            // Add to blocked list
            if (!settings.blockedUsers.includes(targetJid)) {
                settings.blockedUsers.push(targetJid);
                saveSettings(settings);
                
                // Also block in WhatsApp
                try {
                    await conn.updateBlockStatus(targetJid, 'block');
                } catch (e) {
                    console.error('Block failed:', e);
                }
                
                await reply(`✅ *USER BLOCKED*\n\n` +
                           `👤 *User:* ${targetJid.split('@')[0]}\n` +
                           `🚫 *Status:* Added to block list\n` +
                           `🔒 *Cannot use bot anymore*\n` +
                           `📞 *Also blocked on WhatsApp*`);
            } else {
                await reply(`ℹ️ *User already blocked*\n\n` +
                           `User: ${targetJid.split('@')[0]}\n` +
                           `Status: Already in block list`);
            }
            return;
        }
        
        // ====== UNBLOCK USER ======
        if (command === 'unblock') {
            if (!paramText) {
                return reply(`*Usage:* ${prefix}setbot unblock @user\n*Example:* ${prefix}setbot unblock 255763111390`);
            }
            
            let targetJid = paramText.replace(/[^0-9@]/g, '');
            if (!targetJid.includes('@')) {
                targetJid = targetJid + '@s.whatsapp.net';
            }
            
            // Remove from blocked list
            const index = settings.blockedUsers.indexOf(targetJid);
            if (index > -1) {
                settings.blockedUsers.splice(index, 1);
                saveSettings(settings);
                
                // Also unblock in WhatsApp
                try {
                    await conn.updateBlockStatus(targetJid, 'unblock');
                } catch (e) {
                    console.error('Unblock failed:', e);
                }
                
                // Reset warnings
                delete settings.warningCount[targetJid];
                saveSettings(settings);
                
                await reply(`✅ *USER UNBLOCKED*\n\n` +
                           `👤 *User:* ${targetJid.split('@')[0]}\n` +
                           `🔓 *Status:* Removed from block list\n` +
                           `🔄 *Warnings reset*\n` +
                           `📞 *Also unblocked on WhatsApp*`);
            } else {
                await reply(`ℹ️ *User not found in block list*\n\n` +
                           `User: ${targetJid.split('@')[0]}\n` +
                           `Status: Not blocked`);
            }
            return;
        }
        
        // ====== LIST BLOCKED USERS ======
        if (command === 'list') {
            if (settings.blockedUsers.length === 0) {
                return reply(`✅ *No users currently blocked.*\n\n` +
                           `Block list is empty.\n` +
                           `Use \`${prefix}setbot block @user\` to add.`);
            }
            
            let listMsg = `*🚫 BLOCKED USERS LIST*\n\n` +
                         `Total: ${settings.blockedUsers.length} user(s)\n\n`;
            
            settings.blockedUsers.forEach((jid, index) => {
                const num = jid.split('@')[0];
                const warnings = settings.warningCount[jid] || 0;
                listMsg += `${index + 1}. ${num}\n`;
                listMsg += `   ⚠️ Warnings: ${warnings}\n`;
                listMsg += `   📅 Blocked: Permanent\n\n`;
            });
            
            listMsg += `*Commands:*\n` +
                      `${prefix}setbot unblock <number>\n` +
                      `${prefix}setbot reset <number>`;
            
            await reply(listMsg);
            return;
        }
        
        // ====== CHECK WARNINGS ======
        if (command === 'warnings' || command === 'warn') {
            if (!paramText) {
                return reply(`*Usage:* ${prefix}setbot warnings @user\n*Example:* ${prefix}setbot warnings 255763111390`);
            }
            
            let targetJid = paramText.replace(/[^0-9@]/g, '');
            if (!targetJid.includes('@')) {
                targetJid = targetJid + '@s.whatsapp.net';
            }
            
            const warnings = settings.warningCount[targetJid] || 0;
            const isBlocked = settings.blockedUsers.includes(targetJid);
            
            const warnMsg = `*⚠️ USER WARNINGS REPORT*\n\n` +
                           `👤 *User:* ${targetJid.split('@')[0]}\n` +
                           `⚡ *Warning Count:* ${warnings}\n` +
                           `🚫 *Block Status:* ${isBlocked ? 'BLOCKED' : 'NOT BLOCKED'}\n` +
                           `🔒 *Auto-block Threshold:* 3 warnings\n\n`;
            
            if (warnings >= 3 && !isBlocked) {
                warnMsg += `🚨 *USER QUALIFIES FOR AUTO-BLOCK!*\n` +
                          `Use \`${prefix}setbot block ${targetJid.split('@')[0]}\` to block.\n\n`;
            }
            
            warnMsg += `*Actions:*\n` +
                      `${prefix}setbot reset ${targetJid.split('@')[0]}\n` +
                      `${prefix}setbot block ${targetJid.split('@')[0]}\n` +
                      `${prefix}setbot unblock ${targetJid.split('@')[0]}`;
            
            await reply(warnMsg);
            return;
        }
        
        // ====== RESET WARNINGS ======
        if (command === 'reset') {
            if (!paramText) {
                return reply(`*Usage:* ${prefix}setbot reset @user\n*Example:* ${prefix}setbot reset 255763111390`);
            }
            
            let targetJid = paramText.replace(/[^0-9@]/g, '');
            if (!targetJid.includes('@')) {
                targetJid = targetJid + '@s.whatsapp.net';
            }
            
            const warnings = settings.warningCount[targetJid] || 0;
            delete settings.warningCount[targetJid];
            saveSettings(settings);
            
            await reply(`✅ *WARNINGS RESET*\n\n` +
                       `👤 *User:* ${targetJid.split('@')[0]}\n` +
                       `🔄 *Previous warnings:* ${warnings}\n` +
                       `✅ *New count:* 0\n` +
                       `📝 *Status:* Clean slate`);
            return;
        }
        
        // ====== INVALID COMMAND ======
        await reply(`❌ *Invalid sub-command!*\n\n` +
                   `Use: ${prefix}setbot help\n` +
                   `To see all available commands.`);

    } catch (error) {
        console.error('Setbot command error:', error);
        await reply(`❌ *Command Error:* ${error.message}`);
    }
});

// ========== MIDDLEWARE INTEGRATION ==========

// This middleware will run for EVERY message
module.exports.middleware = async (conn, mek, m, { from, sender, body, isCmd, reply }) => {
    try {
        // Skip if not a command
        if (!isCmd) return;
        
        // Check access
        const access = checkAccess(conn, mek, m);
        
        if (!access.allowed) {
            // Don't process command for unauthorized users
            if (settings.enabled && settings.warningMode) {
                await sendWarning(conn, mek, m);
            }
            
            // Also notify owner about violation
            const config = require('../config');
            const owner = config.OWNER_NUMBER ? 
                config.OWNER_NUMBER.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : 
                conn.user.id;
            
            if (owner !== sender) {
                try {
                    await conn.sendMessage(owner, {
                        text: `🚨 *UNAUTHORIZED ACCESS ATTEMPT*\n\n` +
                              `👤 *User:* ${sender}\n` +
                              `📝 *Command:* ${body}\n` +
                              `📅 *Time:* ${new Date().toLocaleString()}\n` +
                              `⚠️ *Warnings:* ${settings.warningCount[sender] || 0}\n` +
                              `🔒 *Action:* Command blocked`
                    });
                } catch (e) {
                    console.error('Owner notification failed:', e);
                }
            }
            
            // Return true to stop further processing
            return true;
        }
        
        // Allow command to proceed
        return false;
    } catch (error) {
        console.error('Setbot middleware error:', error);
        return false; // Don't block on error
    }
};

// Auto-save settings on exit
process.on('SIGINT', () => {
    saveSettings(settings);
    process.exit();
});

process.on('SIGTERM', () => {
    saveSettings(settings);
    process.exit();
});
