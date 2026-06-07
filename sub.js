import { SubBots } from "meowsab";

async function sub(client) {

  // تشغيل النظام بدون أي تنصيب أو ربط
  global.subBots = new SubBots(client.commandSystem);

  const { config } = client;

  await global.subBots.setConfig({
    commandsPath: config.commandsPath || './plugins',
    owners: config.owners,
    prefix: config.prefix,
    info: config.info,
    printQR: false
  });

  /* ========================= */
  /* 🚫 DISABLED FEATURES */
  /* ========================= */

  // ❌ تم إلغاء نظام التنصيب بالكامل
  // SubBots.pariCode("ABCD1234");

  // ❌ منع تحميل أي بوتات محفوظة
  // const loadedCount = await global.subBots.load();

  console.log("🚫 SubBot install system is DISABLED");

  /* ========================= */
  /* EVENTS */
  /* ========================= */

  global.subBots.on('error', (uid, error) => {
    console.error(`❌ [SubBot ${uid}] Error:`, error?.message || error);
  });

  global.subBots.on('ready', (uid) => {
    console.log(`✅ [SubBot ${uid}] Connected`);
  });

  global.subBots.on('pair', (uid, code) => {
    // 🚫 لا يتم عرض أي كود ربط
    return;
  });

  global.subBots.on('close', (uid) => {
    console.log(`🔌 [SubBot ${uid}] Disconnected`);
  });

  global.subBots.on('badSession', (uid) => {
    console.log(`⚠️ [SubBot ${uid}] Bad session removed`);
  });

  /* ========================= */
  /* MUTE SYSTEM */
  /* ========================= */

  global.muted ||= {};

  global.subBots.on('message', async (uid, msg) => {

    try {
      if (!msg?.key) return;

      const bot = global.subBots.get(uid);
      const sock = bot?.sock;
      if (!sock) return;

      const chatId = msg.key.remoteJid;

      const sender =
        msg.key.participant ||
        msg.key.remoteJid ||
        msg.sender;

      if (!sender) return;

      const mutedUntil = global.muted[sender];

      if (mutedUntil) {

        if (Date.now() > mutedUntil) {
          delete global.muted[sender];
          return;
        }

        await sock.sendMessage(chatId, {
          delete: msg.key
        });

        return;
      }

      /* ===== TEST ===== */
      const body = getMessageText(msg);

      if (body === "تست") {
        await sock.sendMessage(chatId, {
          react: { text: "✅", key: msg.key }
        });
      }

    } catch (e) {
      console.log("Mute System Error:", e);
    }

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

export default sub;        })

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
