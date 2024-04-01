import fs from 'fs'

let timeout = 60000 // وقت الانتظار بالمللي ثانية (60 ثانية)
let pointsPerQuestion = 500 // عدد النقاط لكل سؤال
let correctAnswerAudio = 'https://a.tumblr.com/tumblr_mnh7obF8711rni2aqo1.mp3' // رابط الملف الصوتي للإجابة الصحيحة

let handler = async (m, { conn, usedPrefix }) => {
    conn.questionsGame = conn.questionsGame ? conn.questionsGame : {}
    let id = m.chat
    if (id in conn.questionsGame) {
        conn.reply(m.chat, '*⌯ ⤹╵ ⌊انتظر حتى ينتهي السؤال الحالي⌉ ┆⎔*', conn.questionsGame[id][0])
        throw false
    }

    let questions = JSON.parse(fs.readFileSync(`./src/game/questions.json`)) // قم بتحميل ملف الأسئلة الخاص بك
    shuffleArray(questions) // قم بخلط الأسئلة بشكل عشوائي

    let questionIndex = conn.questionsGame[id] ? conn.questionsGame[id][1] + 1 : 0 // تحديد مؤشر السؤال القادم

    // التحقق مما إذا كان اللاعب قد أجاب على جميع الأسئلة
    if (questionIndex >= questions.length) {
        conn.reply(m.chat, '*⌯ ⤹╵ ⌊لقد انتهت جميع الأسئلة، انتهت اللعبة⌉ ┆⎔*', conn.questionsGame[id][0])
        delete conn.questionsGame[id]
        return
    }

    let question = questions[questionIndex].question
    let answer = questions[questionIndex].answer

    let caption = `
ⷮ *السؤال رقم ${questionIndex + 1}:*
${question}

*┇◈↞الـوقـت⌚↞ ${(timeout / 1000).toFixed(2)}┇*
*┇◈↞الـجـائـزة💵↞ ${pointsPerQuestion} نقاط┇*
*『🍷┇𝐒𝐔𝐍𝐆 𝐁𝐎𝐓*
`.trim()

    conn.questionsGame[id] = [
       await conn.reply(m.chat, caption, m),
       questionIndex,
       setTimeout(async () => {
           if (conn.questionsGame[id]) await conn.reply(m.chat, `*⌯ ⤹╵ ⌊انتهى الوقت، الإجابة الصحيحة هي: "${answer}"⌉ ┆⎔*`, conn.questionsGame[id][0])
           delete conn.questionsGame[id]
       }, timeout)
    ]
    
    // الإرسال الملف الصوتي بعد كل إجابة صحيحة
    conn.on('message', async (m) => {
        if (m.text && m.text.toLowerCase() === answer.toLowerCase() && conn.questionsGame[id]) {
            await conn.sendFile(m.chat, correctAnswerAudio, '', '🎉 مبروك إجابتك الصحيحة! 🎉', m)
        }
    })
}

handler.help = ['لعبة']
handler.tags = ['game']
handler.command = /^(لعبة)$/i
export default handler

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
