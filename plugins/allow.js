const { cmd } = require('../command');

/**
 * BOT CONTROL SYSTEM (ON/OFF)
 * This plugin allows group admins to enable or disable the bot.
 * Note: This affects your bot's response only.
 */

// Initialize a global variable if it doesn't exist to store muted groups
if (!global.disabledGroups) {
    global.disabledGroups = [];
}

cmd({
    pattern: "bot",
    alias: ["botcontrol"],
    desc: "Turn bot responses ON or OFF in this group.",
    category: "admin",
    use: "<on/off>",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, args, reply, pushname }) => {
    try {
        // 1. Validation: Only works in groups
        if (!isGroup) return reply("❌ This command is strictly for Group use.");

        // 2. Validation: Only Admins can toggle the bot
        if (!isAdmins) return reply("❌ Access Denied! Only Group Admins can use this command.");

        const action = args[0] ? args[0].toLowerCase() : "";

        // --- BOT OFF LOGIC ---
        if (action === "off") {
            if (global.disabledGroups.includes(from)) {
                return reply("🛡️ Bot is already *OFF* in this group.");
            }
            
            global.disabledGroups.push(from);
            return reply(`🛑 *BOT DISABLED*\n\nAdmin *${pushname}* has turned off the bot. I will no longer respond to commands here until turned *ON*.`);
        } 

        // --- BOT ON LOGIC ---
        if (action === "on") {
            if (!global.disabledGroups.includes(from)) {
                return reply("✅ Bot is already *ON* and active.");
            }
            
            // Remove group ID from disabled list
            global.disabledGroups = global.disabledGroups.filter(id => id !== from);
            return reply("🚀 *BOT ENABLED*\n\nI am back online! How can I help you today?");
        }

        // --- DEFAULT HELP ---
        return reply(`❓ *Usage Help:*\n\nUse *.bot off* to disable me.\nUse *.bot on* to enable me.`);

    } catch (e) {
        console.error(e);
        reply("❌ System Error occurred in Bot Control.");
    }
});

/**
 * LOGIC EXPLANATION:
 * Since you don't want to touch index.js, this command uses a 'Global Array'.
 * To make this fully effective, every other command in your bot should 
 * ideally check if the group is in 'global.disabledGroups'.
 */
