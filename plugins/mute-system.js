const handler = async (m, { conn }) => {

  console.log("تم تشغيل نظام الكتم")

  if (!m.isGroup) return

  global.db.data.muted ||= {}

  let data = global.db.data.muted[m.sender]
  if (!data) return

  if (Date.now() > data.time) {
    delete global.db.data.muted[m.sender]
    return
  }

  await conn.sendMessage(m.chat, {
    delete: m.key
  })
}

handler.all = true

export default handler
