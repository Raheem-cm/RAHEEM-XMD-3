const { cmd } = require('../command');
const { createCanvas } = require('canvas');

cmd({
    pattern: "meme",
    desc: "Advanced Meme Maker (supports long text)",
    category: "fun",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    if (!text) return reply("*Example:* .meme Hii ni meme yangu kali sana...");

    await reply("😂 *Generating meme...*");

    try {
        const width = 900;
        const height = 900;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        ctx.font = "bold 32px Sans";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const colors = [
            "#ff004c", "#00ffcc", "#ffee00",
            "#00aaff", "#ff9900", "#bb00ff",
            "#00ff00", "#ff6666"
        ];

        // Text wrapping
        const words = text.split(" ");
        let line = "";
        let y = 40;
        const maxWidth = width - 80;
        let colorIndex = 0;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth) {
                ctx.fillStyle = colors[colorIndex % colors.length];
                ctx.fillText(line, width / 2, y);
                line = words[i] + " ";
                y += 38;
                colorIndex++;
            } else {
                line = testLine;
            }

            if (y > height - 80) break; // safety
        }

        // Last line
        ctx.fillStyle = colors[colorIndex % colors.length];
        ctx.fillText(line, width / 2, y);

        // Footer
        ctx.font = "bold 24px Sans";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("RAHEEM-XMD MEME", width / 2, height - 40);

        const buffer = canvas.toBuffer();

        await conn.sendMessage(
            from,
            {
                image: buffer,
                caption: "😂 *MEME GENERATED*\n> RAHEEM-XMD"
            },
            { quoted: mek }
        );

    } catch (err) {
        console.log(err);
        reply("❌ Meme generation failed.");
    }
});
