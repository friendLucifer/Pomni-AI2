const handler = async (m) => {

  let user =
    m.quoted?.sender ||
    m.mentionedJid?.[0]

  if (!user) return m.reply("رد على رسالة الشخص")

  // 🔥 حماية قاعدة البيانات
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.muted = global.db.data.muted || {}

  try {

    global.db.data.muted[user] = {
      time: Date.now() + (2 * 60 * 60 * 1000)
    }

    m.reply("🔇 تم كتم العضو لمدة ساعتين")

  } catch (e) {
    console.log(e)
    m.reply("حدث خطأ في الكتم")
  }
}

handler.command = ["كتم"]
handler.admin = true
handler.group = true

export default handler
