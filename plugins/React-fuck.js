const handler = async (m, { conn }) => {

  const owners = [
    "4915510468131@s.whatsapp.net",
    "201055005266@s.whatsapp.net",
    "201044349439@s.whatsapp.net"
  ]

  if (!owners.includes(m.sender)) {
    return m.reply("❌ هذا الأمر لناغومو فقط")
  }

  if (!m.quoted) {
    return m.reply("❌ لازم ترد على رسالة")
  }

  const key = m.quoted?.key || {
    id: m.quoted.id,
    remoteJid: m.chat,
    fromMe: false
  }

  await conn.sendMessage(m.chat, {
    react: {
      text: "🖕🏿",
      key
    }
  })

}

handler.command = ["fuck"]
handler.group = true

export default handler
