import { createCanvas, loadImage } from "canvas"

export default async function group(m, { conn }) {

  if (!m.isGroup) return

  const db = global.db || (global.db = {})
  db.groups ||= {}
  const g = db.groups[m.chat] ||= {}

  const users = m.participants || []

  for (let user of users) {

    const tag = user.split('@')[0]

    /* =========================
       دخول عضو
    ========================= */
    if (m.action === "add") {

      if (g.noWelcome) return

      try {

        const canvas = createCanvas(800, 450)
        const ctx = canvas.getContext("2d")

        // خلفية سوداء
        ctx.fillStyle = "#0f0f0f"
        ctx.fillRect(0, 0, 800, 450)

        // إطار ذهبي
        ctx.strokeStyle = "#d4af37"
        ctx.lineWidth = 5
        ctx.strokeRect(10, 10, 780, 430)

        // النص الأساسي
        ctx.fillStyle = "#ffffff"
        ctx.font = "28px Sans"

        ctx.fillText("Welcome To ARISE 🍷", 200, 80)

        ctx.font = "20px Sans"
        ctx.fillText(`User: @${tag}`, 250, 150)

        ctx.fillText("حللت أهلاً ووطئت سهلاً", 180, 220)
        ctx.fillText("نورت المكان بوجودك", 220, 260)

        const buffer = canvas.toBuffer()

        await conn.sendMessage(m.chat, {
          image: buffer,
          caption: `
❉『 𝑨.𝑹.𝑺 ⊰🍷⊱ 𝑨𝑹𝑰𝑺𝑬 』 ❉

*✧ ┈➤ انضم عضو جديد*

👤 @${tag}

*مرحبا بك في العائلة 🍷*
          `.trim(),
          mentions: [user]
        })

      } catch (e) {

        // fallback لو canvas ما اشتغل
        await conn.sendMessage(m.chat, {
          text: `👋 مرحباً @${tag} في ARISE 🍷`,
          mentions: [user]
        })

      }
    }

    /* =========================
       خروج عضو
    ========================= */
    if (m.action === "remove") {

      await conn.sendMessage(m.chat, {
        text: `
💔 *غادر العضو الجروب*

😒 أبو تقل دمك مكنتش بحبك

👤 @${tag}
        `.trim(),
        mentions: [user]
      })
    }

  }
}
