export default async function before(m, { conn }) {

  const text = (m.body || m.text || "").trim()

  /* =========================
     INIT DATABASE
  ========================= */

  global.db ||= {}
  global.db.stats ||= {}
  global.db.stats.daily ||= {}
  global.db.users ||= {}

  /* =========================
     COUNT MESSAGES
  ========================= */

  const user = m.sender
  global.db.stats.daily[user] ||= 0
  global.db.stats.daily[user]++

  /* =========================
     RESET COMMAND
  ========================= */

  if (text === ".تصفير") {

    global.db.stats.daily = {}

    await m.reply("🧹 تم تصفير إحصائيات اليوم بنجاح")
    return
  }

  /* =========================
     SHOW STATS
  ========================= */

  if (text === ".اليوم" || text === ".احصائيات") {

    const data = global.db.stats.daily

    let list = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    if (list.length === 0) {
      return m.reply("📊 لا توجد إحصائيات بعد")
    }

    let msg = "📊 إحصائيات اليوم:\n\n"
    let mentions = []

    for (let [jid, count] of list) {

      const nickname = global.db.users?.[jid]?.nickname || "بدون لقب"

      msg += `👤 @${jid.split('@')[0]} ➜ 🏷️ ${nickname} ➜ ${count} رسالة\n`

      mentions.push(jid)
    }

    await conn.sendMessage(m.chat, {
      text: msg,
      mentions
    }, { quoted: m })

    return
  }
}
