import { SubBots } from "meowsab";

async function sub(client) {

  global.subBots = new SubBots(client.commandSystem);

  //SubBots.pariCode("ABCD1234");

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
    console.log(`✅ [SubBot ${uid}] Connected`);
  });

  global.subBots.on('pair', (uid, code) => {
    console.log(`🔐 Pairing code: ${code}`);
  });

  /* ========================= */
  /* 🔇 MUTE SYSTEM (FINAL FIX) */
  /* ========================= */

  global.muted ||= {}

  global.subBots.on('message', async (uid, msg) => {

    try {

      if (!msg?.key) return

      const bot = global.subBots.get(uid)
      const sock = bot?.sock
      if (!sock) return

      const chatId = msg.key.remoteJid

      // 🔥 تحديد هوية المرسل بشكل قوي (حل كل مشاكل id)
      const sender =
        msg.key.participant ||
        msg.key.remoteJid ||
        msg.sender

      if (!sender) return

      const mutedUntil = global.muted[sender]

      // 🔇 إذا المستخدم مكموت
      if (mutedUntil) {

        // انتهاء الكتم
        if (Date.now() > mutedUntil) {
          delete global.muted[sender]
          return
        }

        // 💀 حذف الرسالة فورًا
        await sock.sendMessage(chatId, {
          delete: msg.key
        })

        return
      }

    } catch (e) {
      console.log("Mute System Error:", e)
    }

  });

  global.subBots.on('close', (uid) => {
    console.log(`🔌 [SubBot ${uid}] Disconnected`);
  });

  global.subBots.on('badSession', (uid) => {
    console.log(`⚠️ [SubBot ${uid}] Bad session removed`);
  });

  return global.subBots;
}

/* ========================= */
/* HELPERS */
/* ========================= */

function getMessageText(msg) {
  if (!msg.message) return null;
  if (msg.message.conversation) return msg.message.conversation;
  if (msg.message.extendedTextMessage?.text) return msg.message.extendedTextMessage.text;
  if (msg.message.imageMessage?.caption) return msg.message.imageMessage.caption;
  return null;
}

export default sub;      /* ===== TEST ===== */
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
    console.log(`⚠️ [SubBot ${uid}] Bad session removed`);
  });

  return global.subBots;
}

/* ========================= */
/* HELPERS */
/* ========================= */

function getMessageText(msg) {
  if (!msg.message) return null;
  if (msg.message.conversation) return msg.message.conversation;
  if (msg.message.extendedTextMessage?.text) return msg.message.extendedTextMessage.text;
  if (msg.message.imageMessage?.caption) return msg.message.imageMessage.caption;
  return null;
}

export default sub;        await sock.sendMessage(msg.key.remoteJid, {
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
