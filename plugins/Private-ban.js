export default async function before(m, { conn }) {

  // ❌ تجاهل الجروبات
  if (m.isGroup) return false

  const sender = m.sender
  const dev = "201044349439@s.whatsapp.net"

  try {

    // 🚨 رسالة للمستخدم
    await conn.sendMessage(m.chat, {
      text: "🚫 هذا البوت لا يستقبل الرسائل الخاصة\n⛔ سيتم حظرك تلقائيًا"
    })

    // ⛔ حظر المستخدم
    await conn.updateBlockStatus(sender, "block")

    // 📩 إرسال تنبيه للمطور
    await conn.sendMessage(dev, {
      text:
`🚨 *تم حظر مستخدم جديد*

👤 الرقم: @${sender.split("@")[0]}
📌 السبب: إرسال رسالة خاصة للبوت`
    }, {
      mentions: [sender]
    })

  } catch (e) {
    console.log("Block system error:", e)
  }

  return true
}
