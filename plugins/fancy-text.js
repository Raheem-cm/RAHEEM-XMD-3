const config = require('../config');
const { cmd } = require('../command');

// Library ya fonts mbalimbali
const fancyFonts = {
    bold: {
        name: "BOLD",
        map: {
            a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃",
            k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍",
            u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
            A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩",
            K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳",
            U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
            0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫"
        }
    },
    bubble: {
        name: "BUBBLE",
        map: {
            a: "ⓐ", b: "ⓑ", c: "ⓒ", d: "ⓓ", e: "ⓔ", f: "ⓕ", g: "ⓖ", h: "ⓗ", i: "ⓘ", j: "ⓙ",
            k: "ⓚ", l: "ⓛ", m: "ⓜ", n: "ⓝ", o: "ⓞ", p: "ⓟ", q: "ⓠ", r: "ⓡ", s: "ⓢ", t: "ⓣ",
            u: "ⓤ", v: "ⓥ", w: "ⓦ", x: "ⓧ", y: "ⓨ", z: "ⓩ",
            A: "Ⓐ", B: "Ⓑ", C: "Ⓒ", D: "Ⓓ", E: "Ⓔ", F: "Ⓕ", G: "Ⓖ", H: "Ⓗ", I: "Ⓘ", J: "Ⓙ",
            K: "Ⓚ", L: "Ⓛ", M: "Ⓜ", N: "Ⓝ", O: "Ⓞ", P: "Ⓟ", Q: "Ⓠ", R: "Ⓡ", S: "Ⓢ", T: "Ⓣ",
            U: "Ⓤ", V: "Ⓥ", W: "Ⓦ", X: "Ⓧ", Y: "Ⓨ", Z: "Ⓩ",
            0: "⓪", 1: "①", 2: "②", 3: "③", 4: "④", 5: "⑤", 6: "⑥", 7: "⑦", 8: "⑧", 9: "⑨"
        }
    },
    gothic: {
        name: "GOTHIC",
        map: {
            a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣", g: "𝔤", h: "𝔥", i: "𝔦", j: "𝔧",
            k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫", o: "𝔬", p: "𝔭", q: "𝔮", r: "𝔯", s: "𝔰", t: "𝔱",
            u: "𝔲", v: "𝔳", w: "𝔴", x: "𝔵", y: "𝔶", z: "𝔷",
            A: "𝔄", B: "𝔅", C: "ℭ", D: "𝔇", E: "𝔈", F: "𝔉", G: "𝔊", H: "ℌ", I: "ℑ", J: "𝔍",
            K: "𝔎", L: "𝔏", M: "𝔐", N: "𝔑", O: "𝔒", P: "𝔓", Q: "𝔔", R: "ℜ", S: "𝔖", T: "𝔗",
            U: "𝔘", V: "𝔙", W: "𝔚", X: "𝔛", Y: "𝔜", Z: "ℨ"
        }
    },
    double: {
        name: "DOUBLE STRIKE",
        map: {
            a: "𝕒", b: "𝕓", c: "𝕔", d: "𝕕", e: "𝕖", f: "𝕗", g: "𝕘", h: "𝕙", i: "𝕚", j: "𝕛",
            k: "𝕜", l: "𝕝", m: "𝕞", n: "𝕟", o: "𝕠", p: "𝕡", q: "𝕢", r: "𝕣", s: "𝕤", t: "𝕥",
            u: "𝕦", v: "𝕧", w: "𝕨", x: "𝕩", y: "𝕪", z: "𝕫",
            A: "𝔸", B: "𝔹", C: "ℂ", D: "𝔻", E: "𝔼", F: "𝔽", G: "𝔾", H: "ℍ", I: "𝕀", J: "𝕁",
            K: "𝕂", L: "𝕃", M: "𝕄", N: "ℕ", O: "𝕆", P: "ℙ", Q: "ℚ", R: "ℝ", S: "𝕊", T: "𝕋",
            U: "𝕌", V: "𝕍", W: "𝕎", X: "𝕏", Y: "𝕐", Z: "ℤ",
            0: "𝟘", 1: "𝟙", 2: "𝟚", 3: "𝟛", 4: "𝟜", 5: "𝟝", 6: "𝟞", 7: "𝟟", 8: "𝟠", 9: "𝟡"
        }
    },
    cursive: {
        name: "CURSIVE",
        map: {
            a: "𝒶", b: "𝒷", c: "𝒸", d: "𝒹", e: "𝑒", f: "𝒻", g: "𝑔", h: "𝒽", i: "𝒾", j: "𝒿",
            k: "𝓀", l: "𝓁", m: "𝓂", n: "𝓃", o: "𝑜", p: "𝓅", q: "𝓆", r: "𝓇", s: "𝓈", t: "𝓉",
            u: "𝓊", v: "𝓋", w: "𝓌", x: "𝓍", y: "𝓎", z: "𝓏",
            A: "𝒜", B: "ℬ", C: "𝒞", D: "𝒟", E: "ℰ", F: "ℱ", G: "𝒢", H: "ℋ", I: "ℐ", J: "𝒥",
            K: "𝒦", L: "ℒ", M: "ℳ", N: "𝒩", O: "𝒪", P: "𝒫", Q: "𝒬", R: "ℛ", S: "𝒮", T: "𝒯",
            U: "𝒰", V: "𝒱", W: "𝒲", X: "𝒳", Y: "𝒴", Z: "𝒵"
        }
    },
    smallcaps: {
        name: "SMALL CAPS",
        map: {
            a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ",
            k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ",
            u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
            A: "ᴀ", B: "ʙ", C: "ᴄ", D: "ᴅ", E: "ᴇ", F: "ғ", G: "ɢ", H: "ʜ", I: "ɪ", J: "ᴊ",
            K: "ᴋ", L: "ʟ", M: "ᴍ", N: "ɴ", O: "ᴏ", P: "ᴘ", Q: "ǫ", R: "ʀ", S: "s", T: "ᴛ",
            U: "ᴜ", V: "ᴠ", W: "ᴡ", X: "x", Y: "ʏ", Z: "ᴢ"
        }
    },
    upside: {
        name: "UPSIDE DOWN",
        map: {
            a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ",
            k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
            u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
            A: "∀", B: "q", C: "Ɔ", D: "p", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H", I: "I", J: "ſ",
            K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Q", R: "ɹ", S: "S", T: "┴",
            U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
            "!": "¡", "?": "¿", ".": "˙", ",": "'", "'": ",", '"': "„", "(": ")", ")": "(",
            "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<", "&": "⅋", "_": "‾"
        }
    },
    squares: {
        name: "SQUARES",
        map: {
            a: "🄰", b: "🄱", c: "🄲", d: "🄳", e: "🄴", f: "🄵", g: "🄶", h: "🄷", i: "🄸", j: "🄹",
            k: "🄺", l: "🄻", m: "🄼", n: "🄽", o: "🄾", p: "🄿", q: "🅀", r: "🅁", s: "🅂", t: "🅃",
            u: "🅄", v: "🅅", w: "🅆", x: "🅇", y: "🅈", z: "🅉",
            A: "🄰", B: "🄱", C: "🄲", D: "🄳", E: "🄴", F: "🄵", G: "🄶", H: "🄷", I: "🄸", J: "🄹",
            K: "🄺", L: "🄻", M: "🄼", N: "🄽", O: "🄾", P: "🄿", Q: "🅀", R: "🅁", S: "🅂", T: "🅃",
            U: "🅄", V: "🅅", W: "🅆", X: "🅇", Y: "🅈", Z: "🅉",
            0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9"
        }
    },
    circled: {
        name: "CIRCLED",
        map: {
            a: "ⓐ", b: "ⓑ", c: "ⓒ", d: "ⓓ", e: "ⓔ", f: "ⓕ", g: "ⓖ", h: "ⓗ", i: "ⓘ", j: "ⓙ",
            k: "ⓚ", l: "ⓛ", m: "ⓜ", n: "ⓝ", o: "ⓞ", p: "ⓟ", q: "ⓠ", r: "ⓡ", s: "ⓢ", t: "ⓣ",
            u: "ⓤ", v: "ⓥ", w: "ⓦ", x: "ⓧ", y: "ⓨ", z: "ⓩ",
            A: "Ⓐ", B: "Ⓑ", C: "Ⓒ", D: "Ⓓ", E: "Ⓔ", F: "Ⓕ", G: "Ⓖ", H: "Ⓗ", I: "Ⓘ", J: "Ⓙ",
            K: "Ⓚ", L: "Ⓛ", M: "Ⓜ", N: "Ⓝ", O: "Ⓞ", P: "Ⓟ", Q: "Ⓠ", R: "Ⓡ", S: "Ⓢ", T: "Ⓣ",
            U: "Ⓤ", V: "Ⓥ", W: "Ⓦ", X: "Ⓧ", Y: "Ⓨ", Z: "Ⓩ"
        }
    },
    vaporwave: {
        name: "VAPORWAVE",
        map: {
            a: "ａ", b: "ｂ", c: "ｃ", d: "ｄ", e: "ｅ", f: "ｆ", g: "ｇ", h: "ｈ", i: "ｉ", j: "ｊ",
            k: "ｋ", l: "ｌ", m: "ｍ", n: "ｎ", o: "ｏ", p: "ｐ", q: "ｑ", r: "ｒ", s: "ｓ", t: "ｔ",
            u: "ｕ", v: "ｖ", w: "ｗ", x: "ｘ", y: "ｙ", z: "ｚ",
            A: "Ａ", B: "Ｂ", C: "Ｃ", D: "Ｄ", E: "Ｅ", F: "Ｆ", G: "Ｇ", H: "Ｈ", I: "Ｉ", J: "Ｊ",
            K: "Ｋ", L: "Ｌ", M: "Ｍ", N: "Ｎ", O: "Ｏ", P: "Ｐ", Q: "Ｑ", R: "Ｒ", S: "Ｓ", T: "Ｔ",
            U: "Ｕ", V: "Ｖ", W: "Ｗ", X: "Ｘ", Y: "Ｙ", Z: "Ｚ",
            0: "０", 1: "１", 2: "２", 3: "３", 4: "４", 5: "５", 6: "６", 7: "７", 8: "８", 9: "９",
            " ": "　", "!": "！", "?": "？", ".": "．", ",": "，"
        }
    }
};

// Function ya kubadilisha maneno
function convertText(text, fontType) {
    if (!fancyFonts[fontType]) return text;
    
    let result = '';
    for (let char of text) {
        if (fancyFonts[fontType].map[char]) {
            result += fancyFonts[fontType].map[char];
        } else if (fancyFonts[fontType].map[char.toLowerCase()]) {
            result += fancyFonts[fontType].map[char.toLowerCase()];
        } else {
            result += char;
        }
    }
    return result;
}

// Command ya fancy
cmd({
    pattern: "fancy",
    desc: "Badilisha maandishi kuwa miundo mbalimbali ya fancy",
    category: "convert",
    react: "✨",
    filename: __filename
}, async (conn, mek, m, { from, text, args }) => {
    try {
        const input = text.trim();
        
        if (!input) {
            // Onyesha menu ya fonts
            const fontList = `
╔═══════════════════════
║   *🎨 FANCY TEXT GENERATOR*
╚═══════════════════════

📝 *Maelekezo:*
${config.PREFIX}fancy <mtindo> <maandishi>
${config.PREFIX}fancy <maandishi>  (chagua mtindo kisha)

🎭 *MITINDO INAYOPATIKANA:*

1️⃣ *Bold* - Maandishi mazito
   • ${config.PREFIX}fancy bold RAHEEM

2️⃣ *Bubble* - Maandishi kwenye mabubble
   • ${config.PREFIX}fancy bubble SALAM

3️⃣ *Gothic* - Mtindo wa kisasa
   • ${config.PREFIX}fancy gothic HABARI

4️⃣ *Double* - Maandishi yenye mistari mbili
   • ${config.PREFIX}fancy double ZURI

5️⃣ *Cursive* - Maandishi ya mkato
   • ${config.PREFIX}fancy cursive PENDWA

6️⃣ *Smallcaps* - Herufi ndogo
   • ${config.PREFIX}fancy smallcaps DUNIA

7️⃣ *Upside* - Maandishi ya kichwa chini
   • ${config.PREFIX}fancy upside KAZI

8️⃣ *Squares* - Kwenye mraba
   • ${config.PREFIX}fancy squares FURAHA

9️⃣ *Circled* - Kwenye mduara
   • ${config.PREFIX}fancy circled UPENDO

🔟 *Vaporwave* - Mtindo wa kisasa
   • ${config.PREFIX}fancy vaporwave ASANTE

═══════════════════════
💡 *Mfano:* ${config.PREFIX}fancy bold Jambo Dunia
🎯 *All:* ${config.PREFIX}fancy all HABARI ZA LEO
═══════════════════════
            `;
            
            await conn.sendMessage(
                from,
                {
                    image: { 
                        url: "https://files.catbox.moe/sm3zqk.jpg" // Picha ya fancy
                    },
                    caption: fontList,
                    footer: `💎 ${config.BOT_NAME} Fancy Generator`,
                    templateButtons: [
                        {
                            index: 1,
                            quickReplyButton: {
                                displayText: "🎨 Bold Text",
                                id: `${config.PREFIX}fancy bold `
                            }
                        },
                        {
                            index: 2,
                            quickReplyButton: {
                                displayText: "🫧 Bubble Text",
                                id: `${config.PREFIX}fancy bubble `
                            }
                        },
                        {
                            index: 3,
                            quickReplyButton: {
                                displayText: "🏰 Gothic Text",
                                id: `${config.PREFIX}fancy gothic `
                            }
                        },
                        {
                            index: 4,
                            quickReplyButton: {
                                displayText: "🔤 All Fonts",
                                id: `${config.PREFIX}fancy list`
                            }
                        }
                    ]
                },
                { quoted: mek }
            );
            return;
        }
        
        // Check kama user anataka fonts zote
        if (args[0].toLowerCase() === 'all') {
            const allText = args.slice(1).join(' ');
            if (!allText) {
                await conn.sendMessage(from, { text: "⚠️ Tafadhali andika maandishi baada ya 'all'" }, { quoted: mek });
                return;
            }
            
            let result = `╔═══════════════════════\n║   *${allText.toUpperCase()}*\n╚═══════════════════════\n\n`;
            
            for (const [key, font] of Object.entries(fancyFonts)) {
                const converted = convertText(allText, key);
                result += `▫️ *${font.name}:*\n${converted}\n\n`;
            }
            
            result += `═══════════════════════\n📌 *Maandishi asili:* ${allText}\n🎨 *Mitindo yote:* ${Object.keys(fancyFonts).length}`;
            
            await conn.sendMessage(
                from,
                { 
                    text: result,
                    contextInfo: {
                        externalAdReply: {
                            title: "🎨 FANCY TEXT PRO",
                            body: `Generated ${Object.keys(fancyFonts).length} fonts`,
                            thumbnail: { url: "https://files.catbox.moe/sm3zqk.jpg" },
                            mediaType: 1
                        }
                    }
                },
                { quoted: mek }
            );
            return;
        }
        
        // Check kama user ameandika mtindo
        const fontTypes = Object.keys(fancyFonts);
        const possibleFont = args[0].toLowerCase();
        
        if (fontTypes.includes(possibleFont)) {
            const textToConvert = args.slice(1).join(' ');
            if (!textToConvert) {
                await conn.sendMessage(from, { text: "⚠️ Tafadhali andika maandishi ya kubadilisha" }, { quoted: mek });
                return;
            }
            
            const converted = convertText(textToConvert, possibleFont);
            const originalText = textToConvert;
            
            const message = `
╔═══════════════════════
║   *${fancyFonts[possibleFont].name} FONT*
╚═══════════════════════

📝 *Asili:*
${originalText}

🎨 *Badilisho:*
${converted}

📏 *Urefu:* ${converted.length} chars
🔤 *Mtindo:* ${fancyFonts[possibleFont].name}

═══════════════════════
💡 *Ili kukopi:* Shikilia ujumbe huu
🎯 *Zingine:* ${config.PREFIX}fancy list
═══════════════════════
            `;
            
            await conn.sendMessage(
                from,
                {
                    text: message,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                },
                { quoted: mek }
            );
        } else {
            // Ikiwa hakuna mtindo maalum, onyesha fonts zote kwa text hiyo
            const textToConvert = text;
            let result = `╔═══════════════════════\n║   *${textToConvert.toUpperCase()}*\n╚═══════════════════════\n\n`;
            
            // Onyesha fonts 5 kwanza
            const fontsToShow = Object.entries(fancyFonts).slice(0, 5);
            for (const [key, font] of fontsToShow) {
                const converted = convertText(textToConvert, key);
                result += `🎨 *${font.name}:*\n${converted}\n\n`;
            }
            
            result += `═══════════════════════\n📌 Tumae: ${config.PREFIX}fancy <mtindo> <maandishi>\n🎨 Mfano: ${config.PREFIX}fancy bold ${textToConvert.substring(0, 5)}...`;
            
            await conn.sendMessage(
                from,
                { 
                    text: result,
                    footer: `Chagua mtindo kisha tumia ${config.PREFIX}fancy <mtindo> <maandishi>`,
                    templateButtons: [
                        {
                            index: 1,
                            quickReplyButton: {
                                displayText: "🎨 Bold",
                                id: `${config.PREFIX}fancy bold ${textToConvert}`
                            }
                        },
                        {
                            index: 2,
                            quickReplyButton: {
                                displayText: "🫧 Bubble",
                                id: `${config.PREFIX}fancy bubble ${textToConvert}`
                            }
                        },
                        {
                            index: 3,
                            quickReplyButton: {
                                displayText: "🏰 Gothic",
                                id: `${config.PREFIX}fancy gothic ${textToConvert}`
                            }
                        },
                        {
                            index: 4,
                            quickReplyButton: {
                                displayText: "🔤 All Fonts",
                                id: `${config.PREFIX}fancy all ${textToConvert}`
                            }
                        }
                    ]
                },
                { quoted: mek }
            );
        }
        
    } catch (e) {
        console.log(e);
        await conn.sendMessage(
            from,
            { 
                text: `❌ Hitilafu katika fancy:\n${e.message}\n\nTumae: ${config.PREFIX}fancy list` 
            },
            { quoted: mek }
        );
    }
});

// Command ya ziada kwa kutengeneza fancy text katika picha
cmd({
    pattern: "fancy2",
    desc: "Tengeneza fancy text yenye muundo wa picha",
    category: "convert",
    react: "🎭",
    filename: __filename
}, async (conn, mek, m, { from, text }) => {
    try {
        if (!text) {
            await conn.sendMessage(
                from,
                {
                    text: `🎭 *FANCY TEXT PRO*\n\nTumae: ${config.PREFIX}fancy2 <maandishi>\n\nMfano: ${config.PREFIX}fancy2 RAHEEM BOT`,
                    footer: "Inaunda picha yenye maandishi ya fancy"
                },
                { quoted: mek }
            );
            return;
        }
        
        // Hapa unaweza kuongeza code ya kutengeneza picha kwa canvas
        // Kwa sasa tutatumia text tu
        
        const fancyVersions = [];
        for (const [key, font] of Object.entries(fancyFonts)) {
            if (fancyVersions.length < 8) { // Onyesha 8 tu
                fancyVersions.push(`🎨 ${font.name}: ${convertText(text.substring(0, 15), key)}`);
            }
        }
        
        const result = `
╔═══════════════════════
║   *🎭 FANCY PRO RESULTS*
╚═══════════════════════

📝 *Maandishi:* ${text}

${fancyVersions.join('\n')}

═══════════════════════
💡 *Ili kukopi:* Shikilia ujumbe
🎨 *Zaidi:* ${config.PREFIX}fancy list
═══════════════════════
        `;
        
        await conn.sendMessage(
            from,
            {
                text: result,
                contextInfo: {
                    externalAdReply: {
                        title: "🎨 FANCY TEXT MASTER",
                        body: `Generated for: ${text.substring(0, 20)}...`,
                        thumbnail: { url: "https://files.catbox.moe/sm3zqk.jpg" },
                        mediaType: 1
                    }
                }
            },
            { quoted: mek }
        );
        
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: "❌ Hitilafu katika fancy2!" }, { quoted: mek });
    }
});
