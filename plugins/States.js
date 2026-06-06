export default async function before(m, { conn }) {

  const text = (m.body || m.text || "").trim()

  const DEV = "4915510468131@s.whatsapp.net"
  const isDev = m.sender === DEV

  /* =========================
     INIT DATABASE
  ========================= */

  global.db ||= {}
  global.db.stats ||= {}
  global.db.stats.daily ||= {}

  global.db.group ||= {}
  global.db.group[m.chat] ||= {}
  global.db.group[m.chat].nicknames ||= {}

  /* =========================
     COUNT MESSAGES
  ========================= */

  const user = m.sender
  global.db.stats.daily[user] ||= 0
  global.db.stats.daily[user]++

  /* =========================
     🔒 لقـب (DEV ONLY)
  ========================= */

  if (text.startsWith(".لقب")) {

    if (!isDev)
      return m.reply("❌ هذا الأمر خاص بالمطور لوسيفر فقط")

    const mentioned = m.mentionedJid?.[0]
    if (!mentioned) return m.reply("🎯 قم بمنشن الشخص: .لقب @user لقب")

    const parts = text.split(" ")
    parts.shift()
    const nickname = parts.join(" ").trim()

    if (!nickname) return m.reply("✏️ اكتب اللقب بعد المنشن")

    global.db.group[m.chat].nicknames[mentioned] = nickname

    await conn.sendMessage(m.chat, {
      text: `✅ تم تسجيل اللقب: *${nickname}*\n👤 لـ @${mentioned.split('@')[0]}`,
      mentions: [mentioned]
    })

    return
  }

  /* =========================
     🔒 الإحصائيات (DEV ONLY)
  ========================= */

  if (text === ".اليوم" || text === ".احصائيات") {

    if (!isDev)
      return m.reply("❌ هذا الأمر خاص بالمطور لوسيفر فقط")

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
        global.db.group?.[m.chat]?.nicknames?.[jid] || "بدون لقب"

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
     🔒 تصفير (DEV ONLY)
  ========================= */

  if (text === ".تصفير") {

    if (!isDev)
      return m.reply("❌ هذا الأمر خاص بالمطور لوسيفر فقط")

    global.db.stats.daily = {}

    await m.reply("🧹 تم تصفير الإحصائيات بنجاح")
    return
  }
}
