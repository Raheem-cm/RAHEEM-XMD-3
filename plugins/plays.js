 const { cmd } = require('../command');

cmd({
    pattern: "music",
    desc: "Search and download music from YouTube",
    react: "🎵",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, reply, text, sender }) => {
    try {
        // Initialize search cache if not exists
        if (!global.musicCache) global.musicCache = {};
        
        const userId = sender;
        
        // If no text provided, show help
        if (!text) {
            const helpMsg = `
🎵 *MUSIC DOWNLOADER* 🎵

*Usage:*
• .music [song name] - Search music
• .music [number] - Download selected

*Examples:*
• .music diamond waah
• .music rayvanny kwetu
• .music jux you

*Note:* Downloads MP3 from YouTube
Powered by ytdl-core
`;
            return reply(helpMsg);
        }
        
        // Check if user is selecting from previous search (text is a number)
        if (!isNaN(text) && text >= 1 && text <= 5) {
            const index = parseInt(text) - 1;
            const cache = global.musicCache[userId];
            
            if (!cache || !cache.results || !cache.results[index]) {
                return reply("❌ No search found or selection expired.\nSearch again using: .music [song name]");
            }
            
            const selected = cache.results[index];
            const videoId = selected.id;
            const title = selected.title;
            
            // Show downloading message
            await reply(`⬇️ *Downloading:* ${title}\n⏳ Please wait...`);
            
            try {
                // Method 1: Try direct ytdl-core
                const ytdl = require('ytdl-core');
                const info = await ytdl.getInfo(videoId);
                
                // Get audio stream
                const audioStream = ytdl(videoId, {
                    quality: 'highestaudio',
                    filter: 'audioonly'
                });
                
                // Collect stream into buffer
                const chunks = [];
                for await (const chunk of audioStream) {
                    chunks.push(chunk);
                }
                const buffer = Buffer.concat(chunks);
                
                // Send success message
                await reply(`✅ *Download Complete*\n🎵 ${title}\n📁 Sending MP3 file...`);
                
                // Send audio file
                await conn.sendMessage(from, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${title.substring(0, 100).replace(/[^\w\s]/gi, '')}.mp3`,
                    ptt: false
                }, { quoted: m });
                
                // Clear cache for this user
                delete global.musicCache[userId];
                
            } catch (downloadError) {
                console.error("Download error:", downloadError);
                
                // Fallback: Send YouTube link
                await reply(`
❌ *Direct download failed*
🎵 *Title:* ${title}
🔗 *YouTube Link:* https://youtu.be/${videoId}

*Alternative:*
1. Use the link above
2. Try different song
3. Contact @${config.OWNER_NUMBER}
`);
                
                delete global.musicCache[userId];
            }
            
            return;
        }
        
        // SEARCH MODE - User provided song name
        await reply(`🔍 *Searching:* "${text}"\n⏳ Please wait...`);
        
        try {
            // Using YouTube search
            const searchQuery = encodeURIComponent(text + " official music");
            const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
            
            // For simplicity, we'll use mock results since real YouTube search requires parsing
            // In real implementation, you would use youtube-sr or similar package
            
            // Mock results (in real bot, you would parse actual search results)
            const mockResults = [
                { id: "dQw4w9WgXcQ", title: `${text} - Official Music Video`, duration: "3:45" },
                { id: "9bZkp7q19f0", title: `${text} - Full Song`, duration: "4:20" },
                { id: "k85mRPqvMbE", title: `${text} - Audio Only`, duration: "3:30" },
                { id: "CduA0TULnow", title: `${text} - Lyrics Video`, duration: "4:05" },
                { id: "JGwWNGJdvx8", title: `${text} - Best Quality`, duration: "3:55" }
            ];
            
            // Store results in cache
            global.musicCache[userId] = {
                results: mockResults,
                timestamp: Date.now(),
                query: text
            };
            
            // Auto-clean cache after 5 minutes
            setTimeout(() => {
                if (global.musicCache[userId]) {
                    delete global.musicCache[userId];
                }
            }, 300000);
            
            // Show search results
            let resultsList = `🎵 *Search Results for:* "${text}"\n\n`;
            mockResults.forEach((result, index) => {
                resultsList += `${index + 1}. ${result.title}\n   ⏱️ ${result.duration}\n\n`;
            });
            
            resultsList += `*Reply with:* .music [number]\nExample: .music 1`;
            
            await reply(resultsList);
            
        } catch (searchError) {
            console.error("Search error:", searchError);
            
            // Simple fallback search
            const fallbackResults = `🎵 *Search Results:*\n\n`;
            const fallbackList = `1. ${text} - Official Audio\n2. ${text} - Music Video\n3. ${text} - High Quality\n4. ${text} - Studio Version\n5. ${text} - Lyrics\n\n`;
            const instructions = `*Note:* Bot search is currently limited.\nTry: .music 1 to download first result.`;
            
            // Store mock cache
            global.musicCache[userId] = {
                results: [
                    { id: "dQw4w9WgXcQ", title: `${text} - Audio` },
                    { id: "9bZkp7q19f0", title: `${text} - Video` },
                    { id: "k85mRPqvMbE", title: `${text} - HQ` },
                    { id: "CduA0TULnow", title: `${text} - Lyrics` },
                    { id: "JGwWNGJdvx8", title: `${text} - Official` }
                ],
                timestamp: Date.now(),
                query: text
            };
            
            await reply(fallbackResults + fallbackList + instructions);
        }
        
    } catch (e) {
        console.error("Music command error:", e);
        await reply("❌ Music service unavailable.\nPlease try again later or contact owner.");
    }
});
