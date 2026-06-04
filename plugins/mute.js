const handler = async (m, { conn }) => {

  let user = m.mentionedJid?.[0]
  if (!user) return m.reply("منشن الشخص الذي تريد كتمه")

  global.db.data.muted ||= {}

  // ساعتين = 2 * 60 * 60 * 1000 ms
  global.db.data.muted[user] = {
    time: Date.now() + (2 * 60 * 60 * 1000)
  }

  m.reply("🔇 تم كتم العضو لمدة ساعتين")
}

handler.command = ["كتم"]
handler.admin = true
handler.group = true

export default handler
