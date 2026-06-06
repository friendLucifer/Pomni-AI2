export default async function before(m, { conn }) {

  if (!m.isGroup) return false

  global.spam ||= {}

  const db = global.db || (global.db = {})
  db.groups ||= {}
  const g = db.groups[m.chat] ||= {}

  /* =========================
     إعدادات الكلمات الممنوعة
  ========================= */

  const badWords = [
    "كسمك",
    "كسم",
    "عرض",
    "عرص",
    "حول",
    "متناك",
    "شرموط"
  ]

  /* =========================
     جلب النص
  ========================= */

  const text =
    m.text ||
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    ""

  const cleanText = (text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "")

  /* =========================
     جلب الأدمن
  ========================= */

  let admins = []
  try {
    admins = (await conn.groupMetadata(m.chat))
      .participants
      .filter(p => p.admin)
      .map(p => p.id)
  } catch {}

  /* =========================
     دالة تنبيه مشرفين
  ========================= */

  const notifyAdmins = async (reason) => {

    const taggedAdmins = admins.slice(0, 5)

    await conn.sendMessage(m.chat, {
      text:
`🚨 *تنبيه مخالفة*

👤 @${m.sender.split('@')[0]}
⚠️ السبب: ${reason}

📢 تم تنبيه المشرفين:
${taggedAdmins.map(a => '@' + a.split('@')[0]).join(' ')}`,

      mentions: [m.sender, ...taggedAdmins]
    })
  }

  /* =========================
     Anti-Link
  ========================= */

  const linkRegex = /(https?:\/\/|chat\.whatsapp\.com|wa\.me|t\.me)/gi

  if (g.antiLink && linkRegex.test(text)) {

    await conn.sendMessage(m.chat, {
      text: "🚨 تم رصد رابط مخالف",
      quoted: m
    })

    try {
      await conn.sendMessage(m.chat, { delete: m.key })
    } catch {}

    await notifyAdmins("نشر رابط")

    return true
  }

  /* =========================
     Anti-Swear
  ========================= */

  const isBad = badWords.some(w => cleanText.includes(w))

  if (isBad) {

    await conn.sendMessage(m.chat, {
      text: "🚨 تم رصد لفظ غير لائق",
      quoted: m
    })

    try {
      await conn.sendMessage(m.chat, { delete: m.key })
    } catch {}

    await notifyAdmins("استخدام كلمات غير لائقة")

    return true
  }

  /* =========================
     Anti-Spam
  ========================= */

  const user = m.sender
  const now = Date.now()

  global.spam[m.chat] ||= {}
  global.spam[m.chat][user] ||= { count: 0, last: now }

  const diff = now - global.spam[m.chat][user].last

  if (diff < 5000) {
    global.spam[m.chat][user].count += 1
  } else {
    global.spam[m.chat][user].count = 1
  }

  global.spam[m.chat][user].last = now

  if (global.spam[m.chat][user].count >= 7) {

    await conn.sendMessage(m.chat, {
      text: "🚨 تم رصد سبام",
      quoted: m
    })

    try {
      await conn.sendMessage(m.chat, { delete: m.key })
    } catch {}

    await notifyAdmins("إرسال رسائل بسرعة (سبام)")

    global.spam[m.chat][user].count = 0

    return true
  }

  return false
}
  const isBad = badWords.some(w =>
    cleanText.includes(w)
  )

  if (isBad) {

    await conn.sendMessage(m.chat, { delete: m.key })

    await conn.sendMessage(m.chat, {
      text: `🚨 *مخالفة لفظية*\n\n👤 @${m.sender.split('@')[0]}\n⚠️ استخدام كلمات غير لائقة\n📢 تم تنبيه المشرفين`,
      mentions: [m.sender, ...admins]
    })

    return true
  }

  /* =========================
     Anti-Spam (7 رسائل)
  ========================= */

  const user = m.sender
  const now = Date.now()

  global.spam[user] ||= { count: 0, last: now }

  const diff = now - global.spam[user].last

  if (diff < 5000) {
    global.spam[user].count += 1
  } else {
    global.spam[user].count = 1
  }

  global.spam[user].last = now

  if (global.spam[user].count >= 7) {

    await conn.sendMessage(m.chat, { delete: m.key })

    await conn.sendMessage(m.chat, {
      text: `🚨 *Spam Alert*\n\n👤 @${user.split('@')[0]}\n⚠️ أرسل رسائل بسرعة (سبام)\n📢 تم تنبيه المشرفين`,
      mentions: [m.sender, ...admins]
    })

    global.spam[user].count = 0

    return true
  }

  return false
}
