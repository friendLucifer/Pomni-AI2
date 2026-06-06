global.botState ||= "on"
// on = شغال
// mute = صامت
// admin = مشرفين فقط

export default async function before(m, { conn }) {

  if (!m.isGroup) return false

  // جلب الأدمن
  const getAdmins = async () => {
    try {
      const meta = await conn.groupMetadata(m.chat)
      return meta.participants
        .filter(p => p.admin)
        .map(p => p.id)
    } catch {
      return []
    }
  }

  const admins = await getAdmins()

  const isAdmin = admins.includes(m.sender)

  const text = (m.text || "").trim()

  // 🔇 اسكت يا زيرام (للأدمن)
  if (text === "اسكت يا زيرام") {
    if (!isAdmin) return m.reply("❌ للأدمن فقط")
    global.botState = "mute"
    return m.reply("🔇 تم إسكات البوت")
  }

  // 🔊 اتكلم يا زيرام (للأدمن)
  if (text === "اتكلم يا زيرام") {
    if (!isAdmin) return m.reply("❌ للأدمن فقط")
    global.botState = "on"
    return m.reply("🔊 تم تشغيل البوت")
  }

  // 🛡️ مشرفين فقط يا زيرام (للأدمن)
  if (text === "مشرفين فقط يا زيرام") {
    if (!isAdmin) return m.reply("❌ للأدمن فقط")
    global.botState = "admin"
    return m.reply("🛡️ البوت الآن يرد على المشرفين فقط")
  }

  // 🚫 إسكات كامل
  if (global.botState === "mute") {
    return true
  }

  // 🛡️ مشرفين فقط
  if (global.botState === "admin") {
    if (!isAdmin) return true
  }

}
