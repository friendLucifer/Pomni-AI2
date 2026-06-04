const handler = async (m, { conn }) => {

  if (!m.isGroup) return

  global.db.data.muted ||= {}

  let data = global.db.data.muted[m.sender]
  if (!data) return

  // إذا انتهى الوقت → فك تلقائي
  if (Date.now() > data.time) {
    delete global.db.data.muted[m.sender]
    return
  }

  // حذف رسالة المكتوم
  await conn.sendMessage(m.chat, {
    delete: m.key
  })
}

handler.all = true

export default handler
