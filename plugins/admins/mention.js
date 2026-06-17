const handler = async (m, { conn }) => {

  const metadata = await conn.groupMetadata(m.chat)
  const participants = metadata?.participants || []

  const groupAdmins = participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id)

  const groupMembers = participants
    .filter(p => !p.admin)
    .map(p => p.id)

  const shuffledAdmins = [...groupAdmins].sort(() => Math.random() - 0.5)
  const shuffledMembers = [...groupMembers].sort(() => Math.random() - 0.5)

  let messageText = ""

  messageText += `❉『 𝑨.𝑹.𝑺 ⊰🍷⊱ 𝑨𝑹𝑰𝑺𝑬 』 ❉\n\n`

  messageText += `*📊 كــارت الـمـنـشـن*\n\n`

  messageText += `*🗃️│ الـاســم: ${metadata.subject}*\n`
  messageText += `*📯│ تـاريـخ: ${new Date().toLocaleDateString('ar-EG')}*\n\n`

  messageText += `━━━━━━━━━━━━━━━\n\n`

  messageText += `👑 *𝑨.𝑹.𝑺 𝑨𝑫𝑴𝑰𝑵 🍷 (${groupAdmins.length})*\n`
  messageText += shuffledAdmins
    .map((a, i) => `🍷│ ${i + 1}. @${a.split('@')[0]}`)
    .join("\n")

  messageText += `\n\n━━━━━━━━━━━━━━━\n\n`

  messageText += `👥 *𝑨.𝑹.𝑺 𝑴𝑬𝑴𝑩𝑬𝑹 🍷 (${groupMembers.length})*\n`
  messageText += shuffledMembers
    .map((mbr, i) => `│ ${i + 1}. @${mbr.split('@')[0]}`)
    .join("\n")

  messageText += `\n\n━━━━━━━━━━━━━━━\n\n`

  messageText += `💬 *القلش فكره والفكرة لا تموت*\n\n`

  messageText += `> 📌 *إجمالي المشاركين: ${participants.length}*`

  // 🔥 صور الكارت
  const cardImages = [
    "https://i.postimg.cc/9ryVgBP0/22b0240b9fcbc1a87410af6d252b9cce.jpg",
    "https://i.postimg.cc/VdX1ZF9N/24e9d00718707fd5b39fdb59bd061f80.jpg",
    "https://i.postimg.cc/hfVgZ0Lw/2ac18ea4df76188c9dedf674f9d77ab1.jpg",
    "https://i.postimg.cc/F70mCxbY/36e8d89f88e99a6385432c19830f3581.jpg",
    "https://i.postimg.cc/14ksKdFZ/44cf8b5f7b7f6562b67784ef346aeca2.jpg",
    "https://i.postimg.cc/6TkthPvj/5984a1d6ef3da549d29a02c13261fa20.jpg",
    "https://i.postimg.cc/HjqdtNMG/678a5db920a7faa44193f409e0e82a79.jpg",
    "https://i.postimg.cc/fJYZqv7z/7da359ee67a042e149b9baa7fa7628a0.jpg",
    "https://i.postimg.cc/JtfMQFX8/7f28442925b7c5036d557e3da5dbc851.jpg",
    "https://i.postimg.cc/qgP4GF3w/877f54bee46e6888136817ad3709aea8.jpg",
    "https://i.postimg.cc/CzbYr4CZ/8842609b4724322ac31207a384788b5e.jpg",
    "https://i.postimg.cc/fkGDvP9P/9ca93a2f906de4ffa2ee15407a9bfe16.jpg",
    "https://i.postimg.cc/0rTPC4wF/afbf4787d97f84dc56022ce29863066a.jpg",
    "https://i.postimg.cc/ZC6ZsL8Q/b131ca4e68d1462aff5a76ab8e0b4e98.jpg",
    "https://i.postimg.cc/5jhbmrCk/b5db62c3e66d9f0699c7f6b64aa713fe-webp.webp",
    "https://i.postimg.cc/nCqZS14y/be9bfee3ee430264c61ef655fb10d39c-(1).jpg",
    "https://i.postimg.cc/Bjs3r1NF/cb29dade6c46c3eeda22615fc8eea421.jpg",
    "https://i.postimg.cc/8jLDXbRq/cb9d4cafe4f0d57d35158b45046226a4.jpg",
    "https://i.postimg.cc/pmxvwnk9/fc5606b9b04ba8583d74e2011cf0a595-webp.webp"
  ]

  // اختيار صورة عشوائية
  let pp = cardImages[Math.floor(Math.random() * cardImages.length)]

  return conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: messageText,
    mentions: participants.map(p => p.id)
  })

}

handler.command = ["منشن", "mention", "منشنز"]

export default handler
