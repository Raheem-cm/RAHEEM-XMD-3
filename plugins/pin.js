 const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "pin",
    desc: "Pin a message by replying to it",
    category: "group",
    react: "📌",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotGroupAdmin, isAdmin, reply }) => {
    try {
        // Check if in group
        if (!isGroup) {
            return await conn.sendMessage(from, { 
                text: "⚠️ *Hii command inatumika kwenye group tu!*" 
            }, { quoted: mek });
        }

        // Check if bot is admin
        if (!isBotGroupAdmin) {
            return await conn.sendMessage(from, { 
                text: "❌ *Nipe admin rights kwanza ndio nisaidi kusimamisha message!*" 
            }, { quoted: mek });
        }

        // Check if user is admin or sender
        if (!isAdmin && m.sender !== config.OWNER_NUMBER) {
            return await conn.sendMessage(from, { 
                text: "🔒 *Hii command ni ya admins tu!*" 
            }, { quoted: mek });
        }

        // Check if replying to a message
        if (!reply) {
            return await conn.sendMessage(from, { 
                text: "📝 *Reply kwa message unayotaka kupin!*\n\nMfano: .pin (ukireply kwa message)" 
            }, { quoted: mek });
        }

        // Get the message to pin
        const messageToPin = mek.message.extendedTextMessage.contextInfo.stanzaId || mek.message.extendedTextMessage.contextInfo.quotedMessage;
        
        if (!messageToPin) {
            return await conn.sendMessage(from, { 
                text: "❌ *Haiwezekani kupata message ya kupin!*" 
            }, { quoted: mek });
        }

        // Pin the message
        await conn.groupPinMessage(from, reply, true)
            .then(async () => {
                // Success message
                await conn.sendMessage(from, { 
                    text: "✅ *Message imepinishwa kikamilifu!*\n\n📌 *Imehifadhiwa kama pinned message*" 
                }, { quoted: mek });
                
                // Optional: Send reaction to show success
                await conn.sendMessage(from, {
                    react: { text: "📌", key: mek.key }
                });
            })
            .catch(async (error) => {
                console.error("Pin error:", error);
                await conn.sendMessage(from, { 
                    text: `❌ *Imeshindikana kupin message!*\n\nHitilafu: ${error.message || "Unknown error"}` 
                }, { quoted: mek });
            });

    } catch (error) {
        console.error("Pin command error:", error);
        await conn.sendMessage(from, { 
            text: `❌ *Hitilafu ya mfumo!*\n${error.message}` 
        }, { quoted: mek });
    }
});
