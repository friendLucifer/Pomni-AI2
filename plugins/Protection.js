export default async function before(m, { conn }) {

  if (!m.isGroup) return false

  global.spam ||= {}

  const db = global.db || (global.db = {})
  db.groups ||= {}
  const g = db.groups[m.chat] ||= {}

  const badWords = [
    "كسمك",
    "كسم",
    "عرض",
    "عرص",
    "حول",
    "متناك",
    "شرموط"
  ]

  // 🔥 نص موحد مضمون
  const text = (m.text || m.body || "").toLowerCase()

  const cleanText = text.replace(/[^\p{L}\p{N}]/gu, "")

  // =========================
  // جلب الأدمن
  // =========================
  let admins = []
  try {
    const meta = await conn.groupMetadata(m.chat)
    admins = meta.participants
      .filter(p => p.admin)
      .map(p => p.id)
  } catch {}

  const notifyAdmins = async (reason) => {

    const taggedAdmins = admins.slice(0, 5)

    await conn.sendMessage(m.chat, {
      text:
`🚨 *تنبيه مخالفة*

👤 @${m.sender.split('@')[0]}
⚠️ السبب: ${reason}

📢 المشرفين:
${taggedAdmins.map(a => '@' + a.split('@')[0]).join(' ')}`,
      mentions: [m.sender, ...taggedAdmins]
    })
  }

  // =========================
  // Anti-Link
  // =========================
  const linkRegex = /(https?:\/\/|chat\.whatsapp\.com|wa\.me|t\.me)/gi

  if (g.antiLink && linkRegex.test(text)) {

    try {
      await conn.sendMessage(m.chat, {
        text: "🚨 تم رصد رابط مخالف"
      })

      await conn.sendMessage(m.chat, {
        delete: m.key
      })
    } catch {}

    await notifyAdmins("نشر رابط")

    return true
  }

  // =========================
  // Anti-Swear
  // =========================
  const isBad = badWords.some(w => cleanText.includes(w))

  if (isBad) {

    try {
      await conn.sendMessage(m.chat, {
        text: "🚨 تم رصد لفظ غير لائق"
      })

      await conn.sendMessage(m.chat, {
        delete: m.key
      })
    } catch {}

    await notifyAdmins("كلام غير لائق")

    return true
  }

  // =========================
  // Anti-Spam
  // =========================
  const user = m.sender
  const now = Date.now()

  global.spam[m.chat] ||= {}
  global.spam[m.chat][user] ||= { count: 0, last: now }

  const diff = now - global.spam[m.chat][user].last

  global.spam[m.chat][user].count =
    diff < 5000
      ? global.spam[m.chat][user].count + 1
      : 1

  global.spam[m.chat][user].last = now

  if (global.spam[m.chat][user].count >= 7) {

    try {
      await conn.sendMessage(m.chat, {
        text: "🚨 تم رصد سبام"
      })

      await conn.sendMessage(m.chat, {
        delete: m.key
      })
    } catch {}

    await notifyAdmins("سبام")

    global.spam[m.chat][user].count = 0

    return true
  }

  return false
}
