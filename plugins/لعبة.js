import fs from 'fs';

let timeout = 60000; // وقت الانتظار بالمللي ثانية (60 ثانية)
let pointsPerQuestion = 500; // عدد النقاط لكل سؤال
let maxQuestions = 20; // عدد الأسئلة الكلي
let correctAnswers = 0; // عدد الإجابات الصحيحة
let currentQuestionIndex = 0; // مؤشر السؤال الحالي

let handler = async (m, { conn }) => {
    let id = m.chat;
    if (currentQuestionIndex >= maxQuestions) {
        conn.reply(m.chat, '*⌯ ⤹╵ ⌊لقد انتهت جميع الأسئلة، انتهت اللعبة⌉ ┆⎔*', conn.questionsGame[id][0]);
        resetGame();
        return;
    }

    conn.questionsGame = conn.questionsGame ? conn.questionsGame : {};
    if (id in conn.questionsGame) {
        conn.reply(m.chat, '*⌯ ⤹╵ ⌊انتظر حتى ينتهي السؤال الحالي⌉ ┆⎔*', conn.questionsGame[id][0]);
        throw false;
    }

    let questions = JSON.parse(fs.readFileSync('./src/game/acertijo.json', 'utf8'));
    shuffleArray(questions);
    let questionData = questions[currentQuestionIndex];
    let question = questionData.question;

    let caption = `
ⷮ *السؤال رقم ${currentQuestionIndex + 1}:*
${question}

*┇◈↞الـوقـت⌚↞ ${(timeout / 1000).toFixed(2)}┇*
*┇◈↞الـجـائـزة💵↞ ${pointsPerQuestion} نقاط┇*
*『🍷┇𝐒𝐔𝐍𝐆 𝐁𝐎𝐓*
`.trim();

    conn.questionsGame[id] = [
       await conn.reply(m.chat, caption, m),
       questionData,
       setTimeout(async () => {
           if (conn.questionsGame[id]) {
               await conn.reply(m.chat, `*⌯ ⤹╵ ⌊انتهى الوقت، الإجابة الصحيحة هي: "${questionData.answer}"⌉ ┆⎔*`, conn.questionsGame[id][0]);
               delete conn.questionsGame[id];
               resetGame();
           }
       }, timeout)
    ];
};

handler.help = ['لعبة'];
handler.tags = ['game'];
handler.command = /^(لعبة)$/i;
export default handler;

// مساعدة: خلط الأسئلة
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// إعادة تعيين المتغيرات لبدء لعبة جديدة
function resetGame() {
    correctAnswers = 0;
    currentQuestionIndex = 0;
}
