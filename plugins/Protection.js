export default async function before(m, { conn }) {

  if (!m.isGroup) return false

  global.spam ||= {}
  global.stickerSpam ||= {}

  const db = global.db || (global.db = {})
  db.groups ||= {}
  const g = db.groups[m.chat] ||= {}

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
     الكلمات الممنوعة
  ========================= */

  const badWords = [
    "كسمك",
    "كسم",
    "قحبه",
    "عرص",
    "خول",
    "متناك",
    "شرموط"
  ]

  /* =========================
     جلب الأدمن
  ========================= */

  let admins = []
  try {
    const meta = await conn.groupMetadata(m.chat)

    admins = meta.participants
      .filter(p => p.admin)
      .map(p => p.id)

  } catch {}

  if (!admins.length) return false

  const user = m.sender
  const now = Date.now()

  /* =========================
     Anti-Link
  ========================= */

  const linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me|t\.me)/gi

  if (g.antiLink && linkRegex.test(text)) {

    await conn.sendMessage(m.chat, {
      text: `📌 *دليل مخالفة*\n\n👤 @${user.split('@')[0]}\n⚠️ رابط ممنوع\n\n💬 "${text}"`,
      mentions: admins
    })

    setTimeout(async () => {
      try {
        await conn.sendMessage(m.chat, { delete: m.key })
      } catch {}
    }, 800)

    await conn.sendMessage(m.chat, {
      text: `🚨 *تنبيه إداري*\n⚠️ تم رصد رابط في الجروب`,
      mentions: admins
    })

    return true
  }

  /* =========================
     Anti-Swear
  ========================= */

  const isBad = badWords.some(w => cleanText.includes(w))

  if (isBad) {

    await conn.sendMessage(m.chat, {
      text: `📌 *دليل مخالفة*\n\n👤 @${user.split('@')[0]}\n⚠️ كلمات غير لائقة\n\n💬 "${text}"`,
      mentions: admins
    })

    setTimeout(async () => {
      try {
        await conn.sendMessage(m.chat, { delete: m.key })
      } catch {}
    }, 800)

    await conn.sendMessage(m.chat, {
      text: `🚨 *تنبيه إداري*\n⚠️ تم رصد سب في الجروب`,
      mentions: admins
    })

    return true
  }

  /* =========================
     Anti-Spam (7 رسائل)
  ========================= */

  global.spam[user] ||= { count: 0, last: now }

  const diff = now - global.spam[user].last

  if (diff < 5000) global.spam[user
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
