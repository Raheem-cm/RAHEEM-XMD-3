 const { cmd } = require('../command');

// Game data storage
const gameSessions = {};

cmd({
    pattern: "game",
    desc: "Play all games in one command",
    react: "🎮",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, text, prefix }) => {
    try {
        const args = text ? text.trim().split(' ') : [];
        const userId = sender;
        const now = Date.now();
        
        // Clean old game sessions (older than 5 minutes)
        if (gameSessions[userId] && (now - gameSessions[userId].timestamp > 300000)) {
            delete gameSessions[userId];
        }
        
        // Show main menu if no arguments
        if (args.length === 0) {
            const menu = `
🎮 *ALL-IN-ONE GAME HUB* 🎮

*Select a game:*
1. *${prefix}game guess* - Number guessing (1-100)
2. *${prefix}game math* - Math quiz challenge
3. *${prefix}game dice* - Roll dice game
4. *${prefix}game slot* - Slot machine
5. *${prefix}game coin* - Coin flip
6. *${prefix}game trivia* - Trivia question
7. *${prefix}game rps* - Rock Paper Scissors
8. *${prefix}game word* - Word scramble

*Quick play:*
${prefix}game quick - Random mini-game

*Example:* ${prefix}game guess
*Example:* ${prefix}game math
`;
            return reply(menu);
        }
        
        const gameType = args[0].toLowerCase();
        
        // 🎯 NUMBER GUESSING GAME
        if (gameType === 'guess') {
            if (!gameSessions[userId] || gameSessions[userId].type !== 'guess') {
                const secretNumber = Math.floor(Math.random() * 100) + 1;
                gameSessions[userId] = {
                    type: 'guess',
                    number: secretNumber,
                    attempts: 0,
                    maxAttempts: 7,
                    timestamp: now
                };
                return reply(`🎯 *NUMBER GUESSING*\n\nI'm thinking of a number between 1-100.\nYou have 7 attempts!\n\nReply with: ${prefix}game guess [number]\nExample: ${prefix}game guess 50`);
            }
            
            const game = gameSessions[userId];
            if (!args[1] || isNaN(args[1])) {
                return reply(`🔢 Enter a number!\nUsage: ${prefix}game guess [number]`);
            }
            
            const guess = parseInt(args[1]);
            game.attempts++;
            
            if (guess === game.number) {
                delete gameSessions[userId];
                return reply(`🎉 *CORRECT!*\nNumber: ${game.number}\nAttempts: ${game.attempts}/7\n🏆 You won!`);
            }
            
            if (game.attempts >= game.maxAttempts) {
                const correctNum = game.number;
                delete gameSessions[userId];
                return reply(`💥 *GAME OVER*\nThe number was ${correctNum}\nYou used all 7 attempts.`);
            }
            
            const remaining = game.maxAttempts - game.attempts;
            const hint = guess < game.number ? "📈 Go higher!" : "📉 Go lower!";
            return reply(`❌ ${hint}\nAttempts: ${game.attempts}/7\nRemaining: ${remaining}`);
        }
        
        // 🧮 MATH QUIZ
        if (gameType === 'math') {
            if (!gameSessions[userId] || gameSessions[userId].type !== 'math') {
                const num1 = Math.floor(Math.random() * 50) + 1;
                const num2 = Math.floor(Math.random() * 20) + 1;
                const operators = ['+', '-', '*'];
                const op = operators[Math.floor(Math.random() * 3)];
                
                let answer;
                switch(op) {
                    case '+': answer = num1 + num2; break;
                    case '-': answer = num1 - num2; break;
                    case '*': answer = num1 * num2; break;
                }
                
                gameSessions[userId] = {
                    type: 'math',
                    problem: `${num1} ${op} ${num2}`,
                    answer: answer,
                    timestamp: now
                };
                
                return reply(`🧮 *MATH QUIZ*\n\nSolve: *${num1} ${op} ${num2}*\n\nReply: ${prefix}game math [answer]\nExample: ${prefix}game math 42`);
            }
            
            const game = gameSessions[userId];
            if (!args[1] || isNaN(args[1])) {
                return reply(`Enter your answer!\nUsage: ${prefix}game math [answer]`);
            }
            
            const userAnswer = parseInt(args[1]);
            const correct = game.answer;
            
            delete gameSessions[userId];
            
            if (userAnswer === correct) {
                return reply(`✅ *CORRECT!*\n${game.problem} = ${correct}\n🎯 Perfect calculation!`);
            } else {
                return reply(`❌ *WRONG!*\n${game.problem} = ${correct}\nYour answer: ${userAnswer}`);
            }
        }
        
        // 🎲 DICE GAME
        if (gameType === 'dice') {
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;
            const total = dice1 + dice2;
            
            const diceEmoji = ['⚀','⚁','⚂','⚃','⚄','⚅'];
            
            const result = `
🎲 *DICE ROLL* 🎲

${diceEmoji[dice1-1]} + ${diceEmoji[dice2-1]}

*Dice 1:* ${dice1}
*Dice 2:* ${dice2}
*Total:* ${total}

${dice1 === dice2 ? '🎊 *DOUBLES!* 🎊' : ''}
${total === 7 ? '🎯 *LUCKY 7!* 🎯' : ''}
${total >= 10 ? '🔥 *HIGH ROLL!* 🔥' : ''}
`;
            return reply(result);
        }
        
        // 🎰 SLOT MACHINE
        if (gameType === 'slot') {
            const symbols = ['🍒','🍋','🍊','🍉','⭐','🔔','7️⃣','💎'];
            const reel1 = symbols[Math.floor(Math.random() * symbols.length)];
            const reel2 = symbols[Math.floor(Math.random() * symbols.length)];
            const reel3 = symbols[Math.floor(Math.random() * symbols.length)];
            
            const allSame = reel1 === reel2 && reel2 === reel3;
            const twoSame = (reel1 === reel2) || (reel2 === reel3) || (reel1 === reel3);
            
            let result = '';
            if (allSame) {
                result = '🎊 *JACKPOT!* 🎊\n💰 Prize: 1000 points';
            } else if (twoSame) {
                result = '🎉 *DOUBLE!* 🎉\n💰 Prize: 100 points';
            } else {
                result = '😢 *No win*\n💸 Try again!';
            }
            
            const slotResult = `
🎰 *SLOT MACHINE* 🎰

[ ${reel1} | ${reel2} | ${reel3} ]

${result}

💎 *Special:* Three 7️⃣ = MEGA JACKPOT!
`;
            return reply(slotResult);
        }
        
        // 🪙 COIN FLIP
        if (gameType === 'coin') {
            const outcomes = ['HEADS', 'TAILS'];
            const result = outcomes[Math.floor(Math.random() * 2)];
            const emoji = result === 'HEADS' ? '👑' : '🦅';
            
            return reply(`${emoji} *COIN FLIP*\n\n🪙 The coin landed on...\n\n**${result}**\n\n${emoji} ${emoji} ${emoji}`);
        }
        
        // 🤔 ROCK PAPER SCISSORS
        if (gameType === 'rps') {
            if (!args[1]) {
                return reply(`✊ *ROCK PAPER SCISSORS*\n\nUsage: ${prefix}game rps [choice]\nChoices: rock, paper, scissors\nExample: ${prefix}game rps rock`);
            }
            
            const choices = ['rock', 'paper', 'scissors'];
            const userChoice = args[1].toLowerCase();
            
            if (!choices.includes(userChoice)) {
                return reply(`Invalid choice! Use: rock, paper, or scissors`);
            }
            
            const botChoice = choices[Math.floor(Math.random() * 3)];
            
            const emojis = {
                rock: '🪨',
                paper: '📄',
                scissors: '✂️'
            };
            
            let outcome = '';
            if (userChoice === botChoice) {
                outcome = '🤝 *DRAW!*';
            } else if (
                (userChoice === 'rock' && botChoice === 'scissors') ||
                (userChoice === 'paper' && botChoice === 'rock') ||
                (userChoice === 'scissors' && botChoice === 'paper')
            ) {
                outcome = '🎉 *YOU WIN!*';
            } else {
                outcome = '😢 *YOU LOSE!*';
            }
            
            const rpsResult = `
✊ *ROCK PAPER SCISSORS* ✊

You: ${emojis[userChoice]} ${userChoice}
Bot: ${emojis[botChoice]} ${botChoice}

${outcome}

${userChoice === 'rock' && botChoice === 'scissors' ? '🪨 crushes ✂️' : ''}
${userChoice === 'paper' && botChoice === 'rock' ? '📄 covers 🪨' : ''}
${userChoice === 'scissors' && botChoice === 'paper' ? '✂️ cuts 📄' : ''}
`;
            return reply(rpsResult);
        }
        
        // 🔤 WORD SCRAMBLE
        if (gameType === 'word') {
            const words = [
                {word: 'PYTHON', hint: 'Programming language'},
                {word: 'JAVASCRIPT', hint: 'Web language'},
                {word: 'FOOTBALL', hint: 'Popular sport'},
                {word: 'TANZANIA', hint: 'Country in Africa'},
                {word: 'COMPUTER', hint: 'Electronic device'},
                {word: 'WHATSAPP', hint: 'Messaging app'},
                {word: 'INSTAGRAM', hint: 'Social media'},
                {word: 'ELEPHANT', hint: 'Large animal'}
            ];
            
            const randomWord = words[Math.floor(Math.random() * words.length)];
            const scrambled = randomWord.word.split('').sort(() => Math.random() - 0.5).join('');
            
            gameSessions[userId] = {
                type: 'word',
                original: randomWord.word,
                scrambled: scrambled,
                hint: randomWord.hint,
                timestamp: now
            };
            
            return reply(`🔤 *WORD SCRAMBLE*\n\nUnscramble this word:\n\n**${scrambled}**\n\n💡 Hint: ${randomWord.hint}\n\nReply: ${prefix}game word [answer]\nExample: ${prefix}game word python`);
        }
        
        // 📝 TRIVIA
        if (gameType === 'trivia') {
            const questions = [
                {
                    question: 'What is the capital of Tanzania?',
                    options: ['A: Dar es Salaam', 'B: Dodoma', 'C: Arusha', 'D: Mwanza'],
                    answer: 'B'
                },
                {
                    question: 'Which planet is known as the Red Planet?',
                    options: ['A: Venus', 'B: Mars', 'C: Jupiter', 'D: Saturn'],
                    answer: 'B'
                },
                {
                    question: 'What is 5 + 7?',
                    options: ['A: 10', 'B: 11', 'C: 12', 'D: 13'],
                    answer: 'C'
                },
                {
                    question: 'Which is the largest ocean?',
                    options: ['A: Atlantic', 'B: Indian', 'C: Arctic', 'D: Pacific'],
                    answer: 'D'
                }
            ];
            
            const randomQ = questions[Math.floor(Math.random() * questions.length)];
            gameSessions[userId] = {
                type: 'trivia',
                question: randomQ,
                timestamp: now
            };
            
            const triviaMsg = `
❓ *TRIVIA QUESTION* ❓

${randomQ.question}

${randomQ.options.join('\n')}

Reply: ${prefix}game trivia [letter]
Example: ${prefix}game trivia A
`;
            return reply(triviaMsg);
        }
        
        // 🎯 QUICK RANDOM GAME
        if (gameType === 'quick') {
            const quickGames = ['dice', 'coin', 'slot'];
            const randomGame = quickGames[Math.floor(Math.random() * quickGames.length)];
            
            return reply(`🎯 *QUICK GAME*\n\nPlaying random ${randomGame.toUpperCase()} game...\n\n${prefix}game ${randomGame}`);
        }
        
        // If game type not recognized
        return reply(`❌ Unknown game type!\n\nUse: ${prefix}game\nTo see all available games.`);

    } catch (e) {
        console.error("Game command error:", e);
        return reply("⚠️ Game error occurred. Please try again.");
    }
});
