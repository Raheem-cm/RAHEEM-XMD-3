const config = require('../config');
const { cmd } = require('../command');

// Database ya majibu
const responses = {
    "habari": "Nzuri! Vipi wewe?",
    "mambo": "Poa! Vipi mkuu?",
    "poa": "Safi sana!",
    "asante": "Karibu sana!",
    "nimefurahi": "Mimi pia nimefurahi!",
    "unafanyanini": "Nakusaidia na maswali yako!",
    "unaishi wapi": "Ninaishi kwenye server ya WhatsApp!",
    "umri wako": "Sina umri, mimi ni programu tu!",
    "una rafiki": "Ndio, wewe ni rafiki yangu!",
    "nakupenda": "Asante! Mimi pia nakupenda!",
    "good morning": "Good morning! Habari za asubuhi?",
    "good night": "Good night! Lala salama!",
    "una jina": `Jina langu ni ${config.BOT_NAME || 'ChatBot'}!`,
    "nani wewe": `Mimi ni ${config.BOT_NAME || 'ChatBot'}, chatbot ya kukusaidia!`,
    "una uwezo gani": "Ninaweza kukujibu maswali, kusaidia na mazungumzo!",
    "owner wako": `Owner wangu ni ${config.OWNER_NAME || 'Unknown'}`
};

cmd({
    pattern: "smartbot",
    alias: ["helper", "msaidizi"],
    desc: "Turn ON/OFF smart helper bot",
    category: "ai",
    react: "💡",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    const args = text?.split(' ') || [];
    const action = args[0]?.toLowerCase();
    
    if (!action) {
        return reply(`💡 *SMART HELPER BOT*\n\n` +
                     `• .smartbot on - Washa helper\n` +
                     `• .smartbot off - Zima helper\n` +
                     `• .smartbot add [keyword]=[response] - Ongeza jibu\n\n` +
                     `Status: ${config.HELPER_BOT ? '✅ ON' : '❌ OFF'}`);
    }
    
    if (action === 'on') {
        config.HELPER_BOT = true;
        return reply(`✅ *Smart Helper imewashwa!*`);
    }
    
    if (action === 'off') {
        config.HELPER_BOT = false;
        return reply(`❌ *Smart Helper imezimwa!*`);
    }
    
    if (action === 'add' && args[1]) {
        const [key, ...valueParts] = args.slice(1).join(' ').split('=');
        if (key && valueParts.length > 0) {
            responses[key.toLowerCase()] = valueParts.join('=');
            return reply(`✅ Jibu limeongezwa kwa keyword: *${key}*`);
        }
    }
    
    return reply(`❌ Sintaki command.`);
});

// Handler ya smart bot
module.exports.handleSmartBot = async (conn, mek) => {
    try {
        if (!config.HELPER_BOT) return;
        
        const { body, from, sender } = mek;
        const message = body?.toLowerCase()?.trim();
        
        if (!message || message.startsWith(config.PREFIX)) return;
        if (sender === conn.user.id) return;
        
        // Tafuta keyword katika message
        for (const [keyword, response] of Object.entries(responses)) {
            if (message.includes(keyword)) {
                await conn.sendMessage(from, { text: response }, { quoted: mek });
                return;
            }
        }
        
        // Ikiwa hakuna keyword, tumia AI
        if (message.length > 3) {
            const aiResponse = getSmartResponse(message);
            await conn.sendMessage(from, { text: aiResponse }, { quoted: mek });
        }
        
    } catch (error) {
        console.error("Smart bot error:", error);
    }
};

function getSmartResponse(message) {
    // Heuristics za kujibu
    if (message.includes('?')) {
        return "Hiyo ni swali zuri! Ninafikiri...";
    }
    
    if (message.includes('!')) {
        return "Wow! Hiyo ni ya kusisimua!";
    }
    
    if (message.length < 10) {
        const shortResponses = ["Mmmh", "Sawa", "Ok", "Nimeelewa", "Aha"];
        return shortResponses[Math.floor(Math.random() * shortResponses.length)];
    }
    
    // Generic responses
    const generics = [
        "Ninaelewa unachosema.",
        "Hiyo ni ya kuvutia.",
        "Naweza kusaidia vipi zaidi?",
        "Asante kwa kuongea nami.",
        "Nimependa mazungumzo haya."
    ];
    
    return generics[Math.floor(Math.random() * generics.length)];
}
