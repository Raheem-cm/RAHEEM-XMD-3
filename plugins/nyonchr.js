 const { cmd } = require('../command');

// Initialize chatbot state
global.chatbotState = global.chatbotState || {
    enabled: false,
    groupChat: {}
};

cmd({
    pattern: "chatbot",
    desc: "Enable/disable AI chatbot | .chatbot on/off/status",
    react: "🤖",
    category: "ai",
    filename: __filename
},
async (conn, mek, m, { from, reply, text, sender, isGroup }) => {
    try {
        if (!text) {
            const helpMsg = `
🤖 *CHATBOT CONTROL* 🤖

*Usage:* .chatbot [option]
*Options:*
• on - Enable chatbot
• off - Disable chatbot  
• status - Check status

*Examples:*
• .chatbot on
• .chatbot off
• .chatbot status

*Note:* Chatbot will respond to messages when enabled
`;
            return reply(helpMsg);
        }

        const action = text.trim().toLowerCase();
        
        if (action === 'status') {
            const status = global.chatbotState.enabled ? '✅ ON' : '❌ OFF';
            return reply(`🤖 *Chatbot Status:* ${status}`);
        }
        
        if (action === 'on') {
            global.chatbotState.enabled = true;
            return reply(`✅ *Chatbot ENABLED*\n\nThe AI chatbot is now active and will respond to messages.`);
        }
        
        if (action === 'off') {
            global.chatbotState.enabled = false;
            return reply(`❌ *Chatbot DISABLED*\n\nThe AI chatbot is now turned off.`);
        }
        
        return reply(`❌ Invalid option. Use: .chatbot on/off/status`);

    } catch (e) {
        console.error(e);
        await reply("⚠️ Error controlling chatbot.");
    }
});
