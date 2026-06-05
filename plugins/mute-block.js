export default async function (m, { conn }) {

  global.db.data.muted ||= {}
  const muted = global.db.data.muted

  const user = m.sender
  const data = muted[user]

  if (!data) return

  // انتهاء الكتم
  if (Date.now() > data.time) {
    delete muted[user]
    return
  }

  try {
    // حذف رسالة الشخص مباشرة (هذا أقوى شكل للكتم)
    await conn.sendMessage(m.chat, {
      delete: m.key
    })
  } catch (e) {}

  // إيقاف أي أوامر منه
  return true
}
