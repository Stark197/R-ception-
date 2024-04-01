import fs from 'fs';

let timeout = 60000; // وقت الانتظار بالمللي ثانية (60 ثانية)
let pointsPerQuestion = 500; // عدد النقاط لكل سؤال

// الأمر الرئيسي لبدء اللعبة
let handler = async (m, { conn }) => {
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

    let caption = `
ⷮ *السؤال رقم ${questionIndex + 1}:*
${question}

*┇◈↞الـوقـت⌚↞ ${(timeout / 1000).toFixed(2)}┇*
*┇◈↞الـجـائـزة💵↞ ${pointsPerQuestion} نقاط┇*
*『🍷┇𝐒𝐔𝐍𝐆 𝐁𝐎𝐓*
`.trim();

    conn.questionsGame[m.chat] = [
       await conn.reply(m.chat, caption, m),
       questionIndex,
       setTimeout(async () => {
           if (conn.questionsGame[m.chat]) await conn.reply(m.chat, `*⌯ ⤹╵ ⌊انتهى الوقت، الإجابة الصحيحة هي: "${questionData.answer}"⌉ ┆⎔*`, conn.questionsGame[m.chat][0]);
           delete conn.questionsGame[m.chat];
       }, timeout)
    ];
};

handler.help = ['لعبة'];
handler.tags = ['game'];
handler.command = /^(كانيكي)$/i;
export default handler;

// مساعدة: خلط الأسئلة
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
