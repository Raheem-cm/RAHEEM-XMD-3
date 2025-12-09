 const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ind",
    desc: "Get independence information for African countries",
    react: "🇹🇿",
    category: "education",
    filename: __filename
},
async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) {
            const helpMsg = `
🇹🇿 *AFRICAN INDEPENDENCE INFORMATION* 🇹🇿

*Usage:* .ind [country name]
*Examples:*
• .ind tanzania
• .ind ghana
• .ind kenya
• .ind nigeria
• .ind south africa

*Info Provided:*
• Independence year
• Colonial power
• First/First president
• Liberation movement/party
• Key facts

*Available Countries:* Tanzania, Kenya, Uganda, Rwanda, Burundi, Ghana, Nigeria, South Africa, Zambia, Zimbabwe, etc.
`;
            return reply(helpMsg);
        }

        const countryName = text.trim().toLowerCase();
        
        await reply(`🔍 *Searching independence info for:* ${countryName}\n⏳ Please wait...`);

        // Comprehensive independence data for African countries
        const independenceData = {
            // EAST AFRICA
            'tanzania': {
                officialName: "United Republic of Tanzania",
                independence: {
                    year: "1961",
                    date: "December 9, 1961",
                    from: "United Kingdom",
                    as: "Tanganyika (mainland)"
                },
                union: {
                    year: "1964",
                    date: "April 26, 1964",
                    unionWith: "Zanzibar",
                    name: "United Republic of Tanzania"
                },
                leaders: {
                    firstPresident: "Julius K. Nyerere",
                    firstVicePresident: "Sheikh Abeid Karume (Zanzibar)",
                    liberationParty: "Tanganyika African National Union (TANU)",
                    currentParty: "Chama Cha Mapinduzi (CCM)"
                },
                keyFacts: [
                    "First President: Mwalimu Julius K. Nyerere",
                    "Liberation Party: TANU (Later CCM)",
                    "Philosophy: Ujamaa (African Socialism)",
                    "Joined Zanzibar in 1964",
                    "Capital moved to Dodoma in 1996"
                ]
            },
            
            'kenya': {
                officialName: "Republic of Kenya",
                independence: {
                    year: "1963",
                    date: "December 12, 1963",
                    from: "United Kingdom",
                    as: "Kenya"
                },
                leaders: {
                    firstPresident: "Jomo Kenyatta",
                    firstPrimeMinister: "Jomo Kenyatta (1963-1964)",
                    liberationMovement: "Mau Mau Uprising",
                    liberationParty: "Kenya African National Union (KANU)"
                },
                keyFacts: [
                    "Mau Mau rebellion (1952-1960) fought for independence",
                    "First President: Mzee Jomo Kenyatta",
                    "Kenya became a republic in 1964",
                    "Liberation hero: Dedan Kimathi",
                    "Capital: Nairobi"
                ]
            },
            
            'ghana': {
                officialName: "Republic of Ghana",
                independence: {
                    year: "1957",
                    date: "March 6, 1957",
                    from: "United Kingdom",
                    as: "Gold Coast → Ghana"
                },
                leaders: {
                    firstPresident: "Kwame Nkrumah",
                    firstPrimeMinister: "Kwame Nkrumah",
                    liberationParty: "Convention People's Party (CPP)",
                    title: "Osagyefo Dr. Kwame Nkrumah"
                },
                keyFacts: [
                    "First African country south of Sahara to gain independence",
                    "Led by Osagyefo Dr. Kwame Nkrumah",
                    "Originally called Gold Coast",
                    "Pan-Africanism pioneer",
                    "Capital: Accra"
                ]
            },
            
            'nigeria': {
                officialName: "Federal Republic of Nigeria",
                independence: {
                    year: "1960",
                    date: "October 1, 1960",
                    from: "United Kingdom",
                    as: "Nigeria"
                },
                leaders: {
                    firstPresident: "Nnamdi Azikiwe",
                    firstPrimeMinister: "Abubakar Tafawa Balewa",
                    liberationHeroes: "Nnamdi Azikiwe, Obafemi Awolowo, Ahmadu Bello",
                    majorParties: "NPC, NCNC, AG"
                },
                keyFacts: [
                    "Three major regions at independence: North, West, East",
                    "First President: Dr. Nnamdi Azikiwe",
                    "First Prime Minister: Sir Abubakar Tafawa Balewa",
                    "Became a republic in 1963",
                    "Civil war: 1967-1970 (Biafra)"
                ]
            },
            
            'south africa': {
                officialName: "Republic of South Africa",
                independence: {
                    year: "1910",
                    date: "May 31, 1910",
                    from: "United Kingdom",
                    as: "Union of South Africa"
                },
                democracy: {
                    year: "1994",
                    date: "April 27, 1994",
                    event: "First democratic elections",
                    endOf: "Apartheid regime"
                },
                leaders: {
                    firstBlackPresident: "Nelson Mandela",
                    lastApartheidPresident: "F.W. de Klerk",
                    liberationMovement: "African National Congress (ANC)",
                    liberationIcon: "Nelson Mandela"
                },
                keyFacts: [
                    "First democratic elections: 1994",
                    "First Black President: Nelson Mandela",
                    "Liberation movement: ANC (African National Congress)",
                    "Apartheid ended in 1994",
                    "Truth and Reconciliation Commission"
                ]
            },
            
            'zimbabwe': {
                officialName: "Republic of Zimbabwe",
                independence: {
                    year: "1980",
                    date: "April 18, 1980",
                    from: "United Kingdom",
                    as: "Zimbabwe (formerly Rhodesia)"
                },
                leaders: {
                    firstPrimeMinister: "Robert Mugabe",
                    firstPresident: "Canaan Banana (ceremonial)",
                    liberationMovement: "ZANU-PF",
                    liberationHeroes: "Robert Mugabe, Joshua Nkomo"
                },
                keyFacts: [
                    "Previously known as Rhodesia (1965-1979)",
                    "Liberation war: 1964-1979",
                    "First Prime Minister: Robert Mugabe",
                    "First President: Canaan Banana",
                    "Capital: Harare"
                ]
            },
            
            'zambia': {
                officialName: "Republic of Zambia",
                independence: {
                    year: "1964",
                    date: "October 24, 1964",
                    from: "United Kingdom",
                    as: "Zambia (formerly Northern Rhodesia)"
                },
                leaders: {
                    firstPresident: "Kenneth Kaunda",
                    liberationParty: "United National Independence Party (UNIP)",
                    title: "KK (Kenneth Kaunda)"
                },
                keyFacts: [
                    "First President: Kenneth Kaunda",
                    "Liberation Party: UNIP",
                    "Previously Northern Rhodesia",
                    "Copper-rich nation",
                    "Capital: Lusaka"
                ]
            },
            
            'uganda': {
                officialName: "Republic of Uganda",
                independence: {
                    year: "1962",
                    date: "October 9, 1962",
                    from: "United Kingdom",
                    as: "Uganda"
                },
                leaders: {
                    firstPrimeMinister: "Milton Obote",
                    firstPresident: "Edward Mutesa II (Kabaka)",
                    liberationParties: "Uganda People's Congress (UPC)"
                },
                keyFacts: [
                    "First Prime Minister: Milton Obote",
                    "First President: Edward Mutesa II (Buganda's Kabaka)",
                    "Kingdom of Buganda important in politics",
                    "Capital: Kampala",
                    "Idi Amin coup: 1971"
                ]
            },
            
            'rwanda': {
                officialName: "Republic of Rwanda",
                independence: {
                    year: "1962",
                    date: "July 1, 1962",
                    from: "Belgium",
                    as: "Rwanda"
                },
                leaders: {
                    firstPresident: "Grégoire Kayibanda",
                    liberationParty: "PARMEHUTU",
                    currentLeadership: "Paul Kagame (since 2000)"
                },
                keyFacts: [
                    "First President: Grégoire Kayibanda",
                    "Colonized by Germany then Belgium",
                    "1994 Genocide against Tutsi",
                    "Liberation: Rwandan Patriotic Front (1994)",
                    "Capital: Kigali"
                ]
            },
            
            'burundi': {
                officialName: "Republic of Burundi",
                independence: {
                    year: "1962",
                    date: "July 1, 1962",
                    from: "Belgium",
                    as: "Burundi"
                },
                leaders: {
                    firstPrimeMinister: "Joseph Cimpaye",
                    firstPresident: "Mwambutsa IV (King)",
                    liberationStruggle: "Post-independence conflicts"
                },
                keyFacts: [
                    "Kingdom of Burundi at independence",
                    "First President: Mwambutsa IV (King)",
                    "Colonized by Germany then Belgium",
                    "Ethnic conflicts: Hutu-Tutsi",
                    "Capital: Gitega (political), Bujumbura (economic)"
                ]
            },
            
            'mozambique': {
                officialName: "Republic of Mozambique",
                independence: {
                    year: "1975",
                    date: "June 25, 1975",
                    from: "Portugal",
                    as: "Mozambique"
                },
                leaders: {
                    firstPresident: "Samora Machel",
                    liberationMovement: "FRELIMO",
                    liberationWar: "1964-1974"
                },
                keyFacts: [
                    "Liberation war: 1964-1974",
                    "First President: Samora Machel",
                    "Liberation movement: FRELIMO",
                    "Portuguese colony",
                    "Capital: Maputo"
                ]
            },
            
            'angola': {
                officialName: "Republic of Angola",
                independence: {
                    year: "1975",
                    date: "November 11, 1975",
                    from: "Portugal",
                    as: "Angola"
                },
                leaders: {
                    firstPresident: "Agostinho Neto",
                    liberationMovements: "MPLA, UNITA, FNLA",
                    liberationWar: "1961-1974"
                },
                keyFacts: [
                    "Liberation war: 1961-1974",
                    "First President: Agostinho Neto",
                    "Main liberation movement: MPLA",
                    "Civil war: 1975-2002",
                    "Capital: Luanda"
                ]
            },
            
            'ethiopia': {
                officialName: "Federal Democratic Republic of Ethiopia",
                independence: {
                    year: "Never colonized",
                    date: "Traditional",
                    from: "Never colonized",
                    exception: "Italian occupation (1936-1941)"
                },
                leaders: {
                    emperor: "Haile Selassie I",
                    modernLeaders: "Meles Zenawi, Abiy Ahmed",
                    historical: "Ancient African kingdom"
                },
                keyFacts: [
                    "Never colonized (except Italian occupation 1936-1941)",
                    "Emperor: Haile Selassie I (pre-communist)",
                    "Battle of Adwa: 1896 (defeated Italy)",
                    "Oldest independent African country",
                    "Capital: Addis Ababa (AU headquarters)"
                ]
            },
            
            'liberia': {
                officialName: "Republic of Liberia",
                independence: {
                    year: "1847",
                    date: "July 26, 1847",
                    from: "American Colonization Society",
                    as: "Liberia"
                },
                leaders: {
                    firstPresident: "Joseph Jenkins Roberts",
                    unique: "Founded by freed American slaves",
                    historical: "Africa's first republic"
                },
                keyFacts: [
                    "Founded by freed American slaves",
                    "First President: Joseph Jenkins Roberts",
                    "Africa's first republic",
                    "Not colonized by Europeans",
                    "Capital: Monrovia (named after US President Monroe)"
                ]
            },
            
            'egypt': {
                officialName: "Arab Republic of Egypt",
                independence: {
                    year: "1922",
                    date: "February 28, 1922",
                    from: "United Kingdom",
                    as: "Kingdom of Egypt"
                },
                leaders: {
                    firstKing: "Fuad I",
                    modernLeader: "Gamal Abdel Nasser",
                    revolution: "1952 Egyptian Revolution"
                },
                keyFacts: [
                    "Nominal independence: 1922",
                    "Full independence after 1952 revolution",
                    "First President: Mohamed Naguib",
                    "Modernizer: Gamal Abdel Nasser",
                    "Ancient civilization"
                ]
            },
            
            'algeria': {
                officialName: "People's Democratic Republic of Algeria",
                independence: {
                    year: "1962",
                    date: "July 5, 1962",
                    from: "France",
                    as: "Algeria"
                },
                leaders: {
                    firstPresident: "Ahmed Ben Bella",
                    liberationWar: "1954-1962",
                    liberationMovement: "FLN"
                },
                keyFacts: [
                    "Bloody war of independence: 1954-1962",
                    "First President: Ahmed Ben Bella",
                    "Liberation movement: FLN",
                    "French colony",
                    "Capital: Algiers"
                ]
            },
            
            'senegal': {
                officialName: "Republic of Senegal",
                independence: {
                    year: "1960",
                    date: "April 4, 1960",
                    from: "France",
                    as: "Senegal (part of Mali Federation)"
                },
                leaders: {
                    firstPresident: "Léopold Sédar Senghor",
                    poetPresident: "Léopold Sédar Senghor",
                    politicalParty: "Socialist Party of Senegal"
                },
                keyFacts: [
                    "First President: Léopold Sédar Senghor (poet)",
                    "Part of Mali Federation (briefly)",
                    "French colony",
                    "Peaceful transition to independence",
                    "Capital: Dakar"
                ]
            },
            
            'congo drc': {
                officialName: "Democratic Republic of the Congo",
                independence: {
                    year: "1960",
                    date: "June 30, 1960",
                    from: "Belgium",
                    as: "Congo-Léopoldville"
                },
                leaders: {
                    firstPrimeMinister: "Patrice Lumumba",
                    firstPresident: "Joseph Kasa-Vubu",
                    liberationHero: "Patrice Lumumba"
                },
                keyFacts: [
                    "First Prime Minister: Patrice Lumumba",
                    "First President: Joseph Kasa-Vubu",
                    "Belgian colony brutally exploited",
                    "Lumumba assassinated in 1961",
                    "Capital: Kinshasa"
                ]
            },
            
            'cote divoire': {
                officialName: "Republic of Côte d'Ivoire",
                independence: {
                    year: "1960",
                    date: "August 7, 1960",
                    from: "France",
                    as: "Côte d'Ivoire"
                },
                leaders: {
                    firstPresident: "Félix Houphouët-Boigny",
                    foundingFather: "Félix Houphouët-Boigny",
                    politicalParty: "PDCI-RDA"
                },
                keyFacts: [
                    "First President: Félix Houphouët-Boigny",
                    "Peaceful transition to independence",
                    "French colony",
                    "Longest-serving African leader (1960-1993)",
                    "Capital: Yamoussoukro (political), Abidjan (economic)"
                ]
            }
        };

        // Find country data
        const countryKey = Object.keys(independenceData).find(key => 
            countryName.includes(key) || key.includes(countryName)
        );

        if (!countryKey) {
            return reply(`❌ No independence data found for "${text}"\n\nTry:\n• .ind tanzania\n• .ind ghana\n• .ind kenya\n• .ind nigeria\n• .ind south africa`);
        }

        const data = independenceData[countryKey];
        const countryDisplayName = countryKey.charAt(0).toUpperCase() + countryKey.slice(1);
        
        // Generate independence message
        let independenceMsg = `🇹🇿 *INDEPENDENCE INFORMATION: ${data.officialName.toUpperCase()}* 🇹🇿\n\n`;
        
        independenceMsg += `📅 *INDEPENDENCE DETAILS:*\n`;
        independenceMsg += `• *Year:* ${data.independence.year}\n`;
        independenceMsg += `• *Date:* ${data.independence.date}\n`;
        independenceMsg += `• *From:* ${data.independence.from}\n`;
        independenceMsg += `• *As:* ${data.independence.as}\n\n`;
        
        // Add union info if exists (for Tanzania)
        if (data.union) {
            independenceMsg += `🤝 *UNION INFORMATION:*\n`;
            independenceMsg += `• *Year:* ${data.union.year}\n`;
            independenceMsg += `• *Date:* ${data.union.date}\n`;
            independenceMsg += `• *Union with:* ${data.union.unionWith}\n`;
            independenceMsg += `• *New name:* ${data.union.name}\n\n`;
        }
        
        // Add democracy info for South Africa
        if (data.democracy) {
            independenceMsg += `✊ *DEMOCRACY/APARTHEID END:*\n`;
            independenceMsg += `• *Year:* ${data.democracy.year}\n`;
            independenceMsg += `• *Date:* ${data.democracy.date}\n`;
            independenceMsg += `• *Event:* ${data.democracy.event}\n`;
            independenceMsg += `• *End of:* ${data.democracy.endOf}\n\n`;
        }
        
        independenceMsg += `👑 *FOUNDING LEADERS:*\n`;
        
        // List all leaders
        Object.entries(data.leaders).forEach(([role, name]) => {
            const roleName = role.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            independenceMsg += `• *${roleName}:* ${name}\n`;
        });
        
        independenceMsg += `\n📜 *LIBERATION MOVEMENT/PARTY:*\n`;
        
        // Extract liberation party/movement
        const liberationKeys = ['liberationParty', 'liberationMovement', 'politicalParty', 'liberationHeroes'];
        liberationKeys.forEach(key => {
            if (data.leaders[key]) {
                independenceMsg += `• ${data.leaders[key]}\n`;
            }
        });
        
        if (data.leaders.title) {
            independenceMsg += `• Title: ${data.leaders.title}\n`;
        }
        
        independenceMsg += `\n💡 *KEY FACTS:*\n`;
        data.keyFacts.forEach(fact => {
            independenceMsg += `• ${fact}\n`;
        });
        
        // Add historical context
        independenceMsg += `\n📚 *HISTORICAL CONTEXT:*\n`;
        
        if (countryKey === 'ghana') {
            independenceMsg += `Ghana led Africa's independence wave, inspiring other nations.\n`;
        } else if (countryKey === 'tanzania') {
            independenceMsg += `Tanzania's peaceful transition and union with Zanzibar is unique in Africa.\n`;
        } else if (countryKey === 'south africa') {
            independenceMsg += `South Africa's struggle against apartheid was a global human rights movement.\n`;
        } else if (countryKey === 'ethiopia') {
            independenceMsg += `Ethiopia maintained independence throughout the colonial era (except brief Italian occupation).\n`;
        } else if (countryKey === 'algeria') {
            independenceMsg += `Algeria's war of independence was one of Africa's bloodiest liberation struggles.\n`;
        } else {
            independenceMsg += `Part of Africa's independence wave in the 1950s-1970s.\n`;
        }
        
        independenceMsg += `\n🎖️ *AFRICAN LIBERATION LEGACY*\n`;
        independenceMsg += `"Independence is not the end, it's the beginning of responsibility."`;

        return reply(independenceMsg);

    } catch (e) {
        console.error("Independence Command Error:", e);
        return reply("⚠️ Error fetching independence information. Please try again later.");
    }
});
