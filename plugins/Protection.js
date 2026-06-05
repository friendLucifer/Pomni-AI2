export default async function before(m, { conn }) {

  if (!m.isGroup) return false

  global.spam ||= {}
  global.warn ||= {}
  global.stickerSpam ||= {}

  const db = global.db || (global.db = {})
  db.groups ||= {}
  const g = db.groups[m.chat] ||= {}

  /* =========================
     كلمات ممنوعة
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
     النص
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

  const user = m.sender

  /* =========================
     المشرفين
  ========================= */
  let admins = []
  try {
    admins = (await conn.groupMetadata(m.chat))
      .participants
      .filter(p => p.admin)
      .map(p => p.id)
  } catch {}

  /* =========================
     نظام التحذيرات
  ========================= */
  function addWarn(user) {
    global.warn[user] = (global.warn[user] || 0) + 1
    return global.warn[user]
  }

  /* =========================
     Anti-Link
  ========================= */
  const linkRegex = /(https?:\/\/|chat\.whatsapp\.com|wa\.me|t\.me)/gi

  if (g.antiLink && linkRegex.test(text)) {

    await conn.sendMessage(m.chat, { delete: m.key })

    const count = addWarn(user)

    if (count >= 3) {

      await conn.sendMessage(m.chat, {
        text: `🚨 *تحذير نهائي*\n\n⚠️ عضو وصل 3 مخالفات روابط\n👮 تم تنبيه المشرفين`,
        mentions: admins
      })

      global.warn[user] = 0
      return true
    }

    await conn.sendMessage(m.chat, {
      text: `🚨 *مخالفة رابط*\n\n⚠️ تم حذف رسالة\n📊 التحذيرات: ${count}/3`,
      mentions: admins
    })

    return true
  }

  /* =========================
     Anti-Swear
  ========================= */
  const isBad = badWords.some(w => cleanText.includes(w))

  if (isBad) {

    await conn.sendMessage(m.chat, { delete: m.key })

    const count = addWarn(user)

    if (count >= 3) {

      await conn.sendMessage(m.chat, {
        text: `🚨 *تحذير نهائي*\n\n⚠️ عضو وصل 3 مخالفات لفظية\n👮 تم تنبيه المشرفين`,
        mentions: admins
      })

      global.warn[user] = 0
      return true
    }

    await conn.sendMessage(m.chat, {
      text: `🚨 *مخالفة لفظية*\n\n⚠️ تم حذف رسالة\n📊 التحذيرات: ${count}/3`,
      mentions: admins
    })

    return true
  }

  /* =========================
     Anti-Spam (نصوص)
  ========================= */
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

    const count = addWarn(user)

    global.spam[user].count = 0

    if (
