import { createCanvas } from "canvas"

export default async function groupUpdate(update, { conn }) {

  const { id, participants, action } = update

  if (!id || !participants) return

  const db = global.db || (global.db = {})
  db.groups ||= {}
  const g = db.groups[id] ||= {}

  for (let user of participants) {

    const tag = user.split('@')[0]

    /* =========================
       دخول عضو
    ========================= */
    if (action === "add") {

      if (g.noWelcome) return

      await conn.sendMessage(id, {
        text: `
❉『 𝑨.𝑹.𝑺 ⊰🍷⊱ 𝑨𝑹𝑰𝑺𝑬 』 ❉

*❀╎اســتـمـارة الـتـرحـيـب ╎❀*

*━╍∘✦∘╍━⌟🍷⌜━╍∘✦∘╍━*

*✧ ┈➤ حللت أهلاً ووطئت سهلاً، نوّرت المكان بوجودك*

*✧ ┈➤ انضمامك لـ ┆𝑨𝑹𝑰𝑺𝑬 شرف لنا ومكسب كبير*

*✧ ┈➤ معك تكبر العائلة وتقوى، وبك تزيد الهيبة*

*✧ ┈➤ عساك تذوق معنا طعم الإنجاز وتكتب اسمك بين المميزين*

*❁ ┆ ┈➤ الـمـسـؤول ✧ ⤶ 『زيرام 』*

*📌 يُرجى زيارة رابط الإعلانات الرسمي للاطلاع على جديد في الوصف 』*

*━╍∘✦∘╍━🍷⌜━╍∘✦∘╍━*

*♤┆تـوقـيـ؏ اداࢪة مــمـلـكة 🇵🇸『 𝑨.𝑹.𝑺 ⊰🍷⊱ 𝑨𝑹𝑰𝑺𝑬 』╎*

👤 @${tag}
        `.trim(),
        mentions: [user]
      })
    }

    /* =========================
       خروج عضو
    ========================= */
    if (action === "remove") {

      await conn.sendMessage(id, {
        text: `
💔 *غادر العضو الجروب*

😒 ابو تقل دمك مكنتش بحبك اصلا

👤 @${tag}
        `.trim(),
        mentions: [user]
      })
    }
  }
}
