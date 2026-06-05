import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '201558880127',
  prefix: [".", "/", "!"],
  fromMe: false,
  owners: [
    { name: "Lucifer", jid: "201044349439@s.whatsapp.net" }
  ],
  settings: { noWelcome: false },
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* 🔴 MUTE SYSTEM (ADDED) */
client.onMessage(async (m) => {

  try {

    global.db.data.muted ||= {}

    const muted = global.db.data.muted[m.sender]

    if (!muted) return

    // انتهاء مدة الكتم
    if (Date.now() > muted.time) {
      delete global.db.data.muted[m.sender]
      return
    }

    // حذف رسالة المكموت
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

});

/* =========== Database ========== */
if (!global.db) {
  global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;

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
