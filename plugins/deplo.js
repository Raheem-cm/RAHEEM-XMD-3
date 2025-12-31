 const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { File } = require('megajs');

cmd({
    pattern: "deploy",
    alias: ["installsession", "addsession"],
    desc: "Deploy WhatsApp session from session ID",
    category: "owner",
    react: "🚀",
    filename: __filename
}, async (conn, mek, m, { from, sender, text, reply, isCreator }) => {
    try {
        // Check if user is owner/creator
        if (!isCreator) {
            return reply("❌ This command is for bot owner only!");
        }

        if (!text) {
            return reply("❌ *Usage:* .deploy <SESSION_ID>\n*Example:* `.deploy RAHEEM-XMD~abc#def123`");
        }

        const sessionId = text.trim();
        
        // Check if session ID is valid format
        if (!sessionId.includes('RAHEEM-XMD~') || sessionId.length < 20) {
            return reply("❌ Invalid session ID format!\n\n*Correct Format:* `RAHEEM-XMD~xxxxx`\n*Example:* `.deploy RAHEEM-XMD~abc123def456`");
        }

        reply("⏳ Downloading and deploying session...");

        // Extract Mega link code
        const sessdata = sessionId.replace("RAHEEM-XMD~", "");
        
        // Check if creds.json already exists
        const credsPath = path.join(__dirname, '../sessions/creds.json');
        if (fs.existsSync(credsPath)) {
            // Create backup of current session
            const backupDir = path.join(__dirname, '../sessions_backup');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            
            const backupFile = `creds_backup_${Date.now()}.json`;
            fs.copyFileSync(credsPath, path.join(backupDir, backupFile));
        }

        // Download session from Mega
        try {
            const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
            
            filer.download((err, data) => {
                if (err) {
                    console.error("Mega download error:", err);
                    return reply("❌ Failed to download session. Check session ID.");
                }

                // Write session file
                fs.writeFileSync(credsPath, data);
                
                // Check if file is valid JSON
                try {
                    JSON.parse(data.toString());
                    
                    reply("✅ Session deployed successfully!\n\n📱 *Next Steps:*\n1. Bot will auto-restart\n2. Wait for connection\n3. Check owner number for confirmation\n\n⚠️ *Note:* Old session was backed up.");
                    
                    // Auto-restart bot after 3 seconds
                    setTimeout(() => {
                        process.exit(0);
                    }, 3000);
                    
                } catch (parseError) {
                    // Restore backup if exists
                    const backupDir = path.join(__dirname, '../sessions_backup');
                    const backupFiles = fs.existsSync(backupDir) ? fs.readdirSync(backupDir).filter(f => f.endsWith('.json')).sort().reverse() : [];
                    
                    if (backupFiles.length > 0) {
                        const latestBackup = path.join(backupDir, backupFiles[0]);
                        fs.copyFileSync(latestBackup, credsPath);
                    } else {
                        fs.unlinkSync(credsPath);
                    }
                    
                    reply("❌ Invalid session file (not JSON). Restored backup if available.");
                }
            });
            
        } catch (megaError) {
            console.error("Mega file error:", megaError);
            reply("❌ Error accessing Mega file. Session might be expired or invalid.");
        }

    } catch (error) {
        console.error("Deploy command error:", error);
        reply("❌ Error deploying session. Please check the session ID.");
    }
});

// Command ya kuona available sessions
cmd({
    pattern: "sessions",
    alias: ["listsessions", "mysessions"],
    desc: "List available sessions (owner only)",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        const sessionsDir = path.join(__dirname, '../sessions_backup');
        
        if (!fs.existsSync(sessionsDir)) {
            return reply("📭 No session backups available.\n\nUse `.deploy` to add new sessions.");
        }

        const backupFiles = fs.readdirSync(sessionsDir)
            .filter(f => f.endsWith('.json'))
            .sort()
            .reverse()
            .slice(0, 10); // Last 10 backups

        if (backupFiles.length === 0) {
            return reply("📭 No session backups found.");
        }

        let message = "📋 *Available Sessions*\n\n";
        
        backupFiles.forEach((file, index) => {
            const filePath = path.join(sessionsDir, file);
            const stats = fs.statSync(filePath);
            const date = new Date(stats.mtime).toLocaleString();
            const size = (stats.size / 1024).toFixed(2);
            
            message += `*${index + 1}.* ${file}\n`;
            message += `   📅 ${date}\n`;
            message += `   📊 ${size} KB\n\n`;
        });

        message += `*Total Backups:* ${backupFiles.length}\n`;
        message += `*Current Session:* ${fs.existsSync(path.join(__dirname, '../sessions/creds.json')) ? '✅ Active' : '❌ None'}\n\n`;
        message += `*Commands:*\n`;
        message += `• .deploy <ID> - Deploy session\n`;
        message += `• .restoresession <number> - Restore backup\n`;
        message += `• .deletesession <number> - Delete backup`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (error) {
        console.error("Sessions command error:", error);
        reply("❌ Error listing sessions.");
    }
});

// Command ya kurestore session backup
cmd({
    pattern: "restoresession",
    alias: ["restorebackup", "loadsession"],
    desc: "Restore session from backup",
    category: "owner",
    react: "🔄",
    filename: __filename
}, async (conn, mek, m, { from, sender, text, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        if (!text) {
            return reply("❌ *Usage:* .restoresession <backup_number>\n*Example:* `.restoresession 1`");
        }

        const backupNum = parseInt(text);
        if (isNaN(backupNum) || backupNum < 1) {
            return reply("❌ Invalid backup number!");
        }

        const sessionsDir = path.join(__dirname, '../sessions_backup');
        if (!fs.existsSync(sessionsDir)) {
            return reply("❌ No backup directory found.");
        }

        const backupFiles = fs.readdirSync(sessionsDir)
            .filter(f => f.endsWith('.json'))
            .sort()
            .reverse();

        if (backupNum > backupFiles.length) {
            return reply(`❌ Backup #${backupNum} not found. Available: ${backupFiles.length}`);
        }

        const backupFile = backupFiles[backupNum - 1];
        const backupPath = path.join(sessionsDir, backupFile);
        const credsPath = path.join(__dirname, '../sessions/creds.json');

        // Backup current session first
        if (fs.existsSync(credsPath)) {
            const tempBackup = path.join(sessionsDir, `temp_restore_backup_${Date.now()}.json`);
            fs.copyFileSync(credsPath, tempBackup);
        }

        // Restore backup
        fs.copyFileSync(backupPath, credsPath);
        
        const stats = fs.statSync(backupPath);
        const date = new Date(stats.mtime).toLocaleString();

        reply(`✅ Session restored from backup #${backupNum}!\n\n📁 *File:* ${backupFile}\n📅 *Date:* ${date}\n\n🔄 Bot will restart in 3 seconds...`);

        setTimeout(() => {
            process.exit(0);
        }, 3000);

    } catch (error) {
        console.error("Restore session error:", error);
        reply("❌ Error restoring session.");
    }
});

// Command ya kutoa session ID ya sasa
cmd({
    pattern: "getsession",
    alias: ["currentsession", "mysessionid"],
    desc: "Get current session ID for sharing",
    category: "owner",
    react: "🔑",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        const credsPath = path.join(__dirname, '../sessions/creds.json');
        
        if (!fs.existsSync(credsPath)) {
            return reply("❌ No active session found.");
        }

        // Read session file
        const sessionData = fs.readFileSync(credsPath);
        
        // Generate unique ID for this session
        const crypto = require('crypto');
        const sessionHash = crypto.createHash('md5').update(sessionData).digest('hex').substring(0, 12);
        
        const sessionId = `RAHEEM-XMD~${sessionHash}`;
        const fileSize = (sessionData.length / 1024).toFixed(2);
        const modDate = new Date(fs.statSync(credsPath).mtime).toLocaleString();

        const message = `🔑 *Current Session ID*\n\n` +
                       `*Session ID:* \`${sessionId}\`\n` +
                       `*Size:* ${fileSize} KB\n` +
                       `*Modified:* ${modDate}\n\n` +
                       `📤 *Share this ID:*\n\`\`\`${sessionId}\`\`\`\n\n` +
                       `*Usage:*\n\`\`\`.deploy ${sessionId}\`\`\`\n\n` +
                       `⚠️ *Warning:* Keep this ID private!`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (error) {
        console.error("Get session error:", error);
        reply("❌ Error getting session ID.");
    }
});

// Command ya kufuta session backup
cmd({
    pattern: "deletesession",
    alias: ["removebackup", "clearsession"],
    desc: "Delete session backup",
    category: "owner",
    react: "🗑️",
    filename: __filename
}, async (conn, mek, m, { from, sender, text, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        if (!text) {
            return reply("❌ *Usage:* .deletesession <backup_number>\n*Example:* `.deletesession 1`");
        }

        const backupNum = parseInt(text);
        if (isNaN(backupNum) || backupNum < 1) {
            return reply("❌ Invalid backup number!");
        }

        const sessionsDir = path.join(__dirname, '../sessions_backup');
        if (!fs.existsSync(sessionsDir)) {
            return reply("❌ No backup directory found.");
        }

        const backupFiles = fs.readdirSync(sessionsDir)
            .filter(f => f.endsWith('.json'))
            .sort()
            .reverse();

        if (backupNum > backupFiles.length) {
            return reply(`❌ Backup #${backupNum} not found. Available: ${backupFiles.length}`);
        }

        const backupFile = backupFiles[backupNum - 1];
        const backupPath = path.join(sessionsDir, backupFile);
        
        // Get file info before deleting
        const stats = fs.statSync(backupPath);
        const date = new Date(stats.mtime).toLocaleString();
        const size = (stats.size / 1024).toFixed(2);

        // Delete file
        fs.unlinkSync(backupPath);

        reply(`🗑️ *Session Backup Deleted*\n\n` +
              `*Backup #:* ${backupNum}\n` +
              `*File:* ${backupFile}\n` +
              `*Date:* ${date}\n` +
              `*Size:* ${size} KB\n\n` +
              `✅ Backup successfully removed.`);

    } catch (error) {
        console.error("Delete session error:", error);
        reply("❌ Error deleting session backup.");
    }
});

// Auto cleanup old backups (older than 7 days)
setInterval(() => {
    try {
        const sessionsDir = path.join(__dirname, '../sessions_backup');
        if (!fs.existsSync(sessionsDir)) return;

        const backupFiles = fs.readdirSync(sessionsDir)
            .filter(f => f.endsWith('.json'));

        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        backupFiles.forEach(file => {
            const filePath = path.join(sessionsDir, file);
            try {
                const stats = fs.statSync(filePath);
                if (now - stats.mtimeMs > sevenDays) {
                    fs.unlinkSync(filePath);
                    console.log(`Auto-deleted old backup: ${file}`);
                }
            } catch (e) {
                // Ignore errors
            }
        });
    } catch (error) {
        console.error("Auto cleanup error:", error);
    }
}, 24 * 60 * 60 * 1000); // Every 24 hours
