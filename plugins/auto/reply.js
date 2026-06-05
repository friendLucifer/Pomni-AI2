export default async function before(m, { conn }) {

  const text = (m.body || m.text || "").trim();

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

  /* =========================
     الردود العادية
  ========================= */

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
     السلام عليكم المطور
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
}
