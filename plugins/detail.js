 const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios'); // Kuhitajika kwa baadhi ya APIs

cmd({
    pattern: "detail",
    desc: "Get user details from replied message (works in both group and DM)",
    category: "tools",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isGroup, isBotGroupAdmin }) => {
    try {
        // 1. ANGALIA: Je, kuna reply?
        if (!reply) {
            return await conn.sendMessage(from, { 
                text: `📝 *Reply kwa message ya mtu unayetaka taarifa!*\n\nMfano: .detail (ukireply kwa message)` 
            }, { quoted: mek });
        }

        // 2. PATA: Taarifa za msimbo wa ujumbe ulioreply
        const quotedMsg = mek.message.extendedTextMessage;
        const targetUserJid = quotedMsg.contextInfo.participant || quotedMsg.contextInfo.remoteJid;
        
        if (!targetUserJid) {
            return await conn.sendMessage(from, { 
                text: "❌ *Haiwezekani kupata taarifa za mtumiaji!*\n\nHakikisha umereply kwa message halisi." 
            }, { quoted: mek });
        }

        // 3. TOA: Taarifa za msingi kutoka JID
        const userNumber = targetUserJid.split('@')[0];
        const userInfo = await conn.fetchStatus(targetUserJid).catch(() => null);
        const profilePic = await conn.profilePictureUrl(targetUserJid, 'image').catch(() => null);
        
        // 4. ONYESHA: Taarifa kwa muundo mzuri
        const detailMessage = `
╭───「 📋 USER DETAILS 」───╮
│
│ 👤 *NAME:* ${userInfo?.name || 'Hakuna Jina'}
│ 📞 *NUMBER:* +${userNumber}
│ 📝 *ABOUT:* ${userInfo?.status || 'Hakuna Maelezo'}
│ 📅 *UPDATED:* ${userInfo?.time ? new Date(userInfo.time).toLocaleString() : 'Hakijulikani'}
│
╰─────────────────────────╯

${profilePic ? `📸 *Picha ya Profaili:* ${profilePic}` : '⚠️ *Hakuna picha ya profaili*'}
        `.trim();

        // 5. TUMEA: Taarifa zote pamoja
        const messagePayload = {
            text: detailMessage,
            contextInfo: {
                mentionedJid: [targetUserJid],
                forwardingScore: 999,
                isForwarded: true
            }
        };

        // Ongeza picha ikiwa ipo
        if (profilePic) {
            try {
                const imageResponse = await axios.get(profilePic, { responseType: 'arraybuffer' });
                messagePayload.image = imageResponse.data;
                messagePayload.caption = detailMessage;
                delete messagePayload.text;
            } catch (imgError) {
                console.log("⚠️ Picha haikupatikana, tuma text pekee");
            }
        }

        await conn.sendMessage(from, messagePayload, { quoted: mek });

        // 6. BONUS: Onyesha reaction ya uthibitisho
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        console.error("📊 DETAIL CMD ERROR:", error);
        
        let errorMessage = "❌ *Hitilafu katika kupata taarifa!*";
        if (error.message.includes("not authorized")) {
            errorMessage += "\n\n🔒 *Sababu:* Sina ruhusa za kusoma taarifa za mtumiaji huyu.";
        } else if (error.message.includes("404")) {
            errorMessage += "\n\n👤 *Sababu:* Mtumiaji huyu anaweza kuwa amefuta akaunti yake.";
        }
        
        await conn.sendMessage(from, { 
            text: `${errorMessage}\n\n🔧 Error: ${error.message}` 
        }, { quoted: mek });
    }
});
