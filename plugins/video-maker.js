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
    duration: 8, // seconds
    tempDir: './temp_video_maker',
    fontSize: 48,
    fontColor: 'white',
    bgColor: 'blue'
};

// ==================== UTILITIES ====================
function createTempDir() {
    if (!fs.existsSync(CONFIG.tempDir)) {
        fs.mkdirSync(CONFIG.tempDir, { recursive: true });
    }
}

function cleanOldFiles() {
    if (fs.existsSync(CONFIG.tempDir)) {
        const files = fs.readdirSync(CONFIG.tempDir);
        const now = Date.now();
        
        files.forEach(file => {
            const filePath = path.join(CONFIG.tempDir, file);
            try {
                const stats = fs.statSync(filePath);
                // Delete files older than 1 hour
                if (now - stats.mtimeMs > 3600000) {
                    fs.unlinkSync(filePath);
                }
            } catch (e) {
                // Ignore errors
            }
        });
    }
}

// ==================== FFMPEG CHECK ====================
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
    try {
        createTempDir();
        
        const timestamp = Date.now();
        const outputFile = path.join(CONFIG.tempDir, `video_${timestamp}.mp4`);
        
        // Define styles
        const styles = {
            1: { bg: '0x1E90FF', text: 'white' }, // DodgerBlue
            2: { bg: '0xDC143C', text: 'white' }, // Crimson
            3: { bg: '0x32CD32', text: 'black' }, // LimeGreen
            4: { bg: '0xFFD700', text: 'black' }, // Gold
            5: { bg: '0x8A2BE2', text: 'white' }, // BlueViolet
            6: { bg: '0x000000', text: 'white' }, // Black
            7: { bg: '0xFFFFFF', text: 'black' }, // White
            8: { bg: '0xFF69B4', text: 'white' }  // HotPink
        };
        
        const selected = styles[style] || styles[1];
        
        // Escape text for shell
        const safeText = text.replace(/'/g, "'\\''");
        
        // Build FFmpeg command
        const cmd = `ffmpeg -f lavfi -i color=c=${selected.bg}:s=${CONFIG.videoWidth}x${CONFIG.videoHeight}:d=${CONFIG.duration} ` +
                   `-vf "drawtext=text='${safeText}':fontcolor=${selected.text}:fontsize=${CONFIG.fontSize}:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=black@0.5:boxborderw=5" ` +
                   `-c:v libx264 -pix_fmt yuv420p -y "${outputFile}"`;
        
        console.log('Executing:', cmd.substring(0, 100) + '...');
        
        await execAsync(cmd, { timeout: 30000 });
        
        // Verify video was created
        if (fs.existsSync(outputFile) && fs.statSync(outputFile).size > 1024) {
            return outputFile;
        } else {
            throw new Error('Video file not created or too small');
        }
        
    } catch (error) {
        console.error('Video creation error:', error);
        throw error;
    }
}

// ==================== FALLBACK METHOD ====================
async function createFallbackVideo(text) {
    try {
        createTempDir();
        
        const timestamp = Date.now();
        const outputFile = path.join(CONFIG.tempDir, `fallback_${timestamp}.mp4`);
        
        // Simple text file as fallback
        const textFile = path.join(CONFIG.tempDir, `text_${timestamp}.txt`);
        fs.writeFileSync(textFile, `🎬 VIDEO PROMO\n\n${text}\n\n✅ Created by Video Maker\n⏱️ Duration: ${CONFIG.duration}s`);
        
        // Create a simple video from image (if we had one) or just use text
        // For now, we'll create a blank video with text overlay
        const cmd = `ffmpeg -f lavfi -i color=c=blue:s=640x480:d=5 ` +
                   `-vf "drawtext=text='${text.replace(/'/g, "'\\''")}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=(h-text_h)/2" ` +
                   `-c:v libx264 -pix_fmt yuv420p -y "${outputFile}"`;
        
        await execAsync(cmd, { timeout: 15000 });
        
        return outputFile;
    } catch (error) {
        console.error('Fallback video error:', error);
        return null;
    }
}

// ==================== MAIN COMMAND ====================
cmd({
    pattern: "videomake",
    desc: "Tengeneza video ya promosheni kwa maandishi",
    category: "video",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, args, reply, prefix }) => {
    try {
        // ============ SHOW HELP ============
        if (!text || text === 'help' || text === 'menu') {
            const helpMessage = `
🎬 *VIDEO MAKER PRO* 🎬

*TUMIA:*
${prefix}videomake <maandishi>
${prefix}videomake style <namba> <maandishi>

*MIFANO:*
• ${prefix}videomake OFA LA LEO 50%
• ${prefix}videomake style 2 NUNUA SASA
• ${prefix}videomake style 3 KARIBU KWETU

*MITINDO YA VIDEO (1-8):*
1️⃣ Blue Background
2️⃣ Red Background  
3️⃣ Green Background
4️⃣ Gold Background
5️⃣ Purple Background
6️⃣ Black Background
7️⃣ White Background
8️⃣ Pink Background

*VIDEO INFO:*
📏 Size: 640x480
⏱️ Duration: 8 seconds
🎨 Colors: Auto selection
⚡ Speed: Fast processing

*COMMANDS ZA ZIADA:*
• ${prefix}videocheck - Angalia kama ffmpeg iko
• ${prefix}videosetup - Maelekezo ya kusanidi

🔧 *Developed by RAHEEM-XMD*
            `;
            
            return await reply(helpMessage);
        }
        
        // ============ CHECK FFMPEG ============
        if (text === 'check' || text === 'test') {
            const hasFFmpeg = await checkFFmpeg();
            if (hasFFmpeg) {
                return await reply('✅ FFmpeg iko installed na inafanya kazi vizuri!\n\nSasa unaweza kutengeneza video kwa: ' + prefix + 'videomake <maandishi>');
            } else {
                return await reply('❌ FFmpeg haipo! Tafadhali sakinisha ffmpeg kwanza:\n\n' +
                    '*Termux:* `pkg install ffmpeg`\n' +
                    '*Ubuntu:* `sudo apt install ffmpeg`\n' +
                    '*Windows:* Download kutoka ffmpeg.org\n\n' +
                    'Kisha tumia: ' + prefix + 'videomake setup');
            }
        }
        
        // ============ SETUP GUIDE ============
        if (text === 'setup') {
            const setupGuide = `
🔧 *VIDEO MAKER SETUP GUIDE*

*MUHIMU KUFANYA KABLA YA KUTUMIA:*

1️⃣ *INSTALL FFMPEG:*
   • *Termux:* \`pkg install ffmpeg\`
   • *Ubuntu/Debian:* \`sudo apt install ffmpeg\`
   • *Windows:* Download kutoka ffmpeg.org

2️⃣ *TEST FFMPEG:*
   Tumae: ${prefix}videomake check

3️⃣ *AUDIO (Optional):*
   Hakuna haja ya audio files

4️⃣ *FONTS (Optional):*
   System fonts zitakuja moja kwa moja

*MATUMIZI:*
1. Install ffmpeg
2. Test kwa: ${prefix}videomake check
3. Tengeneza video kwa: ${prefix}videomake hello world

*TROUBLESHOOTING:*
• Hakikisha ffmpeg iko kwenye PATH
• Restart bot baada ya kusanidi ffmpeg
• Tumia commands rahisi kwanza

✅ *Kama ffmpeg iko, video maker itafanya kazi 100%!*
            `;
            
            return await reply(setupGuide);
        }
        
        // ============ PROCESS VIDEO REQUEST ============
        await reply(`🎬 *Video inatengenezwa...*\n\n📝 Maandishi: "${text}"\n⏳ Tafadhali subiri 10 sekunde...`);
        
        // Check FFmpeg first
        const hasFFmpeg = await checkFFmpeg();
        if (!hasFFmpeg) {
            return await reply('❌ FFmpeg haipo! Tafadhali sakinisha ffmpeg kwanza.\n\nTumae: ' + prefix + 'videomake setup');
        }
        
        // Parse style and text
        let style = 1;
        let videoText = text;
        
        const parts = text.split(' ');
        if (parts[0] === 'style' && parts[1] && !isNaN(parts[1])) {
            style = parseInt(parts[1]);
            if (style < 1) style = 1;
            if (style > 8) style = 8;
            videoText = parts.slice(2).join(' ');
            
            if (!videoText) {
                return await reply(`❌ Tafadhali andika maandishi baada ya style!\n\nExample: ${prefix}videomake style 1 MAANDISHI YAKO`);
            }
        }
        
        // Create video
        let videoPath;
        try {
            videoPath = await createVideo(videoText, style);
        } catch (error) {
            console.error('Main video creation failed:', error);
            videoPath = await createFallbackVideo(videoText);
        }
        
        if (!videoPath) {
            return await reply('❌ Samahani, video haikutengenezwa!\n\nSababu: FFmpeg ina shida au hakuna uwezo wa kutengeneza video.\n\nTumae: ' + prefix + 'videomake setup');
        }
        
        // Send video
        await conn.sendMessage(from, {
            video: { 
                url: videoPath 
            },
            caption: `🎬 *VIDEO PROMO*\n\n${videoText}\n\n✅ Imetengenezwa kikamilifu!\n🎨 Style: ${style}\n📏 Size: ${CONFIG.videoWidth}x${CONFIG.videoHeight}\n⏱️ Duration: ${CONFIG.duration}s\n\n*"Tumia kwa matangazo yako!"*`,
            gifPlayback: false
        }, { quoted: mek });
        
        // Cleanup after 30 seconds
        setTimeout(() => {
            try {
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                    console.log('Cleaned up video:', path.basename(videoPath));
                }
            } catch (e) {
                // Silent cleanup
            }
        }, 30000);
        
    } catch (error) {
        console.error('Video maker command error:', error);
        await reply(`❌ Hitilafu: ${error.message}\n\nTumae: ${prefix}videomake setup kwa maelekezo`);
    }
});

// ==================== QUICK VIDEO COMMAND ====================
cmd({
    pattern: "promo",
    desc: "Tengeneza video ya promosheni kwa haraka",
    category: "video",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, prefix }) => {
    if (!text) {
        return await reply(`⚡ *QUICK PROMO VIDEO*\n\nTumae: ${prefix}promo <maandishi>\n\nExample: ${prefix}promo OFA LA LEO`);
    }
    
    try {
        await reply(`⚡ *Inatengeneza video ya 5 sekunde...*`);
        
        // Check FFmpeg
        const hasFFmpeg = await checkFFmpeg();
        if (!hasFFmpeg) {
            return await reply('❌ FFmpeg haipo! Tafadhali sakinisha ffmpeg kwanza.\n\nTumae: .videomake setup');
        }
        
        createTempDir();
        const timestamp = Date.now();
        const outputFile = path.join(CONFIG.tempDir, `quick_${timestamp}.mp4`);
        
        // Create quick video
        const safeText = text.replace(/'/g, "'\\''");
        const cmd = `ffmpeg -f lavfi -i color=c=black:s=480x360:d=5 ` +
                   `-vf "drawtext=text='${safeText}':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=(h-text_h)/2" ` +
                   `-c:v libx264 -pix_fmt yuv420p -y "${outputFile}"`;
        
        await execAsync(cmd, { timeout: 15000 });
        
        // Verify and send
        if (fs.existsSync(outputFile) && fs.statSync(outputFile).size > 1024) {
            await conn.sendMessage(from, {
                video: { url: outputFile },
                caption: `⚡ *QUICK PROMO*\n\n${text}\n\n✅ Video imetengenezwa kwa sekunde 5!`
            }, { quoted: mek });
            
            // Cleanup
            setTimeout(() => {
                try {
                    if (fs.existsSync(outputFile)) {
                        fs.unlinkSync(outputFile);
                    }
                } catch (e) {
                    // Silent
                }
            }, 30000);
        } else {
            await reply('❌ Video haikutengenezwa! Jaribu tena.');
        }
        
    } catch (error) {
        console.error('Quick promo error:', error);
        await reply('❌ Video haikutengenezwa! Tumae: .videomake setup');
    }
});

// ==================== SIMPLE TEST COMMAND ====================
cmd({
    pattern: "vidtest",
    desc: "Test video maker na maandishi rahisi",
    category: "video",
    react: "🧪",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await reply('🧪 *Inatengeneza video ya test...*');
        
        const hasFFmpeg = await checkFFmpeg();
        if (!hasFFmpeg) {
            return await reply('❌ FFmpeg haipo! Sakinisha ffmpeg kwanza.');
        }
        
        createTempDir();
        const outputFile = path.join(CONFIG.tempDir, `test_${Date.now()}.mp4`);
        
        const cmd = `ffmpeg -f lavfi -i color=c=green:s=320x240:d=3 ` +
                   `-vf "drawtext=text='TEST VIDEO':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2" ` +
                   `-c:v libx264 -pix_fmt yuv420p -y "${outputFile}"`;
        
        await execAsync(cmd, { timeout: 10000 });
        
        if (fs.existsSync(outputFile)) {
            await conn.sendMessage(from, {
                video: { url: outputFile },
                caption: '🧪 *TEST VIDEO*\n\n✅ Video maker inafanya kazi!\n\nSasa unaweza kutengeneza video yako.'
            }, { quoted: mek });
            
            setTimeout(() => {
                try {
                    if (fs.existsSync(outputFile)) {
                        fs.unlinkSync(outputFile);
                    }
                } catch (e) {}
            }, 20000);
        } else {
            await reply('❌ Test imeshindwa! Hakikisha ffmpeg iko installed.');
        }
        
    } catch (error) {
        console.error('Test error:', error);
        await reply('❌ Test imeshindwa: ' + error.message);
    }
});

// ==================== AUTO CLEANUP ====================
setInterval(cleanOldFiles, 600000); // Clean every 10 minutes

// ==================== INITIALIZATION ====================
console.log(`
╔══════════════════════════════════════╗
║        🎬 VIDEO MAKER PLUGIN 🎬       ║
╠══════════════════════════════════════╣
║ ✅ Loaded: video-maker.js           ║
║ ✅ Commands: .videomake, .promo     ║
║ ✅ Test Command: .vidtest           ║
║ ✅ Temp Directory: ${CONFIG.tempDir}  ║
╚══════════════════════════════════════╝
`);

// Initial cleanup
createTempDir();
cleanOldFiles();
