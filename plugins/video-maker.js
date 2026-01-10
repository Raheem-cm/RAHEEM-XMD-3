const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// ==================== CONFIG ====================
const CONFIG = {
    videoWidth: 640,
    videoHeight: 480,
    duration: 8,
    tempDir: path.join(__dirname, '../temp_video_maker'), // Path ya uhakika
    fontSize: 40
};

// ==================== UTILITIES ====================
function createTempDir() {
    if (!fs.existsSync(CONFIG.tempDir)) {
        fs.mkdirSync(CONFIG.tempDir, { recursive: true });
    }
}

async function checkFFmpeg() {
    try {
        await execAsync('ffmpeg -version');
        return true;
    } catch (error) {
        return false;
    }
}

// ==================== VIDEO CREATION ====================
async function createVideo(text, style = 1) {
    createTempDir();
    const timestamp = Date.now();
    const outputFile = path.join(CONFIG.tempDir, `video_${timestamp}.mp4`);
    
    const styles = {
        1: { bg: 'dodgerblue', text: 'white' },
        2: { bg: 'crimson', text: 'white' },
        3: { bg: 'limegreen', text: 'black' },
        4: { bg: 'gold', text: 'black' },
        5: { bg: 'darkviolet', text: 'white' },
        6: { bg: 'black', text: 'white' },
        7: { bg: 'white', text: 'black' },
        8: { bg: 'hotpink', text: 'white' }
    };
    
    const selected = styles[style] || styles[1];
    const safeText = text.replace(/['"]/g, ""); // Ondoa alama zinazovuruga shell

    // FFmpeg Command iliyoboreshwa (Inafanya kazi bila kuhitaji font path maalum)
    const ffmpegCmd = `ffmpeg -f lavfi -i color=c=${selected.bg}:s=${CONFIG.videoWidth}x${CONFIG.videoHeight}:d=${CONFIG.duration} ` +
               `-vf "drawtext=text='${safeText}':fontcolor=${selected.text}:fontsize=${CONFIG.fontSize}:x=(w-text_w)/2:y=(h-text_h)/2" ` +
               `-c:v libx264 -pix_fmt yuv420p -preset superfast -y "${outputFile}"`;

    await execAsync(ffmpegCmd, { timeout: 40000 });
    
    if (fs.existsSync(outputFile)) {
        return outputFile;
    } else {
        throw new Error('FFmpeg failed to generate video file.');
    }
}

// ==================== MAIN COMMAND ====================
cmd({
    pattern: "videomake",
    desc: "Tengeneza video kwa maandishi",
    category: "video",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, prefix }) => {
    try {
        if (!text) return reply(`*Usage:* ${prefix}videomake <text>\n*Example:* ${prefix}videomake HELLO WORLD`);

        const hasFFmpeg = await checkFFmpeg();
        if (!hasFFmpeg) return reply('❌ *FFmpeg is not installed!* \n\nInstall it via:\nTermux: `pkg install ffmpeg`');

        await reply("🎬 *Creating your video, please wait...*");

        let style = 1;
        let videoText = text;

        if (text.startsWith('style ')) {
            const parts = text.split(' ');
            style = parseInt(parts[1]) || 1;
            videoText = parts.slice(2).join(' ');
        }

        const videoPath = await createVideo(videoText, style);

        await conn.sendMessage(from, {
            video: { url: videoPath },
            caption: `🎬 *RAHEEM-XMD VIDEO MAKER*\n\n📝 *Text:* ${videoText}\n🎨 *Style:* ${style}\n\n✅ *Video Created Successfully!*`,
        }, { quoted: mek });

        // Futa faili baada ya kutuma
        setTimeout(() => { if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath); }, 10000);

    } catch (error) {
        console.error(error);
        reply("❌ *Error:* " + error.message);
    }
});
