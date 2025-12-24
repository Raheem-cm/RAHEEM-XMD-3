 const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Store ya maisha advice
const lifeAdvice = {
    categories: {
        love: [
            "Love is not about finding the perfect person, but learning to see an imperfect person perfectly.",
            "The best relationship is when you can act like lovers and best friends at the same time.",
            "Don't rush love. The best things happen unexpectedly.",
            "Self-love is the first step to receiving love from others.",
            "A healthy relationship will never require you to sacrifice your friends, dreams, or dignity."
        ],
        career: [
            "Your career doesn't define you, but how you approach it shows your character.",
            "Success is not about the destination, but the lessons learned along the journey.",
            "The only way to do great work is to love what you do.",
            "Don't wait for opportunity. Create it.",
            "Your passion is waiting for your courage to catch up."
        ],
        happiness: [
            "Happiness is not something ready-made. It comes from your own actions.",
            "The secret of happiness is not in doing what one likes, but in liking what one does.",
            "Happiness is a choice, not a result. Nothing will make you happy until you choose to be happy.",
            "True happiness comes from within, not from external validation.",
            "Find joy in the ordinary moments; they make up most of life."
        ],
        growth: [
            "Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong.",
            "You cannot grow without being uncomfortable.",
            "The only person you should try to be better than is the person you were yesterday.",
            "Growth begins when we start to accept our own weaknesses.",
            "Every experience, good or bad, is a priceless collector's item in your growth journey."
        ],
        money: [
            "Money is a tool for living, not the purpose of life.",
            "Financial freedom comes from living below your means, not from earning more.",
            "Invest in experiences, not just things. Memories appreciate, objects depreciate.",
            "The best investment you can make is in yourself.",
            "Wealth is not about having a lot of money; it's about having a lot of options."
        ],
        health: [
            "Your body hears everything your mind says. Stay positive.",
            "Take care of your body. It's the only place you have to live.",
            "Health is the greatest possession. Contentment is the greatest treasure.",
            "Mental health is just as important as physical health.",
            "Self-care is not selfish. You cannot serve from an empty vessel."
        ],
        purpose: [
            "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.",
            "Don't ask what the world needs. Ask what makes you come alive, and go do it.",
            "Your time is limited, so don't waste it living someone else's life.",
            "The two most important days in your life are the day you are born and the day you find out why.",
            "Find what you love and let it kill you."
        ]
    },
    
    // Dynamic advice generators
    dynamicAdvice: {
        // Based on time of day
        morning: [
            "Start your day with gratitude. It changes your entire perspective.",
            "Today is a blank page. Write a beautiful story.",
            "The morning breeze has secrets to tell you. Don't go back to sleep.",
            "How you start your day determines how you live your day."
        ],
        afternoon: [
            "Take a moment to breathe. You're doing better than you think.",
            "The middle of the day is a good time to check in with yourself.",
            "Keep going. The hardest part is already behind you.",
            "This is your reminder to drink some water and stretch."
        ],
        evening: [
            "Reflect on what went well today, not just what went wrong.",
            "Let go of what you can't control. Tomorrow is a new day.",
            "Rest is not idle, it's essential for growth.",
            "The stars are always there, even when you can't see them."
        ],
        night: [
            "Sleep is the best meditation. Don't underestimate its power.",
            "Your dreams tonight will inspire your tomorrow.",
            "Let today's worries end with the sunset.",
            "The night is for resting, not regretting."
        ]
    }
};

// User-specific advice tracking
const userAdviceHistory = new Map();

cmd({
    pattern: "life",
    alias: ["advice", "wisdom"],
    desc: "Get personalized life advice (dynamic)",
    category: "fun",
    react: "💭",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const userId = sender.split('@')[0];
        const userName = mek.pushName || "friend";
        
        // Get time-based advice
        const timeAdvice = getTimeBasedAdvice();
        
        // Get random category
        const categories = Object.keys(lifeAdvice.categories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        // Get advice from category
        const categoryAdvices = lifeAdvice.categories[randomCategory];
        const randomAdvice = categoryAdvices[Math.floor(Math.random() * categoryAdvices.length)];
        
        // Get dynamic advice
        const dynamic = getDynamicAdvice(userId, randomCategory);
        
        // Create personalized message
        const message = `💭 *Life Advice for ${userName}*\n\n` +
                       `"${randomAdvice}"\n\n` +
                       `📌 *Category:* ${randomCategory.toUpperCase()}\n` +
                       `⏰ *For this moment:* ${timeAdvice}\n` +
                       `💡 *Personal insight:* ${dynamic}\n\n` +
                       `🌱 *Remember:* This advice is unique to this moment.\n` +
                       `Every day brings new opportunities for growth.\n\n` +
                       `✨ *Today's affirmation:* "${getAffirmation()}"`;
        
        // Store advice history
        storeAdviceHistory(userId, randomAdvice);
        
        await conn.sendMessage(from, { 
            text: message 
        }, { quoted: mek });
        
    } catch (error) {
        console.error("Life command error:", error);
        reply("❌ Couldn't generate life advice right now. Try again later.");
    }
});

// Get time-based advice
function getTimeBasedAdvice() {
    const hour = new Date().getHours();
    let timeOfDay;
    
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    const advices = lifeAdvice.dynamicAdvice[timeOfDay];
    return advices[Math.floor(Math.random() * advices.length)];
}

// Generate dynamic advice based on user history
function getDynamicAdvice(userId, category) {
    const history = userAdviceHistory.get(userId) || [];
    
    // If user has received advice before
    if (history.length > 0) {
        const lastAdvice = history[history.length - 1];
        
        // Different responses based on category
        const dynamics = {
            love: [
                "Love evolves. What worked yesterday may need adjustment today.",
                "Every relationship teaches you something new about yourself.",
                "The heart grows wiser with every experience."
            ],
            career: [
                "Your career path is unique. Don't compare your chapter 1 to someone's chapter 20.",
                "Skills can be learned, passion must be discovered.",
                "Success leaves clues. Follow what energizes you."
            ],
            growth: [
                "Growth happens in the uncomfortable spaces between what you know and what you discover.",
                "Your past doesn't define you; it prepares you.",
                "Transformation often feels like loss before it feels like gain."
            ],
            happiness: [
                "Happiness is a practice, not a permanent state.",
                "Joy multiplies when shared, but doesn't divide.",
                "The pursuit of happiness is the happiness itself."
            ]
        };
        
        // Return category-specific or general dynamic advice
        if (dynamics[category]) {
            return dynamics[category][Math.floor(Math.random() * dynamics[category].length)];
        }
    }
    
    // Default dynamic advice for new users
    const defaults = [
        "This moment is perfect for new beginnings.",
        "Trust the timing of your life.",
        "You are exactly where you need to be right now.",
        "Every experience is preparing you for what's next.",
        "Your journey is unique. Honor it."
    ];
    
    return defaults[Math.floor(Math.random() * defaults.length)];
}

// Get random affirmation
function getAffirmation() {
    const affirmations = [
        "I am capable of amazing things.",
        "I choose peace over perfection.",
        "I am growing every day.",
        "My potential is limitless.",
        "I trust my journey.",
        "I am exactly where I need to be.",
        "I attract positive energy.",
        "I am worthy of love and respect.",
        "My mind is clear and focused.",
        "I create my own happiness."
    ];
    
    return affirmations[Math.floor(Math.random() * affirmations.length)];
}

// Store user advice history
function storeAdviceHistory(userId, advice) {
    if (!userAdviceHistory.has(userId)) {
        userAdviceHistory.set(userId, []);
    }
    
    const history = userAdviceHistory.get(userId);
    history.push({
        advice: advice,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
    });
    
    // Keep only last 10 advices
    if (history.length > 10) {
        history.shift();
    }
}

// Command ya kuona history ya advices
cmd({
    pattern: "mylife",
    alias: ["myadvice", "advicehistory"],
    desc: "See your life advice history",
    category: "fun",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const userId = sender.split('@')[0];
        const history = userAdviceHistory.get(userId) || [];
        
        if (history.length === 0) {
            return reply("📭 You haven't received any life advice yet. Use `.life` first!");
        }
        
        let message = `📜 *Your Life Advice History*\n\n`;
        
        history.forEach((item, index) => {
            const date = new Date(item.timestamp).toLocaleDateString();
            message += `• *${index + 1}.* "${item.advice}"\n   📅 ${date}\n\n`;
        });
        
        message += `✨ Total advices: ${history.length}\n`;
        message += `💡 Use \`.life\` for more wisdom!`;
        
        await conn.sendMessage(from, { 
            text: message 
        }, { quoted: mek });
        
    } catch (error) {
        console.error("MyLife command error:", error);
        reply("❌ Couldn't retrieve your advice history.");
    }
});
