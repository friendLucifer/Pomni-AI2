export default async function before(m, { conn }) {

  const text = (m.body || m.text || "").trim();

  /* =========================
     TRIGGERS العادية
  ========================= */

  const triggers = {
    "السلام عليكم": ["وعليكم السلام 🤎", "وعليكم السلام ورحمة الله ❤️"],
    "تست": ["عايز تقلش؟", "تست تست"],
    "هلا": ["هلا وغلا", "هلا بيك", "يا هلا"],
    "باي": ["مع السلامة", "باي باي", "الله معاك"],
    "صباح الخير": ["صباح النور", "صباح الورد", "صباح الفل"],
    "مساء الخير": ["مساء النور", "مساء الورد", "مساء الفل"],

    "ميتسوري بتسلم عليك": ["ميتسوووو الله يسلمها"],
    "اريما بيكلمك": ["انا اسف", "سامحني", "خادمك المطيع"],
    "ناغومو بيسلم عليك": ["تحيه للقائد"],
    "مازن بيكلمك": ["الله يسلمك يا دحيح"],
    "لوسيفر بيسلم عليك": ["مين يعني؟"]
  };

  const replies = triggers[text];

  if (replies) {
    const reply = replies[Math.floor(Math.random() * replies.length)];
    await m.reply(reply);
    return;
  }

  /* =========================
     دا ثانويه عامه
  ========================= */

  if (text.includes("دا ثانويه عامه")) {

    if (!m.quoted) return

    const laugh =
`😂😂😂😂😂😂
هههههههههههههههههههههههههههههههه
هههههههههههههههههههههههههههههههه
روح ذاكر 📚`

    await conn.sendMessage(m.chat, {
      text: laugh,
      contextInfo: {
        stanzaId: m.quoted.key?.id,
        participant: m.quoted.key?.participant,
        mentionedJid: [m.quoted.sender || m.sender]
      }
    }, { quoted: m })

    return
  }

  /* =========================
     السلام عليكم
  ========================= */

  if (
    text.includes("وعليكم السلام") ||
    text.includes("وعليكم السلام ورحمة الله") ||
    text.includes("وعليكم السلام ورحمة الله وبركاته")
  ) {

    if (!m.quoted) {
      await m.reply("وصلي على النبي ﷺ 🤍")
      return
    }

    await conn.sendMessage(m.chat, {
      text: "وصلي على النبي ﷺ 🤍",
      contextInfo: {
        stanzaId: m.quoted.key?.id,
        participant: m.quoted.key?.participant,
        mentionedJid: [m.quoted.sender || m.sender]
      }
    }, { quoted: m })

    return
  }

  /* =========================
     VIP SYSTEM (الشخصيات)
  ========================= */

  const vip = {
    "201140749033@s.whatsapp.net": {
      name: "الإمبراطور",
      reply: "👑⚡ تحت أمرك يا امبريور ⚡👑\n🍷 العالم كله في خدمتك يا إمبراطور"
    },

    "4915510468131@s.whatsapp.net": {
      name: "لوسيفر",
      reply: "❓ انت مين يا حبيبي؟"
    },

    "201055005266@s.whatsapp.net": {
      name: "ناغومو",
      reply: "🎖️ تحت امر القائد ناغومو"
    },

    "201090957996@s.whatsapp.net": {
      name: "مازن",
      reply: "🤍 تحت امر دحيح الدفعه مازن"
    },

    "201274272076@s.whatsapp.net": {
      name: "ميتسوري",
      reply: "🌸 تحت امر ميتسوري مؤسسة القلش"
    },

    "201091011979@s.whatsapp.net": {
      name: "يامي",
      reply: "🖤 تحت امر القدوه يامي"
    }
  };

  /* =========================
     TRIGGER: زيرام أو نداء خاص
  ========================= */

  if (text === "زيرام") {

    const user = vip[m.sender]

    if (user) {
      await m.reply(user.reply)
      return
    }

    const normal = [
      "شبيك لبيك زيرام بين ايديك🤍🍷",
      "أوامرك يا قائد 👑",
      "في خدمتك دائمًا 🤍"
    ]

    await m.reply(normal[Math.floor(Math.random() * normal.length)])
    return
  }
}    await conn.sendMessage(m.chat, {
      text: "وصلي على النبي ﷺ 🤍",
      contextInfo: {
        stanzaId: m.quoted.key?.id,
        participant: m.quoted.key?.participant,
        mentionedJid: [m.quoted.sender || m.sender]
      }
    }, { quoted: m })

    return
  }
}
