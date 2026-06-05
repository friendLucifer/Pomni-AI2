const handler = async (m, { conn, text }) => {

  const mentioned = m.mentionedJid?.[0]
  if (!mentioned) return m.reply('🎯 قم بمنشن الشخص: .لقب @user');

  const parts = text.split(' ')
  parts.shift()
  const nickname = parts.join(' ').trim()

  if (!nickname) return m.reply('✏️ اكتب اللقب بعد المنشن: .لقب @user لقبك');

  global.db ||= {}
  global.db.users ||= {}

  const existingNick = Object.entries(global.db.users).find(([jid, data]) =>
    data?.nickname === nickname && jid !== mentioned
  )

  if (existingNick) {
    return m.reply(`🪾 اللقب "${nickname}" محجوز`)
  }

  global.db.users[mentioned] ||= {}
  global.db.users[mentioned].nickname = nickname

  await conn.sendMessage(m.chat, {
    text: `✅ تم تسجيل اللقب: "${nickname}" لـ @${mentioned.split('@')[0]}`,
    mentions: [mentioned]
  })
}

handler.command = ["لقب"]
handler.usage = ["لقب"]
handler.category = "nicknames"
handler.admin = true
handler.group = true

export default handler
