import { Client } from 'meowsab'
import UltraDB from "./system/UltraDB.js"
import sub from './sub.js'
import { group, access } from "./system/control.js"

/* =========================
   DATABASE (HARD INIT)
========================= */
global.db = new UltraDB()

global.db.data ||= {}
global.db.data.users ||= {}
global.db.data.stats ||= {}
global.db.data.stats.daily ||= {}
global.db.data.muted ||= {}

/* =========================
   HELPERS
========================= */

// لقب
global.setNickname = (jid, nickname) => {
  global.db.data.users[jid] ||= {}
  global.db.data.users[jid].nickname = nickname
}

// إحصائيات يومية
global.addDaily = (jid) => {
  global.db.data.stats.daily[jid] ||= 0
  global.db.data.stats.daily[jid]++
}

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

client.onGroupEvent(group)
client.onCommandAccess(access)

/* =========================
   MUTE SYSTEM
========================= */
client.onMessage(async (m) => {
  try {

    global.addDaily(m.sender)

    const muted = global.db.data.muted[m.sender]
    if (!muted) return

    if (Date.now() > muted.time) {
      delete global.db.data.muted[m.sender]
      return
    }

    if (m.delete) {
      await m.delete()
    } else {
      await client.sendMessage(m.chat, {
        delete: m.key
      })
    }

    return false

  } catch (e) {
    console.log("Mute error:", e)
  }
})

/* =========================
   CONFIG
========================= */
const { config } = client

config.info = {
  nameBot: "♡ 𝒁𝑬𝑰𝑹𝑨𝑴 ⚘️ 〈",
  nameChannel: "arise",
  idChannel: "@newsletter",
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029VbD9pJnEKyZAhN247W2V"
  },
  copyright: {
    pack: 'ڤـ ـ LC ـ ـا',
    author: 'LUCY'
  }
}

/* =========================
   START BOT
========================= */
client.start()

setTimeout(() => {
  if (client.commandSystem) {
    sub(client)
  }
}, 2000)

/* =========================
   ERROR HANDLING
========================= */
process.on('uncaughtException', (e) => {
  if (e.message.includes('rate-overlimit')) return
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
})    author: 'LUCY'
  }
};

/* =========== Start ========== */
client.start();

setTimeout(async () => {
  if (client.commandSystem) {
    sub(client)
  }
}, 2000);

/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
  if (e.message.includes('rate-overlimit')) {}
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
});
