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
     Anti-Link
  ========================= */

  const linkRegex = /(https?:\/\/|chat\.whatsapp\.com|wa\.me|t\.me)/gi

  if (g.antiLink && linkRegex.test(text)) {

    await conn.sendMessage(m.chat, { delete: m.key })

    await conn.sendMessage(m.chat, {
      text: `🚨 *مخالفة رابط*\n\n👤 @${m.sender.split('@')[0]}\n⚠️ نشر رابط ممنوع\n📢 تم تنبيه المشرفين`,
      mentions: [m.sender, ...admins]
    })

    return true
  }

  /* =========================
     Anti-Swear
  ========================= */

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
