 const { cmd } = require('../command');

// Local advice database - no global state
const adviceDB = {
    school: [
        "📚 *Study consistently*, not just before exams.",
        "🎯 *Choose friends wisely* in school.",
        "👨‍🏫 *Ask questions* when you don't understand.",
        "⏰ *Manage your time* well."
    ],
    
    life: [
        "🌅 *Live in the present*.",
        "🔄 *Embrace change*.",
        "💪 *Be resilient*."
    ],
    
    love: [
        "❤️ *Love yourself first*.",
        "👂 *Listen more than you speak*.",
        "🤝 *Communication is key*."
    ],
    
    money: [
        "💰 *Save before you spend*.",
        "📊 *Budget wisely*.",
        "💹 *Invest in knowledge*."
    ],
    
    health: [
        "🥦 *Eat real food*.",
        "💧 *Drink water*.",
        "🏃 *Move daily*."
    ],
    
    career: [
        "🎯 *Find work you love*.",
        "📚 *Never stop learning*.",
        "🤝 *Network genuinely*."
    ],
    
    friendship: [
        "🤝 *Quality over quantity*.",
        "👂 *Be a good listener*.",
        "💖 *Show up*."
    ],
    
    study: [
        "📖 *Active learning* beats passive reading.",
        "⏰ *Pomodoro technique*.",
        "🧠 *Understand, don't memorize*."
    ],
    
    family: [
        "👨‍👩‍👧‍👦 *Family comes first*.",
        "🗣️ *Communicate openly*.",
        "⏰ *Make time for family*."
    ]
};

cmd({
    pattern: "advice",
    desc: "Get advice on topics",
    react: "💡",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) {
            const topics = Object.keys(adviceDB).join(', ');
            return reply(`💡 *Usage:* .advice [topic]\n📌 *Topics:* ${topics}`);
        }

        const topic = text.trim().toLowerCase();
        
        // Simple topic matching
        const topicKeys = Object.keys(adviceDB);
        let selectedTopic = topicKeys.find(key => 
            key === topic || key.includes(topic) || topic.includes(key)
        ) || 'life';
        
        // Get random advice
        const adviceList = adviceDB[selectedTopic];
        const randomAdvice = adviceList[Math.floor(Math.random() * adviceList.length)];
        
        // Simple response
        const response = `💡 *Advice (${selectedTopic}):*\n\n${randomAdvice}`;
        
        await reply(response);
        
    } catch (e) {
        console.error("Advice Error:", e);
        await reply("💡 *Life advice:* Stay calm and try again later!");
    }
});
