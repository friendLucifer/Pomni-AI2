import { Client } from 'meowsab'
import { group, access } from "./system/control.js"
import UltraDB from "./system/UltraDB.js"
import sub from './sub.js'

/* =========================
   DATABASE (MUST FIRST)
========================= */
global.db = new UltraDB()

global.db.data ||= {}
global.db.data.users ||= {}
global.db.data.stats ||= {}
global.db.data.stats.daily ||= {}
global.db.data.muted ||= {}

/* =========================
   CLIENT
========================= */
const client = new Client({
  phoneNumber: '201558880127',
  prefix: [".", "/", "!"],
  fromMe: false,
  owners: [
    { name: "Lucifer", jid: "201044349439@s.whatsapp.net" }
  ],
  settings: { noWelcome: false },
  commandsPath: './plugins'
})

/* =========================
   SAFETY: GROUP EVENTS (SAFE)
========================= */
try {
  client.onGroupEvent(group)
} catch (e) {
  console.log("GroupEvent Error:", e)
}

/* =========================
   ACCESS (SAFE WRAP)
   ⚠️ إذا سبب مشاكل → لا يوقف البوت
========================= */
try {
  client.onCommandAccess(access)
} catch (e) {
  console.log("Access Error:", e)
}

/* =========================
   MUTE SYSTEM (SAFE)
========================= */
client.onMessage(async (m) => {
  try {

    const user = m.sender

    global.db.data.muted ||= {}

    const muted = global.db.data.muted[user]

    if (!muted) return

    if (Date.now() > muted.time) {
      delete global.db.data.muted[user]
      return
    }

    try {
      if (m.delete) {
        await m.delete()
      } else {
        await client.sendMessage(m.chat, {
          delete: m.key
        })
      }
    } catch {}

    return false

  } catch (e) {
    console.log("Mute error:", e)
  }
})

/* =========================
   START BOT
========================= */
client.start()

setTimeout(() => {
  try {
    if (client.commandSystem) {
      sub(client)
    }
  } catch (e) {
    console.log("Sub Error:", e)
  }
}, 2000)

/* =========================
   GLOBAL ERROR HANDLING
========================= */
process.on('uncaughtException', (e) => {
  console.log("CRASH:", e)
})

process.on('unhandledRejection', (err) => {
  console.log("PROMISE ERROR:", err)
})
