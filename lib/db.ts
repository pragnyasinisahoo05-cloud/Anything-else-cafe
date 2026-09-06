import Database from 'better-sqlite3'

const db = new Database('anything-else.db')

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
// ============================================================
// RESERVATIONS
// ============================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL,
    special_request TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

// ============================================================
// MENU CATEGORIES
// ============================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS menu_categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    blurb TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible INTEGER NOT NULL DEFAULT 1
  )
`)

// ============================================================
// MENU ITEMS
// ============================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT,
    tag TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_available INTEGER NOT NULL DEFAULT 1,

    FOREIGN KEY (category_id)
      REFERENCES menu_categories(id)
      ON DELETE CASCADE
  )
`)

// ============================================================
// SEED INITIAL MENU
// ============================================================

// Only seed if the menu is completely empty.
// This means existing menu data will NOT be duplicated
// every time the server starts.

const menuCount = db
  .prepare('SELECT COUNT(*) as count FROM menu_categories')
  .get() as { count: number }

if (menuCount.count === 0) {
  const seedMenu = db.transaction(() => {
    // --------------------------------------------------------
    // Categories
    // --------------------------------------------------------

    const insertCategory = db.prepare(`
      INSERT INTO menu_categories (
        id,
        title,
        blurb,
        sort_order,
        is_visible
      )
      VALUES (?, ?, ?, ?, ?)
    `)

    insertCategory.run(
      'espresso',
      'Espresso Bar',
      'Pulled from our seasonal house blend, roasted in-house each week.',
      0,
      1,
    )

    insertCategory.run(
      'slow',
      'Slow & Cold',
      'For the patient. Brewed slow, poured cold, sipped unhurried.',
      1,
      1,
    )

    insertCategory.run(
      'bakery',
      'From the Bakery',
      'Baked before sunrise. When they’re gone, they’re gone.',
      2,
      1,
    )

    // --------------------------------------------------------
    // Items
    // --------------------------------------------------------

    const insertItem = db.prepare(`
      INSERT INTO menu_items (
        category_id,
        name,
        description,
        price,
        image,
        tag,
        sort_order,
        is_available
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    // ========================================================
    // Espresso Bar
    // ========================================================

    insertItem.run(
      'espresso',
      'Caramel Latte',
      'Double ristretto, steamed milk, house salted-caramel.',
      '5.50',
      '/images/drink-latte.png',
      'Signature',
      0,
      1,
    )

    insertItem.run(
      'espresso',
      'Cortado',
      'Equal parts espresso and warm micro-foam milk.',
      '4.25',
      null,
      null,
      1,
      1,
    )

    insertItem.run(
      'espresso',
      'Flat White',
      'Silky steamed milk over a velvety double shot.',
      '4.75',
      null,
      null,
      2,
      1,
    )

    insertItem.run(
      'espresso',
      'Cappuccino',
      'Classic espresso with a thick, cloud-like foam.',
      '4.50',
      null,
      null,
      3,
      1,
    )

    // ========================================================
    // Slow & Cold
    // ========================================================

    insertItem.run(
      'slow',
      'Cold Brew',
      '18-hour steep, deep chocolate notes, cream swirl.',
      '5.00',
      '/images/drink-coldbrew.png',
      'House Favorite',
      0,
      1,
    )

    insertItem.run(
      'slow',
      'Pour Over',
      'Single-origin, hand-poured. Ask about today’s roast.',
      '6.00',
      null,
      null,
      1,
      1,
    )

    insertItem.run(
      'slow',
      'Matcha Latte',
      'Ceremonial-grade matcha whisked with oat milk.',
      '5.75',
      '/images/drink-matcha.png',
      null,
      2,
      1,
    )

    insertItem.run(
      'slow',
      'Iced Mocha',
      'Cold brew, dark chocolate, a whisper of vanilla.',
      '5.50',
      null,
      null,
      3,
      1,
    )

    // ========================================================
    // From the Bakery
    // ========================================================

    insertItem.run(
      'bakery',
      'Butter Croissant',
      'Laminated over three days, impossibly flaky.',
      '4.00',
      '/images/drink-pastry.png',
      'Baked daily',
      0,
      1,
    )

    insertItem.run(
      'bakery',
      'Almond Danish',
      'Frangipane, toasted almonds, dusted sugar.',
      '4.75',
      null,
      null,
      1,
      1,
    )

    insertItem.run(
      'bakery',
      'Banana Bread',
      'Brown butter, walnuts, a thick honeyed crust.',
      '4.25',
      null,
      null,
      2,
      1,
    )

    insertItem.run(
      'bakery',
      'Seasonal Galette',
      'Whatever the farmers brought us this morning.',
      '5.25',
      null,
      null,
      3,
      1,
    )
  })

  seedMenu()
}

export default db