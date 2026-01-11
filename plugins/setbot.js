const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../setbot_settings.json');

const defaultSettings = {
    enabled: false,
    warningCount: {},
    blockedUsers: [],
    scaryVideo: 'https://files.catbox.moe/rmk8y2.mp4'
};

function loadSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    } catch (e) { console.error(e); }
    return defaultSettings;
}

function saveSettings(settings) {
    try { fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2)); } catch (e) { console.error(e); }
}

let settings = loadSettings();

// Universal Middleware - Block Intruders
module.exports.middleware = async (conn, mek, m, { from, sender, isCmd, reply }) => {
    if (!isCmd || !settings.enabled) return false;

    const config = require('../config');
    // Inaruhusu yeyote aliyedeploy bot (Owner wa namba au aliyeweka config)
    const isOwner = m.key.fromMe || sender.split('@')[0] === config.OWNER_NUMBER.replace(/[^0-9]/g, '');

    if (isOwner) return false;

    if (settings.blockedUsers.includes(sender)) return true;

    settings.warningCount[sender] = (settings.warningCount[sender] || 0) + 1;
    const count = settings.warningCount[sender];

    if (count === 1) {
        await conn.sendMessage(sender, { sticker: { url: 'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/Skull/1.webp' } });
        await reply(`*R A H E E M - X M D : SECURITY* 🚨\n\n*Unauthorized access detected.*\n*Warnings:* 1/2\n\n_Next attempt will trigger auto-termination._`);
    } 
    else if (count >= 2) {
        // TERMINATION SEQUENCE
        await reply(`*TERMINATION IN PROGRESS...* 💀`);
        
        // Tuma Video Kwanza (Delay kidogo kwa drama)
        await new Promise(resolve => setTimeout(resolve, 1000));
        await conn.sendMessage(sender, { 
            video: { url: settings.scaryVideo }, 
            caption: `*YOU HAVE BEEN WARNED.* 🔫\n_Permanent Blacklist Activated._` 
        });

        // Subiri video iende kabla ya ku-block
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await conn.updateBlockStatus(sender, 'block');
        settings.blockedUsers.push(sender);
        saveSettings(settings);
    }
    return true;
};

// COMMAND YA KUSETA
cmd({
    pattern: "setbot",
    desc: "Lock your bot from other users.",
    category: "owner",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { from, args, text, prefix, reply }) => {
    // Check kama ni mmiliki wa bot
    if (!m.key.fromMe) return reply("*OWNER ONLY* ❌");

    if (!text) return reply(`*R A H E E M - X M D   S E C U R I T Y* 🛡️\n\n*Commands:*\n◦ \`${prefix}setbot on\` - Activate Lock\n◦ \`${prefix}setbot off\` - Deactivate Lock\n◦ \`${prefix}setbot list\` - View Blacklist\n◦ \`${prefix}setbot unblock <num>\` - Pardon User`);

    const action = args[0].toLowerCase();

    if (action === 'on') {
        settings.enabled = true;
        saveSettings(settings);
        return reply(`*SYSTEM ARMED* 🔒\n_Bot is now exclusive to owner._`);
    }

    if (action === 'off') {
        settings.enabled = false;
        saveSettings(settings);
        return reply(`*SYSTEM DISARMED* 🔓\n_Bot is now open to everyone._`);
    }

    if (action === 'unblock') {
        let user = args[1]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        settings.blockedUsers = settings.blockedUsers.filter(u => u !== user);
        delete settings.warningCount[user];
        saveSettings(settings);
        await conn.updateBlockStatus(user, 'unblock');
        return reply(`*USER PARDONED* ✅`);
    }
});
