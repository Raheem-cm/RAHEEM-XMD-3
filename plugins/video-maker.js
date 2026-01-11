const { cmd } = require('../command');
const { exec } = require('child_process');
const fs = require('fs');

cmd({
    pattern: "videomake",
    desc: "All-in-one video maker",
    category: "video",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    if (!text) return reply("*Example:* .videomake RAHEEM XMD");

    const videoPath = `/tmp/video_${Date.now()}.mp4`;
    const safeText = text.replace(/['":]/g, "");

    await reply("🎬 *Creating video...*");

    const ffmpegs = [
        "ffmpeg",
        "/app/vendor/ffmpeg/ffmpeg",
        "/usr/bin/ffmpeg"
    ];

    const makeCmd = (ff) =>
`${ff} -y -f lavfi -i color=c=black:s=720x720:d=5 \
-vf "drawtext=text='${safeText}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2" \
-c:v libx264 -pix_fmt yuv420p "${videoPath}"`;

    const tryFFmpeg = (i = 0) => {
        if (i >= ffmpegs.length) {
            return reply("❌ FFmpeg haipo kwenye system hii.\n⚠️ Video HALISI haiwezekani bila FFmpeg.");
        }

        exec(makeCmd(ffmpegs[i]), async (err) => {
            if (err || !fs.existsSync(videoPath)) {
                return tryFFmpeg(i + 1);
            }

            await conn.sendMessage(
                from,
                { video: fs.readFileSync(videoPath), caption: "✅ *Video Generated*" },
                { quoted: mek }
            );

            fs.unlinkSync(videoPath);
        });
    };

    tryFFmpeg();
});
