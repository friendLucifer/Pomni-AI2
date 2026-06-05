export default async function (m, { conn }) {
  if (m.text === 'اختبار') {
    await conn.sendMessage(m.chat, {
      text: 'نظام البوت يعمل ✅'
    })
  }
}

export const handler = {
  all: true
}
