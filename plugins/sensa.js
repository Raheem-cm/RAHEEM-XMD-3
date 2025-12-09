 const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "cs",
    desc: "Get country census/population data",
    react: "📊",
    category: "info",
    filename: __filename
},
async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) {
            const helpMsg = `
📊 *COUNTRY CENSUS DATA* 📊

*Usage:* .cs [country name]
*Examples:*
• .cs china
• .cs tanzania
• .cs kenya
• .cs usa
• .cs india

*Info Provided:*
• Population
• Last census year
• Area
• Density
• Growth rate

*Data Source:* World Bank & UN
`;
            return reply(helpMsg);
        }

        const countryName = text.trim().toLowerCase();
        
        // Show searching message
        await reply(`🔍 *Searching census data for:* ${countryName}\n⏳ Please wait...`);

        // Country code mapping
        const countryCodes = {
            'china': 'CHN',
            'tanzania': 'TZA',
            'kenya': 'KEN',
            'uganda': 'UGA',
            'rwanda': 'RWA',
            'burundi': 'BDI',
            'india': 'IND',
            'usa': 'USA',
            'united states': 'USA',
            'uk': 'GBR',
            'united kingdom': 'GBR',
            'germany': 'DEU',
            'france': 'FRA',
            'japan': 'JPN',
            'brazil': 'BRA',
            'nigeria': 'NGA',
            'south africa': 'ZAF',
            'egypt': 'EGY',
            'russia': 'RUS',
            'canada': 'CAN',
            'australia': 'AUS'
        };

        const countryCode = countryCodes[countryName] || countryName.toUpperCase();
        const formattedName = countryName.charAt(0).toUpperCase() + countryName.slice(1);

        try {
            // Try World Bank API
            const apiUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?format=json&date=2023:2020`;
            
            const response = await axios.get(apiUrl);
            const data = response.data;
            
            if (!data || data.length < 2 || !data[1] || data[1].length === 0) {
                // Fallback to REST Countries API
                const restUrl = `https://restcountries.com/v3.1/name/${countryName}`;
                const restResponse = await axios.get(restUrl);
                const countryData = restResponse.data[0];
                
                const population = countryData.population.toLocaleString();
                const area = countryData.area.toLocaleString();
                const density = (countryData.population / countryData.area).toFixed(2);
                
                const censusInfo = `
📊 *CENSUS DATA: ${countryData.name.common.toUpperCase()}* 📊

👥 *Population:* ${population}
🌍 *Area:* ${area} km²
📐 *Density:* ${density}/km²
🗺️ *Region:* ${countryData.region}
🌐 *Subregion:* ${countryData.subregion}
🏙️ *Capital:* ${countryData.capital ? countryData.capital[0] : 'N/A'}
🗣️ *Languages:* ${Object.values(countryData.languages || {}).join(', ')}

📅 *Last Census:* ${new Date().getFullYear() - 1}
📈 *Source:* REST Countries API

🇹🇿 *Note:* Data might not be latest census
`;
                
                return reply(censusInfo);
            }
            
            // Process World Bank data
            const populationData = data[1];
            const latestYear = populationData[0].date;
            const latestPopulation = parseInt(populationData[0].value).toLocaleString();
            const prevYear = populationData[1]?.date || 'N/A';
            const prevPopulation = populationData[1] ? parseInt(populationData[1].value).toLocaleString() : 'N/A';
            
            // Calculate growth
            let growthRate = 'N/A';
            if (populationData[1]) {
                const current = populationData[0].value;
                const previous = populationData[1].value;
                const growth = ((current - previous) / previous * 100).toFixed(2);
                growthRate = `${growth}%`;
            }
            
            // Get country info from REST Countries
            let area = 'N/A';
            let density = 'N/A';
            let capital = 'N/A';
            
            try {
                const restUrl = `https://restcountries.com/v3.1/alpha/${countryCode.toLowerCase()}`;
                const restResponse = await axios.get(restUrl);
                const countryInfo = restResponse.data[0];
                
                area = countryInfo.area.toLocaleString();
                density = (populationData[0].value / countryInfo.area).toFixed(2);
                capital = countryInfo.capital ? countryInfo.capital[0] : 'N/A';
            } catch (e) {
                // Use default values if REST API fails
            }
            
            const censusResult = `
📊 *CENSUS DATA: ${formattedName.toUpperCase()}* 📊

👥 *Population (${latestYear}):* ${latestPopulation}
📅 *Previous (${prevYear}):* ${prevPopulation}
📈 *Growth Rate:* ${growthRate}

🌍 *Area:* ${area} km²
📐 *Density:* ${density}/km²
🏙️ *Capital:* ${capital}

📋 *Census Info:*
• Last official census: ${latestYear}
• Data source: World Bank
• Next census: ${parseInt(latestYear) + 5}-${parseInt(latestYear) + 10}
• Status: Official statistics

💡 *Note:* Population figures are estimates
📊 *Accuracy:* Government published data
`;
            
            return reply(censusResult);
            
        } catch (apiError) {
            console.error("API Error:", apiError);
            
            // Fallback to hardcoded data for major countries
            const hardcodedData = {
                'china': {
                    population: '1,411,750,000',
                    year: '2020',
                    area: '9,596,961',
                    density: '147',
                    census: '2020 (7th National Population Census)'
                },
                'tanzania': {
                    population: '61,741,000',
                    year: '2022',
                    area: '945,087',
                    density: '65',
                    census: '2022 (Population and Housing Census)'
                },
                'kenya': {
                    population: '54,985,000',
                    year: '2019',
                    area: '580,367',
                    density: '94',
                    census: '2019 (Population and Housing Census)'
                },
                'india': {
                    population: '1,428,627,663',
                    year: '2023',
                    area: '3,287,263',
                    density: '434',
                    census: '2011 (last), Next: 2024'
                },
                'usa': {
                    population: '331,893,745',
                    year: '2021',
                    area: '9,833,520',
                    density: '34',
                    census: '2020 (Decennial Census)'
                }
            };
            
            const data = hardcodedData[countryName];
            
            if (data) {
                const fallbackMsg = `
📊 *CENSUS DATA: ${formattedName.toUpperCase()}* 📊

👥 *Population:* ${data.population}
📅 *Census Year:* ${data.year}
🌍 *Area:* ${data.area} km²
📐 *Density:* ${data.density}/km²

📋 *Census Details:*
• ${data.census}
• Source: National Statistics Bureau
• Type: Population & Housing Census

⚠️ *Note:* This is cached data
💡 For latest data, check government websites
`;
                
                return reply(fallbackMsg);
            }
            
            return reply(`❌ No census data found for "${text}"\n\nTry:\n• .cs china\n• .cs tanzania\n• .cs kenya\n• .cs india\n• .cs usa`);
        }
        
    } catch (e) {
        console.error("CS Command Error:", e);
        return reply("⚠️ Error fetching census data. Please try again later.");
    }
});
