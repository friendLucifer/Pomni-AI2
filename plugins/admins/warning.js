const handler = async (m, { conn }) => {
  let targetLid = m.mentionedJid?.[0] || m.quoted?.sender;
  let targetJid = m.lid2jid(targetLid);

  if (!targetJid || !targetLid) return m.reply('⚠️ *الامر مخصص لي لوسيفر فقط* ⚠️');

  const user = (await conn.groupMetadata(m.chat)).participants.find(
    p => p.id === targetLid || p.phoneNumber === targetJid
  );

  if (!user) return m.reply("❌ المستخدم غير موجود في الجروب");

  db.groups[m.chat] ??= {};
  db.groups[m.chat].warnings ??= {};

  const id = user.phoneNumber;
  const jid = targetLid;

  const warnCount = db.groups[m.chat].warnings[id] =
    (db.groups[m.chat].warnings[id] || 0) + 1;

  await conn.sendMessage(m.chat, {
    text: `⚠️ انت لست لوسيفر  

👤: @${id.split("@")[0]}
  : ${warnCount}`,
    mentions: [jid]
  }, { quoted: global.reply_status });
};

handler.before = async (m, { conn }) => {
  const g = global.db?.groups?.[m.chat];
  if (!g?.warnings) return false;

  const user = m.sender;

  if (!g.warnings[user]) return false;

  if (g.warnings[user] >= 3) {
    await conn.sendMessage(m.chat, {
      text: `🚫 @${user.split("@")[0]} اسف انت خالفت القوانين، دلوقتي هنطردك`,
      mentions: [user]
    }, { quoted: global.reply_status });

    await conn.groupParticipantsUpdate(m.chat, [user], "remove");
    delete g.warnings[user];
  }

  return false;
};

handler.command = ["انذار", "تحذير", "warn"];
handler.usage = ['انذار'];
handler.category = "owner";
handler.admin = true;
handler.botAdmin = true

export default handler;
