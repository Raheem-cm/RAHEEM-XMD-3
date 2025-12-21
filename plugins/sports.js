 const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

const API_KEY = 'WEKA_API_KEY_YAKO_HAPA'; // Pata hapa: https://rapidapi.com/api-sports/api/api-football

// 1. DYNAMIC EPL TABLE (MSIMAMO)
cmd({
    pattern: "epltable",
    alias: ["toprank", "eplrank"],
    desc: "Get live EPL standings.",
    category: "sports",
    react: "🏆",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/standings', {
            params: { league: '39', season: '2025' }, // 39 ni ID ya Premier League
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        });

        const standings = response.data.response[0].league.standings[0];
        let tableMsg = `*╭━━〔 🏆 EPL LIVE TABLE 〕━━┈*\n┃\n`;

        standings.forEach((team) => {
            let emoji = team.rank <= 4 ? '🔵' : (team.rank >= 18 ? '🔴' : '⚪'); // Champions League vs Relegation
            tableMsg += `┃ ${team.rank}. ${team.team.name}\n┃    *Pts:* ${team.points} | *GD:* ${team.goalsDiff}\n┃\n`;
        });

        tableMsg += `╰━━━━━━━━━━━━━━━━━━━━━━━┈\n\n> *Season 2025/26 - Dynamic Updates*\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴇᴇᴍ-xᴍᴅ*`;

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
            caption: tableMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "RAHEEM-XMD SPORTS"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error fetching live standings. Ensure API key is correct.");
    }
});

// 2. DYNAMIC EPL SCORERS (WAFUNGAJI)
cmd({
    pattern: "eplscorers",
    alias: ["topscorers"],
    desc: "Get live EPL top scorers.",
    category: "sports",
    react: "⚽",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/players/topscorers', {
            params: { league: '39', season: '2025' },
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        });

        const scorers = response.data.response.slice(0, 10); // Top 10 pekee
        let scorersMsg = `*╭━━〔 ⚽ EPL TOP SCORERS 〕━━┈*\n┃\n`;

        scorers.forEach((p, index) => {
            const name = p.player.name;
            const goals = p.statistics[0].goals.total;
            const team = p.statistics[0].team.name;
            const rankEmoji = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : '◦'));
            
            scorersMsg += `┃ ${rankEmoji} *${name}* (${team})\n┃    ➩ *${goals} Goals*\n┃\n`;
        });

        scorersMsg += `╰━━━━━━━━━━━━━━━━━━━━━━━┈\n\n> *Live Dynamic Goal Stats*\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴇᴇᴍ-xᴍᴅ*`;

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/9gl0l8.jpg" },
            caption: scorersMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "RAHEEM-XMD SPORTS"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Failed to fetch live scorers.");
    }
});
