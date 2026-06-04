const handler = async (m) => {

  let user = m.mentionedJid?.[0]
  if (!user) return m.reply("منشن الشخص")

  global.db.data.muted ||= {}

  delete global.db.data.muted[user]

  m.reply("🔊تقدر تتنفس تم فك الكتم")
}

handler.command = ["فك"]
handler.admin = true
handler.group = true

export default handler
