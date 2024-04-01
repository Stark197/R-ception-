import fs from 'fs';

let timeout = 60000; // وقت الانتظار بالمللي ثانية (60 ثانية)
let pointsPerQuestion = 500; // عدد النقاط لكل سؤال
let correctAnswerAudio = 'shanks.mp3'; // رابط الملف الصوتي للإجابة الصحيحة

let handler = async (m, { conn }) => {
    conn.questionsGame = conn.questionsGame || {};
    let id = m.chat;
    
    if (id in conn.questionsGame) {
        conn.reply(m.chat, '*⌯ ⤹╵ ⌊انتظر حتى ينتهي السؤال الحالي⌉ ┆⎔*', conn.questionsGame[id][0]);
        throw false;
    }

    let questions = JSON.parse(fs.readFileSync('./src/game/acertijo.json', 'utf8'));
    shuffleArray(questions);

    let questionIndex = conn.questionsGame[id] ? conn.questionsGame[id][1] + 1 : 0;

    if (questionIndex >= questions.length) {
        conn.reply(m.chat, '*⌯ ⤹╵ ⌊لقد انتهت جميع الأسئلة، انتهت اللعبة⌉ ┆⎔*', conn.questionsGame[id][0]);
        delete conn.questionsGame[id];
        return;
    }

    let questionData = questions[questionIndex];
    let question = questionData.question;
    let answer = questionData.answer;

    let caption = `
ⷮ *السؤال رقم ${questionIndex + 1}:*
${question}

*┇◈↞الـوقـت⌚↞ ${(timeout / 1000).toFixed(2)}┇*
*┇◈↞الـجـائـزة💵↞ ${pointsPerQuestion} نقاط┇*
*『🍷┇𝐒𝐔𝐍𝐆 𝐁𝐎𝐓*
`.trim();

    conn.questionsGame[id] = [
       await conn.reply(m.chat, caption, m),
       questionIndex,
       setTimeout(async () => {
           if (conn.questionsGame[id]) await conn.reply(m.chat, `*⌯ ⤹╵ ⌊انتهى الوقت، الإجابة الصحيحة هي: "${answer}"⌉ ┆⎔*`, conn.questionsGame[id][0]);
           delete conn.questionsGame[id];
       }, timeout)
    ];
    
    conn.on('message', async (message) => {
        if (message.text && message.text.toLowerCase() === answer.toLowerCase() && conn.questionsGame[id]) {
            await conn.sendFile(m.chat, correctAnswerAudio, '', '🎉 مبروك إجابتك الصحيحة! 🎉', m);
        }
    });
};

handler.help = ['لعبة'];
handler.tags = ['game'];
handler.command = /^(لعبة)$/i;
export default handler;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
