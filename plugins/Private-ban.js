const OWNER = "4915510468131@s.whatsapp.net"
const LOG_GROUP = "BFHXZU5kovwFYFpt89xUX6@g.us"

// قاعدة الحظر
global.privateBan ||= {}

export default async function before(m, { conn }) {

  // فقط الخاص
  if (m.isGroup) return

  // استثناء المطور
  if (m.sender === OWNER) return

  // إذا محظور مسبقاً → تجاهل كامل
  if (global.privateBan[m.sender]) return true

  try {

    // 🚫 تسجيل الحظر فوراً (أول مرة)
    global.privateBan[m.sender] = {
      time: Date.now(),
      reason: "private_chat"
    }

    // 📢 إرسال للجروب
    await conn.sendMessage(LOG_GROUP, {
      text: `🚨 *حظر تلقائي*

👤 المستخدم: @${m.sender.split('@')[0]}
❌ حاول مراسلة البوت في الخاص
🔒 تم حظره فوراً من البوت`,
      mentions: [m.sender]
    })

    // ❌ رد في الخاص
    await conn.sendMessage(m.chat, {
      text: "🚫 تم حظرك من البوت\n❌ لا يمكنك مراسلتي مرة أخرى"
    })

  } catch (e) {
    console.log("Private ban error:", e)
  }

  return true
}
