 const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

// Sehemu ya kuhifadhi status ya ChatVoice (On/Off)
let chatVoiceStatus = {}; 

cmd({
    on: "body"
}, async (conn, mek, m, { body, from, isGroup, isCmd, sender }) => {
    try {
        if (!body || isCmd || mek.key.fromMe) return;

        // Angalia kama ChatVoice imewashwa kwa chat hii
        if (!chatVoiceStatus[from] || chatVoiceStatus[from] === 'off') return;

        // Tengeneza URL ya Google TTS (Kiswahili - 'sw')
        // Unaweza kubadili 'sw' kwenda 'en' kama unataka Kiingereza
        const text = body.trim();
        if (text.length > 200) return; // Isichukue meseji ndefu sana kuzuia errors

        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=sw&client=tw-ob`;

        await conn.sendMessage(from, {
            audio: { url: ttsUrl },
            mimetype: 'audio/mp4',
            ptt: true 
        }, { quoted: mek });

    } catch (e) {
        console.log("ChatVoice Error: ", e);
    }
});

// COMMAND YA KUWASHA NA KUZIMA
cmd({
    pattern: "chatvoice",
    desc: "Washa au zima mfumo wa SMS kuwa Voice",
    category: "main",
    react: "🎤",
    filename: __filename
}, async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("Hii ni kwa ajili ya Owner tu!");
    
    const action = args[0] ? args[0].toLowerCase() : '';

    if (action === 'on') {
        chatVoiceStatus[m.chat] = 'on';
        return reply("*CHATVOICE IMEWASHWA* ✅\n\nSasa SMS zote zitajibiwa kwa sauti.");
    } else if (action === 'off') {
        chatVoiceStatus[m.chat] = 'off';
        return reply("*CHATVOICE IMEZIMWA* ❌");
    } else {
        return reply("*MATUMIZI:* \n\n◦ `.chatvoice on` - Kuwasha\n◦ `.chatvoice off` - Kuzima");
    }
});
