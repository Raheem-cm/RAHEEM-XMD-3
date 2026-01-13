const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "play",
    alias: ["yt2", "music", "song"],
    react: "🎵",
    desc: "YouTube Downloader with Interactive Buttons",
    category: "download",
    use: ".play <song/video name>",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return await conn.sendMessage(from, {
                text: `🎵 *𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*\n\n*Usage:* .play <song/video name>\n*Example:* .play Shape of You\n\n*Powered by ${config.BOT_NAME || 'RAHEEM'}*`,
                footer: "Search and download YouTube content"
            }, { quoted: mek });
        }

        // Search YouTube
        const search = await yts(text);
        const data = search.videos[0];
        
        if (!data) {
            return await reply("❌ *No results found!*\nPlease try different search terms.");
        }

        // Create interactive message with buttons
        const fancyMsg = `
╔══════════════════════════╗
       ♪  *𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑* ♪
╠══════════════════════════╣
🎬 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
👁️ *Views:* ${data.views.toLocaleString()}
👤 *Channel:* ${data.author.name}
📅 *Uploaded:* ${data.ago}
╚══════════════════════════╝
`;

        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: fancyMsg,
            footer: `Choose download format below • ${config.BOT_NAME}`,
            templateButtons: [
                {
                    index: 1,
                    quickReplyButton: {
                        displayText: "🎧 MP3 Audio",
                        id: `.ytmp3 ${data.url}`
                    }
                },
                {
                    index: 2,
                    quickReplyButton: {
                        displayText: "🎥 MP4 Video",
                        id: `.ytmp4 ${data.url}`
                    }
                },
                {
                    index: 3,
                    quickReplyButton: {
                        displayText: "📁 Audio (Doc)",
                        id: `.ytmp3doc ${data.url}`
                    }
                },
                {
                    index: 4,
                    quickReplyButton: {
                        displayText: "💿 Video (Doc)",
                        id: `.ytmp4doc ${data.url}`
                    }
                }
            ],
            contextInfo: {
                externalAdReply: {
                    title: "🎵 YouTube Premium DL",
                    body: "Choose your format • RAHEEM-XMD",
                    thumbnail: { url: data.thumbnail },
                    mediaType: 1,
                    sourceUrl: data.url
                }
            }
        }, { quoted: mek });

        // React to show success
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        console.error('Play command error:', error);
        await reply("❌ *Error searching YouTube!* Try again later.");
    }
});

// ==================== SUPPORTING COMMANDS ====================

// MP3 Audio command
cmd({
    pattern: "ytmp3",
    desc: "Download YouTube as MP3 audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return await reply("❌ *Please provide YouTube URL!*\nExample: .ytmp3 https://youtube.com/...");

        await reply("⬇️ *Downloading MP3 audio...* Please wait ⏳");

        // Use YouTube download API
        const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(text.trim())}`;
        
        const response = await fetch(apiUrl);
        const json = await response.json();
        
        if (!json.success || !json.result?.download_url) {
            return await reply("❌ *Failed to download!* Try again or use different URL.");
        }

        const audioUrl = json.result.download_url;
        const title = json.result.title || "YouTube Audio";

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: "🎧 MP3 Download",
                    body: title.substring(0, 50),
                    thumbnail: { url: "https://files.catbox.moe/music.jpg" },
                    mediaType: 2
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error('YTMP3 error:', error);
        await reply("❌ *Download failed!* API error or invalid URL.");
    }
});

// MP4 Video command
cmd({
    pattern: "ytmp4",
    desc: "Download YouTube as MP4 video",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return await reply("❌ *Please provide YouTube URL!*");

        await reply("⬇️ *Downloading MP4 video...* This may take a minute ⏳");

        // Use YouTube download API
        const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(text.trim())}`;
        
        const response = await fetch(apiUrl);
        const json = await response.json();
        
        if (!json.success || !json.result?.download_url) {
            return await reply("❌ *Failed to download video!* Try another URL.");
        }

        const videoUrl = json.result.download_url;
        const title = json.result.title || "YouTube Video";

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `🎬 *${title}*\n\n✅ Downloaded successfully!\n📁 Size: ${json.result.filesize || 'N/A'}`,
            gifPlayback: false
        }, { quoted: mek });

    } catch (error) {
        console.error('YTMP4 error:', error);
        await reply("❌ *Video download failed!* File might be too large.");
    }
});

// MP3 as Document
cmd({
    pattern: "ytmp3doc",
    desc: "Download YouTube audio as document",
    category: "download",
    react: "📁",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return await reply("❌ *YouTube URL required!*");

        await reply("📁 *Downloading as document...*");

        const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(text.trim())}`;
        
        const response = await fetch(apiUrl);
        const json = await response.json();
        
        if (!json.success || !json.result?.download_url) {
            return await reply("❌ *Download failed!*");
        }

        const audioUrl = json.result.download_url;
        const title = json.result.title || "Audio";

        await conn.sendMessage(from, {
            document: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `📁 *${title}*\n\nAudio saved as document for easy sharing.`
        }, { quoted: mek });

    } catch (error) {
        console.error('YTMP3DOC error:', error);
        await reply("❌ *Failed to download document!*");
    }
});

// MP4 as Document
cmd({
    pattern: "ytmp4doc",
    desc: "Download YouTube video as document",
    category: "download",
    react: "💿",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return await reply("❌ *YouTube URL required!*");

        await reply("💿 *Downloading video as document...* Please wait");

        const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(text.trim())}`;
        
        const response = await fetch(apiUrl);
        const json = await response.json();
        
        if (!json.success || !json.result?.download_url) {
            return await reply("❌ *Video download failed!*");
        }

        const videoUrl = json.result.download_url;
        const title = json.result.title || "Video";

        await conn.sendMessage(from, {
            document: { url: videoUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `💿 *${title}*\n\nVideo saved as document file.`
        }, { quoted: mek });

    } catch (error) {
        console.error('YTMP4DOC error:', error);
        await reply("❌ *Failed to save video as document!*");
    }
});

// Alternative simple play command
cmd({
    pattern: "play5",
    alias: ["ytsearch"],
    desc: "Search YouTube videos",
    category: "download",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return await reply("🔍 *YouTube Search*\n\nUsage: .play2 <search query>\nExample: .play2 trending songs 2024");
        }

        const search = await yts(text);
        const videos = search.videos.slice(0, 5);
        
        if (!videos.length) {
            return await reply("❌ *No videos found!* Try different keywords.");
        }

        let resultText = `🔍 *YouTube Search Results*\n\n`;
        
        videos.forEach((video, index) => {
            resultText += `*${index + 1}. ${video.title}*\n`;
            resultText += `   ⏱️ ${video.timestamp} | 👁️ ${video.views.toLocaleString()}\n`;
            resultText += `   👤 ${video.author.name}\n`;
            resultText += `   🔗 .ytmp4 ${video.url}\n\n`;
        });

        resultText += `*Reply with number to download* (1-5)`;

        await conn.sendMessage(from, {
            text: resultText,
            footer: "Choose video by number • RAHEEM-XMD"
        }, { quoted: mek });

    } catch (error) {
        console.error('Play2 error:', error);
        await reply("❌ *Search failed!* Check your connection.");
    }
});

console.log(`
╔════════════════════════════════════╗
║     🎵 YOUTUBE DOWNLOADER 🎵      ║
╠════════════════════════════════════╣
║ ✅ Commands: .play, .ytmp3,       ║
║           .ytmp4, .ytmp3doc,      ║
║           .ytmp4doc, .play5       ║
║ ✅ Features: Interactive buttons  ║
║ ✅ APIs: yt-search, download APIs ║
╚════════════════════════════════════╝
`);
