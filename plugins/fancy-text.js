const { cmd } = require('../command');

// Hapa tunatengeneza function ya kugeuza herufi kuwa fancy
function toFancy(text) {
    const table = {
        fancy1: { a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱", i: "𝓲", j: "𝓳", k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷", o: "𝓸", p: "𝓹", q: "𝓺", r: "𝓻", s: "𝓼", t: "𝓽", u: "𝓾", v: "𝓿", w: "𝔀", x: "𝔁", y: "𝔂", z: "𝔃" },
        fancy2: { a: "𝕒", b: "𝕓", c: "𝕔", d: "𝕕", e: "𝕖", f: "𝕗", g: "𝕘", h: "𝕙", i: "𝕚", j: "𝕛", k: "𝕜", l: "𝕝", m: "𝕞", n: "𝕟", o: "𝕠", p: "𝕡", q: "𝕢", r: "𝕣", s: "𝕤", t: "𝕥", u: "𝕦", v: "𝕧", w: "𝕨", x: "𝕩", y: "𝕪", z: "𝕫" },
        fancy3: { a: "Ⓐ", b: "Ⓑ", c: "Ⓒ", d: "Ⓓ", e: "Ⓔ", f: "Ⓕ", g: "Ⓖ", h: "Ⓗ", i: "Ⓘ", j: "Ⓙ", k: "Ⓚ", l: "Ⓛ", m: "Ⓜ", n: "Ⓝ", o: "Ⓞ", p: "Ⓟ", q: "Ⓠ", r: "Ⓡ", s: "Ⓢ", t: "Ⓣ", u: "Ⓤ", v: "Ⓥ", w: "Ⓦ", x: "Ⓧ", y: "Ⓨ", z: "Ⓩ" },
        fancy4: { a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣", g: "𝔤", h: "𝔥", i: "𝔦", j: "𝔧", k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫", o: "𝔬", p: "𝔭", q: "𝔮", r: "𝔯", s: "𝔰", t: "𝔱", u: "𝔲", v: "𝔳", w: "𝔴", x: "𝔵", y: "𝔶", z: "𝔷" },
        fancy5: { a: "🄰", b: "🄱", c: "🄲", d: "🄳", e: "🄴", f: "🄵", g: "🄿", h: "🄶", i: "🄸", j: "🄹", k: "🄺", l: "🄻", m: "🄼", n: "🄽", o: "🄾", p: "🄿", q: "🅀", r: "🅁", s: "🅂", t: "🅃", u: "🅄", v: "🅅", w: "🅆", x: "🅇", y: "🅈", z: "🅉" }
    };

    let results = [];
    for (let style in table) {
        let transformed = text.toLowerCase().split('').map(char => table[style][char] || char).join('');
        results.push(transformed);
    }
    return results;
}

cmd({
    pattern: "fancy",
    alias: ["font", "style"],
    desc: "Convert text into fancy fonts.",
    category: "convert",
    react: "🎨",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*Yow kiongozi, andika maandishi!*\n\n*Mfano:* .fancy raheem-xmd");

        const fonts = toFancy(q);
        let responseText = `*FANCY STYLES FOR:* _${q}_\n\n`;
        
        fonts.forEach((f, i) => {
            responseText += `*${i + 1}* ➪ \`\`\`${f}\`\`\`\n\n`;
        });

        responseText += `> *© RAHEEM-TECH*`;

        await conn.sendMessage(from, { text: responseText }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Kitu kimeenda mrama!");
    }
});
