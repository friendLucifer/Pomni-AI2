export default async function before(m, { conn }) {

    const g = global.db?.groups?.[m.chat]

    if (!g?.antiLink) return false
    if (m.isOwner || m.isAdmin) return false

    const text =
        m.text ||
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        ""

    if (!text) return false

    const groupLinkRegex = /(https?:\/\/)?(chat\.whatsapp\.com|whatsapp\.com\/channel|wa\.me|t\.me)\/[A-Za-z0-9]+/gi

    if (groupLinkRegex.test(text)) {

        try {

            await conn.sendMessage(m.chat, {
                delete: m.key
            })

            await conn.sendMessage(m.chat, {
                text: `🚫 تم حذف الرابط\n\n@${m.sender.split('@')[0]} ممنوع نشر الروابط`,
                mentions: [m.sender]
            })

        } catch (e) {
            console.log("AntiLink error:", e)
        }

        return true
    }

    return false
}
