import { SubBots } from "meowsab";

async function sub(client) {

  global.subBots = new SubBots(client.commandSystem);

  SubBots.pariCode("ABCD1234");

  const { config } = client;

  await global.subBots.setConfig({
    commandsPath: config.commandsPath || './plugins',
    owners: config.owners,
    prefix: config.prefix,
    info: config.info,
    printQR: false
  });

  global.subBots.on('error', (uid, error) => {
    console.error(`❌ [SubBot ${uid}] Error:`, error?.message || error);
  });

  const loadedCount = await global.subBots.load();
  console.log(`✅ Loaded ${loadedCount} saved bots`);

  global.subBots.on('ready', (uid) => {
    console.log(`✅ [SubBot ${uid}] Connected!`);
  });

  global.subBots.on('pair', (uid, code) => {
    console.log(`🔐 Pairing code: ${code}`);
  });

  /* ===================== */
  /* 🔇 MUTE SYSTEM STRONG */
  /* ===================== */

  global.subBots.on('message', async (uid, msg) => {

    if (msg.key.id.includes("3EB0")) return;

    const body = getMessageText(msg);
    const bot = global.subBots.get(uid);
    const sock = bot?.sock;

    if (!sock) return;

    try {

      global.db.data.muted ||= {}

      const id = msg.key.participant || msg.key.remoteJid
      const muted = global.db.data.muted[id]

      // 🔴 إذا الشخص مكموت
      if (muted) {

        // انتهاء الكتم
        if (Date.now() > muted.time) {
          delete global.db.data.muted[id]
          return
        }

        // 🔥 حذف الرسالة فورًا (الكتم الحقيقي)
        await sock.sendMessage(msg.key.remoteJid, {
          delete: msg.key
        })

        return
      }

      /* ===== TEST ===== */
      if (body === "تست") {
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: "✅", key: msg.key }
        });
      }

    } catch (e) {
      console.log("Mute Error:", e);
    }

  });

  global.subBots.on('close', (uid) => {
    console.log(`🔌 [SubBot ${uid}] Disconnected`);
  });

  global.subBots.on('badSession', (uid) => {
    console.log(`⚠️ [SubBot ${uid}] Bad session`);
  });

  return global.subBots;
}

/* ===================== */
/* HELPERS */
/* ===================== */

function getMessageText(msg) {
  if (!msg.message) return null;
  if (msg.message.conversation) return msg.message.conversation;
  if (msg.message.extendedTextMessage?.text) return msg.message.extendedTextMessage.text;
  if (msg.message.imageMessage?.caption) return msg.message.imageMessage.caption;
  return null;
}

export default sub;
