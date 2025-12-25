 const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

cmd({
    pattern: "vcf",
    alias: ["vcard", "contacts", "groupcontacts"],
    desc: "Create VCF file with all group members' contacts",
    category: "group",
    react: "📇",
    filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply, groupMetadata, participants }) => {
    try {
        if (!isGroup) {
            return reply("❌ This command only works in groups!");
        }

        // Check if user is admin
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        const isAdmin = groupAdmins.includes(sender);
        
        if (!isAdmin) {
            return reply("❌ Only group admins can use this command!");
        }

        reply("⏳ Creating VCF file for group members...");

        // Get all participants
        const members = participants || await conn.groupMetadata(from).then(g => g.participants);
        
        // Create VCF content
        let vcfContent = "";
        let contactCount = 0;

        for (const member of members) {
            try {
                const jid = member.id;
                const number = jid.split('@')[0];
                
                // Get member name
                const name = await conn.getName(jid) || `User${number.substring(number.length - 4)}`;
                
                // Create vCard entry
                const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:${number}
N:${name.split(' ').pop()};${name.split(' ').shift()};;;
EMAIL;TYPE=INTERNET:${number}@whatsapp.com
NOTE:WhatsApp Group Contact
REV:${new Date().toISOString()}
END:VCARD\n\n`;
                
                vcfContent += vcard;
                contactCount++;
                
            } catch (error) {
                console.error(`Error processing member:`, error);
            }
        }

        if (contactCount === 0) {
            return reply("❌ Could not create contacts file.");
        }

        // Create temporary file
        const tempDir = path.join(__dirname, 'temp_vcf');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const filename = `group_contacts_${Date.now()}.vcf`;
        const filepath = path.join(tempDir, filename);

        // Write VCF file
        fs.writeFileSync(filepath, vcfContent);

        // Send file
        await conn.sendMessage(from, {
            document: fs.readFileSync(filepath),
            fileName: `Group_Contacts_${groupMetadata.subject || 'WhatsApp_Group'}.vcf`,
            mimetype: 'text/vcard'
        }, { quoted: mek });

        // Cleanup
        setTimeout(() => {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }, 5000);

    } catch (error) {
        console.error("VCF command error:", error);
        reply("❌ Error creating VCF file. Please try again.");
    }
});

// Command ya kutengeneza VCF ya watu specific
cmd({
    pattern: "createvcf",
    alias: ["makevcard", "exportcontacts"],
    desc: "Create VCF file from mentioned users",
    category: "group",
    react: "📲",
    filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, text, reply }) => {
    try {
        if (!isGroup) {
            return reply("❌ This command works in groups only!");
        }

        const args = text?.split(' ') || [];
        const mentionedJids = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (mentionedJids.length === 0 && args.length === 0) {
            return reply("❌ Please mention users or provide numbers!\n\nUsage: .createvcf @user1 @user2\nOr: .createvcf 255123456789 255987654321");
        }

        reply("⏳ Creating VCF file...");

        let vcfContent = "";
        let contactCount = 0;

        // Process mentioned users
        if (mentionedJids.length > 0) {
            for (const jid of mentionedJids) {
                if (jid.includes('@s.whatsapp.net')) {
                    const number = jid.split('@')[0];
                    const name = await conn.getName(jid) || `User${number.substring(number.length - 4)}`;
                    
                    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:${number}
N:${name.split(' ').pop()};${name.split(' ').shift()};;;
EMAIL;TYPE=INTERNET:${number}@whatsapp.com
NOTE:Created via WhatsApp Bot
REV:${new Date().toISOString()}
END:VCARD\n\n`;
                    
                    vcfContent += vcard;
                    contactCount++;
                }
            }
        }

        // Process phone numbers from text
        if (args.length > 0) {
            for (const arg of args) {
                if (/^\d{9,15}$/.test(arg)) {
                    const number = arg.startsWith('255') ? arg : `255${arg}`;
                    const name = `Contact_${number.substring(number.length - 4)}`;
                    
                    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:${number}
N:${name};;;;
EMAIL;TYPE=INTERNET:${number}@whatsapp.com
NOTE:Phone number contact
REV:${new Date().toISOString()}
END:VCARD\n\n`;
                    
                    vcfContent += vcard;
                    contactCount++;
                }
            }
        }

        if (contactCount === 0) {
            return reply("❌ No valid contacts found to create VCF.");
        }

        // Create file
        const tempDir = path.join(__dirname, 'temp_vcf');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const filename = `contacts_${Date.now()}.vcf`;
        const filepath = path.join(tempDir, filename);

        fs.writeFileSync(filepath, vcfContent);

        // Send file with caption
        await conn.sendMessage(from, {
            document: fs.readFileSync(filepath),
            fileName: `WhatsApp_Contacts_${contactCount}_users.vcf`,
            mimetype: 'text/vcard',
            caption: `✅ VCF File Created!\n\n📇 Total Contacts: ${contactCount}\n📱 Format: vCard (VCF)\n💾 Save to phone contacts`
        }, { quoted: mek });

        // Cleanup
        setTimeout(() => {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }, 5000);

    } catch (error) {
        console.error("CreateVCF command error:", error);
        reply("❌ Error creating VCF file.");
    }
});

// Command ya kutengeneza VCF ya mtu mmoja
cmd({
    pattern: "myvcf",
    alias: ["mycontact", "getmyvcard"],
    desc: "Create your own VCF contact file",
    category: "tools",
    react: "👤",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const number = sender.split('@')[0];
        const name = mek.pushName || `User${number.substring(number.length - 4)}`;
        
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:${number}
N:${name.split(' ').pop()};${name.split(' ').shift()};;;
EMAIL;TYPE=INTERNET:${number}@whatsapp.com
NOTE:My WhatsApp Contact
REV:${new Date().toISOString()}
END:VCARD`;

        const tempDir = path.join(__dirname, 'temp_vcf');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const filename = `my_contact_${Date.now()}.vcf`;
        const filepath = path.join(tempDir, filename);

        fs.writeFileSync(filepath, vcard);

        await conn.sendMessage(from, {
            document: fs.readFileSync(filepath),
            fileName: `${name}_Contact.vcf`,
            mimetype: 'text/vcard',
            caption: `📇 Your Contact Card\n\n👤 Name: ${name}\n📱 Number: ${number}\n💾 Save this file to share your contact`
        }, { quoted: mek });

        // Cleanup
        setTimeout(() => {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }, 5000);

    } catch (error) {
        console.error("MyVCF command error:", error);
        reply("❌ Error creating your contact file.");
    }
});

// Cleanup temp files periodically
setInterval(() => {
    const tempDir = path.join(__dirname, 'temp_vcf');
    if (fs.existsSync(tempDir)) {
        fs.readdirSync(tempDir).forEach(file => {
            const filepath = path.join(tempDir, file);
            try {
                if (Date.now() - fs.statSync(filepath).mtimeMs > 10 * 60 * 1000) {
                    fs.unlinkSync(filepath);
                }
            } catch (e) {
                // Ignore errors
            }
        });
    }
}, 30 * 60 * 1000); // Every 30 minutes
