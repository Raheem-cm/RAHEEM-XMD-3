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

// ==================== AI RESPONSE HANDLER ====================
// Add this function to your main message handler

async function handleAIResponse(conn, mek, m) {
    try {
        // Check if chatbot is enabled
        if (!global.chatbotState || !global.chatbotState.enabled) return;
        
        const message = m.messages ? m.messages[0] : m;
        const from = message.key.remoteJid;
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || 
                    message.message?.imageMessage?.caption ||
                    "";
        
        // Skip if no text or message is from bot itself
        if (!text || message.key.fromMe) return;
        
        const isGroup = from.endsWith('@g.us');
        
        // Simple AI responses
        const responses = {
            greetings: [
                "Hello! 👋 How can I help you today?",
                "Hi there! 😊 What's on your mind?",
                "Hey! I'm your AI assistant. How can I assist you?",
                "Greetings! 🤖 Ready to chat!"
            ],
            
            questions: {
                "how are you": "I'm doing great, thanks for asking! How about you?",
                "your name": "I'm RAHEEM-CM AI Bot! Nice to meet you!",
                "who created you": "I was created by Abdulrahim (RAHEEM-CM)!",
                "what can you do": "I can chat, answer questions, tell jokes, and help with information!",
                "help": "I can help with:\n• General chat\n• Information\n• Jokes\n• Facts\n• Translations\nJust ask me anything!"
            },
            
            jokes: [
                "Why don't scientists trust atoms?\nBecause they make up everything! 😄",
                "Why did the scarecrow win an award?\nBecause he was outstanding in his field! 🌾",
                "What do you call a fake noodle?\nAn Impasta! 🍝",
                "Why don't eggs tell jokes?\nThey'd crack each other up! 🥚"
            ]
        };
        
        // Process message
        let response = "";
        const lowerText = text.toLowerCase();
        
        // Check for specific questions
        for (const [keyword, answer] of Object.entries(responses.questions)) {
            if (lowerText.includes(keyword)) {
                response = answer;
                break;
            }
        }
        
        // If no specific answer
        if (!response) {
            if (lowerText.includes('joke')) {
                response = responses.jokes[Math.floor(Math.random() * responses.jokes.length)];
            } 
            else if (lowerText.match(/(hello|hi|hey|habari|mambo)/)) {
                response = responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
            }
            else {
                // Generic response
                const genericResponses = [
                    `Interesting! Tell me more about that.`,
                    "I see! What else would you like to know?",
                    "That's cool! 😎 How can I assist you further?",
                    "Thanks for sharing! Anything specific you'd like to ask?"
                ];
                response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
            }
        }
        
        // Send response
        await conn.sendMessage(from, { 
            text: `🤖 *AI:* ${response}` 
        }, { quoted: message });
        
    } catch (e) {
        console.error("AI Response Error:", e);
    }
}

// Export for use in main file
module.exports = { handleAIResponse };
