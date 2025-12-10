 const { cmd } = require('../command');

cmd({
    pattern: "advice",
    desc: "Get random life advice",
    react: "💡",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, reply, text }) => {
    try {
        const adviceList = [
            "✨ *Always be yourself.* Unless you can be a unicorn, then always be a unicorn.",
            "💡 *Learn something new every day.* Knowledge is the only treasure that increases when shared.",
            "🌟 *Don't compare your Chapter 1 to someone else's Chapter 20.* Everyone has their own timeline.",
            "🌱 *Invest in yourself.* The best project you'll ever work on is you.",
            "🔄 *Mistakes are proof that you're trying.* Don't be afraid to fail, be afraid not to try.",
            "🤝 *Be kind to everyone.* You never know what battles they are fighting.",
            "⏳ *Time is more valuable than money.* You can get more money, but you can't get more time.",
            "📚 *Read books.* They are the cheapest way to travel and learn from great minds.",
            "💪 *Take care of your health.* It's the greatest wealth you'll ever have.",
            "🎯 *Set goals.* A dream written down with a date becomes a goal.",
            "😊 *Smile often.* It costs nothing but creates much.",
            "🗣️ *Speak less, listen more.* You have two ears and one mouth for a reason.",
            "🛡️ *Protect your peace.* Not every battle is worth fighting.",
            "🌅 *Start your day with gratitude.* It changes your perspective on everything.",
            "🧠 *Challenge your mind.* A comfort zone is a beautiful place, but nothing ever grows there.",
            "❤️ *Love yourself first.* You can't pour from an empty cup.",
            "🚶 *Take one step at a time.* You don't have to see the whole staircase, just take the first step.",
            "🎨 *Express yourself creatively.* Art is the language of the soul.",
            "🌍 *Travel when you can.* The world is a book, and those who don't travel read only one page.",
            "🔄 *Adapt to change.* The only constant in life is change.",
            "🤔 *Think before you speak.* Words once spoken can't be taken back.",
            "🎉 *Celebrate small wins.* They lead to big successes.",
            "🌧️ *Learn to dance in the rain.* Life isn't about waiting for the storm to pass.",
            "🧳 *Pack light in life.* Too much baggage slows you down.",
            "🔑 *Forgive others.* Not because they deserve forgiveness, but because you deserve peace.",
            "🌻 *Surround yourself with positive people.* You become like the people you spend time with.",
            "📝 *Write things down.* The faintest ink is more powerful than the strongest memory.",
            "🎶 *Listen to music.* It's the soundtrack of life.",
            "🌳 *Spend time in nature.* It's the best therapy.",
            "💭 *Meditate daily.* Silence is the language of God.",
            "🤲 *Help others without expecting anything in return.* True generosity expects no reward.",
            "🎭 *Don't take life too seriously.* Nobody gets out alive anyway.",
            "🔍 *Look for the good in people.* Everyone has something beautiful to offer.",
            "🌊 *Go with the flow.* Sometimes the best plan is no plan.",
            "🎁 *Be present.* The past is history, the future is mystery, today is a gift - that's why it's called present.",
            "⚡ *Take risks.* Ships are safe in harbor, but that's not what ships are built for.",
            "🌈 *After every storm comes a rainbow.* Have faith.",
            "👑 *Believe in yourself.* If you don't, who will?",
            "🕊️ *Let go of what you can't control.* Focus on what you can.",
            "🔥 *Follow your passion.* Do what you love, and you'll never work a day in your life.",
            "🧩 *Everything happens for a reason.* Even if you don't see it now.",
            "🎯 *Stay focused on your goals.* Distraction is the enemy of success.",
            "💧 *Stay hydrated.* Water is life.",
            "🌙 *Get enough sleep.* Your body repairs itself while you sleep.",
            "🙏 *Pray or meditate daily.* Connect with something greater than yourself.",
            "📱 *Limit social media time.* Real life happens offline.",
            "🍎 *Eat healthy.* You are what you eat.",
            "🏃 *Exercise regularly.* A healthy body houses a healthy mind.",
            "🎓 *Never stop learning.* Growth stops when learning stops.",
            "💎 *Value experiences over things.* Memories last longer than material possessions."
        ];
        
        // Get random advice
        const randomIndex = Math.floor(Math.random() * adviceList.length);
        const advice = adviceList[randomIndex];
        
        // Format the message
        const adviceMessage = `
💡 *DAILY ADVICE* 💡

${advice}

━━━━━━━━━━━━━━━━━━━━

📊 *Advice #${randomIndex + 1} of ${adviceList.length}*
🎯 *Category:* Life Wisdom
💫 *For:* Everyone

💖 *Remember:* This too shall pass.
🔄 *Need another?* Send .advice again!

*"The best advice comes from experience."* 📚
`;
        
        await reply(adviceMessage);
        
    } catch (e) {
        console.error("Advice Command Error:", e);
        await reply("💡 *Advice for you:* Always keep trying! Error getting advice, but don't give up! 😊");
    }
});
