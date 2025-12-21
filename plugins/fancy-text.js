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
      return reply("❎ Tafadhali andika maandishi ya kubadilisha fonti.\n\n*Mfano:* .fancy Habari");
    }

    // Jaribu API ya Salman
    const apiUrl = `https://api-sv2.salman-it.repl.co/fancytext?text=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);
    
    if (!response.data || !response.data.result) {
      return reply("❌ Hakuna fonti zilizopatikana. Jaribu tena.");
    }

    const fonts = response.data.result;
    const resultText = `✨ *Fancy Fonts Converter* ✨\n\n${fonts.join("\n\n")}\n\n> *Powered by Raheem-cm*`;

    await conn.sendMessage(from, { text: resultText }, { quoted: m });
    
  } catch (error) {
    console.error("❌ Error in fancy command:", error);
    reply("⚠️ API imekataa. Jaribu tena baadaye.");
  }
});
