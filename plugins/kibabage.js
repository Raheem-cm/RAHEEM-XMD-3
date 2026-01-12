const { cmd } = require("../command");
const config = require("../config");
const fetch = require("node-fetch");

// === AI Chatbot Event Handler (GROUP AI) ===
cmd({ on: "body" }, async (client, message, chat, { from, body, isGroup, isCmd }) => {
  try {
    // Logic: Inafanya kazi ikiwa ni GROUP, AI ipo ON, siyo Command, na siyo meseji yako mwenyewe
    if (config.AUTO_AI === "true" && isGroup && !isCmd && !message.key.fromMe && body) {
      
      const text = body.toLowerCase();
      let aiReply = "";

      // --- CUSTOM BRAIN: Majibu ya Haraka ---
      if (text.includes("wewe ni nani") || text.includes("jina lako") || text.includes("who are you")) {
          aiReply = "Mimi naitwa *Nyoni-XMD*, bot yako msaidizi hapa groupuni! 🤖";
      } 
      else if (text.includes("namba ya mwenye boti") || text.includes("namba ya boss") || text.includes("owner number")) {
          aiReply = "Namba ya mwenye boti (Owner) ni: *255760003443* 📞";
      }

      // Kama hajajibu kupitia Custom Brain, basi aende kwenye API
      if (!aiReply) {
          await client.sendPresenceUpdate('composing', from);
          const apiUrl = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(body)}&apikey=`;
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.status === 200 || data.success) {
              aiReply = data.result;
          }
      }

      // Tuma jibu kama limepatikana
      if (aiReply) {
          await client.sendMessage(from, {
              text: `${aiReply}\n\n> © ɴʏᴏɴɪ-xᴍᴅ ᴀɪ 🤖`
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
    if (!isOwner && !isAdmins) return; 

    const action = args[0]?.toLowerCase();

    if (action === 'on') {
        config.AUTO_AI = "true";
        await client.sendMessage(from, {
            image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
            caption: "✅ *Group AI Chatbot Activated!*\nSasa nitajibu meseji zote kwenye group hili kama *Nyoni-XMD*."
        }, { quoted: message });
    } else if (action === 'off') {
        config.AUTO_AI = "false";
        await client.sendMessage(from, {
            image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
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
