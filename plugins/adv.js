 const { cmd } = require('../command');

cmd({
    pattern: "ad",
    desc: "Get advice on specific topics",
    react: "💡",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) {
            const helpMsg = `
💡 *ADVICE BY TOPIC* 💡

*Usage:* .ad [topic]
*Examples:*
• .ad school
• .ad life
• .ad love
• .ad money
• .ad health
• .ad career
• .ad friendship

*Available Topics:*
school, life, love, money, health, career, friendship, 
study, family, work, success, happiness, stress, future
`;
            return reply(helpMsg);
        }

        const topic = text.trim().toLowerCase();
        
        // Advice database by topic
        const adviceDB = {
            school: [
                "📚 *Study consistently*, not just before exams. Little by little makes a big difference.",
                "🎯 *Choose friends wisely* in school. They influence your habits and future.",
                "👨‍🏫 *Ask questions* when you don't understand. No question is stupid.",
                "⏰ *Manage your time* well. Balance studies, rest, and social life.",
                "📝 *Take good notes*. They're your personal study guide.",
                "🏆 *Participate in extracurricular activities*. They build character and skills.",
                "🧠 *Understand concepts*, don't just memorize. Knowledge lasts longer that way.",
                "🔄 *Review regularly*. Spaced repetition helps retain information.",
                "📖 *Read beyond textbooks*. Wide reading makes you knowledgeable.",
                "🎓 *Set academic goals*. Know what you want to achieve each term."
            ],
            
            life: [
                "🌅 *Live in the present*. Yesterday is history, tomorrow is mystery, today is a gift.",
                "🔄 *Embrace change*. It's the only constant in life.",
                "💪 *Be resilient*. Fall seven times, stand up eight.",
                "🤝 *Build strong relationships*. They're life's true wealth.",
                "🎯 *Find your purpose*. A life with meaning is a life well-lived.",
                "😊 *Choose happiness*. It's a decision, not a result.",
                "🌱 *Keep growing*. Stagnation is the beginning of decline.",
                "🙏 *Practice gratitude*. Appreciate what you have while working for what you want.",
                "🧭 *Stay true to your values*. They're your internal compass.",
                "⚖️ *Balance is key*. Work, play, love, learn - all in moderation."
            ],
            
            love: [
                "❤️ *Love yourself first*. You can't pour from an empty cup.",
                "👂 *Listen more than you speak* in relationships.",
                "🤝 *Communication is key*. Talk about feelings, needs, and boundaries.",
                "💑 *Respect is non-negotiable*. In love, respect is as important as love.",
                "⏳ *Take it slow*. True love grows with time.",
                "✨ *Appreciate the small things*. Love is in the details.",
                "🛡️ *Protect your heart* but don't build walls too high.",
                "💔 *Heartbreak heals*. Time and self-love mend all wounds.",
                "🌈 *Love shouldn't hurt*. Healthy love brings peace, not pain.",
                "🎯 *Know what you want* in a partner. Don't settle for less."
            ],
            
            money: [
                "💰 *Save before you spend*. Pay yourself first.",
                "📊 *Budget wisely*. Know where every shilling goes.",
                "💹 *Invest in knowledge*. Financial literacy pays the best interest.",
                "🔄 *Multiple income streams*. Don't rely on one source of money.",
                "🚫 *Avoid debt* for liabilities. Only borrow for assets.",
                "📈 *Start investing early*. Compound interest is the 8th wonder.",
                "💳 *Live below your means*. Wealth is built by spending less than you earn.",
                "🎯 *Set financial goals*. Short-term and long-term.",
                "🛡️ *Build an emergency fund*. 3-6 months of expenses.",
                "🧠 *Money is a tool*. Use it wisely to create the life you want."
            ],
            
            health: [
                "🥦 *Eat real food*. Your body is not a trash can.",
                "💧 *Drink water* like it's your job. Stay hydrated.",
                "🏃 *Move daily*. Even 30 minutes of walking changes everything.",
                "😴 *Sleep 7-8 hours*. Your body repairs itself during sleep.",
                "🧘 *Manage stress*. Chronic stress kills slowly.",
                "🚭 *Avoid harmful habits*. Smoking, excess alcohol, drugs.",
                "🌞 *Get sunlight*. Vitamin D is essential.",
                "🩺 *Regular check-ups*. Prevention is better than cure.",
                "🧠 *Mental health matters*. It's as important as physical health.",
                "🎯 *Consistency over intensity*. Small daily habits beat occasional extremes."
            ],
            
            career: [
                "🎯 *Find work you love*. You'll never 'work' a day in your life.",
                "📚 *Never stop learning*. Skills are the new currency.",
                "🤝 *Network genuinely*. Your network determines your net worth.",
                "💼 *Build a personal brand*. What do people say about you when you're not there?",
                "🚀 *Take calculated risks*. Safe jobs can be risky in the long run.",
                "⚖️ *Work-life balance*. Burnout helps no one.",
                "💡 *Solve problems*. That's what valuable employees do.",
                "📈 *Set career goals*. Where do you want to be in 5 years?",
                "🤲 *Help others succeed*. Rising tides lift all boats.",
                "🔄 *Adapt to change*. The job market evolves constantly."
            ],
            
            friendship: [
                "🤝 *Quality over quantity*. A few true friends are better than many acquaintances.",
                "👂 *Be a good listener*. Friends need someone who listens, not just talks.",
                "💖 *Show up*. Be there in good times and bad times.",
                "🔄 *Reciprocate effort*. Friendship is a two-way street.",
                "🤗 *Accept flaws*. Nobody is perfect, including your friends.",
                "🗣️ *Communicate honestly*. Don't let small issues become big problems.",
                "⏰ *Make time*. Even busy people make time for what's important.",
                "🎉 *Celebrate their wins*. True friends are happy for your success.",
                "🛡️ *Keep secrets*. Trust is the foundation of friendship.",
                "🔄 *Let go when needed*. Some friendships have expiration dates."
            ],
            
            study: [
                "📖 *Active learning* beats passive reading. Teach what you learn.",
                "⏰ *Pomodoro technique*: 25 minutes study, 5 minutes break.",
                "🧠 *Understand, don't memorize*. Knowledge sticks better that way.",
                "📝 *Practice with past papers*. Familiarity reduces exam anxiety.",
                "🎯 *Set specific study goals*. 'Study chemistry' is vague. 'Learn periodic table' is specific.",
                "🔄 *Review within 24 hours*. Prevents forgetting up to 80%.",
                "💤 *Sleep after studying*. Sleep consolidates memory.",
                "📚 *Create mind maps*. Visual learning enhances retention.",
                "🤔 *Ask why*. Understanding reasons behind facts helps memory.",
                "🎵 *Study in different locations*. Context variation improves recall."
            ],
            
            family: [
                "👨‍👩‍👧‍👦 *Family comes first*. They're your roots and foundation.",
                "🗣️ *Communicate openly*. Don't assume they know how you feel.",
                "⏰ *Make time for family*. Busy is not an excuse.",
                "🤝 *Support each other*. Family should be your safe haven.",
                "🔄 *Forgive easily*. Family misunderstandings shouldn't last long.",
                "🎉 *Create traditions*. They build family identity.",
                "👵 *Respect elders*. Their wisdom is invaluable.",
                "👶 *Guide the young*. They're the future of the family.",
                "❤️ *Express love*. Don't just assume they know you love them.",
                "🏡 *Home should be peaceful*. A sanctuary from the world."
            ]
        };

        // Find matching topic
        let selectedTopic = null;
        let selectedAdvice = null;
        
        // Exact match
        if (adviceDB[topic]) {
            selectedTopic = topic;
            selectedAdvice = adviceDB[topic];
        } else {
            // Partial match
            for (const [key, adviceList] of Object.entries(adviceDB)) {
                if (key.includes(topic) || topic.includes(key)) {
                    selectedTopic = key;
                    selectedAdvice = adviceList;
                    break;
                }
            }
        }
        
        if (!selectedAdvice) {
            // Default to life advice
            selectedTopic = "life";
            selectedAdvice = adviceDB.life;
        }
        
        // Get random advice from selected topic
        const randomIndex = Math.floor(Math.random() * selectedAdvice.length);
        const advice = selectedAdvice[randomIndex];
        
        // Format response
        const response = `
💡 *ADVICE ABOUT: ${selectedTopic.toUpperCase()}* 💡

${advice}

━━━━━━━━━━━━━━━━━━━━

📌 *Topic:* ${selectedTopic}
🎯 *For:* ${getAudienceForTopic(selectedTopic)}
🔄 *Tip:* Use .ad [different topic] for other advice

*"Good advice is always in season."* 🌱
`;
        
        await reply(response);
        
    } catch (e) {
        console.error("Ad Command Error:", e);
        await reply("💡 *Advice:* When things go wrong, stay calm and try again! Error getting advice.");
    }
});

// Helper function to get audience for topic
function getAudienceForTopic(topic) {
    const audiences = {
        'school': 'Students & Teachers',
        'life': 'Everyone',
        'love': 'Those in relationships',
        'money': 'Financial seekers',
        'health': 'Health conscious',
        'career': 'Professionals',
        'friendship': 'Everyone with friends',
        'study': 'Learners',
        'family': 'Family members'
    };
    return audiences[topic] || 'Everyone';
              }
