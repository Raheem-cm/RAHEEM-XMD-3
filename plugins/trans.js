const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "trans",
    alias: ["currency", "rate"],
    desc: "Convert money from one currency to another.",
    category: "tools",
    use: ".trans 2000 tsh to ksh",
    react: "💰",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        // Validation: Expecting format [amount] [from] to [to]
        if (args.length < 4 || args[2].toLowerCase() !== "to") {
            return reply("❌ *Format Error!*\n\n*Use:* .trans [amount] [from] to [to]\n*Example:* .trans 2000 TSH to KSH");
        }

        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[3].toUpperCase();

        if (isNaN(amount)) return reply("❌ Please provide a valid number for the amount.");

        await reply(`⏳ *Calculating exchange rate...*`);

        // Fetching real-time exchange rate
        // Note: Using a public free API for exchange rates
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const rate = response.data.rates[toCurrency];

        if (!rate) {
            return reply(`❌ Could not find currency code: *${toCurrency}*`);
        }

        const convertedAmount = (amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const lastUpdate = response.data.date;

        const resultMsg = `
┏━〔 *CURRENCY CONVERTER* 〕━┓
┃
┃ 💵 *From:* ${amount.toLocaleString()} ${fromCurrency}
┃ 🇰🇪 *To:* ${convertedAmount} ${toCurrency}
┃ 📊 *Rate:* 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}
┃ 🕒 *Date:* ${lastUpdate}
┃
┗━━━━━━━━━━━━━━┛
> *© RAHEEM-XMD SYSTEM*`;

        return await reply(resultMsg);

    } catch (e) {
        console.error(e);
        reply("❌ *Error:* Service unavailable or invalid currency code. Ensure you use codes like TSH, KSH, USD, UGX.");
    }
});
