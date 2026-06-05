const handler = async (m) => {

  let user =
    m.quoted?.sender ||
    m.mentionedJid?.[0]

  if (!user) return m.reply("رد على رسالة الشخص أو منشنه")

  global.muted ||= {}

  global.muted[user] = Date.now() + (2 * 60 * 60 * 1000)

  m.reply("🔇 تم الكتم لمدة ساعتين")
}

handler.command = ["كتم"]
handler.admin = true
handler.group = true

export default handler
