let timeout = 40000
let poin = 5000
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tokitoki = conn.tokitoki ? conn.tokitoki : {}
    let id = m.chat
    if (id in conn.tokitoki) {
        conn.reply(m.chat, '❐┃لم يتم الاجابة علي السؤال بعد┃❌ ❯', conn.tokitoki[id][0])
        throw false
    }
    let src = await (await fetch('https://gist.githubusercontent.com/Stark197/e6eb5b13b875f2178cc6b6a5c18ee9ac/raw/7e4d026b19799908d3aaf1d728b1d23634999d48/gistfile1.txt')).json()
  let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*❰❖── ~『𝐿𝑈𝐹𝐹𝑌-𝐵𝛩𝑇』~──❖❱*\n *•┇❖↞استخدم انسحب للانسحاب┇👁️❯*
 *•┃❖↞الـوقـت⏳↞* *${(timeout / 1000).toFixed(2)}* *ثانية┇❯*
  
 *•┃❖↞الـجـائـزة💰↞* *${poin}* *نقطه┇❯*
   *❰❖── ~『𝐿𝑈𝐹𝐹𝑌-𝐵𝛩𝑇』~──❖❱*
     `.trim()
    conn.tokitoki[id] = [
        await conn.sendFile(m.chat, json.img, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tokitoki[id]) conn.reply(m.chat, `*❮ ⌛┇انتــهــى الــوقــت┇⌛❯*\n*❖↞┇الاجـابـة✅↞*  *${json.name}* *┇❯*`, conn.tokitoki[id][0])
            delete conn.tokitoki[id]
        }, timeout)
    ]
}
handler.help = ['guessflag']
handler.tags = ['game']
handler.command = /^عين/i

export default handler
