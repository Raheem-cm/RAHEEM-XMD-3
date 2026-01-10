const { cmd } = require('../command');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "videomake",
    desc: "Create simple video for Heroku",
    category: "video",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    if (!text) return reply("*Example:* .videomake HELLO WORLD");

    await reply("🎬 *Heroku is processing your video...*");
    const videoPath = path.join(__dirname, `../temp_${Date.now()}.mp4`);
    const safeText = text.replace(/['"]/g, "");

    // Command inayofanya kazi vizuri kwenye Heroku mazingira ya Linux
    const command = `ffmpeg -f lavfi -i color=c=blue:s=640x480:d=5 -vf "drawtext=text='${safeText}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2" -c:v libx264 -pix_fmt yuv420p -y "${videoPath}"`;

    exec(command, async (err) => {
        if (err) return reply("❌ Make sure you added FFmpeg Buildpack to Heroku Settings.");
        
        await conn.sendMessage(from, { 
            video: { url: videoPath }, 
            caption: "✅ *Video Created on Heroku!*" 
        }, { quoted: mek });
        
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    });
});
