global.privateBan ||= {}

const OWNER = "4915510468131@s.whatsapp.net"
const LOG_GROUP = "BFHXZU5kovwFYFpt89xUX6@g.us"

const handler = async (m, { conn }) => {

  // فقط الخاص
  if (m.isGroup) return

  // استثناء المطور
  if (m.sender === OWNER) return

  // إذا محظور مسبقاً
  if (global.privateBan[m.sender]) return

  try {

    // تسجيل الحظر فوراً (أول مرة فقط)
    global.privateBan[m.sender] = {
      time: Date.now(),
      reason: "private_chat"
    }

    // تنبيه في الجروب
    await conn.sendMessage(LOG_GROUP, {
      text: `🚨 *حظر تلقائي*

👤 المستخدم: @${m.sender.split('@')[0]}
❌ حاول مراسلة البوت في الخاص
🔒 تم حظره فوراً`,
      mentions: [m.sender]
    })

    // رد في الخاص
    await conn.sendMessage(m.chat, {
      text: "🚫 تم حظرك من البوت\n❌ لا يمكنك مراسلتي مرة أخرى"
    })

  } catch (e) {
    console.log("Private ban error:", e)
  }
}

// 🔥 مهم جدًا عشان يشتغل على كل الرسائل
handler.all = true

export default handler
