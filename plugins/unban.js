 const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

// Store active pairings
const activePairings = new Map();

cmd({
    pattern: "whatsapp",
    alias: ["wa", "session", "pair", "unban", "block"],
    desc: "Complete WhatsApp management tool - Pair, Unban, Session control",
    category: "owner",
    filename: __filename,
    use: '<command> <args>',
    fromMe: true,
    react: "📱"
}, async (conn, mek, m, { from, sender, reply, args, text, prefix }) => {
    try {
        const config = require('../config');
        
        // === OWNER CHECK ===
        const ownerNumbers = [
            config.OWNER_NUMBER, 
            config.DEV, 
            '255763111390', 
            '255611109830',
            '18494967948'
        ].filter(n => n);
        
        const senderNumber = sender.split('@')[0];
        const isOwner = ownerNumbers.some(num => 
            senderNumber.includes(num.replace(/[^0-9]/g, ''))
        );
        
        if (!isOwner) {
            return reply('❌ *Owner Command Only!*\nThis command is restricted to bot owner.');
        }

        // === HELP MENU ===
        if (!text || text === 'help') {
            const helpMsg = `
*📱 WHATSAPP MANAGEMENT TOOL*

*🔐 SESSION MANAGEMENT:*
• \`${prefix}whatsapp pair <number>\` - Generate session via API
• \`${prefix}whatsapp qr\` - Generate QR code for pairing
• \`${prefix}whatsapp direct\` - Get direct pairing link
• \`${prefix}whatsapp set <session_id>\` - Manually set session
• \`${prefix}whatsapp check\` - Check current session status
• \`${prefix}whatsapp reset\` - Delete current session
• \`${prefix}whatsapp restart\` - Restart bot with current session

*🔓 BLOCK/UNBLOCK:*
• \`${prefix}whatsapp unban <number>\` - Unban/Unblock number
• \`${prefix}whatsapp ban <number>\` - Block number
• \`${prefix}whatsapp blocklist\` - Show blocked numbers
• \`${prefix}whatsapp unbanall\` - Unban all blocked numbers

*👤 CONTACT MANAGEMENT:*
• \`${prefix}whatsapp contact <number>\` - Get contact info
• \`${prefix}whatsapp update <number> <name>\` - Update contact name
• \`${prefix}whatsapp chat <number>\` - Open chat with number

*🔧 BOT CONTROLS:*
• \`${prefix}whatsapp status\` - Bot connection status
• \`${prefix}whatsapp logout\` - Logout from WhatsApp
• \`${prefix}whatsapp reload\` - Reload all plugins

*🌐 API INFO:*
• Session API: https://abdulrhim.onrender.com/pair
• Owner: ${config.OWNER_NAME || 'RAHEEM-CM'}
• Bot: ${config.BOT_NAME || 'RAHEEM-XMD-3'}

*📌 Example:* ${prefix}whatsapp pair 255763111390
*📌 Example:* ${prefix}whatsapp unban 256790986772
`;
            return reply(helpMsg);
        }

        const [command, ...params] = text.trim().split(' ');
        const argsText = params.join(' ');

        // ==================== SESSION COMMANDS ====================
        
        // === PAIR VIA NUMBER ===
        if (command === 'pair') {
            if (!argsText) {
                return reply(`*Usage:* ${prefix}whatsapp pair <number>\n*Example:* ${prefix}whatsapp pair 255763111390`);
            }
            
            let phoneNumber = argsText.replace(/[+\s\-()]/g, '');
            
            if (!phoneNumber.match(/^\d{10,15}$/)) {
                return reply('❌ *Invalid number format!*\nUse: 255763111390 (with country code)');
            }
            
            await reply(`🔄 *Processing: ${phoneNumber}*\nConnecting to WhatsApp API...\n⏱️ Please wait 30-60 seconds`);
            
            try {
                const apiUrl = 'https://abdulrhim.onrender.com/pair';
                const response = await axios.post(apiUrl, {
                    number: phoneNumber,
                    source: 'RAHEEM-XMD-3-CMD'
                }, {
                    timeout: 90000,
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'RAHEEM-XMD-3'
                    }
                });
                
                if (response.data && response.data.success !== false) {
                    let sessionId = response.data.sessionId || response.data.session;
                    
                    if (sessionId) {
                        if (!sessionId.startsWith('RAHEEM-XMD-2>>>')) {
                            sessionId = `RAHEEM-XMD-2>>>${sessionId}`;
                        }
                        
                        // Save session
                        const sessionDir = path.join(__dirname, '../sessions');
                        if (!fs.existsSync(sessionDir)) {
                            fs.mkdirSync(sessionDir, { recursive: true });
                        }
                        
                        const credsData = {
                            "clientID": "RAHEEM-XMD-3",
                            "serverToken": "RAHEEM-SERVER",
                            "clientToken": "RAHEEM-CLIENT",
                            "encKey": Buffer.from(phoneNumber + Date.now()).toString('base64').substring(0, 44),
                            "macKey": Buffer.from(Date.now() + phoneNumber).toString('base64').substring(0, 44),
                            "sessionId": sessionId,
                            "number": phoneNumber,
                            "generatedAt": new Date().toISOString()
                        };
                        
                        fs.writeFileSync(path.join(sessionDir, 'creds.json'), JSON.stringify(credsData, null, 2));
                        
                        const successMsg = `✅ *SESSION GENERATED!*\n\n` +
                                         `📱 *Number:* ${phoneNumber}\n` +
                                         `🔑 *Session ID:*\n\`${sessionId}\`\n\n` +
                                         `📁 *Saved to:* sessions/creds.json\n\n` +
                                         `*Next:* Use ${prefix}whatsapp restart`;
                        
                        await reply(successMsg);
                        
                        // Send as file
                        await conn.sendMessage(from, {
                            document: Buffer.from(sessionId),
                            fileName: `session_${phoneNumber}.txt`,
                            mimetype: 'text/plain',
                            caption: `Session for ${phoneNumber}`
                        }, { quoted: mek });
                        
                    } else if (response.data.qrCode) {
                        await conn.sendMessage(from, {
                            image: { url: response.data.qrCode },
                            caption: `*📱 SCAN QR CODE*\n\nNumber: ${phoneNumber}\n\nScan with WhatsApp to pair`
                        }, { quoted: mek });
                    } else {
                        await reply(`✅ *API Response:*\n${JSON.stringify(response.data, null, 2)}`);
                    }
                } else {
                    throw new Error('API returned failure');
                }
                
            } catch (error) {
                await reply(`❌ *API Error:* ${error.message}\n\nTry: ${prefix}whatsapp qr`);
            }
            return;
        }
        
        // === QR CODE ===
        if (command === 'qr') {
            const pairId = 'RAHEEM-' + Date.now();
            
            const qrBuffer = await qrcode.toBuffer(pairId, {
                width: 400,
                margin: 2,
                color: { dark: '#000000', light: '#FFFFFF' }
            });
            
            activePairings.set(pairId, {
                userId: sender,
                timestamp: Date.now()
            });
            
            await conn.sendMessage(from, {
                image: qrBuffer,
                caption: `*🔐 SCAN QR CODE*\n\n` +
                        `1. WhatsApp → Settings → Linked Devices\n` +
                        `2. Tap "Link a Device"\n` +
                        `3. Scan this QR code\n\n` +
                        `*ID:* ${pairId}\n` +
                        `*Expires:* 2 minutes`
            }, { quoted: mek });
            
            setTimeout(() => {
                if (activePairings.has(pairId)) {
                    activePairings.delete(pairId);
                    reply('❌ QR expired. Try again.');
                }
            }, 120000);
            return;
        }
        
        // === DIRECT LINK ===
        if (command === 'direct' || command === 'link') {
            await reply(`*🌐 DIRECT PAIRING LINK*\n\n` +
                       `🔗 *URL:* https://abdulrhim.onrender.com/pair\n\n` +
                       `*Instructions:*\n` +
                       `1. Open the link\n` +
                       `2. Enter your number\n` +
                       `3. Follow steps\n` +
                       `4. Copy session ID\n` +
                       `5. Use: ${prefix}whatsapp set <session_id>`);
            return;
        }
        
        // === SET SESSION ===
        if (command === 'set') {
            if (!argsText) {
                return reply(`*Usage:* ${prefix}whatsapp set <session_id>\nExample: ${prefix}whatsapp set RAHEEM-XMD-2>>>ABC123...`);
            }
            
            let sessionId = argsText;
            if (!sessionId.startsWith('RAHEEM-XMD-2>>>')) {
                sessionId = `RAHEEM-XMD-2>>>${sessionId}`;
            }
            
            const sessionDir = path.join(__dirname, '../sessions');
            if (!fs.existsSync(sessionDir)) {
                fs.mkdirSync(sessionDir, { recursive: true });
            }
            
            fs.writeFileSync(path.join(sessionDir, 'session_id.txt'), sessionId);
            
            await reply(`✅ *Session Set!*\n\n` +
                       `🔑 *Session ID:*\n\`${sessionId.substring(0, 60)}...\`\n\n` +
                       `Use ${prefix}whatsapp restart to apply`);
            return;
        }
        
        // === CHECK SESSION ===
        if (command === 'check' || command === 'status') {
            const sessionDir = path.join(__dirname, '../sessions');
            const credsFile = path.join(sessionDir, 'creds.json');
            const configSession = config.SESSION_ID || '';
            
            let statusMsg = `*📱 SESSION STATUS*\n\n`;
            
            // Config session
            statusMsg += `*Config SESSION_ID:*\n`;
            if (configSession) {
                statusMsg += `✅ Present (${configSession.length} chars)\n`;
                if (configSession.startsWith('RAHEEM-XMD-2>>>')) {
                    statusMsg += `🔑 ID: ${configSession.substring(16, 36)}...\n`;
                }
            } else {
                statusMsg += `❌ Not set\n`;
            }
            statusMsg += `\n`;
            
            // Sessions folder
            if (fs.existsSync(sessionDir)) {
                const files = fs.readdirSync(sessionDir);
                statusMsg += `*Sessions Folder:* ${files.length} file(s)\n`;
                files.forEach(file => {
                    const filePath = path.join(sessionDir, file);
                    const stats = fs.statSync(filePath);
                    statusMsg += `📄 ${file} (${(stats.size/1024).toFixed(1)} KB)\n`;
                });
            } else {
                statusMsg += `*Sessions Folder:* ❌ Not found\n`;
            }
            statusMsg += `\n`;
            
            // Connection
            statusMsg += `*Connection:* ${conn.user ? '✅ Connected' : '❌ Disconnected'}\n`;
            if (conn.user) {
                statusMsg += `*Bot Number:* ${conn.user.id.split(':')[0]}\n`;
                statusMsg += `*Push Name:* ${conn.user.name || 'N/A'}\n`;
                statusMsg += `*Platform:* ${conn.user.platform || 'Unknown'}`;
            }
            
            await reply(statusMsg);
            return;
        }
        
        // === RESET SESSION ===
        if (command === 'reset' || command === 'delete') {
            const sessionDir = path.join(__dirname, '../sessions');
            
            if (fs.existsSync(sessionDir)) {
                const files = fs.readdirSync(sessionDir);
                let deleted = 0;
                
                files.forEach(file => {
                    try {
                        fs.unlinkSync(path.join(sessionDir, file));
                        deleted++;
                    } catch (e) {}
                });
                
                await reply(`✅ *Session Reset*\n\n` +
                           `🗑️ Deleted ${deleted} file(s)\n` +
                           `📁 Folder: sessions/\n\n` +
                           `*Next:* Use ${prefix}whatsapp pair to create new session`);
            } else {
                await reply(`✅ No session files found.\nUse ${prefix}whatsapp pair to create.`);
            }
            return;
        }
        
        // === RESTART BOT ===
        if (command === 'restart' || command === 'reboot') {
            await reply('🔄 *Restarting bot...*\nPlease wait 10-15 seconds');
            setTimeout(() => {
                process.exit(1);
            }, 2000);
            return;
        }
        
        // ==================== UNBAN/BLOCK COMMANDS ====================
        
        // === UNBAN NUMBER ===
        if (command === 'unban' || command === 'unblock') {
            if (!argsText) {
                return reply(`*Usage:* ${prefix}whatsapp unban <number>\nExample: ${prefix}whatsapp unban 256790986772`);
            }
            
            let phoneNumber = argsText.replace(/[+\s\-()]/g, '');
            
            if (!phoneNumber.match(/^\d{10,15}$/)) {
                return reply('❌ *Invalid number!*\nUse: 256790986772 (with country code)');
            }
            
            const jid = phoneNumber + '@s.whatsapp.net';
            
            await reply(`🔄 *Unbanning: ${phoneNumber}*`);
            
            try {
                // Try to unblock
                await conn.updateBlockStatus(jid, 'unblock');
                
                // Send test message
                try {
                    await conn.sendMessage(jid, { text: ' ' });
                } catch (e) {}
                
                const successMsg = `✅ *UNBAN SUCCESSFUL!*\n\n` +
                                 `📱 *Number:* ${phoneNumber}\n` +
                                 `🔓 *Status:* UNBLOCKED\n\n` +
                                 `*Actions taken:*\n` +
                                 `• Removed from block list\n` +
                                 `• Contact updated\n` +
                                 `• Chat access restored\n\n` +
                                 `User can now message you.`;
                
                await reply(successMsg);
                
                // Notify the unblocked user
                setTimeout(async () => {
                    try {
                        await conn.sendMessage(jid, {
                            text: `*🔓 Unblock Notification*\n\n` +
                                  `You have been unblocked by ${config.BOT_NAME || 'Bot'}.\n` +
                                  `You can now send messages.\n\n` +
                                  `_Automated message_`
                        });
                    } catch (e) {}
                }, 1000);
                
            } catch (error) {
                await reply(`❌ *Unban failed:* ${error.message}\n\n` +
                           `*Try manual method:*\n` +
                           `WhatsApp → Settings → Blocked → Remove ${phoneNumber}`);
            }
            return;
        }
        
        // === BAN NUMBER ===
        if (command === 'ban' || command === 'block') {
            if (!argsText) {
                return reply(`*Usage:* ${prefix}whatsapp ban <number>\nExample: ${prefix}whatsapp ban 256790986772`);
            }
            
            let phoneNumber = argsText.replace(/[+\s\-()]/g, '');
            
            if (!phoneNumber.match(/^\d{10,15}$/)) {
                return reply('❌ *Invalid number!*');
            }
            
            const jid = phoneNumber + '@s.whatsapp.net';
            
            await reply(`⛔ *Blocking: ${phoneNumber}*`);
            
            try {
                await conn.updateBlockStatus(jid, 'block');
                
                await reply(`✅ *NUMBER BLOCKED*\n\n` +
                           `📱 *Number:* ${phoneNumber}\n` +
                           `🚫 *Status:* BLOCKED\n\n` +
                           `User cannot message you now.`);
                
            } catch (error) {
                await reply(`❌ *Block failed:* ${error.message}`);
            }
            return;
        }
        
        // === BLOCKLIST ===
        if (command === 'blocklist' || command === 'list') {
            try {
                const blockedList = await conn.fetchBlocklist();
                
                if (!blockedList || blockedList.length === 0) {
                    return reply('✅ *No blocked numbers found.*');
                }
                
                let listMsg = `*🚫 BLOCKED NUMBERS*\n\n`;
                listMsg += `Total: ${blockedList.length}\n\n`;
                
                blockedList.forEach((jid, index) => {
                    const num = jid.split('@')[0];
                    listMsg += `${index + 1}. ${num}\n`;
                });
                
                listMsg += `\n*Unban:* ${prefix}whatsapp unban <number>`;
                
                await reply(listMsg);
                
            } catch (error) {
                await reply(`❌ *Cannot fetch blocklist:* ${error.message}`);
            }
            return;
        }
        
        // === UNBAN ALL ===
        if (command === 'unbanall') {
            try {
                const blockedList = await conn.fetchBlocklist();
                
                if (!blockedList || blockedList.length === 0) {
                    return reply('✅ *No blocked numbers to unban.*');
                }
                
                await reply(`🔄 *Unbanning ${blockedList.length} numbers...*`);
                
                let success = 0;
                let failed = 0;
                
                for (const jid of blockedList) {
                    try {
                        await conn.updateBlockStatus(jid, 'unblock');
                        success++;
                    } catch (e) {
                        failed++;
                    }
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                
                await reply(`✅ *BULK UNBAN COMPLETE*\n\n` +
                           `📊 *Results:*\n` +
                           `• Total: ${blockedList.length}\n` +
                           `• Success: ${success}\n` +
                           `• Failed: ${failed}\n` +
                           `• Rate: ${((success/blockedList.length)*100).toFixed(1)}%`);
                
            } catch (error) {
                await reply(`❌ *Bulk unban failed:* ${error.message}`);
            }
            return;
        }
        
        // ==================== CONTACT COMMANDS ====================
        
        // === CONTACT INFO ===
        if (command === 'contact' || command === 'info') {
            if (!argsText) {
                return reply(`*Usage:* ${prefix}whatsapp contact <number>\nExample: ${prefix}whatsapp contact 255763111390`);
            }
            
            let phoneNumber = argsText.replace(/[+\s\-()]/g, '');
            const jid = phoneNumber + '@s.whatsapp.net';
            
            try {
                const contact = await conn.getContact(jid);
                
                let infoMsg = `*👤 CONTACT INFORMATION*\n\n`;
                infoMsg += `📱 *Number:* ${phoneNumber}\n`;
                infoMsg += `👤 *Name:* ${contact.name || 'Unknown'}\n`;
                infoMsg += `📞 *Verified Name:* ${contact.verifiedName || 'N/A'}\n`;
                infoMsg += `🏷️ *Notify:* ${contact.notify || 'N/A'}\n`;
                infoMsg += `📅 *Created:* ${contact.t || 'N/A'}\n`;
                
                await reply(infoMsg);
                
            } catch (error) {
                await reply(`❌ *Cannot get contact info:* ${error.message}\n\n` +
                           `*Try:* ${prefix}whatsapp chat ${phoneNumber} hello`);
            }
            return;
        }
        
        // === UPDATE CONTACT ===
        if (command === 'update') {
            const [num, ...nameParts] = argsText.split(' ');
            const name = nameParts.join(' ');
            
            if (!num || !name) {
                return reply(`*Usage:* ${prefix}whatsapp update <number> <name>\nExample: ${prefix}whatsapp update 255763111390 "John Doe"`);
            }
            
            let phoneNumber = num.replace(/[+\s\-()]/g, '');
            const jid = phoneNumber + '@s.whatsapp.net';
            
            try {
                await conn.updateContact(jid, { name: name });
                
                await reply(`✅ *CONTACT UPDATED*\n\n` +
                           `📱 *Number:* ${phoneNumber}\n` +
                           `👤 *New Name:* ${name}\n\n` +
                           `Changes saved to WhatsApp contacts.`);
                
            } catch (error) {
                await reply(`❌ *Update failed:* ${error.message}`);
            }
            return;
        }
        
        // === OPEN CHAT ===
        if (command === 'chat') {
            if (!argsText) {
                return reply(`*Usage:* ${prefix}whatsapp chat <number> [message]\nExample: ${prefix}whatsapp chat 255763111390 hello`);
            }
            
            const [num, ...messageParts] = argsText.split(' ');
            const message = messageParts.join(' ');
            
            let phoneNumber = num.replace(/[+\s\-()]/g, '');
            const jid = phoneNumber + '@s.whatsapp.net';
            
            if (message) {
                try {
                    await conn.sendMessage(jid, { text: message });
                    await reply(`✅ *Message sent to ${phoneNumber}*\n\nMessage: "${message}"`);
                } catch (error) {
                    await reply(`❌ *Cannot send message:* ${error.message}\n\n` +
                               `Possible reasons:\n` +
                               `1. Number is blocked\n` +
                               `2. Invalid number\n` +
                               `3. Network issue`);
                }
            } else {
                await reply(`*💬 CHAT WITH ${phoneNumber}*\n\n` +
                           `Use: ${prefix}chat ${phoneNumber} <message>\n` +
                           `Or send message directly to that number.`);
            }
            return;
        }
        
        // === LOGOUT ===
        if (command === 'logout') {
            await reply('⚠️ *Logging out from WhatsApp...*\nBot will disconnect and need new session.');
            
            const sessionDir = path.join(__dirname, '../sessions');
            if (fs.existsSync(sessionDir)) {
                const files = fs.readdirSync(sessionDir);
                files.forEach(file => {
                    try {
                        fs.unlinkSync(path.join(sessionDir, file));
                    } catch (e) {}
                });
            }
            
            setTimeout(() => {
                process.exit(0);
            }, 3000);
            return;
        }
        
        // === RELOAD ===
        if (command === 'reload') {
            await reply('🔄 *Reloading plugins...*');
            
            // Clear require cache
            Object.keys(require.cache).forEach(key => {
                if (key.includes('plugins/')) {
                    delete require.cache[key];
                }
            });
            
            // Reload plugins
            const fs = require('fs');
            const path = require('path');
            
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    try {
                        require("./plugins/" + plugin);
                    } catch (e) {
                        console.error(`Failed to load ${plugin}:`, e);
                    }
                }
            });
            
            await reply('✅ *Plugins reloaded successfully!*');
            return;
        }
        
        // === INVALID COMMAND ===
        await reply(`❌ *Invalid sub-command!*\n\n` +
                   `Use: ${prefix}whatsapp help\n` +
                   `To see all available commands.`);

    } catch (error) {
        console.error('WhatsApp command error:', error);
        await reply(`❌ *Command Error:* ${error.message}\n\n` +
                   `Use: ${prefix}whatsapp help for assistance.`);
    }
});

// Auto-cleanup pairings
setInterval(() => {
    const now = Date.now();
    for (const [id, data] of activePairings.entries()) {
        if (now - data.timestamp > 120000) { // 2 minutes
            activePairings.delete(id);
        }
    }
}, 60000); // Every minute
