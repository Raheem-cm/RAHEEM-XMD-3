 const { cmd } = require("../command");
const config = require("../config");
const fetch = require("node-fetch");

// === AI Chatbot Event Handler ===
// This part listens to every message to see if it should reply automatically
cmd({ on: "body" }, async (client, message, chat, { from, body, isGroup, isCmd }) => {
  try {
    // Logic: Only reply if AI is ON, NOT a command, NOT a group, and NOT from yourself
    if (config.AUTO_AI === "true" && !isCmd && !isGroup && !message.key.fromMe && body) {
      
      // Realistic typing indicator
      await client.sendPresenceUpdate('composing', from);

      // Fetching from the David Cyril API
      const apiUrl = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(body)}&apikey=`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 200 || data.success) {
        const aiReply = data.result;

        // Simple, clean reply without newsletter or forwarding info
        await client.sendMessage(from, {
          text: `${aiReply}\n\n> © Raheem xmd ᴀɪ 🤖`
        }, { quoted: message });
      }
    }
  } catch (error) {
    console.error("❌ Chatbot Error:", error);
  }
});

// === Chatbot Toggle Command ===
// Clean command to turn the AI on or off
cmd({
  pattern: "chatbot",
  alias: ["autoai", "aichat"],
  desc: "Toggle Auto AI Chatbot feature",
  category: "owner",
  react: "🤖",
  filename: __filename,
  fromMe: true
},
async (client, message, m, { isOwner, from, sender, args }) => {
  try {
    if (!isOwner) return; // Simple silent exit if not owner

    const action = args[0]?.toLowerCase() || 'status';
    let statusText, reaction = "🤖";

    if (action === 'on') {
        config.AUTO_AI = "true";
        statusText = "✅ *AI Chatbot Activated!*\nI will now reply to all private messages.";
        reaction = "✅";
    } else if (action === 'off') {
        config.AUTO_AI = "false";
        statusText = "❌ *AI Chatbot Deactivated.*";
        reaction = "❌";
    } else {
        statusText = `🤖 *Chatbot Status:* ${config.AUTO_AI === "true" ? "ON" : "OFF"}\n\n_Use .chatbot on/off to change_`;
    }

    // Simple image message without newsletter info
    await client.sendMessage(from, {
      image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
      caption: statusText
    }, { quoted: message });

    // React for visual feedback
    await client.sendMessage(from, {
      react: { text: reaction, key: message.key }
    });

  } catch (error) {
    console.error("❌ Chatbot command error:", error);
  }
});
