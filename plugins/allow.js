const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// File to store the bot state for groups
const BOT_STATE_FILE = './bot_global_state.json';

// ==================== 1. LOAD/SAVE STATE ====================
function loadBotState() {
    try {
        if (fs.existsSync(BOT_STATE_FILE)) {
            const data = fs.readFileSync(BOT_STATE_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading bot state:', error);
    }
    return { enabled: true }; // Default: bot is ON
}

function saveBotState(state) {
    try {
        fs.writeFileSync(BOT_STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving bot state:', error);
    }
}

// ==================== 2. CHECK IF COMMAND SHOULD WORK ====================
async function shouldProcessCommand(conn, mek, sender) {
    const from = mek.key.remoteJid;
    
    // Command works in GROUPS only
    if (!from.endsWith('@g.us')) {
        return { allowed: false, reason: '⚠️ *This command only works in GROUPS!*' };
    }
    
    // Check if sender is OWNER
    const config = require('../config');
    const ownerJid = config.OWNER_NUMBER ? 
        (config.OWNER_NUMBER.includes('@') ? config.OWNER_NUMBER : config.OWNER_NUMBER + '@s.whatsapp.net') : 
        null;
    
    const isOwner = ownerJid && sender === ownerJid;
    
    // Added +255 792 797 707 to creator list
    const isCreator = sender.includes('18494967948') || 
                      sender.includes('255763111390') || 
                      sender.includes('255792797707');
    
    if (!isOwner && !isCreator) {
        return { allowed: false, reason: '❌ *This command is for the OWNER only!*' };
    }
    
    // Check if sender is ADMIN in the group
    try {
        const groupMetadata = await conn.groupMetadata(from);
        const participant = groupMetadata.participants.find(p => p.id === sender);
        
        if (!participant) {
            return { allowed: false, reason: '❌ *You are not in this group!*' };
        }
        
        if (!['admin', 'superadmin'].includes(participant.admin)) {
            return { allowed: false, reason: '❌ *You need to be an ADMIN to use this command!*' };
        }
        
        return { allowed: true, groupMetadata };
    } catch (error) {
        return { allowed: false, reason: '❌ *Error retrieving group information!*' };
    }
}

// ==================== 3. MAIN BOT ON/OFF COMMAND ====================
cmd({
    pattern: "bot",
    desc: "Turn bot off/on for all groups (Owner/Admin only)",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, text, args, sender, reply, prefix }) => {
    try {
        // Check permissions
        const permission = await shouldProcessCommand(conn, mek, sender);
        if (!permission.allowed) {
            return await reply(permission.reason);
        }
        
        const state = loadBotState();
        const action = args[0] ? args[0].toLowerCase() : 'status';
        
        // ========== BOT OFF ==========
        if (action === 'off' || action === 'stop' || action === 'zima') {
            if (!state.enabled) {
                return await reply('🔇 *Bot is already OFFLINE for all groups!*');
            }
            
            state.enabled = false;
            state.disabledBy = sender;
            state.disabledAt = new Date().toISOString();
            state.disabledInGroup = from;
            saveBotState(state);
            
            await reply(`🔴 *BOT TURNED OFF!*\n\n✅ Bot has been disabled for ALL groups.\n\n` +
                       `📌 *Group:* ${permission.groupMetadata.subject}\n` +
                       `👤 *Disabled by:* ${m.pushName || 'Owner'}\n` +
                       `⏰ *Time:* ${new Date().toLocaleTimeString()}\n\n` +
                       `*Type:* ${prefix}bot on to enable it again.`);
            
            return;
        }
        
        // ========== BOT ON ==========
        if (action === 'on' || action === 'start' || action === 'washa') {
            if (state.enabled) {
                return await reply('🟢 *Bot is already ONLINE for all groups!*');
            }
            
            state.enabled = true;
            state.enabledBy = sender;
            state.enabledAt = new Date().toISOString();
            state.enabledInGroup = from;
            saveBotState(state);
            
            await reply(`🟢 *BOT TURNED ON!*\n\n✅ Bot has been enabled for ALL groups.\n\n` +
                       `📌 *Group:* ${permission.groupMetadata.subject}\n` +
                       `👤 *Enabled by:* ${m.pushName || 'Owner'}\n` +
                       `⏰ *Time:* ${new Date().toLocaleTimeString()}\n\n` +
                       `*The bot is now ready to serve you!* 🤖`);
            
            return;
        }
        
        // ========== BOT STATUS ==========
        if (action === 'status' || action === 'state' || action === 'hali') {
            const status = state.enabled ? '🟢 ONLINE' : '🔴 OFFLINE';
            const statusMsg = state.enabled ? 
                '*The bot is ONLINE and working in all groups.*' : 
                '*The bot is OFFLINE. It will not respond to commands in any group.*';
            
            let statusDetails = '';
            if (!state.enabled && state.disabledAt) {
                const disabledTime = new Date(state.disabledAt).toLocaleString();
                statusDetails = `\n🔴 *Disabled on:* ${disabledTime}`;
            } else if (state.enabled && state.enabledAt) {
                const enabledTime = new Date(state.enabledAt).toLocaleString();
                statusDetails = `\n🟢 *Enabled on:* ${enabledTime}`;
            }
            
            await reply(`⚙️ *BOT GLOBAL STATUS*\n\n` +
                       `📊 *Status:* ${status}\n` +
                       `${statusMsg}\n` +
                       `${statusDetails}\n\n` +
                       `*Type:* ${prefix}bot on/off`);
            
            return;
        }
        
        // ========== HELP ==========
        await reply(`⚙️ *BOT CONTROL COMMANDS*\n\n` +
                   `🔴 *Turn Off:* ${prefix}bot off\n` +
                   `🟢 *Turn On:* ${prefix}bot on\n` +
                   `📊 *Check Status:* ${prefix}bot status\n\n` +
                   `*Requirements:*\n` +
                   `✅ Must be OWNER\n` +
                   `✅ Must be ADMIN in the group\n` +
                   `✅ Works in GROUPS only\n\n` +
                   `*Example:* ${prefix}bot off`);
        
    } catch (error) {
        console.error('Bot control error:', error);
        await reply('❌ *Error managing the bot!*\n\n' + error.message);
    }
});

// ==================== 4. COMMAND BLOCKING MIDDLEWARE ====================
const originalCommands = new Map();

function initializeBotMiddleware(events) {
    const state = loadBotState();
    
    events.commands.forEach(cmd => {
        if (cmd.pattern && cmd.function) {
            originalCommands.set(cmd.pattern, cmd.function);
        }
    });
    
    events.commands.forEach(cmd => {
        if (cmd.pattern && cmd.function) {
            const originalFunc = cmd.function;
            cmd.function = async function(...args) {
                const state = loadBotState();
                
                const conn = args[0];
                const mek = args[1];
                const m = args[2];
                const params = args[3] || {};
                const body = params.body || '';
                const prefix = params.prefix || '.';
                
                const botCommands = ['bot', '.bot'];
                const isBotCommand = botCommands.some(cmdStr => 
                    body.toLowerCase().startsWith(prefix + cmdStr)
                );
                
                if (!state.enabled && !isBotCommand) {
                    const from = mek.key.remoteJid;
                    if (from.endsWith('@g.us')) {
                        console.log(`Blocked command in group ${from} while bot is offline`);
                        return;
                    }
                }
                
                return originalFunc.apply(this, args);
            };
        }
    });
    
    console.log('✅ Bot Control Middleware Loaded');
}

// ==================== 5. AUTO-INITIALIZE MIDDLEWARE ====================
setTimeout(() => {
    try {
        const events = require('../command');
        if (events && events.commands) {
            initializeBotMiddleware(events);
            console.log('🛡️  Bot Control System: ACTIVE');
        }
    } catch (error) {
        console.error('Failed to initialize bot middleware:', error);
    }
}, 3000);

// ==================== 6. CLEANUP ON START ====================
if (!fs.existsSync(BOT_STATE_FILE)) {
    saveBotState({ enabled: true });
}
