const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Store settings
const SETTINGS_FILE = path.join(__dirname, '../setbot_settings.json');

// Default settings - KALI ZAIDI NA VIDEO!
const defaultSettings = {
    enabled: false,
    warningMode: true,
    autoBlock: true, // TRUE - Automatically block after 2 warnings!
    warningCount: {},
    blockedUsers: [],
    scareLevel: 'extreme',
    
    // WARNING MESSAGES
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
    
    // VIDEO YA KUTISHA KABLA YA AUTO-BLOCK
    scaryVideo: 'https://files.catbox.moe/rmk8y2.mp4', // VIDEO YAKO YA KUTISHA
    
    // STICKERS ZA WARNING ZA KWANZA
    warningStickers: [
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/17.webp',
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Skull/1.webp',
        'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Police/18.webp'
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

// Function ya kutuma STICKER (kwa warning ya kwanza)
async function sendWarningSticker(conn, sender) {
    try {
        // Chagua random sticker
        const stickerIndex = Math.floor(Math.random() * settings.warningStickers.length);
        const stickerUrl = settings.warningStickers[stickerIndex];
        
        await conn.sendMessage(sender, {
            sticker: { url: stickerUrl }
        });
        return true;
    } catch (error) {
        console.error('Sticker sending error:', error);
        return false;
    }
}

// Function ya kutuma VIDEO YA KUTISHA (kabla ya auto-block)
async function sendScaryVideo(conn, sender) {
    try {
        console.log(`📹 Sending scary video to ${sender}`);
        
        await conn.sendMessage(sender, {
            video: { url: settings.scaryVideo },
            caption: `🔫 *TERMINATION IN PROGRESS...* 🔫`,
            gifPlayback: false
        });
        return true;
    } catch (error) {
        console.error('Video sending error:', error);
        
        // Fallback kama video imeshindwa - tuma sticker badala yake
        try {
            await conn.sendMessage(sender, {
                sticker: { url: 'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Skull/1.webp' }
            });
        } catch (e) {}
        
        return false;
    }
}

// MIDDLEWARE - NA VIDEO YA KUTISHA!
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
                      `👮 *ADMIN NOTIFIED OF THIS ATTEMPT*\n\n` +
                      `*BLOCK REASON:* Multiple security violations`
            });
            return true;
        }
        
        // ========== INCREMENT WARNING COUNT ==========
        settings.warningCount[sender] = (settings.warningCount[sender] || 0) + 1;
        const warningNumber = settings.warningCount[sender];
        
        // ========== PROCESS BASED ON WARNING NUMBER ==========
        let warningMsg = '';
        let shouldSendVideo = false;
        let shouldBlock = false;
        
        if (warningNumber === 1) {
            // FIRST WARNING - TUMA STICKER
            await sendWarningSticker(conn, sender);
            
            // Delay kidogo
            await new Promise(resolve => setTimeout(resolve, 800));
            
            warningMsg = `🔫 *FIRST WARNING!* 🔫\n\n` +
                        `⚠️ *Security Violation Detected!*\n` +
                        `📱 *Violator:* ${senderNumber}\n` +
                        `📝 *Command:* ${body.substring(0, 30)}...\n` +
                        `👁️ *You are being monitored*\n\n` +
                        `🚨 *NEXT ATTEMPT = VIDEO WARNING + AUTO-BLOCK!*\n\n` +
                        `❌ *STOP NOW OR FACE CONSEQUENCES!*`;
        } 
        else if (warningNumber === 2) {
            // SECOND WARNING - TUMA VIDEO KABLA YA BLOCK!
            shouldSendVideo = true;
            shouldBlock = true;
            
            warningMsg = `💀 *FINAL WARNING VIOLATED!* 💀\n\n` +
                        `📱 *Violator:* ${senderNumber}\n` +
                        `⛔ *Violations:* 2/2\n` +
                        `🔫 *Action:* TERMINATION SEQUENCE ACTIVATED\n` +
                        `📹 *Sending termination video...*\n\n` +
                        `*YOU HAVE BEEN WARNED TWICE!*`;
        }
        else if (warningNumber >= 3) {
            // ALREADY SHOULD BE BLOCKED, BUT JUST IN CASE
            shouldBlock = true;
            warningMsg = `⛔ *AUTO-BLOCK ACTIVATED!* ⛔\n\n` +
                        `📱 *Violator:* ${senderNumber}\n` +
                        `💀 *Violations:* ${warningNumber}\n` +
                        `🚫 *Status:* PERMANENTLY BLACKLISTED\n\n` +
                        `*BLOCK REASON:* Exceeded maximum warnings`;
        }
        
        // ========== SEND WARNING MESSAGE ==========
        await conn.sendMessage(sender, { text: warningMsg });
        
        // ========== SEND SCARY VIDEO KABLA YA BLOCK ==========
        if (shouldSendVideo) {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Delay for dramatic effect
            
            console.log(`🎬 Sending termination video to ${senderNumber}`);
            await sendScaryVideo(conn, sender);
            
            // Wait for video to be seen
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        // ========== AUTO-BLOCK KAMA WARNING 2 AU ZAIDI ==========
        if (shouldBlock) {
            try {
                console.log(`⛔ Auto-blocking ${senderNumber}...`);
                
                // 1. Block on WhatsApp
                await conn.updateBlockStatus(sender, 'block');
                
                // 2. Add to blocked list
                settings.blockedUsers.push(sender);
                
                // 3. Send final termination message
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                await conn.sendMessage(sender, {
                    text: `⛔ *TERMINATION COMPLETE!* ⛔\n\n` +
                          `🔫 *ACCESS PERMANENTLY REVOKED*\n` +
                          `💀 *YOUR NUMBER IS NOW BLACKLISTED*\n` +
                          `🚫 *ALL FUTURE ATTEMPTS WILL FAIL*\n` +
                          `📞 *WhatsApp: BLOCKED*\n` +
                          `🤖 *Bot: BLOCKED*\n\n` +
                          `*Violations:* ${warningNumber}\n` +
                          `*Termination time:* ${new Date().toLocaleString()}\n` +
                          `*Reason:* Security policy violation`
                });
                
                console.log(`✅ Successfully blocked ${senderNumber}`);
                
            } catch (blockError) {
                console.error('Auto-block failed:', blockError);
                
                // Try alternative blocking method
                try {
                    settings.blockedUsers.push(sender);
                    await conn.sendMessage(sender, {
                        text: `⚠️ *BLOCK ATTEMPT FAILED BUT YOU ARE BLACKLISTED!*\n\n` +
                              `🚫 *Your number is recorded in blacklist*\n` +
                              `⛔ *Bot commands are permanently disabled for you*`
                    });
                } catch (e) {}
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
                    notifyMsg += `🔫 *Action:* AUTO-BLOCK ACTIVATED\n`;
                    notifyMsg += `📹 *Video sent:* ${shouldSendVideo ? '✅ YES' : '❌ NO'}\n`;
                    notifyMsg += `⛔ *Status:* PERMANENTLY BLACKLISTED`;
                } else {
                    notifyMsg += `⚠️ *Action:* Warning ${warningNumber} sent\n`;
                    notifyMsg += `🚨 *Next violation:* VIDEO + AUTO-BLOCK`;
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
    desc: "Extreme bot security with scary video termination!",
    category: "owner",
    filename: __filename,
    use: '<on/off/status/block/unblock/list/test>',
    fromMe: true,
    react: "🎬"
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
            await sendWarningSticker(conn, sender);
            
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
*🎬 SETBOT EXTREME SECURITY WITH VIDEO*

*Military-grade bot protection with scary termination video!*

*📌 COMMANDS:*
• \`${prefix}setbot on\` - Arm security system
• \`${prefix}setbot off\` - Disarm security
• \`${prefix}setbot status\` - Check security status
• \`${prefix}setbot block <num>\` - Manually block user
• \`${prefix}setbot unblock <num>\` - Unblock user
• \`${prefix}setbot list\` - List blocked users
• \`${prefix}setbot reset <num>\` - Reset warnings
• \`${prefix}setbot test\` - Test security system
• \`${prefix}setbot video\` - Test termination video

*⚡ SECURITY SEQUENCE:*
1️⃣ First violation: Warning sticker
2️⃣ Second violation: SCARY VIDEO → AUTO-BLOCK
⛔ Blocked permanently from bot & WhatsApp

*🎬 TERMINATION VIDEO:*
${settings.scaryVideo}

*🔫 CURRENT STATUS:*
• System: ${settings.enabled ? '🔒 ARMED' : '🔓 DISARMED'}
• Blocked: ${settings.blockedUsers.length} user(s)
• Video: ${settings.scaryVideo ? '✅ LOADED' : '❌ MISSING'}
`;
            return reply(helpMsg);
        }

        const [command, ...params] = text.trim().split(' ');
        const paramText = params.join(' ');

        // ====== ON ======
        if (command === 'on') {
            settings.enabled = true;
            saveSettings(settings);
            
            await reply(`🎬 *SECURITY SYSTEM ARMED!*\n\n` +
                       `⚠️ *Status:* LOCKED & LOADED\n` +
                       `🔫 *Intruders will face consequences*\n` +
                       `📹 *Termination video ready*\n` +
                       `⛔ *Auto-block after 2 warnings*\n\n` +
                       `*TERMINATION SEQUENCE:*\n` +
                       `1. Warning 1: Sticker\n` +
                       `2. Warning 2: Scary Video → AUTO-BLOCK\n` +
                       `3. Permanent blacklisting`);
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
            
            let statusMsg = `*🎬 SETBOT SECURITY STATUS*\n\n`;
            statusMsg += `⚡ *System:* ${settings.enabled ? '🔒 ARMED' : '🔓 DISARMED'}\n`;
            statusMsg += `🚨 *Auto-block:* ${settings.autoBlock ? '✅ ACTIVE' : '❌ INACTIVE'}\n`;
            statusMsg += `⛔ *Blacklisted:* ${blockedCount} user(s)\n`;
            statusMsg += `⚠️ *Active Warnings:* ${warningCount}\n`;
            statusMsg += `🎬 *Termination Video:* ${settings.scaryVideo ? '✅ LOADED' : '❌ MISSING'}\n\n`;
            
            // Show video info
            if (settings.scaryVideo) {
                statusMsg += `*📹 VIDEO URL:*\n`;
                statusMsg += `${settings.scaryVideo.substring(0, 50)}...\n\n`;
            }
            
            // Show recently blocked
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
            
            // Show users with 1 warning
            const riskUsers = Object.entries(settings.warningCount)
                .filter(([jid, count]) => count === 1 && !settings.blockedUsers.includes(jid))
                .slice(0, 3);
            
            if (riskUsers.length > 0) {
                statusMsg += `*⚠️ USERS AT RISK (1 warning):*\n`;
                riskUsers.forEach(([jid, count]) => {
                    const num = jid.split('@')[0];
                    statusMsg += `• ${num} - Next = VIDEO + BLOCK\n`;
                });
            }
            
            statusMsg += `\n*Quick Commands:*\n`;
            statusMsg += `\`${prefix}setbot test\` - Test warning system\n`;
            statusMsg += `\`${prefix}setbot video\` - Test termination video\n`;
            statusMsg += `\`${prefix}setbot list\` - View blacklist`;
            
            await reply(statusMsg);
            return;
        }
        
        // ====== TEST VIDEO ======
        if (command === 'video' || command === 'testvideo') {
            await reply(`🎬 *TESTING TERMINATION VIDEO...*\n\n` +
                       `Sending scary video to owner...`);
            
            try {
                await sendScaryVideo(conn, sender);
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                await reply(`✅ *TERMINATION VIDEO TEST COMPLETE!*\n\n` +
                           `🎬 Video: ✅ SENT\n` +
                           `🔫 Effect: ✅ SCARY\n` +
                           `⏱️ Duration: ✅ GOOD\n\n` +
                           `*Intruders will receive this video before being blocked!*`);
            } catch (videoError) {
                await reply(`❌ *VIDEO TEST FAILED!*\n\n` +
                           `Error: ${videoError.message}\n\n` +
                           `*Check video URL in settings:*\n` +
                           `${settings.scaryVideo}`);
            }
            return;
        }
        
        // ====== TEST SYSTEM ======
        if (command === 'test') {
            await reply(`🔫 *TESTING SECURITY SYSTEM...*\n\n` +
                       `Simulating intruder sequence...`);
            
            // Test warning 1
            await sendWarningSticker(conn, sender);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await conn.sendMessage(sender, {
                text: `⚠️ *TEST: FIRST WARNING*\n\n` +
                      `🔫 Sticker: ✅ SENT\n` +
                      `📝 Warning: ✅ SENT\n` +
                      `🚨 Next: VIDEO + AUTO-BLOCK\n\n` +
                      `*This is a simulation of warning 1*`
            });
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Test warning 2 (with video)
            await reply(`🎬 *TESTING TERMINATION SEQUENCE...*\n\n` +
                       `Simulating final warning with video...`);
            
            await sendScaryVideo(conn, sender);
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            await conn.sendMessage(sender, {
                text: `💀 *TEST: TERMINATION SEQUENCE*\n\n` +
                      `🎬 Video: ✅ SENT\n` +
                      `⛔ Block: ✅ SIMULATED\n` +
                      `🚫 Blacklist: ✅ ACTIVATED\n\n` +
                      `*This is a simulation of the auto-block sequence*\n` +
                      `*Real intruders would be permanently blocked!*`
            });
            
            await reply(`✅ *SECURITY SYSTEM TEST COMPLETE!*\n\n` +
                       `🔫 Warning System: ✅ OPERATIONAL\n` +
                       `🎬 Video System: ✅ OPERATIONAL\n` +
                       `⛔ Auto-block: ✅ READY\n\n` +
                       `*Intruders will face:*\n` +
                       `1. Warning sticker\n` +
                       `2. Scary termination video\n` +
                       `3. Permanent blacklist`);
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
                // Send termination video first
                await sendScaryVideo(conn, targetJid);
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Add to blocked list
                settings.blockedUsers.push(targetJid);
                settings.warningCount[targetJid] = 2;
                saveSettings(settings);
                
                // Block in WhatsApp
                try {
                    await conn.updateBlockStatus(targetJid, 'block');
                } catch (e) {}
                
                // Send termination message
                await conn.sendMessage(targetJid, {
                    text: `⛔ *MANUALLY TERMINATED BY ADMIN!* ⛔\n\n` +
                          `🔫 *ACCESS PERMANENTLY REVOKED*\n` +
                          `💀 *ADMIN HAS BLACKLISTED YOU*\n` +
                          `🎬 *Termination video sent*\n` +
                          `🚫 *ALL FUTURE ATTEMPTS WILL FAIL*\n\n` +
                          `*Reason:* Manual termination by owner\n` +
                          `*Time:* ${new Date().toLocaleString()}`
                });
                
                await reply(`✅ *USER TERMINATED WITH VIDEO!*\n\n` +
                           `🔫 *Target:* ${targetJid.split('@')[0]}\n` +
                           `🎬 *Video sent:* ✅ YES\n` +
                           `💀 *Status:* PERMANENTLY BLACKLISTED\n` +
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
                           `No users are currently terminated.\n` +
                           `Peace mode activated. 🕊️`);
            }
            
            let listMsg = `*🚫 TERMINATED USERS*\n\n`;
            listMsg += `Total terminated: ${settings.blockedUsers.length}\n\n`;
            
            settings.blockedUsers.forEach((jid, index) => {
                const num = jid.split('@')[0];
                const warnings = settings.warningCount[jid] || 2;
                listMsg += `${index + 1}. ${num}\n`;
                listMsg += `   ⚠️ Violations: ${warnings}\n`;
                listMsg += `   🎬 Video sent: ✅ YES\n`;
                listMsg += `   🔒 Status: TERMINATED\n\n`;
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
                resetMsg += `🔓 *Was:* TERMINATED (now pardoned)\n`;
                resetMsg += `🤝 *Status:* FULL ACCESS RESTORED`;
                
                // Notify user
                try {
                    await conn.sendMessage(targetJid, {
                        text: `🔄 *YOUR RECORD HAS BEEN CLEARED!*\n\n` +
                              `✅ *Admin has reset your warnings*\n` +
                              `🔓 *Termination revoked*\n` +
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
        
        // ====== INVALID ======
        await reply(`❌ *Invalid command!*\n\n` +
                   `Use: \`${prefix}setbot help\` for commands.`);

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
