const handler = async (m, { conn }) => {

  if (!m.isGroup) return

  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.muted = global.db.data.muted || {}

  console.log("تم تشغيل نظام الكتم")
  console.log("Sender:", m.sender)
  console.log("Muted List:", global.db.data.muted)

  let data = global.db.data.muted[m.sender]

  if (!data) return

  if (Date.now() > data.time) {
    delete global.db.data.muted[m.sender]
    return
  }

  console.log("تم العثور على عضو مكتوم")

  await conn.sendMessage(m.chat, {
    delete: m.key
  })
}

handler.all = true

export default handler
