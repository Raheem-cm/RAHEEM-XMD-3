const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { File } = require('megajs');

// Multi-session management system
const sessionsDir = path.join(__dirname, '../sessions_multi');

// Initialize sessions directory
if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true });
}

cmd({
    pattern: "deploy",
    alias: ["addsession", "installbot"],
    desc: "Deploy new WhatsApp session without stopping bot",
    category: "owner",
    react: "🚀",
    filename: __filename
}, async (conn, mek, m, { from, sender, text, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        if (!text) {
            return reply("❌ *Usage:* .deploy <SESSION_ID>\n*Example:* `.deploy RAHEEM-XMD~abc123def456`\n\n*Get Session ID:* Ask user to use `.mysession` in their bot");
        }

        const sessionId = text.trim();
        
        // Validate session ID format
        if (!sessionId.includes('RAHEEM-XMD~')) {
            return reply("❌ *Invalid Session Format!*\n\n*Correct Format:* `RAHEEM-XMD~xxxxx`\n*Example:* `.deploy RAHEEM-XMD~abc123def456`");
        }

        reply("⏳ *Downloading session...*");

        // Extract Mega code
        const sessdata = sessionId.replace("RAHEEM-XMD~", "");
        
        // Generate unique name for this session
        const timestamp = Date.now();
        const sessionName = `session_${timestamp}`;
        const sessionFolder = path.join(sessionsDir, sessionName);
        
        // Create session folder
        fs.mkdirSync(sessionFolder, { recursive: true });
        
        // Download from Mega
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
        
        filer.download(async (err, data) => {
            if (err) {
                console.error("Mega download error:", err);
                fs.rmdirSync(sessionFolder, { recursive: true });
                return reply("❌ *Download failed!*\n\n• Check session ID\n• Session might be expired\n• Try again");
            }

            try {
                // Save creds.json
                fs.writeFileSync(path.join(sessionFolder, 'creds.json'), data);
                
                // Verify it's valid JSON
                JSON.parse(data.toString());
                
                // Create session config
                const sessionConfig = {
                    id: sessionId,
                    name: sessionName,
                    timestamp: timestamp,
                    folder: sessionName,
                    status: "pending",
                    deployTime: new Date().toISOString()
                };
                
                // Save config
                fs.writeFileSync(
                    path.join(sessionFolder, 'config.json'),
                    JSON.stringify(sessionConfig, null, 2)
                );
                
                // Start the new session in background
                startNewSession(sessionName, sessionFolder);
                
                reply(`✅ *Session Deployed Successfully!*\n\n` +
                     `📱 *Session Name:* ${sessionName}\n` +
                     `🆔 *ID:* ${sessionId.substring(0, 20)}...\n` +
                     `⏰ *Time:* ${new Date().toLocaleTimeString()}\n\n` +
                     `🔄 *Starting bot in background...*\n` +
                     `📞 *New bot will message you when connected.*`);
                
            } catch (parseError) {
                console.error("Session parse error:", parseError);
                fs.rmdirSync(sessionFolder, { recursive: true });
                reply("❌ *Invalid session file!*\n\nFile is corrupted or not a valid WhatsApp session.");
            }
        });

    } catch (error) {
        console.error("Deploy command error:", error);
        reply("❌ *Deployment Error!*\n\nCheck console for details.");
    }
});

// Start new session in background
function startNewSession(sessionName, sessionPath) {
    const scriptContent = `
const { spawn } = require('child_process');
const path = require('path');

// Copy main bot files to session folder
const fs = require('fs');
const sourceDir = path.join(__dirname, '..');
const targetDir = path.join('${sessionPath}', 'bot_files');

// Create bot files
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Copy essential files
const filesToCopy = [
    'index.js',
    'config.js',
    'command.js',
    'package.json',
    'lib/',
    'plugins/',
    'data/'
];

filesToCopy.forEach(file => {
    const source = path.join(sourceDir, file);
    const target = path.join(targetDir, file);
    
    if (fs.existsSync(source)) {
        if (fs.lstatSync(source).isDirectory()) {
            copyFolderSync(source, target);
        } else {
            fs.copyFileSync(source, target);
        }
    }
});

function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) fs.mkdirSync(target);
    
    fs.readdirSync(source).forEach(element => {
        const sourcePath = path.join(source, element);
        const targetPath = path.join(target, element);
        
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

// Modify config to use this session
const configFile = path.join(targetDir, 'config.js');
if (fs.existsSync(configFile)) {
    let configContent = fs.readFileSync(configFile, 'utf8');
    configContent = configContent.replace(
        /__dirname \\+ '\\/sessions\\/creds\.json'/g,
        \`'\${sessionPath}/creds.json'\`
    );
    fs.writeFileSync(configFile, configContent);
}

// Start bot process
const botProcess = spawn('node', [path.join(targetDir, 'index.js')], {
    detached: true,
    stdio: 'ignore'
});

botProcess.unref();
console.log(\`✅ Bot started for session: ${sessionName}\`);
`;

    const scriptPath = path.join(sessionPath, 'start_bot.js');
    fs.writeFileSync(scriptPath, scriptContent);

    // Execute in background
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Session ${sessionName} start error:`, error);
        } else {
            console.log(`Session ${sessionName} started successfully`);
        }
    });
}

// Command ya kuona sessions zote
cmd({
    pattern: "listsessions",
    alias: ["bots", "allbots"],
    desc: "List all deployed sessions/bots",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        const sessions = fs.readdirSync(sessionsDir)
            .filter(f => fs.statSync(path.join(sessionsDir, f)).isDirectory())
            .sort()
            .reverse();

        if (sessions.length === 0) {
            return reply("📭 *No deployed sessions found.*\n\nUse `.deploy <SESSION_ID>` to add new sessions.");
        }

        let message = `🤖 *ACTIVE SESSIONS/BOTS* 🤖\n\n`;
        let activeCount = 0;
        let totalCount = sessions.length;

        sessions.forEach((session, index) => {
            const sessionPath = path.join(sessionsDir, session);
            const configPath = path.join(sessionPath, 'config.json');
            
            try {
                if (fs.existsSync(configPath)) {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    const time = new Date(config.deployTime).toLocaleString();
                    
                    message += `*${index + 1}.* ${session}\n`;
                    message += `   🆔 ${config.id.substring(0, 15)}...\n`;
                    message += `   ⏰ ${time}\n`;
                    message += `   📁 ${sessionPath}\n\n`;
                    
                    activeCount++;
                }
            } catch (e) {
                message += `*${index + 1}.* ${session} ❌ (Corrupted)\n\n`;
            }
        });

        message += `📊 *Stats:* ${activeCount}/${totalCount} active\n`;
        message += `🚀 *Deploy new:* \`.deploy <SESSION_ID>\`\n`;
        message += `🛑 *Stop bot:* \`.stopsession <number>\`\n`;
        message += `🗑️ *Remove:* \`.removesession <number>\``;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (error) {
        console.error("Listsessions error:", error);
        reply("❌ Error listing sessions.");
    }
});

// Command ya kuzima session
cmd({
    pattern: "stopsession",
    alias: ["stopbot", "killsession"],
    desc: "Stop a running session/bot",
    category: "owner",
    react: "🛑",
    filename: __filename
}, async (conn, mek, m, { from, sender, text, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        if (!text) {
            return reply("❌ *Usage:* .stopsession <session_number>\n*Example:* `.stopsession 1`");
        }

        const sessionNum = parseInt(text);
        if (isNaN(sessionNum) || sessionNum < 1) {
            return reply("❌ Invalid session number!");
        }

        const sessions = fs.readdirSync(sessionsDir)
            .filter(f => fs.statSync(path.join(sessionsDir, f)).isDirectory())
            .sort()
            .reverse();

        if (sessionNum > sessions.length) {
            return reply(`❌ Session #${sessionNum} not found!\n\nAvailable: ${sessions.length} sessions`);
        }

        const sessionName = sessions[sessionNum - 1];
        const sessionPath = path.join(sessionsDir, sessionName);
        
        // Create stop signal file
        const stopFile = path.join(sessionPath, 'STOP');
        fs.writeFileSync(stopFile, '1');
        
        reply(`🛑 *Stopping Session #${sessionNum}*\n\n` +
              `📱 *Session:* ${sessionName}\n` +
              `⏳ *Status:* Stopping...\n\n` +
              `Bot will stop within 30 seconds.`);

    } catch (error) {
        console.error("Stopsession error:", error);
        reply("❌ Error stopping session.");
    }
});

// Command ya kufuta session
cmd({
    pattern: "removesession",
    alias: ["deletesession", "rmbot"],
    desc: "Remove a deployed session",
    category: "owner",
    react: "🗑️",
    filename: __filename
}, async (conn, mek, m, { from, sender, text, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        if (!text) {
            return reply("❌ *Usage:* .removesession <session_number>\n*Example:* `.removesession 1`");
        }

        const sessionNum = parseInt(text);
        if (isNaN(sessionNum) || sessionNum < 1) {
            return reply("❌ Invalid session number!");
        }

        const sessions = fs.readdirSync(sessionsDir)
            .filter(f => fs.statSync(path.join(sessionsDir, f)).isDirectory())
            .sort()
            .reverse();

        if (sessionNum > sessions.length) {
            return reply(`❌ Session #${sessionNum} not found!\n\nAvailable: ${sessions.length} sessions`);
        }

        const sessionName = sessions[sessionNum - 1];
        const sessionPath = path.join(sessionsDir, sessionName);
        
        // First stop the session
        const stopFile = path.join(sessionPath, 'STOP');
        fs.writeFileSync(stopFile, '1');
        
        // Wait 5 seconds then delete
        setTimeout(() => {
            try {
                // Delete folder recursively
                fs.rmSync(sessionPath, { recursive: true, force: true });
                console.log(`Removed session: ${sessionName}`);
            } catch (e) {
                console.error(`Error removing session ${sessionName}:`, e);
            }
        }, 5000);
        
        reply(`🗑️ *Removing Session #${sessionNum}*\n\n` +
              `📱 *Session:* ${sessionName}\n` +
              `⏳ *Status:* Stopping and deleting...\n\n` +
              `Session will be completely removed.`);

    } catch (error) {
        console.error("Removesession error:", error);
        reply("❌ Error removing session.");
    }
});

// Command ya kuona stats
cmd({
    pattern: "botstats",
    alias: ["sessionstats", "stats"],
    desc: "Show bot deployment statistics",
    category: "owner",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        const sessions = fs.readdirSync(sessionsDir)
            .filter(f => fs.statSync(path.join(sessionsDir, f)).isDirectory());

        let activeSessions = 0;
        let totalSize = 0;
        
        sessions.forEach(session => {
            const sessionPath = path.join(sessionsDir, session);
            try {
                const stats = fs.statSync(sessionPath);
                totalSize += stats.size;
                
                // Check if bot is running (has creds.json)
                if (fs.existsSync(path.join(sessionPath, 'creds.json'))) {
                    activeSessions++;
                }
            } catch (e) {
                // Ignore errors
            }
        });

        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        
        const message = `📊 *BOT DEPLOYMENT STATS*\n\n` +
                       `🤖 *Total Sessions:* ${sessions.length}\n` +
                       `✅ *Active Bots:* ${activeSessions}\n` +
                       `📁 *Storage Used:* ${totalSizeMB} MB\n` +
                       `⏰ *Uptime:* ${formatUptime(process.uptime())}\n\n` +
                       `📈 *Capacity:* ${sessions.length}/100 sessions\n` +
                       `💾 *Free Space:* ${getFreeSpace()} MB\n\n` +
                       `*Commands:*\n` +
                       `• .deploy <ID> - Add new bot\n` +
                       `• .listsessions - View all bots\n` +
                       `• .botstats - This stats page`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (error) {
        console.error("Botstats error:", error);
        reply("❌ Error getting statistics.");
    }
});

// Helper functions
function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function getFreeSpace() {
    try {
        const disk = require('diskusage');
        const info = disk.checkSync(__dirname);
        return (info.free / (1024 * 1024)).toFixed(2);
    } catch {
        return "Unknown";
    }
}

// Auto-cleanup old sessions (older than 30 days)
setInterval(() => {
    try {
        const sessions = fs.readdirSync(sessionsDir)
            .filter(f => fs.statSync(path.join(sessionsDir, f)).isDirectory());

        const now = Date.now();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        sessions.forEach(session => {
            const sessionPath = path.join(sessionsDir, session);
            try {
                const stats = fs.statSync(sessionPath);
                if (now - stats.mtimeMs > thirtyDays) {
                    // Check if STOP file exists (inactive)
                    if (fs.existsSync(path.join(sessionPath, 'STOP'))) {
                        fs.rmSync(sessionPath, { recursive: true, force: true });
                        console.log(`Auto-cleaned old session: ${session}`);
                    }
                }
            } catch (e) {
                // Ignore errors
            }
        });
    } catch (error) {
        console.error("Auto-cleanup error:", error);
    }
}, 24 * 60 * 60 * 1000); // Every 24 hours
