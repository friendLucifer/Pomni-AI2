const handler = async (m) => {

  let user =
    m.quoted?.sender ||
    m.mentionedJid?.[0]

  if (!user) return m.reply("رد على رسالة الشخص أو منشنه")

  global.db.data.muted ||= {}

  delete global.db.data.muted[user]

  m.reply("🔊 تم فك الكتم")
}

handler.command = ["فك"]
handler.admin = true
handler.group = true

export default handler
