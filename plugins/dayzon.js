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

        // Get country info
        const countryInfo = await getCountryTimeInfo(input);
        
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
        if (error.message.includes("Network Error")) {
            errorMessage += "Network unavailable or API not working.\n";
            errorMessage += "Using internal country information.";
        } else if (error.message.includes("404")) {
            errorMessage += "Country not found in the time system.";
        } else {
            errorMessage += `Reason: ${error.message}`;
        }
        
        errorMessage += `\n\nUse ${prefix}today list to see available countries.`;
        
        await conn.sendMessage(from, { 
            text: errorMessage 
        }, { quoted: mek });
    }
});

// Function to get country time info
async function getCountryTimeInfo(countryInput) {
    try {
        // Country to timezone mapping
        const countryTimezones = {
            // Africa
            'tanzania': 'Africa/Dar_es_Salaam',
            'kenya': 'Africa/Nairobi',
            'uganda': 'Africa/Kampala',
            'rwanda': 'Africa/Kigali',
            'burundi': 'Africa/Bujumbura',
            'ethiopia': 'Africa/Addis_Ababa',
            'nigeria': 'Africa/Lagos',
            'ghana': 'Africa/Accra',
            'south africa': 'Africa/Johannesburg',
            'egypt': 'Africa/Cairo',
            'morocco': 'Africa/Casablanca',
            
            // Asia
            'india': 'Asia/Kolkata',
            'china': 'Asia/Shanghai',
            'japan': 'Asia/Tokyo',
            'korea': 'Asia/Seoul',
            'singapore': 'Asia/Singapore',
            'malaysia': 'Asia/Kuala_Lumpur',
            'indonesia': 'Asia/Jakarta',
            'saudi arabia': 'Asia/Riyadh',
            'uae': 'Asia/Dubai',
            'turkey': 'Europe/Istanbul',
            
            // Europe
            'germany': 'Europe/Berlin',
            'france': 'Europe/Paris',
            'italy': 'Europe/Rome',
            'spain': 'Europe/Madrid',
            'uk': 'Europe/London',
            'russia': 'Europe/Moscow',
            'netherlands': 'Europe/Amsterdam',
            'sweden': 'Europe/Stockholm',
            
            // Americas
            'usa': 'America/New_York',
            'canada': 'America/Toronto',
            'brazil': 'America/Sao_Paulo',
            'mexico': 'America/Mexico_City',
            'argentina': 'America/Argentina/Buenos_Aires',
            
            // Oceania
            'australia': 'Australia/Sydney',
            'new zealand': 'Pacific/Auckland'
        };

        // Find matching timezone
        let timezone = null;
        let countryName = '';
        
        // Check exact match
        if (countryTimezones[countryInput]) {
            timezone = countryTimezones[countryInput];
            countryName = Object.keys(countryTimezones).find(key => key === countryInput);
        } else {
            // Check partial match
            for (const [key, value] of Object.entries(countryTimezones)) {
                if (key.includes(countryInput) || countryInput.includes(key)) {
                    timezone = value;
                    countryName = key;
                    break;
                }
            }
        }

        if (!timezone) return null;

        // Get time from World Time API
        const response = await axios.get(`http://worldtimeapi.org/api/timezone/${timezone}`, {
            timeout: 5000
        });

        const data = response.data;
        const now = new Date(data.datetime);
        
        // Format day names in English
        const daysEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = daysEnglish[now.getDay()];
        
        // Format month names in English
        const monthsEnglish = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthName = monthsEnglish[now.getMonth()];
        
        return {
            country: countryName.toUpperCase(),
            timezone: timezone,
            datetime: now,
            day: dayName,
            date: now.getDate(),
            month: monthName,
            year: now.getFullYear(),
            hour: now.getHours().toString().padStart(2, '0'),
            minute: now.getMinutes().toString().padStart(2, '0'),
            second: now.getSeconds().toString().padStart(2, '0'),
            dayOfYear: Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)),
            weekNumber: getWeekNumber(now),
            isDST: data.dst,
            abbreviation: data.abbreviation,
            unixTime: data.unixtime
        };

    } catch (error) {
        console.error("Timezone API Error:", error.message);
        // Fallback to local calculation if API fails
        return getLocalTimeInfo(countryInput);
    }
}

// Fallback function if API fails
function getLocalTimeInfo(countryInput) {
    const now = new Date();
    
    // Simple mapping for demonstration
    const countryOffsets = {
        'tanzania': 3, // UTC+3
        'kenya': 3,
        'uganda': 3,
        'rwanda': 2,
        'india': 5.5,
        'china': 8,
        'japan': 9,
        'uk': 0,
        'usa': -5,
        'germany': 1,
        'australia': 10
    };
    
    const offset = countryOffsets[countryInput] || 0;
    const localTime = new Date(now.getTime() + (offset * 60 * 60 * 1000));
    
    const daysEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsEnglish = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return {
        country: countryInput.toUpperCase(),
        timezone: `UTC${offset >= 0 ? '+' : ''}${offset}`,
        datetime: localTime,
        day: daysEnglish[localTime.getDay()],
        date: localTime.getDate(),
        month: monthsEnglish[localTime.getMonth()],
        year: localTime.getFullYear(),
        hour: localTime.getHours().toString().padStart(2, '0'),
        minute: localTime.getMinutes().toString().padStart(2, '0'),
        second: localTime.getSeconds().toString().padStart(2, '0'),
        dayOfYear: Math.floor((localTime - new Date(localTime.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)),
        weekNumber: getWeekNumber(localTime),
        isDST: false,
        abbreviation: `UTC${offset >= 0 ? '+' : ''}${offset}`,
        unixTime: Math.floor(localTime.getTime() / 1000)
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
    
    return `
╭───「 🕐 ${flagEmoji} TIME IN ${info.country} 」───╮
│
│ 📅 *DATE:* ${info.day}, ${info.date} ${info.month} ${info.year}
│ 🕒 *TIME:* ${info.hour}:${info.minute}:${info.second}
│ 🌍 *ZONE:* ${info.timezone}
│ 📊 *YEAR:* ${info.year}
│ 
│ 📋 *ADDITIONAL INFO:*
│ ├ Day of year: ${info.dayOfYear}
│ ├ Week number: ${info.weekNumber}
│ ├ Unix Time: ${info.unixTime}
│ └ Time system: ${info.abbreviation}
│ 
│ 📅 *${info.year} YEAR CALENDAR:*
│ ├ Total days: 365
│ ├ Weeks passed: ${info.weekNumber - 1}
│ ├ Weeks remaining: ${52 - info.weekNumber}
│ └ Year progress: ${Math.round((info.dayOfYear / 365) * 100)}%
│
╰─────────────────────────────────╯

🌐 *Countries sharing similar time:* ${getSimilarTimezones(info.timezone)}

🔔 *Note:* Time shown is for ${info.country} location.
🔄 *Change country:* .today [another country]
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
        'AUSTRALIA': '🇦🇺'
    };
    
    return flagMap[countryName] || '🇺🇳';
}

// Function to show country list
async function showCountryList(conn, from, mek, prefix) {
    const countries = [
        '🇹🇿 Tanzania', '🇰🇪 Kenya', '🇺🇬 Uganda', '🇷🇼 Rwanda',
        '🇧🇮 Burundi', '🇪🇹 Ethiopia', '🇳🇬 Nigeria', '🇬🇭 Ghana',
        '🇿🇦 South Africa', '🇪🇬 Egypt', '🇮🇳 India', '🇨🇳 China',
        '🇯🇵 Japan', '🇺🇸 USA', '🇬🇧 UK', '🇩🇪 Germany',
        '🇫🇷 France', '🇮🇹 Italy', '🇪🇸 Spain', '🇧🇷 Brazil',
        '🇦🇺 Australia', '🇨🇦 Canada', '🇷🇺 Russia', '🇸🇦 Saudi Arabia',
        '🇹🇷 Turkey', '🇮🇩 Indonesia', '🇲🇾 Malaysia', '🇸🇬 Singapore'
    ];

    let countryList = "╭───「 🌍 COUNTRY LIST 」───╮\n│\n";
    
    // Group countries in columns of 4
    for (let i = 0; i < countries.length; i += 4) {
        const row = countries.slice(i, i + 4);
        countryList += `│ ${row.join(' | ')}\n`;
    }
    
    countryList += `│\n╰─────────────────────────╯\n\n`;
    countryList += `💡 *Usage:* ${prefix}today [country]\n`;
    countryList += `📝 *Examples:*\n`;
    countryList += `• ${prefix}today tanzania\n`;
    countryList += `• ${prefix}today kenya\n`;
    countryList += `• ${prefix}today japan\n`;
    countryList += `• ${prefix}today germany\n\n`;
    countryList += `📍 *Note:* You can use full name or partial name.`;

    await conn.sendMessage(from, { 
        text: countryList 
    }, { quoted: mek });
}

// Function to get similar timezones
function getSimilarTimezones(timezone) {
    const similarZones = {
        'Africa/Dar_es_Salaam': 'Kenya, Uganda, Ethiopia',
        'Africa/Nairobi': 'Tanzania, Uganda, Ethiopia',
        'Asia/Kolkata': 'India, Sri Lanka',
        'Asia/Tokyo': 'Japan, Korea',
        'Europe/London': 'UK, Portugal',
        'America/New_York': 'USA (East), Canada',
        'Australia/Sydney': 'Australia (East)'
    };
    
    return similarZones[timezone] || 'Other countries in the same zone';
}

// ============================================
// BONUS: WORLD CLOCK COMMAND
// ============================================

cmd({
    pattern: "worldclock",
    alias: ["globaltime", "worldtime", "multitime"],
    desc: "Show time in multiple major cities worldwide",
    category: "tools",
    react: "🕐",
    filename: __filename
}, async (conn, mek, m, { from, prefix }) => {
    try {
        const majorCities = [
            { name: "🇹🇿 Dar es Salaam", tz: "Africa/Dar_es_Salaam" },
            { name: "🇰🇪 Nairobi", tz: "Africa/Nairobi" },
            { name: "🇿🇦 Johannesburg", tz: "Africa/Johannesburg" },
            { name: "🇮🇳 Mumbai", tz: "Asia/Kolkata" },
            { name: "🇯🇵 Tokyo", tz: "Asia/Tokyo" },
            { name: "🇬🇧 London", tz: "Europe/London" },
            { name: "🇩🇪 Berlin", tz: "Europe/Berlin" },
            { name: "🇺🇸 New York", tz: "America/New_York" },
            { name: "🇦🇺 Sydney", tz: "Australia/Sydney" }
        ];

        let clockMessage = "╭───「 🕐 WORLD CLOCK 」───╮\n│\n";
        
        for (const city of majorCities) {
            try {
                const now = new Date();
                // Simple offset calculation for demo
                const offsets = {
                    'Africa/Dar_es_Salaam': 3,
                    'Africa/Nairobi': 3,
                    'Africa/Johannesburg': 2,
                    'Asia/Kolkata': 5.5,
                    'Asia/Tokyo': 9,
                    'Europe/London': 0,
                    'Europe/Berlin': 1,
                    'America/New_York': -5,
                    'Australia/Sydney': 10
                };
                
                const offset = offsets[city.tz] || 0;
                const cityTime = new Date(now.getTime() + (offset * 60 * 60 * 1000));
                
                const timeStr = cityTime.getHours().toString().padStart(2, '0') + ':' + 
                               cityTime.getMinutes().toString().padStart(2, '0');
                
                clockMessage += `│ ${city.name}: ${timeStr} (UTC${offset >= 0 ? '+' : ''}${offset})\n`;
                
            } catch (e) {
                clockMessage += `│ ${city.name}: --:--\n`;
            }
        }
        
        clockMessage += `│\n╰──────────────────────╯\n\n`;
        clockMessage += `📅 *Today's Date:* ${new Date().toLocaleDateString('en-US')}\n`;
        clockMessage += `🔄 *Change country:* ${prefix}today [country]\n`;
        clockMessage += `🌐 *All countries:* ${prefix}today list`;

        await conn.sendMessage(from, { 
            text: clockMessage 
        }, { quoted: mek });

    } catch (error) {
        console.error("WORLD CLOCK ERROR:", error);
    }
});

// ============================================
// BONUS: TIME DIFFERENCE COMMAND
// ============================================

cmd({
    pattern: "timediff",
    alias: ["timegap", "timedifference", "difference"],
    desc: "Get time difference between two countries",
    category: "tools",
    react: "⏰",
    filename: __filename
}, async (conn, mek, m, { from, args, prefix }) => {
    try {
        if (!args || args.length < 2) {
            return await conn.sendMessage(from, { 
                text: `⏰ *TIME DIFFERENCE*\n\nUsage: ${prefix}timediff [country1] [country2]\nExample: ${prefix}timediff tanzania japan\n\nFind countries: ${prefix}today list` 
            }, { quoted: mek });
        }

        const country1 = args[0].toLowerCase();
        const country2 = args[1].toLowerCase();
        
        const info1 = await getCountryTimeInfo(country1) || getLocalTimeInfo(country1);
        const info2 = await getCountryTimeInfo(country2) || getLocalTimeInfo(country2);
        
        if (!info1 || !info2) {
            return await conn.sendMessage(from, { 
                text: `❌ *COUNTRY NOT FOUND!*\n\nMake sure you specified correct country names.\n\nUse ${prefix}today list to see available countries.` 
            }, { quoted: mek });
        }

        const diffHours = Math.abs(parseInt(info1.hour) - parseInt(info2.hour));
        const ahead = parseInt(info1.hour) > parseInt(info2.hour) ? info1.country : info2.country;
        
        const diffMessage = `
╭───「 ⏰ TIME DIFFERENCE 」───╮
│
│ 🌍 *COUNTRIES:* ${info1.country} vs ${info2.country}
│ 🕐 *TIME IN ${info1.country}:* ${info1.hour}:${info1.minute}
│ 🕐 *TIME IN ${info2.country}:* ${info2.hour}:${info2.minute}
│ 
│ 📊 *DIFFERENCE:*
│ ├ Hours: ${diffHours} hours
│ ├ Minutes: ${diffHours * 60} minutes
│ ├ ${ahead} is ahead
│ └ ${ahead === info1.country ? info2.country : info1.country} is behind
│ 
│ 🌐 *TIME ZONES:*
│ ├ ${info1.country}: ${info1.timezone}
│ └ ${info2.country}: ${info2.timezone}
│
╰─────────────────────────╯

💡 *Example:* When ${info1.country} is 12:00, ${info2.country} is ${(parseInt(info1.hour) - diffHours + 24) % 24}:${info1.minute}

🔄 *Check time:* ${prefix}today [country]
        `.trim();

        await conn.sendMessage(from, { 
            text: diffMessage 
        }, { quoted: mek });

    } catch (error) {
        console.error("TIME DIFF ERROR:", error);
    }
});
