const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "pin",
    desc: "Pin message (kwa admins tu) - Toleo la uwakika",
    category: "group",
    react: "📌",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply, sender, isAdmin }) => {
    try {
        // 1. ANGALIA: Je, ni kikundi?
        if (!isGroup) {
            return await conn.sendMessage(from, { 
                text: "⚠️ *Hii command inatumika kwenye group tu!*" 
            }, { quoted: mek });
        }

        // 2. ANGALIA: Je, kuna reply?
        if (!reply) {
            return await conn.sendMessage(from, { 
                text: "📝 *Reply kwa message unayotaka kupin!*\n\nMfano: .pin (ukireply kwa message)" 
            }, { quoted: mek });
        }

        // 3. ANGALIA ADMIN: Njia ya Uwakika (Direct Metadata)
        const groupMetadata = await conn.groupMetadata(from);
        
        // Tafuta taarifa za mtumiaji aliyetuma
        const userParticipant = groupMetadata.participants.find(p => p.id === sender);
        const userIsAdmin = userParticipant?.admin === 'admin' || userParticipant?.admin === 'superadmin';
        
        // Tafuta taarifa za BOT
        const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        const botParticipant = groupMetadata.participants.find(p => p.id === botJid);
        const botIsAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';

        // 4. HAKIKISHA: Mtumiaji ni Admin
        if (!userIsAdmin && sender !== config.OWNER_NUMBER) {
            return await conn.sendMessage(from, { 
                text: `🔒 *Ruhusa zimekataliwa!*\n\nUna budi kuwa *Admin* wa kikundi ili kupin message.` 
            }, { quoted: mek });
        }

        // 5. HAKIKISHA: Bot ni Admin
        if (!botIsAdmin) {
            return await conn.sendMessage(from, { 
                text: `🤖 *Bot yangu sio Admin!*\n\nTafadhali nipe *Admin rights* kwanza kupitia:\n1. Open Group Info\n2. Tap Bot Name\n3. Select "Make Group Admin"` 
            }, { quoted: mek });
        }

        // 6. TENGEZA: Jaribu kupin moja kwa moja
        try {
            await conn.groupPinMessage(from, reply, true);
            
            // Onyesha ufanisi
            await conn.sendMessage(from, {
                react: { text: "✅", key: mek.key }
            });
            
            await conn.sendMessage(from, { 
                text: `✅ *Message Imepinishwa!*\n\n📌 Sasa imehifadhiwa kama *pinned message* ya kwanza kwenye kikundi.` 
            }, { quoted: mek });
            
        } catch (pinError) {
            // Ishia makosa maalum
            let errorMsg = "❌ *Imeshindikana kupin message!*";
            if (pinError.message.includes("not authorized")) {
                errorMsg += "\n\n⚙️ *Sababu:* Bot anaonekana Admin, lakini hakuna ruhusa kamili.";
            } else if (pinError.message.includes("404")) {
                errorMsg += "\n\n⚙️ *Sababu:* Message haipo au imefutwa tayari.";
            }
            errorMsg += `\n\n🔧 *Details:* ${pinError.message}`;
            
            await conn.sendMessage(from, { 
                text: errorMsg 
            }, { quoted: mek });
        }

    } catch (error) {
        console.error("📌 PIN CMD ERROR:", error);
        await conn.sendMessage(from, { 
            text: `⚙️ *Hitilafu ya Mfumo!*\n\nTafadhali jaribu tena baadae au tumia command nyingine.\n\n🔍 Error: ${error.message}` 
        }, { quoted: mek });
    }
});
