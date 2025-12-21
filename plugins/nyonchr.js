 const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

// Kumbukumbu ya mazungumzo (conversation memory)
const userChats = new Map();

cmd({
    pattern: "chatbot",
    alias: ["bot", "ai"],
    desc: "On/Off chatbot for groups or private",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, text, isGroup, sender }) => {
    try {
        const args = text?.split(' ') || [];
        const action = args[0]?.toLowerCase();
        
        if (!action) {
            return await conn.sendMessage(from, { 
                text: `🤖 *CHATBOT SETTINGS*\n\n` +
                      `*.chatbot on* - Turn ON chatbot\n` +
                      `*.chatbot off* - Turn OFF chatbot\n` +
                      `*.chatbot group on* - Turn ON for group only\n` +
                      `*.chatbot group off* - Turn OFF for group\n` +
                      `*.chatbot private on* - Turn ON for private\n` +
                      `*.chatbot private off* - Turn OFF for private\n\n` +
                      `*Current Status:*\n` +
                      `• Group Chatbot: ${config.GROUP_CHATBOT ? '✅ ON' : '❌ OFF'}\n` +
                      `• Private Chatbot: ${config.PRIVATE_CHATBOT ? '✅ ON' : '❌ OFF'}`
            }, { quoted: mek });
        }
        
        if (action === 'on') {
            config.GROUP_CHATBOT = true;
            config.PRIVATE_CHATBOT = true;
            return await conn.sendMessage(from, { 
                text: `✅ *Chatbot imewashwa kwa Group na Private!*`
            }, { quoted: mek });
        }
        
        if (action === 'off') {
            config.GROUP_CHATBOT = false;
            config.PRIVATE_CHATBOT = false;
            return await conn.sendMessage(from, { 
                text: `❌ *Chatbot imezimwa kwa Group na Private!*`
            }, { quoted: mek });
        }
        
        if (action === 'group') {
            const subAction = args[1]?.toLowerCase();
            if (subAction === 'on') {
                config.GROUP_CHATBOT = true;
                return await conn.sendMessage(from, { 
                    text: `✅ *Group Chatbot imewashwa!*`
                }, { quoted: mek });
            } else if (subAction === 'off') {
                config.GROUP_CHATBOT = false;
                return await conn.sendMessage(from, { 
                    text: `❌ *Group Chatbot imezimwa!*`
                }, { quoted: mek });
            }
        }
        
        if (action === 'private') {
            const subAction = args[1]?.toLowerCase();
            if (subAction === 'on') {
                config.PRIVATE_CHATBOT = true;
                return await conn.sendMessage(from, { 
                    text: `✅ *Private Chatbot imewashwa!*`
                }, { quoted: mek });
            } else if (subAction === 'off') {
                config.PRIVATE_CHATBOT = false;
                return await conn.sendMessage(from, { 
                    text: `❌ *Private Chatbot imezimwa!*`
                }, { quoted: mek });
            }
        }
        
    } catch (e) {
        console.error("Chatbot command error:", e);
    }
});

// System ya kukamata messages kujibu automatikally
module.exports.handleMessage = async (conn, m) => {
    try {
        const { body, from, sender, isGroup, quoted } = m;
        const message = body?.toLowerCase()?.trim();
        
        if (!message) return;
        
        // Check ikiwa ni command
        if (message.startsWith(config.PREFIX)) return;
        
        // Check ikiwa ni group na group chatbot iko ON
        if (isGroup && config.GROUP_CHATBOT) {
            // Jibu messages kwenye group
            await handleChatbotResponse(conn, m, true);
        }
        
        // Check ikiwa ni private na private chatbot iko ON
        if (!isGroup && config.PRIVATE_CHATBOT) {
            // Jibu messages za private
            await handleChatbotResponse(conn, m, false);
        }
        
    } catch (e) {
        console.error("Chatbot handler error:", e);
    }
};

// Function ya kujibu messages
async function handleChatbotResponse(conn, m, isGroup) {
    try {
        const { body, from, sender, quoted } = m;
        const userId = sender.split('@')[0];
        const userMessage = body.trim();
        
        // Usijibu yenyewe
        if (sender === conn.user.id) return;
        
        // Usijibu commands
        if (userMessage.startsWith(config.PREFIX)) return;
        
        // Tengeneza mazungumzo ya mtumiaji
        if (!userChats.has(userId)) {
            userChats.set(userId, []);
        }
        
        const userConversation = userChats.get(userId);
        userConversation.push(`User: ${userMessage}`);
        
        // Weka kikomo cha mazungumzo (last 10 messages)
        if (userConversation.length > 10) {
            userConversation.shift();
        }
        
        // Tengeneza context kutoka kwa mazungumzo ya nyuma
        const context = userConversation.join('\n');
        
        // Tuma kwa AI API
        const aiResponse = await getAIResponse(userMessage, context, isGroup);
        
        if (aiResponse) {
            // Ongeza jibu kwenye mazungumzo
            userConversation.push(`AI: ${aiResponse}`);
            
            // Tuma jibu
            await conn.sendMessage(from, { 
                text: aiResponse 
            }, { quoted: m });
        }
        
    } catch (e) {
        console.error("Chatbot response error:", e);
    }
}

// Function ya kupata majibu kutoka AI APIs
async function getAIResponse(message, context, isGroup) {
    try {
        // API 1: Dark API (ya bure)
        try {
            const response = await axios.post('https://darkapi--hfproject.hf.space/chat', {
                message: message,
                context: context
            }, { timeout: 10000 });
            
            if (response.data && response.data.response) {
                return response.data.response;
            }
        } catch (e) {
            // API 1 imeshindwa, jaribu API 2
        }
        
        // API 2: Free ChatGPT API
        try {
            const response = await axios.get(`https://api.azz.biz.id/api/chatgpt?q=${encodeURIComponent(message)}&key=free`, {
                timeout: 10000
            });
            
            if (response.data && response.data.respon) {
                return response.data.respon;
            }
        } catch (e) {
            // API 2 imeshindwa, jaribu API 3
        }
        
        // API 3: Simple AI (fallback)
        try {
            const response = await axios.get(`https://api.siputzx.my.id/api/ai/simi?text=${encodeURIComponent(message)}`, {
                timeout: 8000
            });
            
            if (response.data && response.data.result) {
                return response.data.result;
            }
        } catch (e) {
            // API 3 imeshindwa
        }
        
        // Default response ikiwa APIs zote zimeshindwa
        const defaultResponses = [
            "Naelewa ulichosema!",
            "Hiyo ni interesting!",
            "Unaweza kuelezea zaidi?",
            "Nimekuelewa!",
            "Asante kwa kuongea nami!",
            "Hiyo ni nzuri!"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        
    } catch (error) {
        console.error("AI API error:", error);
        return "Samahani, sijaweza kukujibu kwa sasa. Jaribu tena baadaye.";
    }
}

// Ongeza hizi settings kwenye config.js yako:
/*
// Chatbot Settings
config.GROUP_CHATBOT = false;    // Chatbot kwa group
config.PRIVATE_CHATBOT = false;  // Chatbot kwa private
*/
