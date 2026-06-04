const handler = async (m) => {

  if (m.text === "اختبار") {
    await m.reply("نظام الكتم يعمل")
  }

}

handler.all = true

export default handler
