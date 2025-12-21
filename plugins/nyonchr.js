const config = require('../config');
const { cmd } = require('../command');

// 1. COMMAND YA KUWASHA/KUZIMA (Kwa Owner)
cmd({
    pattern: "chatbot",
    desc: "Turn on or off the auto-reply chatbot.",
    category: "owner",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, isOwner, reply }) => {
    if (!isOwner) return reply("❌ Amri hii ni kwa ajili ya Owner pekee.");

    if (q === "on") {
        config.CHATBOT_ON = "true";
        await reply("🤖 *Chatbot imewashwa!* Sasa nitajibu meseji za watu kiotomatiki.");
    } else if (q === "off") {
        config.CHATBOT_ON = "false";
        await reply("🤖 *Chatbot imezimwa!* Nitarudi kwenye hali ya kawaida.");
    } else {
        await reply(`*Status:* ${config.CHATBOT_ON === "true" ? "ON ✅" : "OFF ❌"}\n*Usage:* .chatbot on / off`);
    }
});

// 2. LOGIC YA CHATBOT (Inasoma meseji zote)
cmd({
    on: "body"
}, async (conn, mek, m, { from, body, isCmd, pushname, reply }) => {
    // Masharti ya kuto-jibu
    if (config.CHATBOT_ON !== "true") return; // Ikiwa chatbot imezimwa
    if (isCmd) return; // Isijibu ikiwa ni command (mfano .menu)
    if (m.key.fromMe) return; // Isijibu meseji zako mwenyewe

    const msg = body.toLowerCase();

    // --- MAJIBU YA CHATBOT ---
    if (msg.includes("mambo") || msg.includes("vipi") || msg.includes("habari")) {
        return await reply(`Safi kabisa *${pushname}*! Mimi ni RAHEEM-XMD AI. Boss wangu hayupo kwa sasa, lakini unaweza kutumia *.menu* kuona ninachoweza kufanya.`);
    }

    if (msg === "bot" || msg === "raheem") {
        return await reply("Nipo hapa mkuu! Unahitaji msaada gani? Type *.menu* uone commands zangu.");
    }

    if (msg.includes("asante") || msg.includes("shukrani")) {
        return await reply("Karibu sana! Tuko pamoja. 🫡");
    }

    if (msg.includes("owner") || msg.includes("admin")) {
        return await reply("Boss wangu ni *RAHEEM CM*. Unaweza kumpata hapa: +255763111390");
    }

    // Ukireply namba kwenye menu (Mfano wa kuelekeza watu)
    if (m.quoted && m.quoted.text.includes("MENU")) {
        if (msg === '1') return reply("Umechagua namba 1: Hii ni Main Menu.");
        if (msg === '2') return reply("Umechagua namba 2: Hii ni Downloader Menu.");
    }
});
