const handler = async (m) => {

  let user =
    m.quoted?.sender ||
    m.mentionedJid?.[0]

  if (!user) return m.reply("رد على رسالة الشخص")

  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.muted = global.db.data.muted || {}

  try {

    delete global.db.data.muted[user]

    m.reply("🔊 تم فك الكتم")

  } catch (e) {
    console.log(e)
    m.reply("حدث خطأ في فك الكتم")
  }
}

handler.command = ["فك"]
handler.admin = true
handler.group = true

export default handler
