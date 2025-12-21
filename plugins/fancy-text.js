 const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "✍️",
  desc: "Convert text into various fonts.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, q, reply }) => {
  try {
    if (!q) {
      return reply("❎ Please provide text to convert into fancy fonts.\n\n*Example:* .fancy Hello");
    }

    // Using a working public API
    const apiUrl = `https://api.fgmods.xyz/api/maker/fancy?text=${encodeURIComponent(q)}&apikey=free`;
    const response = await axios.get(apiUrl);
    
    if (!response.data || !response.data.result) {
      return reply("❌ Unexpected response from the font service. Please try again.");
    }

    // Formatting the result from the new API
    const fonts = response.data.result;
    const resultText = `✨ *Fancy Fonts Converter* ✨\n\n${fonts}\n\n> *Powered by Raheem-cm*`;

    await conn.sendMessage(from, { text: resultText }, { quoted: m });
  } catch (error) {
    console.error("❌ Error in fancy command:", error);
    reply("⚠️ An error occurred while fetching fonts. The service might be temporarily unavailable.");
  }
});
