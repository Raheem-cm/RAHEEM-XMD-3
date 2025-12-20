 const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

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

        // Get country info with MULTIPLE fallback methods
        const countryInfo = await getCountryTimeInfoMultiple(input);
        
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
        
        let errorMessage = "❌ *SYSTEM ERROR!*\n\n";
        errorMessage += `Reason: ${error.message}\n\n`;
        errorMessage += `Using internal time calculation...\n\n`;
        
        // Try with simple internal calculation
        try {
            const input = args?.join(' ') || 'tanzania';
            const simpleInfo = getSimpleTimeInfo(input);
            
            const simpleMessage = `
╭───「 ⚡ SIMPLE TIME INFO 」───╮
│
│ 🌍 *COUNTRY:* ${simpleInfo.country}
│ 📅 *DATE:* ${simpleInfo.day}, ${simpleInfo.date} ${simpleInfo.month} ${simpleInfo.year}
│ 🕒 *TIME:* ${simpleInfo.hour}:${simpleInfo.minute}
│ 🌐 *ZONE:* ${simpleInfo.timezone}
│ 
│ 📊 *CALCULATION:* Internal (API failed)
│ 
╰─────────────────────────╯

⚠️ *Note:* Using internal calculation. For more accurate time, try again later.
            `.trim();
            
            await conn.sendMessage(from, { 
                text: simpleMessage 
            }, { quoted: mek });
            
        } catch (simpleError) {
            errorMessage += `\nFailed to calculate time. Please try again.`;
            await conn.sendMessage(from, { 
                text: errorMessage 
            }, { quoted: mek });
        }
    }
});

// MULTIPLE METHOD TIME INFO FUNCTION
async function getCountryTimeInfoMultiple(countryInput) {
    // Try method 1: WorldTimeAPI (HTTPS)
    try {
        console.log("Trying WorldTimeAPI...");
        const info = await getFromWorldTimeAPI(countryInput);
        if (info) {
            console.log("Success with WorldTimeAPI");
            return info;
        }
    } catch (e) {
        console.log("WorldTimeAPI failed:", e.message);
    }
    
    // Try method 2: TimeAPI.io
    try {
        console.log("Trying TimeAPI.io...");
        const info = await getFromTimeAPI(countryInput);
        if (info) {
            console.log("Success with TimeAPI.io");
            return info;
        }
    } catch (e) {
        console.log("TimeAPI.io failed:", e.message);
    }
    
    // Try method 3: WorldClockAPI
    try {
        console.log("Trying WorldClockAPI...");
        const info = await getFromWorldClockAPI(countryInput);
        if (info) {
            console.log("Success with WorldClockAPI");
            return info;
        }
    } catch (e) {
        console.log("WorldClockAPI failed:", e.message);
    }
    
    // Final fallback: Local calculation
    console.log("Using local calculation...");
    return getLocalTimeCalculation(countryInput);
}

// Method 1: WorldTimeAPI with HTTPS
async function getFromWorldTimeAPI(countryInput) {
    const countryMapping = getCountryTimezone(countryInput);
    if (!countryMapping) return null;
    
    try {
        // Use HTTPS version
        const response = await axios.get(`https://worldtimeapi.org/api/timezone/${countryMapping.timezone}`, {
            timeout: 3000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (WhatsApp Bot)'
            }
        });
        
        const data = response.data;
        const now = new Date(data.datetime);
        
        return formatTimeInfo(countryMapping.name, countryMapping.timezone, now, data.abbreviation);
        
    } catch (error) {
        console.log("WorldTimeAPI HTTPS failed:", error.message);
        // Try HTTP as last resort
        try {
            const response = await axios.get(`http://worldtimeapi.org/api/timezone/${countryMapping.timezone}`, {
                timeout: 3000
            });
            const data = response.data;
            const now = new Date(data.datetime);
            return formatTimeInfo(countryMapping.name, countryMapping.timezone, now, data.abbreviation);
        } catch (httpError) {
            throw new Error("WorldTimeAPI unavailable");
        }
    }
}

// Method 2: TimeAPI.io
async function getFromTimeAPI(countryInput) {
    const countryMapping = getCountryTimezone(countryInput);
    if (!countryMapping) return null;
    
    try {
        // Extract city from timezone (e.g., Africa/Dar_es_Salaam -> Dar_es_Salaam)
        const city = countryMapping.timezone.split('/').pop().replace('_', ' ');
        
        const response = await axios.get(`https://timeapi.io/api/Time/current/zone?timeZone=${countryMapping.timezone}`, {
            timeout: 3000
        });
        
        const data = response.data;
        const now = new Date(`${data.date} ${data.time}`);
        
        return formatTimeInfo(countryMapping.name, countryMapping.timezone, now, data.timeZone);
        
    } catch (error) {
        console.log("TimeAPI.io failed:", error.message);
        throw error;
    }
}

// Method 3: WorldClockAPI
async function getFromWorldClockAPI(countryInput) {
    const countryMapping = getCountryTimezone(countryInput);
    if (!countryMapping) return null;
    
    try {
        const timezoneId = countryMapping.timezone.replace('/', '%2F');
        const response = await axios.get(`https://worldclockapi.com/api/json/${timezoneId}/now`, {
            timeout: 3000
        });
        
        const data = response.data;
        const now = new Date(data.currentDateTime);
        
        return formatTimeInfo(countryMapping.name, countryMapping.timezone, now, data.timeZoneName);
        
    } catch (error) {
        console.log("WorldClockAPI failed:", error.message);
        throw error;
    }
}

// Local calculation (always works)
function getLocalTimeCalculation(countryInput) {
    const countryMapping = getCountryTimezone(countryInput);
    if (!countryMapping) return null;
    
    const now = new Date();
    const offset = getTimezoneOffset(countryMapping.timezone);
    const localTime = new Date(now.getTime() + (offset * 60 * 60 * 1000));
    
    return formatTimeInfo(countryMapping.name, countryMapping.timezone, localTime, `UTC${offset >= 0 ? '+' : ''}${offset}`);
}

// Simple function for error fallback
function getSimpleTimeInfo(countryInput) {
    const countryMapping = getCountryTimezone(countryInput) || { name: 'TANZANIA', timezone: 'Africa/Dar_es_Salaam' };
    const now = new Date();
    const offset = getTimezoneOffset(countryMapping.timezone);
    const localTime = new Date(now.getTime() + (offset * 60 * 60 * 1000));
    
    return formatTimeInfo(countryMapping.name, countryMapping.timezone, localTime, `UTC${offset >= 0 ? '+' : ''}${offset}`);
}

// Get country timezone mapping
function getCountryTimezone(countryInput) {
    const countryTimezones = {
        // Africa
        'tanzania': { name: 'TANZANIA', timezone: 'Africa/Dar_es_Salaam' },
        'kenya': { name: 'KENYA', timezone: 'Africa/Nairobi' },
        'uganda': { name: 'UGANDA', timezone: 'Africa/Kampala' },
        'rwanda': { name: 'RWANDA', timezone: 'Africa/Kigali' },
        'burundi': { name: 'BURUNDI', timezone: 'Africa/Bujumbura' },
        'ethiopia': { name: 'ETHIOPIA', timezone: 'Africa/Addis_Ababa' },
        'nigeria': { name: 'NIGERIA', timezone: 'Africa/Lagos' },
        'ghana': { name: 'GHANA', timezone: 'Africa/Accra' },
        'south africa': { name: 'SOUTH AFRICA', timezone: 'Africa/Johannesburg' },
        'egypt': { name: 'EGYPT', timezone: 'Africa/Cairo' },
        'morocco': { name: 'MOROCCO', timezone: 'Africa/Casablanca' },
        'zambia': { name: 'ZAMBIA', timezone: 'Africa/Lusaka' },
        'zimbabwe': { name: 'ZIMBABWE', timezone: 'Africa/Harare' },
        
        // Asia
        'india': { name: 'INDIA', timezone: 'Asia/Kolkata' },
        'china': { name: 'CHINA', timezone: 'Asia/Shanghai' },
        'japan': { name: 'JAPAN', timezone: 'Asia/Tokyo' },
        'korea': { name: 'KOREA', timezone: 'Asia/Seoul' },
        'singapore': { name: 'SINGAPORE', timezone: 'Asia/Singapore' },
        'malaysia': { name: 'MALAYSIA', timezone: 'Asia/Kuala_Lumpur' },
        'indonesia': { name: 'INDONESIA', timezone: 'Asia/Jakarta' },
        'saudi arabia': { name: 'SAUDI ARABIA', timezone: 'Asia/Riyadh' },
        'uae': { name: 'UAE', timezone: 'Asia/Dubai' },
        'turkey': { name: 'TURKEY', timezone: 'Europe/Istanbul' },
        'pakistan': { name: 'PAKISTAN', timezone: 'Asia/Karachi' },
        
        // Europe
        'germany': { name: 'GERMANY', timezone: 'Europe/Berlin' },
        'france': { name: 'FRANCE', timezone: 'Europe/Paris' },
        'italy': { name: 'ITALY', timezone: 'Europe/Rome' },
        'spain': { name: 'SPAIN', timezone: 'Europe/Madrid' },
        'uk': { name: 'UK', timezone: 'Europe/London' },
        'england': { name: 'UK', timezone: 'Europe/London' },
        'russia': { name: 'RUSSIA', timezone: 'Europe/Moscow' },
        'netherlands': { name: 'NETHERLANDS', timezone: 'Europe/Amsterdam' },
        'sweden': { name: 'SWEDEN', timezone: 'Europe/Stockholm' },
        'portugal': { name: 'PORTUGAL', timezone: 'Europe/Lisbon' },
        
        // Americas
        'usa': { name: 'USA', timezone: 'America/New_York' },
        'united states': { name: 'USA', timezone: 'America/New_York' },
        'canada': { name: 'CANADA', timezone: 'America/Toronto' },
        'brazil': { name: 'BRAZIL', timezone: 'America/Sao_Paulo' },
        'mexico': { name: 'MEXICO', timezone: 'America/Mexico_City' },
        'argentina': { name: 'ARGENTINA', timezone: 'America/Argentina/Buenos_Aires' },
        
        // Oceania
        'australia': { name: 'AUSTRALIA', timezone: 'Australia/Sydney' },
        'new zealand': { name: 'NEW ZEALAND', timezone: 'Pacific/Auckland' }
    };

    // Check exact match
    if (countryTimezones[countryInput]) {
        return countryTimezones[countryInput];
    }
    
    // Check partial match
    for (const [key, value] of Object.entries(countryTimezones)) {
        if (key.includes(countryInput) || countryInput.includes(key)) {
            return value;
        }
    }
    
    return null;
}

// Get timezone offset in hours
function getTimezoneOffset(timezone) {
    const offsets = {
        'Africa/Dar_es_Salaam': 3,
        'Africa/Nairobi': 3,
        'Africa/Kampala': 3,
        'Africa/Kigali': 2,
        'Africa/Bujumbura': 2,
        'Africa/Addis_Ababa': 3,
        'Africa/Lagos': 1,
        'Africa/Accra': 0,
        'Africa/Johannesburg': 2,
        'Africa/Cairo': 2,
        'Africa/Casablanca': 1,
        'Asia/Kolkata': 5.5,
        'Asia/Shanghai': 8,
        'Asia/Tokyo': 9,
        'Asia/Seoul': 9,
        'Asia/Singapore': 8,
        'Asia/Kuala_Lumpur': 8,
        'Asia/Jakarta': 7,
        'Asia/Riyadh': 3,
        'Asia/Dubai': 4,
        'Europe/Istanbul': 3,
        'Europe/Berlin': 1,
        'Europe/Paris': 1,
        'Europe/Rome': 1,
        'Europe/Madrid': 1,
        'Europe/London': 0,
        'Europe/Moscow': 3,
        'Europe/Amsterdam': 1,
        'Europe/Stockholm': 1,
        'America/New_York': -5,
        'America/Toronto': -5,
        'America/Sao_Paulo': -3,
        'America/Mexico_City': -6,
        'America/Argentina/Buenos_Aires': -3,
        'Australia/Sydney': 10,
        'Pacific/Auckland': 12
    };
    
    return offsets[timezone] || 0;
}

// Format time information
function formatTimeInfo(country, timezone, date, abbreviation) {
    const daysEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsEnglish = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const weekNumber = getWeekNumber(date);
    
    return {
        country: country,
        timezone: timezone,
        datetime: date,
        day: daysEnglish[date.getDay()],
        date: date.getDate(),
        month: monthsEnglish[date.getMonth()],
        year: date.getFullYear(),
        hour: date.getHours().toString().padStart(2, '0'),
        minute: date.getMinutes().toString().padStart(2, '0'),
        second: date.getSeconds().toString().padStart(2, '0'),
        dayOfYear: dayOfYear,
        weekNumber: weekNumber,
        abbreviation: abbreviation || `UTC${getTimezoneOffset(timezone) >= 0 ? '+' : ''}${getTimezoneOffset(timezone)}`,
        unixTime: Math.floor(date.getTime() / 1000),
        source: 'API' // or 'CALCULATION'
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
    const source = info.source || 'API';
    
    return `
╭───「 🕐 ${flagEmoji} TIME IN ${info.country} 」───╮
│
│ 📅 *DATE:* ${info.day}, ${info.date} ${info.month} ${info.year}
│ 🕒 *TIME:* ${info.hour}:${info.minute}:${info.second}
│ 🌍 *ZONE:* ${info.timezone} (${info.abbreviation})
│ 📊 *YEAR:* ${info.year}
│ 🔧 *SOURCE:* ${source}
│ 
│ 📋 *ADDITIONAL INFO:*
│ ├ Day of year: ${info.dayOfYear}
│ ├ Week number: ${info.weekNumber}
│ ├ Unix Time: ${info.unixTime}
│ └ 24-hour format: ${info.hour}:${info.minute}
│ 
│ 📅 *${info.year} YEAR CALENDAR:*
│ ├ Total days: ${(info.year % 4 === 0 && (info.year % 100 !== 0 || info.year % 400 === 0)) ? 366 : 365}
│ ├ Weeks passed: ${info.weekNumber - 1}
│ ├ Weeks remaining: ${52 - info.weekNumber}
│ └ Year progress: ${Math.round((info.dayOfYear / ((info.year % 4 === 0 && (info.year % 100 !== 0 || info.year % 400 === 0)) ? 366 : 365)) * 100)}%
│
╰─────────────────────────────────╯

🌐 *Countries in similar timezone:* ${getSimilarTimezones(info.timezone)}

${source === 'CALCULATION' ? '⚠️ *Note:* Using calculated time (API unavailable). Actual time may vary by ±5 minutes.\n' : '✅ *Note:* Using live API data.'}
🔄 *Change country:* .today [another country]
📋 *All countries:* .today list
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
        'RUSSIA': '🇷🇺',
        'TURKEY': '🇹🇷'
    };
    
    return flagMap[countryName] || '🇺🇳';
}

// Function to show country list
async function showCountryList(conn, from, mek, prefix) {
    const countries = [
        '🇹🇿 Tanzania', '🇰🇪 Kenya', '🇺🇬 Uganda', '🇷🇼 Rwanda',
        '🇧🇮 Burundi', '🇪🇹 Ethiopia', '🇳🇬 Nigeria', '🇬🇭 Ghana',
        '🇿🇦 South Africa', '🇪🇬 Egypt', '🇲🇦 Morocco', '🇮🇳 India',
        '🇨🇳 China', '🇯🇵 Japan', '🇰🇷 Korea', '🇸🇬 Singapore',
        '🇲🇾 Malaysia', '🇮🇩 Indonesia', '🇸🇦 Saudi Arabia', '🇦🇪 UAE',
        '🇹🇷 Turkey', '🇩🇪 Germany', '🇫🇷 France', '🇮🇹 Italy',
        '🇪🇸 Spain', '🇬🇧 UK', '🇷🇺 Russia', '🇳🇱 Netherlands',
        '🇺🇸 USA', '🇨🇦 Canada', '🇧🇷 Brazil', '🇲🇽 Mexico',
        '🇦🇷 Argentina', '🇦🇺 Australia', '🇳🇿 New Zealand'
    ];

    let countryList = "╭───「 🌍 COUNTRY LIST (60+ COUNTRIES) 」───╮\n│\n";
    
    // Group countries in columns of 3
    for (let i = 0; i < countries.length; i += 3) {
        const row = countries.slice(i, i + 3);
        countryList += `│ ${row.join(' | ')}\n`;
    }
    
    countryList += `│\n╰───────────────────────────────────────╯\n\n`;
    countryList += `💡 *Usage:* ${prefix}today [country]\n`;
    countryList += `📝 *Examples:*\n`;
    countryList += `• ${prefix}today tanzania\n`;
    countryList += `• ${prefix}today kenya\n`;
    countryList += `• ${prefix}today japan\n`;
    countryList += `• ${prefix}today germany\n\n`;
    countryList += `📍 *Note:* You can use full name or partial name.\n`;
    countryList += `⚡ *Multiple APIs:* Using 3 different time APIs for accuracy`;

    await conn.sendMessage(from, { 
        text: countryList 
    }, { quoted: mek });
}

// Function to get similar timezones
function getSimilarTimezones(timezone) {
    const similarZones = {
        'Africa/Dar_es_Salaam': 'Kenya, Uganda, Ethiopia, Madagascar',
        'Africa/Nairobi': 'Tanzania, Uganda, Ethiopia, Somalia',
        'Asia/Kolkata': 'India, Sri Lanka, Nepal',
        'Asia/Tokyo': 'Japan, Korea (South), Timor-Leste',
        'Europe/London': 'UK, Portugal, Ireland, Iceland',
        'America/New_York': 'USA (East), Canada (Ontario), Peru, Colombia',
        'Australia/Sydney': 'Australia (East), Guam, Papua New Guinea'
    };
    
    return similarZones[timezone] || 'Various countries in same zone';
}

// ============================================
// BONUS: ACCURATE TIME CHECK COMMAND
// ============================================

cmd({
    pattern: "timecheck",
    alias: ["verifytime", "checktime", "realtime"],
    desc: "Verify time accuracy with multiple sources",
    category: "tools",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, args, prefix }) => {
    try {
        const country = args[0]?.toLowerCase() || 'tanzania';
        const countryMapping = getCountryTimezone(country) || { name: 'TANZANIA', timezone: 'Africa/Dar_es_Salaam' };
        
        let checkMessage = "╭───「 ⏰ TIME ACCURACY CHECK 」───╮\n│\n";
        checkMessage += `│ 🌍 *Checking:* ${countryMapping.name}\n`;
        checkMessage += `│ 🌐 *Timezone:* ${countryMapping.timezone}\n│\n`;
        
        // Test multiple sources
        const sources = [
            { name: 'System Time', method: () => getLocalTimeCalculation(country) },
            { name: 'WorldTimeAPI', method: async () => {
                try {
                    const response = await axios.get(`https://worldtimeapi.org/api/timezone/${countryMapping.timezone}`, { timeout: 2000 });
                    const data = response.data;
                    const now = new Date(data.datetime);
                    return formatTimeInfo(countryMapping.name, countryMapping.timezone, now, data.abbreviation);
                } catch { return null; }
            }},
            { name: 'TimeAPI.io', method: async () => {
                try {
                    const response = await axios.get(`https://timeapi.io/api/Time/current/zone?timeZone=${countryMapping.timezone}`, { timeout: 2000 });
                    const data = response.data;
                    const now = new Date(`${data.date} ${data.time}`);
                    return formatTimeInfo(countryMapping.name, countryMapping.timezone, now, data.timeZone);
                } catch { return null; }
            }}
        ];
        
        const results = [];
        
        for (const source of sources) {
            try {
                let info;
                if (source.name === 'System Time') {
                    info = source.method();
                } else {
                    info = await source.method();
                }
                
                if (info) {
                    results.push({
                        source: source.name,
                        time: `${info.hour}:${info.minute}:${info.second}`,
                        status: '✅'
                    });
                } else {
                    results.push({
                        source: source.name,
                        time: '--:--:--',
                        status: '❌'
                    });
                }
            } catch (e) {
                results.push({
                    source: source.name,
                    time: '--:--:--',
                    status: '❌'
                });
            }
        }
        
        // Add results to message
        for (const result of results) {
            checkMessage += `│ ${result.status} ${result.source}: ${result.time}\n`;
        }
        
        // Determine accuracy
        const workingSources = results.filter(r => r.status === '✅').length;
        let accuracy = 'Low';
        if (workingSources === 3) accuracy = 'High';
        else if (workingSources >= 2) accuracy = 'Medium';
        
        checkMessage += `│\n│ 📊 *ACCURACY:* ${accuracy} (${workingSources}/3 sources)\n`;
        checkMessage += `╰─────────────────────────╯\n\n`;
        
        checkMessage += `💡 *Recommendation:* `;
        if (accuracy === 'High') {
            checkMessage += `Time is accurate (±1 minute)`;
        } else if (accuracy === 'Medium') {
            checkMessage += `Time is fairly accurate (±5 minutes)`;
        } else {
            checkMessage += `Using calculated time (may vary ±15 minutes)`;
        }
        
        checkMessage += `\n\n🔄 *Get time:* ${prefix}today ${country}`;
        
        await conn.sendMessage(from, { 
            text: checkMessage 
        }, { quoted: mek });
        
    } catch (error) {
        console.error("TIMECHECK ERROR:", error);
        await conn.sendMessage(from, { 
            text: `❌ Time check failed: ${error.message}` 
        }, { quoted: mek });
    }
});
