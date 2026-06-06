const handler = async (m, { conn }) => {

  if (m.sender !== "4915510468131@s.whatsapp.net") {
    return m.reply("❌ هذا الأمر خاص بلوسيفر فقط")
  }

  try {

    await conn.groupParticipantsUpdate(
      m.chat,
      [m.sender],
      "promote"
    )

    await m.reply("👑 تم رفعك إدمن يا لوسيفر")

  } catch (e) {
    await m.reply("❌ تأكد أن البوت أدمن في الجروب")
  }
}

handler.command = ["lucifer"] // 🔥 مهم جدًا
handler.group = true

export default handler
