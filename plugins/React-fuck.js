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
    return m.reply("❌ رد على رسالة لو كنت ناغومو")
  }

  try {

    await conn.sendMessage(m.chat, {
      react: {
        text: "🖕🏿",
        key: m.quoted.key || m.quoted?.key || m.key
      }
    })

  } catch (e) {
    console.log(e)
    m.reply("❌ لم يعمل الريأكت")
  }

}

handler.command = ["fuck"]
handler.group = true

export default handler
