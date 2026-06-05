const handler = async (m) => {

  let user =
    m.quoted?.sender ||
    m.mentionedJid?.[0]

  if (!user) return m.reply("رد على رسالة الشخص أو منشنه")

  global.muted ||= {}

  delete global.muted[user]

  m.reply("🔊 تم فك الكتم")
}

handler.command = ["فك", "فك_كتم"]
handler.admin = true
handler.group = true

export default handler
