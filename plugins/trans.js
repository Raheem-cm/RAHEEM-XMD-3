const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "trans",
    alias: ["currency"],
    desc: "Convert money with live rates.",
    category: "tools",
    react: "💰",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (args.length < 4) return reply("❌ *Use:* .trans 2000 TSH to KSH");

        const amount = parseFloat(args[0]);
        const fromCur = args[1].toUpperCase();
        const toCur = args[3].toUpperCase();

        await reply(`⏳ *Converting ${amount} ${fromCur}...*`);

        // API mbadala ambayo ni imara zaidi
        const url = `https://api.exchangerate-api.com/v4/latest/${fromCur}`;
        const res = await axios.get(url);
        
        if (res.data && res.data.rates) {
            const rate = res.data.rates[toCur];
            if (rate) {
                const total = (amount * rate).toFixed(2);
                return reply(`✅ *CONVERSION SUCCESS*\n\n💰 *${amount} ${fromCur}* = *${total} ${toCur}*\n📊 *Rate:* ${rate}\n\n> *RAHEEM-XMD SYSTEM*`);
            }
        }
        
        reply("❌ Currency code not supported.");
    } catch (e) {
        reply("❌ Service busy. Try again after a few minutes.");
    }
});
