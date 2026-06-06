const handler = async (m, { conn }) => {

  // السماح فقط للمطور
  if (m.sender !== "4915510468131@s.whatsapp.net") {
    return m.reply("❌ هذا الأمر خاص بالمطور فقط")
  }

  try {

    await conn.sendMessage(m.chat, {
      text: "مطوري قالي أخرج انا اسف 💔💔"
    })

    // البوت يخرج من الجروب
    await conn.groupLeave(m.chat)

  } catch (e) {
    m.reply("❌ حصل خطأ أثناء الخروج")
  }
}

handler.command = ["أخرج"]
handler.group = true

export default handler
