import fs from "fs"

const DB_PATH = "./database.json"

/* =========================
   إنشاء قاعدة البيانات إذا غير موجودة
========================= */
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      users: {},
      stats: {
        daily: {}
      }
    }, null, 2))
  }
}

/* =========================
   تحميل البيانات
========================= */
function loadDB() {
  initDB()
  return JSON.parse(fs.readFileSync(DB_PATH))
}

/* =========================
   حفظ البيانات
========================= */
function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

/* =========================
   تحميلها إلى global
========================= */
global.db = loadDB()
global.saveDB = saveDB
