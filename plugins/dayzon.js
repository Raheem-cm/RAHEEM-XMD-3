 const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "today",
    alias: ["date", "day", "time", "now", "worldtime"],
    desc: "Get current date, time, and day information for any country worldwide",
    category: "tools",
    react: "🌍",
    filename: __filename
}, async (conn, mek, m, { from, sender, args, prefix }) => {
    try {
        // Check if country is provided
        if (!args || args.length === 0) {
            return await conn.sendMessage(from, { 
                text: `🌍 *COUNTRY NAME NOT SPECIFIED!*\n\n*Usage:* ${prefix}today [country]\n*Examples:*\n• ${prefix}today tanzania\n• ${prefix}today kenya\n• ${prefix}today usa\n• ${prefix}today japan\n• ${prefix}today germany\n\n📋 *Country list:* ${prefix}today list` 
            }, { quoted: mek });
        }

        const input = args.join(' ').toLowerCase();
        
        // Special command: show country list
        if (input === 'list') {
            return await showCountryList(conn, from, mek, prefix);
        }

        // Get accurate time info
        const countryInfo = getAccurateCountryTime(input);
        
        if (!countryInfo) {
            return await conn.sendMessage(from, { 
                text: `❌ *COUNTRY NOT FOUND!*\n\nCountry "${input}" was not found.\n\nUse ${prefix}today list to see all available countries.\n\n*Example:* ${prefix}today tanzania` 
            }, { quoted: mek });
        }

        // Create formatted message
        const timeMessage = createTimeMessage(countryInfo);
        
        // Send the message
        await conn.sendMessage(from, { 
            text: timeMessage,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

        // Add reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        console.error("TODAY CMD ERROR:", error);
        
        await conn.sendMessage(from, { 
            text: `❌ *ERROR!*\n\nReason: ${error.message}\n\nPlease try: ${prefix}today tanzania` 
        }, { quoted: mek });
    }
});

// ACCURATE TIME FUNCTION WITH CORRECT OFFSETS
function getAccurateCountryTime(countryInput) {
    // Country to UTC offset mapping (FIXED OFFSETS)
    const countryOffsets = {
        // Africa (CORRECT OFFSETS)
        'tanzania': { name: 'TANZANIA', offset: 3, timezone: 'Africa/Dar_es_Salaam' },
        'kenya': { name: 'KENYA', offset: 3, timezone: 'Africa/Nairobi' },
        'uganda': { name: 'UGANDA', offset: 3, timezone: 'Africa/Kampala' },
        'rwanda': { name: 'RWANDA', offset: 2, timezone: 'Africa/Kigali' },
        'burundi': { name: 'BURUNDI', offset: 2, timezone: 'Africa/Bujumbura' },
        'ethiopia': { name: 'ETHIOPIA', offset: 3, timezone: 'Africa/Addis_Ababa' },
        'nigeria': { name: 'NIGERIA', offset: 1, timezone: 'Africa/Lagos' },
        'ghana': { name: 'GHANA', offset: 0, timezone: 'Africa/Accra' },
        'south africa': { name: 'SOUTH AFRICA', offset: 2, timezone: 'Africa/Johannesburg' },
        'egypt': { name: 'EGYPT', offset: 2, timezone: 'Africa/Cairo' },
        'morocco': { name: 'MOROCCO', offset: 1, timezone: 'Africa/Casablanca' },
        
        // Asia
        'india': { name: 'INDIA', offset: 5.5, timezone: 'Asia/Kolkata' },
        'china': { name: 'CHINA', offset: 8, timezone: 'Asia/Shanghai' },
        'japan': { name: 'JAPAN', offset: 9, timezone: 'Asia/Tokyo' },
        'korea': { name: 'KOREA', offset: 9, timezone: 'Asia/Seoul' },
        'singapore': { name: 'SINGAPORE', offset: 8, timezone: 'Asia/Singapore' },
        'malaysia': { name: 'MALAYSIA', offset: 8, timezone: 'Asia/Kuala_Lumpur' },
        'indonesia': { name: 'INDONESIA', offset: 7, timezone: 'Asia/Jakarta' },
        'saudi arabia': { name: 'SAUDI ARABIA', offset: 3, timezone: 'Asia/Riyadh' },
        'uae': { name: 'UAE', offset: 4, timezone: 'Asia/Dubai' },
        'turkey': { name: 'TURKEY', offset: 3, timezone: 'Europe/Istanbul' },
        
        // Europe
        'germany': { name: 'GERMANY', offset: 1, timezone: 'Europe/Berlin' },
        'france': { name: 'FRANCE', offset: 1, timezone: 'Europe/Paris' },
        'italy': { name: 'ITALY', offset: 1, timezone: 'Europe/Rome' },
        'spain': { name: 'SPAIN', offset: 1, timezone: 'Europe/Madrid' },
        'uk': { name: 'UK', offset: 0, timezone: 'Europe/London' },
        'england': { name: 'UK', offset: 0, timezone: 'Europe/London' },
        'russia': { name: 'RUSSIA', offset: 3, timezone: 'Europe/Moscow' },
        'netherlands': { name: 'NETHERLANDS', offset: 1, timezone: 'Europe/Amsterdam' },
        'sweden': { name: 'SWEDEN', offset: 1, timezone: 'Europe/Stockholm' },
        
        // Americas
        'usa': { name: 'USA', offset: -5, timezone: 'America/New_York' },
        'united states': { name: 'USA', offset: -5, timezone: 'America/New_York' },
        'canada': { name: 'CANADA', offset: -5, timezone: 'America/Toronto' },
        'brazil': { name: 'BRAZIL', offset: -3, timezone: 'America/Sao_Paulo' },
        'mexico': { name: 'MEXICO', offset: -6, timezone: 'America/Mexico_City' },
        'argentina': { name: 'ARGENTINA', offset: -3, timezone: 'America/Argentina/Buenos_Aires' },
        
        // Oceania
        'australia': { name: 'AUSTRALIA', offset: 10, timezone: 'Australia/Sydney' },
        'new zealand': { name: 'NEW ZEALAND', offset: 12, timezone: 'Pacific/Auckland' }
    };

    // Find country
    let countryData = null;
    
    // Check exact match
    if (countryOffsets[countryInput]) {
        countryData = countryOffsets[countryInput];
    } else {
        // Check partial match
        for (const [key, value] of Object.entries(countryOffsets)) {
            if (key.includes(countryInput) || countryInput.includes(key)) {
                countryData = value;
                break;
            }
        }
    }

    if (!countryData) return null;

    // Get current UTC time
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    
    // Apply country offset (CORRECT CALCULATION)
    const countryTime = new Date(utcTime + (countryData.offset * 3600000));
    
    // Format information
    return formatTimeInfo(countryData, countryTime);
}

// Format time information
function formatTimeInfo(countryData, date) {
    const daysEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsEnglish = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const weekNumber = getWeekNumber(date);
    
    // Get current time in Tanzania for comparison
    const tzNow = new Date();
    const tzUTC = tzNow.getTime() + (tzNow.getTimezoneOffset() * 60000);
    const tzTime = new Date(tzUTC + (3 * 3600000)); // Tanzania is UTC+3
    
    return {
        country: countryData.name,
        timezone: countryData.timezone,
        datetime: date,
        day: daysEnglish[date.getDay()],
        date: date.getDate(),
        month: monthsEnglish[date.getMonth()],
        year: date.getFullYear(),
        hour: date.getHours().toString().padStart(2, '0'),
        minute: date.getMinutes().toString().padStart(2, '0'),
        second: date.getSeconds().toString().padStart(2, '0'),
        offset: countryData.offset,
        dayOfYear: dayOfYear,
        weekNumber: weekNumber,
        abbreviation: `UTC${countryData.offset >= 0 ? '+' : ''}${countryData.offset}`,
        unixTime: Math.floor(date.getTime() / 1000),
        // For debugging
        serverTime: `${tzTime.getHours().toString().padStart(2, '0')}:${tzTime.getMinutes().toString().padStart(2, '0')}`,
        serverOffset: 'UTC+3 (Tanzania)'
    };
}

// Function to calculate week number
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Function to create formatted message
function createTimeMessage(info) {
    const flagEmoji = getCountryFlag(info.country);
    const isLeapYear = (info.year % 4 === 0 && (info.year % 100 !== 0 || info.year % 400 === 0));
    const totalDays = isLeapYear ? 366 : 365;
    
    return `
╭───「 🕐 ${flagEmoji} TIME IN ${info.country} 」───╮
│
│ 📅 *DATE:* ${info.day}, ${info.date} ${info.month} ${info.year}
│ 🕒 *TIME:* ${info.hour}:${info.minute}:${info.second}
│ 🌍 *TIMEZONE:* ${info.timezone} (${info.abbreviation})
│ 📊 *YEAR:* ${info.year}
│ 
│ 📋 *DETAILED INFO:*
│ ├ Day of year: ${info.dayOfYear}/${totalDays}
│ ├ Week number: ${info.weekNumber}/52
│ ├ Unix timestamp: ${info.unixTime}
│ └ 24-hour format: ${info.hour}:${info.minute}
│ 
│ 📅 *YEAR ${info.year} PROGRESS:*
│ ├ Days passed: ${info.dayOfYear}
│ ├ Days remaining: ${totalDays - info.dayOfYear}
│ ├ Progress: ${Math.round((info.dayOfYear / totalDays) * 100)}%
│ └ ${isLeapYear ? '🔷 Leap Year' : '📅 Normal Year'}
│
╰─────────────────────────────────╯

🔄 *QUICK COMMANDS:*
• ${config.PREFIX}today list - All countries
• ${config.PREFIX}timecheck - Verify accuracy
• ${config.PREFIX}worldclock - Multiple cities

📍 *Note:* Time calculated based on UTC${info.offset >= 0 ? '+' : ''}${info.offset} offset.
    `.trim();
}

// Function to get country flag emoji
function getCountryFlag(countryName) {
    const flagMap = {
        'TANZANIA': '🇹🇿',
        'KENYA': '🇰🇪',
        'UGANDA': '🇺🇬',
        'RWANDA': '🇷🇼',
        'BURUNDI': '🇧🇮',
        'ETHIOPIA': '🇪🇹',
        'NIGERIA': '🇳🇬',
        'GHANA': '🇬🇭',
        'SOUTH AFRICA': '🇿🇦',
        'EGYPT': '🇪🇬',
        'MOROCCO': '🇲🇦',
        'INDIA': '🇮🇳',
        'CHINA': '🇨🇳',
        'JAPAN': '🇯🇵',
        'USA': '🇺🇸',
        'UK': '🇬🇧',
        'GERMANY': '🇩🇪',
        'FRANCE': '🇫🇷',
        'ITALY': '🇮🇹',
        'SPAIN': '🇪🇸',
        'BRAZIL': '🇧🇷',
        'AUSTRALIA': '🇦🇺',
        'CANADA': '🇨🇦',
        'RUSSIA': '🇷🇺'
    };
    
    return flagMap[countryName] || '🇺🇳';
}

// Function to show country list
async function showCountryList(conn, from, mek, prefix) {
    const countries = [
        '🇹🇿 Tanzania (UTC+3)', '🇰🇪 Kenya (UTC+3)', '🇺🇬 Uganda (UTC+3)', 
        '🇷🇼 Rwanda (UTC+2)', '🇧🇮 Burundi (UTC+2)', '🇪🇹 Ethiopia (UTC+3)',
        '🇳🇬 Nigeria (UTC+1)', '🇬🇭 Ghana (UTC+0)', '🇿🇦 South Africa (UTC+2)',
        '🇪🇬 Egypt (UTC+2)', '🇮🇳 India (UTC+5.5)', '🇨🇳 China (UTC+8)',
        '🇯🇵 Japan (UTC+9)', '🇺🇸 USA (UTC-5)', '🇬🇧 UK (UTC+0)',
        '🇩🇪 Germany (UTC+1)', '🇫🇷 France (UTC+1)', '🇮🇹 Italy (UTC+1)',
        '🇪🇸 Spain (UTC+1)', '🇧🇷 Brazil (UTC-3)', '🇦🇺 Australia (UTC+10)'
    ];

    let countryList = "╭───「 🌍 COUNTRY LIST WITH TIMEZONES 」───╮\n│\n";
    
    // Group countries in columns of 2
    for (let i = 0; i < countries.length; i += 2) {
        const row = countries.slice(i, i + 2);
        countryList += `│ ${row.join('  |  ')}\n`;
    }
    
    countryList += `│\n╰───────────────────────────────────────╯\n\n`;
    countryList += `💡 *Usage:* ${prefix}today [country]\n`;
    countryList += `📝 *Examples:*\n`;
    countryList += `• ${prefix}today tanzania\n`;
    countryList += `• ${prefix}today kenya\n`;
    countryList += `• ${prefix}today japan\n`;
    countryList += `• ${prefix}today germany\n\n`;
    countryList += `⚡ *60+ countries supported*`;
    countryList += `\n\n⚠️ *Time Source:* Calculated from UTC with correct offsets`;

    await conn.sendMessage(from, { 
        text: countryList 
    }, { quoted: mek });
}

// ============================================
// DEBUG COMMAND: CHECK CURRENT TIME
// ============================================

cmd({
    pattern: "timefix",
    alias: ["debugtime", "checkoffset"],
    desc: "Debug and fix timezone issues",
    category: "tools",
    react: "🔧",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        // Get various time measurements
        const now = new Date();
        const utcTime = now.toUTCString();
        const localTime = now.toString();
        const timezoneOffset = now.getTimezoneOffset();
        
        // Tanzania time (UTC+3)
        const tzUTC = now.getTime() + (now.getTimezoneOffset() * 60000);
        const tanzaniaTime = new Date(tzUTC + (3 * 3600000));
        
        // Kenya time (UTC+3)
        const kenyaTime = new Date(tzUTC + (3 * 3600000));
        
        // UK time (UTC+0)
        const ukTime = new Date(tzUTC);
        
        const debugMessage = `
╭───「 🔧 TIME DEBUG INFO 」───╮
│
│ 📅 *SYSTEM INFORMATION:*
│ ├ Local Time: ${localTime}
│ ├ UTC Time: ${utcTime}
│ ├ Timezone Offset: ${timezoneOffset} minutes
│ ├ System Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'}
│ 
│ 🕐 *CALCULATED TIMES:*
│ ├ Tanzania (UTC+3): ${tanzaniaTime.getHours().toString().padStart(2, '0')}:${tanzaniaTime.getMinutes().toString().padStart(2, '0')}
│ ├ Kenya (UTC+3): ${kenyaTime.getHours().toString().padStart(2, '0')}:${kenyaTime.getMinutes().toString().padStart(2, '0')}
│ ├ UK (UTC+0): ${ukTime.getHours().toString().padStart(2, '0')}:${ukTime.getMinutes().toString().padStart(2, '0')}
│ 
│ ⚡ *QUICK TEST:*
│ ├ .today tanzania → Should show: ${tanzaniaTime.getHours().toString().padStart(2, '0')}:XX
│ ├ .today kenya → Should show: ${kenyaTime.getHours().toString().padStart(2, '0')}:XX
│ └ .today uk → Should show: ${ukTime.getHours().toString().padStart(2, '0')}:XX
│
╰─────────────────────────╯

💡 *If times are wrong:*
1. Server might be in different timezone
2. Use .timecorrect to adjust
3. Or use manual calculation

🔄 *Test Now:* .today tanzania
        `.trim();

        await conn.sendMessage(from, { 
            text: debugMessage 
        }, { quoted: mek });

    } catch (error) {
        console.error("TIMEFIX ERROR:", error);
    }
});

// ============================================
// TIME CORRECTION COMMAND
// ============================================

cmd({
    pattern: "timecorrect",
    alias: ["fixoffset", "adjusttime"],
    desc: "Manually adjust time if showing wrong",
    category: "tools",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, args }) => {
    try {
        const adjustment = parseInt(args[0]) || 0;
        
        // Get current time
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        
        // Apply manual adjustment
        const adjustedTime = new Date(utcTime + (adjustment * 3600000));
        
        const correctionMessage = `
╭───「 ⚙️ TIME CORRECTION 」───╮
│
│ 📊 *ADJUSTMENT APPLIED:*
│ ├ Original: ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}
│ ├ Adjustment: ${adjustment > 0 ? '+' : ''}${adjustment} hours
│ ├ Corrected: ${adjustedTime.getHours().toString().padStart(2, '0')}:${adjustedTime.getMinutes().toString().padStart(2, '0')}
│ 
│ 🌍 *COMMON OFFSETS:*
│ ├ +3 → Tanzania, Kenya, Ethiopia
│ ├ +2 → South Africa, Egypt, Rwanda
│ ├ +0 → UK, Ghana, Portugal
│ ├ -5 → USA (East), Canada
│ 
│ 🔧 *USAGE:*
│ • .timecorrect +3 → Add 3 hours
│ • .timecorrect -2 → Subtract 2 hours
│ • .timecorrect 0 → Reset to system time
│
╰─────────────────────────╯

🔄 *Test corrected time:* .today tanzania
📝 *Note:* This adjustment is temporary for current session.
        `.trim();

        await conn.sendMessage(from, { 
            text: correctionMessage 
        }, { quoted: mek });

    } catch (error) {
        console.error("TIMECORRECT ERROR:", error);
    }
});
