const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

cmd({
    pattern: "promovid",
    desc: "Tengeneza video ya promosheni kwa maandishi",
    category: "video",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, args }) => {
    try {
        if (!text) {
            return await conn.sendMessage(from, {
                text: `🎬 *VIDEO PROMO MAKER*\n\nTumae: ${config.PREFIX}promovid <maandishi>\n\nMifano:\n• ${config.PREFIX}promovid KARIBU KWA SOKO\n• ${config.PREFIX}promovid NUNUA SASA\n• ${config.PREFIX}promovid OFA LA LEO`,
                footer: "Weka maandishi ya kutengeneza video"
            }, { quoted: mek });
        }

        // Acha tuwatumie ujumbe kuwa video inatengenezwa
        await conn.sendMessage(from, {
            text: `⏳ *Inatengeneza video yako...*\n\nMaandishi: "${text}"\n\nTafadhali subiri sekunde 15...`
        }, { quoted: mek });

        // Tengeneza video kwa kutumia FFmpeg
        const videoPath = await createPromoVideo(text);
        
        // Tuma video
        await conn.sendMessage(from, {
            video: { url: videoPath },
            caption: `🎬 *VIDEO YA PROMO*\n\n📝: ${text}\n\n✅ Imetengenezwa kikamilifu!\n\nTumia kwa matangazo yako.`,
            gifPlayback: false
        }, { quoted: mek });

        // Futa faili baada ya kutuma
        setTimeout(() => {
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        }, 5000);

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, {
            text: `❌ Hitilafu katika kutengeneza video!\n\nError: ${error.message}\n\nTafadhali jaribu tena au tumia maandishi mafupi.`
        }, { quoted: mek });
    }
});

// Function ya kutengeneza video
async function createPromoVideo(text) {
    const tempDir = './temp';
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const timestamp = Date.now();
    const outputPath = path.join(tempDir, `promo_${timestamp}.mp4`);
    
    // Kugawanya maandishi kwa mistari
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
        if ((currentLine + ' ' + word).length <= 20) {
            currentLine = currentLine ? currentLine + ' ' + word : word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);

    // Tengeneza faili ya maelezo ya FFmpeg
    const ffmpegScript = generateFFmpegScript(lines, outputPath);
    const scriptPath = path.join(tempDir, `script_${timestamp}.txt`);
    fs.writeFileSync(scriptPath, ffmpegScript);

    try {
        // Tekeleza FFmpeg
        await execAsync(`ffmpeg -f lavfi -i color=c=black:s=1280x720:d=10 -i "https://files.catbox.moe/mp3.wav" ${generateFFmpegFilters(lines)} -y ${outputPath}`);
        
        return outputPath;
    } catch (error) {
        // Ikiwa FFmpeg haipo, tumia backup method
        return await createSimpleVideo(text, outputPath);
    }
}

// Function ya kutumia filters za FFmpeg
function generateFFmpegFilters(lines) {
    let filters = '-filter_complex "';
    
    // Background
    filters += '[0:v]scale=1280:720,format=yuv420p[bg];';
    
    // Maandishi
    lines.forEach((line, index) => {
        const yPos = 200 + (index * 80);
        filters += `[bg]drawtext=text='${line}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=60:fontcolor=white:x=(w-text_w)/2:y=${yPos}:box=1:boxcolor=black@0.5:boxborderw=10[bg${index}];`;
    });
    
    // Audio
    filters += '[1:a]volume=0.5[a];';
    
    // Muundo wa mwisho
    filters += `[bg${lines.length - 1}]`;
    
    filters += '" -map "[bg' + (lines.length - 1) + ']" -map "[a]" -shortest';
    
    return filters;
}

// Function mbadala ikiwa FFmpeg haipo
async function createSimpleVideo(text, outputPath) {
    // Tengeneza picha kwa canvas
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
    gradient.addColorStop(0, '#1a2980');
    gradient.addColorStop(1, '#26d0ce');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 720);
    
    // Maandishi
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 70px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Center text
    const lines = splitTextIntoLines(text, 20);
    lines.forEach((line, index) => {
        const yPos = 300 + (index * 80);
        ctx.fillText(line.toUpperCase(), 640, yPos);
    });
    
    // Additional elements
    ctx.font = '30px Arial';
    ctx.fillText('🔥 PROMOTION 🔥', 640, 500);
    
    // Save image
    const tempDir = './temp';
    const imagePath = path.join(tempDir, `promo_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);
    
    // Convert image to video with FFmpeg
    try {
        await execAsync(`ffmpeg -loop 1 -i ${imagePath} -i "https://files.catbox.moe/mp3.wav" -c:v libx264 -t 10 -pix_fmt yuv420p -y ${outputPath}`);
    } catch (e) {
        // Kama FFmpeg haipo, tuma picha tu
        return imagePath;
    }
    
    // Cleanup
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    
    return outputPath;
}

function splitTextIntoLines(text, maxLength) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        if ((currentLine + ' ' + word).length <= maxLength) {
            currentLine = currentLine ? currentLine + ' ' + word : word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
}

// Function ya kujenga script ya FFmpeg
function generateFFmpegScript(lines, outputPath) {
    let script = `ffmpeg -f lavfi -i color=c=0x1a2980:s=1280x720:d=10 \\\n`;
    script += `-f lavfi -i color=c=0x26d0ce:s=1280x720:d=10 \\\n`;
    script += `-filter_complex "`;
    
    // Crossfade between two colors
    script += `[0:v][1:v]blend=all_expr='A*(if(gte(T,5),1,T/5))+B*(if(gte(T,5),0,1-T/5))'[v];`;
    
    // Add text
    lines.forEach((line, index) => {
        const startTime = index * 2;
        const yPos = 200 + (index * 80);
        script += `[v]drawtext=text='${line}':fontcolor=white:fontsize=60:box=1:boxcolor=black@0.5:x=(w-text_w)/2:y=${yPos}:enable='between(t,${startTime},${startTime + 2})'[v];`;
    });
    
    script += `" \\\n`;
    script += `-c:v libx264 -pix_fmt yuv420p -y ${outputPath}`;
    
    return script;
}

// ALTERNATIVE: Video maker ya kisasa zaidi
cmd({
    pattern: "videomaker",
    desc: "Tengeneza video za kisasa na muundo",
    category: "video",
    react: "🎥",
    filename: __filename
}, async (conn, mek, m, { from, text, args }) => {
    try {
        if (!text) {
            const menu = `
🎥 *VIDEO MAKER PRO*

*Chagua aina ya video:*

1️⃣ *Promo Video* - Matangazo
   • ${config.PREFIX}promovid <maandishi>

2️⃣ *Intro Video* - Utangulizi
   • ${config.PREFIX}intro <jina>

3️⃣ *Outro Video* - Hitimisho
   • ${config.PREFIX}outro <maandishi>

4️⃣ *Announcement* - Tangazo
   • ${config.PREFIX}announce <ujumbe>

5️⃣ *Story Video* - Hadithi fupi
   • ${config.PREFIX}story <maandishi>

*Mifano:*
• ${config.PREFIX}promovid OFA LA LEO 50%
• ${config.PREFIX}intro RAHEEM TV
• ${config.PREFIX}announce MKUTANO KESHO
            `;
            
            return await conn.sendMessage(from, {
                text: menu,
                footer: "Tengeneza video zako mwenyewe!"
            }, { quoted: mek });
        }
        
        await conn.sendMessage(from, {
            text: "🎬 *Video inatengenezwa...* Tafadhali subiri 10 sekunde."
        }, { quoted: mek });

        // Tengeneza video tofauti kulingana na aina
        let videoType = "promo";
        if (args[0] === 'intro') videoType = 'intro';
        if (args[0] === 'outro') videoType = 'outro';
        if (args[0] === 'announce') videoType = 'announce';
        if (args[0] === 'story') videoType = 'story';

        const videoContent = text.replace(args[0] + ' ', '');
        const videoPath = await createStyledVideo(videoContent, videoType);
        
        // Tuma video
        await conn.sendMessage(from, {
            video: { url: videoPath },
            caption: `✅ *${videoType.toUpperCase()} VIDEO*\n\n${videoContent}\n\n📹 Generated by ${config.BOT_NAME}`,
            gifPlayback: false
        }, { quoted: mek });

        // Cleanup
        setTimeout(() => {
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        }, 5000);

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, {
            text: `❌ Samahani, video haikutengenezwa.\n\nSababu: ${error.message}`
        }, { quoted: mek });
    }
});

// Function ya video za kisasa
async function createStyledVideo(text, style = "promo") {
    const tempDir = './temp';
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const outputPath = path.join(tempDir, `video_${Date.now()}.mp4`);
    
    // Background colors kulingana na style
    const styles = {
        promo: { bg1: '0x1a2980', bg2: '0x26d0ce', fontsize: '60' },
        intro: { bg1: '0xff416c', bg2: '0xff4b2b', fontsize: '70' },
        outro: { bg1: '0x0f0c29', bg2: '0x302b63', fontsize: '50' },
        announce: { bg1: '0x232526', bg2: '0x414345', fontsize: '55' },
        story: { bg1: '0x3a1c71', bg2: '0xd76d77', fontsize: '45' }
    };

    const currentStyle = styles[style] || styles.promo;
    
    try {
        // Tengeneza video kwa FFmpeg
        const command = `ffmpeg -f lavfi -i color=c=${currentStyle.bg1}:s=1280x720:d=8 \
        -f lavfi -i color=c=${currentStyle.bg2}:s=1280x720:d=8 \
        -i "https://files.catbox.moe/promoaudio.mp3" \
        -filter_complex "[0:v][1:v]blend=all_expr='A*(if(gte(T,4),1,T/4))+B*(if(gte(T,4),0,1-T/4))'[v]; \
        [v]drawtext=text='${text}':fontcolor=white:fontsize=${currentStyle.fontsize}:box=1:boxcolor=black@0.3:x=(w-text_w)/2:y=(h-text_h)/2[vout]" \
        -map "[vout]" -map "2:a" -c:v libx264 -c:a aac -shortest -y ${outputPath}`;

        await execAsync(command);
        return outputPath;
    } catch (error) {
        // Backup: Tengeneza picha na kuifanya video
        return await createBackupVideo(text, currentStyle, outputPath);
    }
}

async function createBackupVideo(text, style, outputPath) {
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
    gradient.addColorStop(0, style.bg1);
    gradient.addColorStop(1, style.bg2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 720);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${style.fontsize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = splitTextIntoLines(text, 25);
    lines.forEach((line, index) => {
        const yPos = 300 + (index * 80);
        ctx.fillText(line, 640, yPos);
    });
    
    // Save as image
    const tempDir = './temp';
    const imagePath = path.join(tempDir, `temp_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);
    
    // Convert to video
    try {
        await execAsync(`ffmpeg -loop 1 -i ${imagePath} -t 8 -c:v libx264 -pix_fmt yuv420p -y ${outputPath}`);
    } finally {
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
    
    return outputPath;
}

// Quick video command
cmd({
    pattern: "vid",
    desc: "Tengeneza video kwa haraka",
    category: "video",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, text }) => {
    if (!text) {
        return await conn.sendMessage(from, {
            text: `⚡ *QUICK VIDEO*\n\nTumae: ${config.PREFIX}vid <maandishi>\n\nMfano: ${config.PREFIX}vid MESSAGE HERE`
        }, { quoted: mek });
    }
    
    await conn.sendMessage(from, {
        text: `⚡ *Inatengeneza video ya 5 sekunde...*`
    }, { quoted: mek });
    
    try {
        // Simple video creation
        const tempDir = './temp';
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        
        const outputPath = path.join(tempDir, `quick_${Date.now()}.mp4`);
        
        // Create simple video with text
        const command = `ffmpeg -f lavfi -i color=c=0x0088cc:s=640x480:d=5 \
        -vf "drawtext=text='${text}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2" \
        -c:v libx264 -pix_fmt yuv420p -y ${outputPath}`;
        
        await execAsync(command);
        
        await conn.sendMessage(from, {
            video: { url: outputPath },
            caption: `⚡ *QUICK VIDEO*\n\n${text}`
        }, { quoted: mek });
        
        // Cleanup
        setTimeout(() => {
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
        }, 3000);
        
    } catch (error) {
        await conn.sendMessage(from, {
            text: `❌ Samahani, video haikutengenezwa. Tafadhali jaribu tena baadaye.`
        }, { quoted: mek });
    }
});
