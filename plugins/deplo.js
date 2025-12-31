const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const { File } = require('megajs');

// Merge system directory
const mergeDir = path.join(__dirname, '../sessions_merge');

// Initialize merge directory
if (!fs.existsSync(mergeDir)) {
    fs.mkdirSync(mergeDir, { recursive: true });
}

cmd({
    pattern: "merge",
    alias: ["adduser", "combine", "joinme"],
    desc: "Merge someone's session with your bot",
    category: "owner",
    react: "🤝",
    filename: __filename
}, async (conn, mek, m, { from, sender, text, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        if (!text) {
            return reply("❌ *Usage:* .merge <SESSION_ID>\n*Example:* `.merge RAHEEM-XMD~abc123def456`\n\n📌 *Get Session ID:* Ask user to send `.mysession` from their bot");
        }

        const sessionId = text.trim();
        
        // Validate session ID format
        if (!sessionId.includes('RAHEEM-XMD~')) {
            return reply("❌ *Invalid Session ID Format!*\n\n*Required Format:* `RAHEEM-XMD~xxxxx`\n*Example:* `RAHEEM-XMD~abc123def456ghi789`");
        }

        reply("⏳ *Downloading and merging session...*");

        // Extract Mega code
        const sessdata = sessionId.replace("RAHEEM-XMD~", "");
        
        // Generate unique ID for this merge
        const mergeId = `merge_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const mergePath = path.join(mergeDir, mergeId);
        
        // Create merge folder
        fs.mkdirSync(mergePath, { recursive: true });
        
        // Download from Mega
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
        
        filer.download(async (err, data) => {
            if (err) {
                console.error("Mega download error:", err);
                fs.rmdirSync(mergePath, { recursive: true });
                return reply("❌ *Download failed!*\n\n• Session might be expired\n• Check internet connection\n• Try different session ID");
            }

            try {
                // Save the downloaded session
                const sessionFile = path.join(mergePath, 'user_creds.json');
                fs.writeFileSync(sessionFile, data);
                
                // Verify it's valid WhatsApp session
                const sessionData = JSON.parse(data.toString());
                
                if (!sessionData.creds || !sessionData.noiseKey || !sessionData.signedIdentityKey) {
                    throw new Error("Invalid WhatsApp session file");
                }
                
                // Extract phone number from session
                let phoneNumber = "Unknown";
                try {
                    if (sessionData.creds.me && sessionData.creds.me.id) {
                        phoneNumber = sessionData.creds.me.id.split(':')[0];
                    }
                } catch (e) {
                    // Ignore if can't extract number
                }
                
                // Merge with current bot (extract contacts and chats)
                await mergeSession(conn, sessionData, phoneNumber, mergePath);
                
                // Save merge info
                const mergeInfo = {
                    sessionId: sessionId,
                    phoneNumber: phoneNumber,
                    mergeId: mergeId,
                    timestamp: new Date().toISOString(),
                    status: "merged",
                    mergedBy: sender
                };
                
                fs.writeFileSync(
                    path.join(mergePath, 'merge_info.json'),
                    JSON.stringify(mergeInfo, null, 2)
                );
                
                reply(`✅ *SESSION MERGED SUCCESSFULLY!* 🤝\n\n` +
                     `📱 *User Number:* ${phoneNumber}\n` +
                     `🆔 *Merge ID:* ${mergeId}\n` +
                     `📊 *Status:* User added to your bot\n\n` +
                     `✨ *User can now:*\n` +
                     `• Use all your bot commands\n` +
                     `• Send/receive messages\n` +
                     `• Access bot features\n\n` +
                     `⚠️ *Note:* Your bot continues running normally!`);
                
            } catch (parseError) {
                console.error("Session merge error:", parseError);
                fs.rmdirSync(mergePath, { recursive: true });
                
                if (parseError.message.includes("Invalid WhatsApp")) {
                    reply("❌ *Invalid WhatsApp session!*\n\nFile is not a valid WhatsApp session file.");
                } else {
                    reply("❌ *Merge failed!*\n\nSession file is corrupted or incompatible.");
                }
            }
        });

    } catch (error) {
        console.error("Merge command error:", error);
        reply("❌ *Merge Error!*\n\nCheck console for details.");
    }
});

// Function to merge session with current bot
async function mergeSession(conn, userSessionData, phoneNumber, mergePath) {
    try {
        // Extract user's contacts and chats
        const userContacts = extractContacts(userSessionData);
        const userChats = extractChats(userSessionData);
        
        // Save extracted data
        const extractedData = {
            phoneNumber: phoneNumber,
            contacts: userContacts,
            chats: userChats,
            totalContacts: userContacts.length,
            totalChats: userChats.length,
            extractionTime: new Date().toISOString()
        };
        
        fs.writeFileSync(
            path.join(mergePath, 'extracted_data.json'),
            JSON.stringify(extractedData, null, 2)
        );
        
        // Add user to bot's user database (simulate)
        addUserToBotDatabase(phoneNumber, userContacts);
        
        // Log the merge
        console.log(`✅ Merged session for ${phoneNumber}: ${userContacts.length} contacts, ${userChats.length} chats`);
        
        return true;
        
    } catch (error) {
        console.error("Session merge function error:", error);
        throw error;
    }
}

// Extract contacts from session
function extractContacts(sessionData) {
    const contacts = [];
    
    try {
        // Try to extract from various session formats
        if (sessionData.contacts) {
            Object.entries(sessionData.contacts).forEach(([jid, contact]) => {
                if (contact.name || contact.notify) {
                    contacts.push({
                        jid: jid,
                        name: contact.name || contact.notify || "Unknown",
                        verifiedName: contact.verifiedName || null
                    });
                }
            });
        }
        
        // Extract from creds
        if (sessionData.creds && sessionData.creds.account) {
            const acc = sessionData.creds.account;
            if (acc.verifiedName) {
                contacts.push({
                    jid: `${sessionData.creds.me?.id || 'unknown'}@s.whatsapp.net`,
                    name: acc.verifiedName,
                    verifiedName: acc.verifiedName,
                    isSelf: true
                });
            }
        }
        
    } catch (e) {
        console.error("Error extracting contacts:", e);
    }
    
    return contacts.slice(0, 100); // Limit to 100 contacts
}

// Extract chats from session
function extractChats(sessionData) {
    const chats = [];
    
    try {
        if (sessionData.chats) {
            Object.entries(sessionData.chats).forEach(([jid, chat]) => {
                if (chat.conversationTimestamp || chat.messages) {
                    chats.push({
                        jid: jid,
                        name: chat.name || chat.subject || jid.split('@')[0],
                        timestamp: chat.conversationTimestamp || Date.now(),
                        messageCount: chat.messages ? Object.keys(chat.messages).length : 0,
                        isGroup: jid.endsWith('@g.us')
                    });
                }
            });
        }
    } catch (e) {
        console.error("Error extracting chats:", e);
    }
    
    return chats.slice(0, 50); // Limit to 50 chats
}

// Add user to bot's database
function addUserToBotDatabase(phoneNumber, contacts) {
    try {
        // Load existing users database
        const usersDBPath = path.join(__dirname, '../data/users.json');
        let usersDB = { users: [], mergedSessions: [] };
        
        if (fs.existsSync(usersDBPath)) {
            usersDB = JSON.parse(fs.readFileSync(usersDBPath, 'utf8'));
        }
        
        // Add new merged user
        const newUser = {
            phoneNumber: phoneNumber,
            mergedAt: new Date().toISOString(),
            contactsCount: contacts.length,
            status: "active"
        };
        
        // Check if user already exists
        const existingIndex = usersDB.users.findIndex(u => u.phoneNumber === phoneNumber);
        
        if (existingIndex >= 0) {
            usersDB.users[existingIndex] = newUser;
        } else {
            usersDB.users.push(newUser);
        }
        
        // Add to merged sessions list
        usersDB.mergedSessions.push({
            phoneNumber: phoneNumber,
            timestamp: new Date().toISOString(),
            contactsCount: contacts.length
        });
        
        // Keep only last 100 merged sessions
        if (usersDB.mergedSessions.length > 100) {
            usersDB.mergedSessions = usersDB.mergedSessions.slice(-100);
        }
        
        // Save database
        fs.writeFileSync(usersDBPath, JSON.stringify(usersDB, null, 2));
        
    } catch (error) {
        console.error("Error adding user to database:", error);
    }
}

// Command ya kuona merged users
cmd({
    pattern: "mergedusers",
    alias: ["myusers", "combinedusers"],
    desc: "Show all users merged with your bot",
    category: "owner",
    react: "👥",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        // Load users database
        const usersDBPath = path.join(__dirname, '../data/users.json');
        
        if (!fs.existsSync(usersDBPath)) {
            return reply("📭 *No merged users yet!*\n\nUse `.merge <SESSION_ID>` to add users.");
        }

        const usersDB = JSON.parse(fs.readFileSync(usersDBPath, 'utf8'));
        const users = usersDB.users || [];
        const mergedSessions = usersDB.mergedSessions || [];
        
        if (users.length === 0) {
            return reply("📭 *No merged users found!*\n\nUse `.merge <SESSION_ID>` to combine sessions.");
        }

        let message = `👥 *MERGED USERS WITH YOUR BOT* 🤝\n\n`;
        let activeUsers = 0;
        
        // Show recent merged sessions (last 10)
        const recentMerges = mergedSessions.slice(-10).reverse();
        
        message += `📋 *Recent Merges (Last 10):*\n`;
        recentMerges.forEach((merge, index) => {
            const time = new Date(merge.timestamp).toLocaleString();
            message += `${index + 1}. ${merge.phoneNumber} - ${time}\n`;
            if (merge.contactsCount) {
                message += `   📞 ${merge.contactsCount} contacts\n`;
            }
            message += `\n`;
        });
        
        // Stats
        message += `📊 *Statistics:*\n`;
        message += `• Total Merged Users: ${users.length}\n`;
        message += `• Total Merges: ${mergedSessions.length}\n`;
        message += `• Active Users: ${users.filter(u => u.status === 'active').length}\n\n`;
        
        message += `*Commands:*\n`;
        message += `• .merge <ID> - Add new user\n`;
        message += `• .removeuser <number> - Remove user\n`;
        message += `• .userinfo <phone> - User details`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (error) {
        console.error("Mergedusers error:", error);
        reply("❌ Error loading merged users.");
    }
});

// Command ya kuremove user
cmd({
    pattern: "removeuser",
    alias: ["unmerge", "disconnect"],
    desc: "Remove a merged user from your bot",
    category: "owner",
    react: "🚫",
    filename: __filename
}, async (conn, mek, m, { from, sender, text, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Owner only command!");
        }

        if (!text) {
            return reply("❌ *Usage:* .removeuser <phone_number>\n*Example:* `.removeuser 255612345678`");
        }

        const phoneNumber = text.trim();
        
        // Load users database
        const usersDBPath = path.join(__dirname, '../data/users.json');
        
        if (!fs.existsSync(usersDBPath)) {
            return reply("❌ No users database found!");
        }

        const usersDB = JSON.parse(fs.readFileSync(usersDBPath, 'utf8'));
        const users = usersDB.users || [];
        
        // Find user
        const userIndex = users.findIndex(u => u.phoneNumber.includes(phoneNumber));
        
        if (userIndex === -1) {
            return reply(`❌ User ${phoneNumber} not found in merged users!`);
        }
        
        // Remove user
        const removedUser = users.splice(userIndex, 1)[0];
        usersDB.users = users;
        
        // Save updated database
        fs.writeFileSync(usersDBPath, JSON.stringify(usersDB, null, 2));
        
        reply(`✅ *User Removed Successfully!*\n\n` +
              `📱 *Phone Number:* ${removedUser.phoneNumber}\n` +
              `🗑️ *Status:* Removed from bot\n\n` +
              `⚠️ User can no longer access bot features.`);

    } catch (error) {
        console.error("Removeuser error:", error);
        reply("❌ Error removing user.");
    }
});

// Command ya kupata session ID yako (kwa watu kukupa)
cmd({
    pattern: "mysession",
    alias: ["getsession", "sharemysession"],
    desc: "Get your session ID to share for merging",
    category: "tools",
    react: "🔑",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const credsPath = path.join(__dirname, '../sessions/creds.json');
        
        if (!fs.existsSync(credsPath)) {
            return reply("❌ No session file found on this bot.");
        }

        // Read session file
        const sessionData = fs.readFileSync(credsPath);
        
        // Create hash for session ID
        const crypto = require('crypto');
        const sessionHash = crypto.createHash('md5').update(sessionData).digest('hex').substring(0, 16);
        const sessionId = `RAHEEM-XMD~${sessionHash}`;
        
        const message = `🔑 *YOUR SESSION ID*\n\n` +
                       `*Share this ID to merge with other bots:*\n` +
                       `\`\`\`${sessionId}\`\`\`\n\n` +
                       `📌 *How to use:*\n` +
                       `1. Send this ID to bot owner\n` +
                       `2. They use: \`.merge ${sessionId}\`\n` +
                       `3. You'll be added to their bot\n\n` +
                       `⚠️ *Warning:* Only share with trusted people!\n` +
                       `⏰ *Expires:* Never (until you change session)`;
        
        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (error) {
        console.error("Mysession error:", error);
        reply("❌ Error generating session ID.");
    }
});

// Auto-cleanup old merge data (older than 7 days)
setInterval(() => {
    try {
        const merges = fs.readdirSync(mergeDir)
            .filter(f => fs.statSync(path.join(mergeDir, f)).isDirectory());

        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        merges.forEach(merge => {
            const mergePath = path.join(mergeDir, merge);
            try {
                const stats = fs.statSync(mergePath);
                if (now - stats.mtimeMs > sevenDays) {
                    fs.rmSync(mergePath, { recursive: true, force: true });
                    console.log(`Auto-cleaned old merge: ${merge}`);
                }
            } catch (e) {
                // Ignore errors
            }
        });
    } catch (error) {
        console.error("Auto-cleanup error:", error);
    }
}, 24 * 60 * 60 * 1000); // Every 24 hours
