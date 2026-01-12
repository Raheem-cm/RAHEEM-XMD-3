const { cmd } = require("../command");
const config = require("../config");
const fetch = require("node-fetch");

// === AI Chatbot Event Handler (GROUP AI) ===
cmd({ on: "body" }, async (client, message, chat, { from, body, isGroup, isCmd }) => {
  try {
    // Logic: Inafanya kazi ikiwa ni GROUP, AI ipo ON, siyo Command, na siyo meseji yako mwenyewe
    if (config.AUTO_AI === "true" && isGroup && !isCmd && !message.key.fromMe && body) {
      
      // Onyesha bot inaandika (Typing...)
      await client.sendPresenceUpdate('composing', from);

      // Fetching from the David Cyril API
      const apiUrl = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(body)}&apikey=`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 200 || data.success) {
        const aiReply = data.result;

        // Jibu meseji kwenye group
        await client.sendMessage(from, {
          text: `${aiReply}\n\n> © ʀᴀʜᴇᴇᴍ xᴍᴅ ᴀɪ 🤖`
        }, { quoted: message });
      }
    }
  } catch (error) {
    console.error("❌ Group Chatbot Error:", error);
  }
});

// === Chatbot Toggle Command (chb on/off) ===
cmd({
  pattern: "chb",
  alias: ["chatbot", "aichat"],
  desc: "Washa au Zima Group AI Chatbot",
  category: "owner",
  react: "🤖",
  filename: __filename,
  fromMe: true
},
async (client, message, m, { isOwner, from, args, isAdmins }) => {
  try {
    // Inaruhusu Owner au Admin wa group kubadili setting
    if (!isOwner && !isAdmins) return; 

    const action = args[0]?.toLowerCase();

    if (action === 'on') {
        config.AUTO_AI = "true";
        await client.sendMessage(from, {
            image: { url: "https://files.catbox.moe/kiy0hl.jpg" },
            caption: "✅ *Group AI Chatbot Activated!*\nSasa nitajibu meseji zote kwenye group hili."
        }, { quoted: message });
    } else if (action === 'off') {
        config.AUTO_AI = "false";
        await client.sendMessage(from, {
            image: { url: "https://files.catbox.moe/kiy0hl.jpg" },
            caption: "❌ *Group AI Chatbot Deactivated.*"
        }, { quoted: message });
    } else {
        await client.sendMessage(from, {
            text: `🤖 *Group Chatbot Status:* ${config.AUTO_AI === "true" ? "ON" : "OFF"}\n\n_Tumia .chb on kuwasha au .chb off kuzima_`
        }, { quoted: message });
    }

  } catch (error) {
    console.error("❌ Chatbot command error:", error);
  }
});
