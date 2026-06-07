export default async function before(m, { conn }) {

  const text = (m.body || m.text || "").trim()

  /* =========================
     INIT DATABASE
  ========================= */

  global.db ||= {}
  global.db.stats ||= {}
  global.db.stats.daily ||= {}

  global.db.nicknames ||= {}

  /* =========================
     CHECK ADMIN
  ========================= */

  let isAdmin = false

  try {
    const meta = await conn.groupMetadata(m.chat)
    isAdmin = meta.participants.some(p =>
      p.id === m.sender &&
      (p.admin === "admin" || p.admin === "superadmin")
    )
  } catch {}

  /* =========================
     COUNT MESSAGES
  ========================= */

  const user = m.sender
  global.db.stats.daily[user] ||= 0
  global.db.stats.daily[user]++

  /* =========================
     🔒 SET NICKNAME (ADMIN ONLY)
  ========================= */

  if (text.startsWith(".لقب")) {

    if (!isAdmin)
      return m.reply("❌ هذا الأمر خاص بالأدمن فقط")

    const mentioned = m.mentionedJid?.[0]
    if (!mentioned)
      return m.reply("🎯 قم بمنشن الشخص: .لقب @user لقب")

    const parts = text.split(" ")
    parts.shift()
    const nickname = parts.join(" ").trim()

    if (!nickname)
      return m.reply("✏️ اكتب اللقب بعد المنشن")

    global.db.nicknames[mentioned] = nickname

    return conn.sendMessage(m.chat, {
      text: `✅ تم تسجيل اللقب: *${nickname}*\n👤 لـ @${mentioned.split('@')[0]}`,
      mentions: [mentioned]
    })
  }

  /* =========================
     🔒 STATS (ADMIN ONLY)
  ========================= */

  if (text === ".اليوم" || text === ".احصائيات") {

    if (!isAdmin)
      return m.reply("❌ هذا الأمر خاص بالأدمن فقط")

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

      const nickname =
        global.db.nicknames[jid] || "بدون لقب"

      msg += `👤 @${jid.split('@')[0]} ➜ 🏷️ ${nickname} ➜ 💬 ${count} رسالة\n`

      mentions.push(jid)
    }

    await conn.sendMessage(m.chat, {
      text: msg,
      mentions
    }, { quoted: m })

    return
  }

  /* =========================
     🔒 RESET (ADMIN ONLY)
  ========================= */

  if (text === ".تصفير") {

    if (!isAdmin)
      return m.reply("❌ هذا الأمر خاص بالأدمن فقط")

    global.db.stats.daily = {}

    return m.reply("🧹 تم تصفير الإحصائيات بنجاح")
  }

}
