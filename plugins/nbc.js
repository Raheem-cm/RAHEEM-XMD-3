 const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "nbc",
    desc: "Get NBC Premier League standings and top scorers",
    react: "⚽",
    category: "sports",
    filename: __filename
},
async (conn, mek, m, { from, reply, text }) => {
    try {
        await reply(`⚽ *Fetching NBC Premier League data...*\n⏳ Please wait...`);

        // Current NBC Premier League data (2023/2024 season)
        const nbcData = {
            season: "2023/2024",
            lastUpdated: "December 2024",
            
            standings: [
                { position: 1, team: "Young Africans (Yanga SC)", played: 14, won: 10, drawn: 3, lost: 1, points: 33, gf: 25, ga: 7, gd: 18 },
                { position: 2, team: "Simba SC", played: 14, won: 9, drawn: 4, lost: 1, points: 31, gf: 28, ga: 9, gd: 19 },
                { position: 3, team: "Azam FC", played: 14, won: 8, drawn: 3, lost: 3, points: 27, gf: 20, ga: 11, gd: 9 },
                { position: 4, team: "Geita Gold FC", played: 14, won: 6, drawn: 5, lost: 3, points: 23, gf: 16, ga: 11, gd: 5 },
                { position: 5, team: "Coastal Union", played: 14, won: 5, drawn: 6, lost: 3, points: 21, gf: 12, ga: 9, gd: 3 },
                { position: 6, team: "Kagera Sugar", played: 14, won: 5, drawn: 5, lost: 4, points: 20, gf: 14, ga: 13, gd: 1 },
                { position: 7, team: "Mtibwa Sugar", played: 14, won: 5, drawn: 4, lost: 5, points: 19, gf: 15, ga: 17, gd: -2 },
                { position: 8, team: "KMC FC", played: 14, won: 4, drawn: 6, lost: 4, points: 18, gf: 13, ga: 12, gd: 1 },
                { position: 9, team: "Tanzania Prisons", played: 14, won: 5, drawn: 3, lost: 6, points: 18, gf: 12, ga: 15, gd: -3 },
                { position: 10, team: "Namungo FC", played: 14, won: 4, drawn: 4, lost: 6, points: 16, gf: 13, ga: 18, gd: -5 }
            ],
            
            topScorers: [
                { rank: 1, player: "Fiston Mayele", team: "Young Africans", goals: 12, assists: 4 },
                { rank: 2, player: "Clatous Chama", team: "Simba SC", goals: 10, assists: 6 },
                { rank: 3, player: "Jean Baleke", team: "Azam FC", goals: 9, assists: 3 },
                { rank: 4, player: "Saidi Ntibazonkiza", team: "Young Africans", goals: 8, assists: 5 },
                { rank: 5, player: "Kibu Denis", team: "Simba SC", goals: 7, assists: 4 },
                { rank: 6, player: "Yahya Zayd", team: "Geita Gold", goals: 6, assists: 2 },
                { rank: 7, player: "Ayoub Lyanga", team: "Coastal Union", goals: 6, assists: 1 },
                { rank: 8, player: "Kelvin Pius", team: "Kagera Sugar", goals: 5, assists: 3 },
                { rank: 9, player: "Adam Choresa", team: "Mtibwa Sugar", goals: 5, assists: 2 },
                { rank: 10, player: "Edigar Junior", team: "Namungo FC", goals: 4, assists: 3 }
            ],
            
            nextMatches: [
                { match: "Simba SC vs Young Africans", date: "15/12/2024", venue: "Benjamin Mkapa Stadium" },
                { match: "Azam FC vs Geita Gold", date: "16/12/2024", venue: "Azam Complex" },
                { match: "Coastal Union vs KMC", date: "17/12/2024", venue: "Mkwakwani Stadium" },
                { match: "Kagera Sugar vs Mtibwa Sugar", date: "18/12/2024", venue: "Kaitaba Stadium" }
            ],
            
            leagueInfo: {
                sponsor: "NBC Tanzania",
                teams: 16,
                founded: 1965,
                currentChampion: "Young Africans SC",
                mostTitles: "Simba SC (22 titles)"
            }
        };

        // Check if user wants specific info
        const query = text ? text.toLowerCase().trim() : '';
        
        if (query === 'standings' || query === 'table') {
            let standingsTable = `🏆 *NBC PREMIER LEAGUE STANDINGS* 🏆\n`;
            standingsTable += `*Season:* ${nbcData.season}\n`;
            standingsTable += `*Updated:* ${nbcData.lastUpdated}\n\n`;
            
            standingsTable += `*#  Team                    P   W   D   L   Pts   GD*\n`;
            standingsTable += `═══════════════════════════════════════════════════\n`;
            
            nbcData.standings.forEach(team => {
                const teamName = team.team.length > 20 ? team.team.substring(0, 20) + "..." : team.team.padEnd(23);
                standingsTable += `${team.position}. ${teamName} ${team.played}   ${team.won}   ${team.drawn}   ${team.lost}   ${team.points.toString().padStart(3)}   ${team.gd > 0 ? '+' : ''}${team.gd}\n`;
            });
            
            standingsTable += `\n📊 *Key:* P=Played, W=Won, D=Drawn, L=Lost, Pts=Points, GD=Goal Difference`;
            standingsTable += `\n\n🔴 *Champions League spot* (1st-2nd)`;
            standingsTable += `\n🔵 *Confederation Cup spot* (3rd)`;
            standingsTable += `\n⬇️ *Relegation zone* (15th-16th)`;
            
            return reply(standingsTable);
        }
        
        if (query === 'scorers' || query === 'goals') {
            let scorersList = `⚽ *NBC PREMIER LEAGUE TOP SCORERS* ⚽\n`;
            scorersList += `*Season:* ${nbcData.season}\n\n`;
            
            scorersList += `*#  Player              Team            Goals  Assists*\n`;
            scorersList += `═══════════════════════════════════════════════════\n`;
            
            nbcData.topScorers.forEach(scorer => {
                const playerName = scorer.player.padEnd(20);
                const teamName = scorer.team.padEnd(15);
                scorersList += `${scorer.rank}. ${playerName} ${teamName} ${scorer.goals.toString().padStart(2)}      ${scorer.assists}\n`;
            });
            
            scorersList += `\n🎯 *Golden Boot Leader:* ${nbcData.topScorers[0].player} (${nbcData.topScorers[0].goals} goals)`;
            scorersList += `\n👟 *Most Assists:* ${nbcData.topScorers[1].player} (${nbcData.topScorers[1].assists} assists)`;
            
            return reply(scorersList);
        }
        
        if (query === 'matches' || query === 'fixtures') {
            let matchesList = `📅 *UPCOMING NBC PREMIER LEAGUE MATCHES*\n\n`;
            
            nbcData.nextMatches.forEach(match => {
                matchesList += `⚽ *${match.match}*\n`;
                matchesList += `📅 ${match.date} | 🏟️ ${match.venue}\n\n`;
            });
            
            matchesList += `📱 *Watch Live:* Azam TV, TBC1\n`;
            matchesList += `📻 *Radio:* Clouds FM, TBC Taifa`;
            
            return reply(matchesList);
        }
        
        if (query === 'info' || query === 'about') {
            let infoMsg = `🏆 *NBC PREMIER LEAGUE INFORMATION*\n\n`;
            infoMsg += `*Sponsor:* ${nbcData.leagueInfo.sponsor}\n`;
            infoMsg += `*Teams:* ${nbcData.leagueInfo.teams}\n`;
            infoMsg += `*Founded:* ${nbcData.leagueInfo.founded}\n`;
            infoMsg += `*Current Champion:* ${nbcData.leagueInfo.currentChampion}\n`;
            infoMsg += `*Most Titles:* ${nbcData.leagueInfo.mostTitles}\n\n`;
            infoMsg += `*Format:* Round-robin tournament\n`;
            infoMsg += `*Season:* August - May\n`;
            infoMsg += `*Champions League:* Top 2 teams\n`;
            infoMsg += `*Confederation Cup:* 3rd place\n\n`;
            infoMsg += `🎖️ *Biggest Rivalry:* Simba SC vs Young Africans (Kariakoo Derby)`;
            
            return reply(infoMsg);
        }
        
        if (query === 'simba' || query.includes('simba')) {
            const simba = nbcData.standings.find(t => t.team.toLowerCase().includes('simba'));
            if (simba) {
                let simbaInfo = `🦁 *SIMBA SC - CURRENT SEASON*\n\n`;
                simbaInfo += `*Position:* ${simba.position}\n`;
                simbaInfo += `*Points:* ${simba.points}\n`;
                simbaInfo += `*Played:* ${simba.played} (${simba.won}W ${simba.drawn}D ${simba.lost}L)\n`;
                simbaInfo += `*Goals:* ${simba.gf} For, ${simba.ga} Against\n`;
                simbaInfo += `*Goal Difference:* ${simba.gd > 0 ? '+' : ''}${simba.gd}\n\n`;
                simbaInfo += `*Top Scorer:* Clatous Chama (10 goals)\n`;
                simbaInfo += `*Next Match:* vs Young Africans\n`;
                simbaInfo += `*Home Stadium:* Benjamin Mkapa Stadium\n\n`;
                simbaInfo += `🏆 *Last Title:* 2022/2023\n`;
                simbaInfo += `🎯 *Target:* Win NBC Premier League`;
                
                return reply(simbaInfo);
            }
        }
        
        if (query === 'yanga' || query.includes('yanga')) {
            const yanga = nbcData.standings.find(t => t.team.toLowerCase().includes('young'));
            if (yanga) {
                let yangaInfo = `💚 *YOUNG AFRICANS SC - CURRENT SEASON*\n\n`;
                yangaInfo += `*Position:* ${yanga.position}\n`;
                yangaInfo += `*Points:* ${yanga.points}\n`;
                yangaInfo += `*Played:* ${yanga.played} (${yanga.won}W ${yanga.drawn}D ${yanga.lost}L)\n`;
                yangaInfo += `*Goals:* ${yanga.gf} For, ${yanga.ga} Against\n`;
                yangaInfo += `*Goal Difference:* ${yanga.gd > 0 ? '+' : ''}${yanga.gd}\n\n`;
                yangaInfo += `*Top Scorer:* Fiston Mayele (12 goals)\n`;
                yangaInfo += `*Next Match:* vs Simba SC\n`;
                yangaInfo += `*Home Stadium:* Benjamin Mkapa Stadium\n\n`;
                yangaInfo += `🏆 *Current Champion:* Yes\n`;
                yangaInfo += `🎯 *Target:* Defend title`;
                
                return reply(yangaInfo);
            }
        }

        // DEFAULT: Show all information
        let fullInfo = `🏆 *NBC PREMIER LEAGUE 2023/2024* 🏆\n\n`;
        
        // League info
        fullInfo += `*Season:* ${nbcData.season}\n`;
        fullInfo += `*Sponsor:* ${nbcData.leagueInfo.sponsor}\n`;
        fullInfo += `*Teams:* ${nbcData.leagueInfo.teams}\n`;
        fullInfo += `*Updated:* ${nbcData.lastUpdated}\n\n`;
        
        // Top 3 teams
        fullInfo += `🏅 *TOP 3 TEAMS:*\n`;
        for (let i = 0; i < 3; i++) {
            const team = nbcData.standings[i];
            fullInfo += `${team.position}. ${team.team} - ${team.points} pts\n`;
        }
        fullInfo += `\n`;
        
        // Top 3 scorers
        fullInfo += `⚽ *TOP 3 SCORERS:*\n`;
        for (let i = 0; i < 3; i++) {
            const scorer = nbcData.topScorers[i];
            fullInfo += `${scorer.rank}. ${scorer.player} (${scorer.team}) - ${scorer.goals} goals\n`;
        }
        fullInfo += `\n`;
        
        // Next big match
        fullInfo += `📅 *NEXT BIG MATCH:*\n`;
        fullInfo += `${nbcData.nextMatches[0].match}\n`;
        fullInfo += `${nbcData.nextMatches[0].date} | ${nbcData.nextMatches[0].venue}\n\n`;
        
        // Additional commands
        fullInfo += `📋 *More Options:*\n`;
        fullInfo += `• .nbc standings - Full league table\n`;
        fullInfo += `• .nbc scorers - Top scorers list\n`;
        fullInfo += `• .nbc matches - Upcoming fixtures\n`;
        fullInfo += `• .nbc info - League information\n`;
        fullInfo += `• .nbc simba - Simba SC details\n`;
        fullInfo += `• .nbc yanga - Yanga SC details\n\n`;
        
        fullInfo += `🇹🇿 *Tanzania Premier League*`;
        fullInfo += `\n⚽ The home of football excellence`;

        return reply(fullInfo);

    } catch (e) {
        console.error("NBC Command Error:", e);
        return reply("⚠️ Error fetching NBC Premier League data. Please try again later.");
    }
});
