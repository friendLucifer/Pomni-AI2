global.botState ||= "on"
// on = شغال
// mute = صامت
// admin = مشرفين فقط

// تخزين مؤقت للأدمن (كل مرة يتحدث)
const getAdmins = async (conn, m) => {
  try {
    const meta = await conn.groupMetadata(m.chat)
    return meta.participants
      .filter(p => p.admin === "admin" || p.admin === "superadmin")
      .map(p => p.id)
  } catch {
    return []
  }
}

const handler = async (m, { conn, command }) => {

  if (!m.isGroup) return

  const admins = await getAdmins(conn, m)
  const isAdmin = admins.includes(m.sender)

  // 🔇 shut
  if (command === "shut") {
    if (!isAdmin) return m.reply("❌ للأدمن فقط")
    global.botState = "mute"
    return m.reply("🔇 تم إسكات البوت")
  }

  // 🔊 good
  if (command === "good") {
    if (!isAdmin) return m.reply("❌ للأدمن فقط")
    global.botState = "on"
    return m.reply("🔊 تم تشغيل البوت")
  }

  // 🛡️ toadmin
  if (command === "toadmin") {
    if (!isAdmin) return m.reply("❌ للأدمن فقط")
    global.botState = "admin"
    return m.reply("🛡️ مشرفين فقط")
  }

  // =========================
  // الحالات (تطبيق الحالة على الرسائل)
  // =========================

  if (global.botState === "mute") return

  if (global.botState === "admin" && !isAdmin) return
}

handler.command = ["shut", "good", "toadmin"]
handler.group = true

export default handler
