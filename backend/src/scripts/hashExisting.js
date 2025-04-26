// backend/scripts/hashExistingPasswords.js
require('dotenv').config();
const pool   = require('../db/pool');
const { hash } = require('../utils/hash');

async function migrate() {
  console.log('Starting password migration…');
  const { rows } = await pool.query(
    'SELECT userid, password FROM public.users ORDER BY userid LIMIT 11'
  );
  for (const { userid, password } of rows) {
    // skip if already hashed
    if (password.startsWith('$2b$')) continue;

    const newHash = await hash(password);
    await pool.query(
      'UPDATE public.users SET password = $1 WHERE userid = $2',
      [newHash, userid]
    );
    console.log(`  • Migrated user ${userid}`);
  }
  console.log('Migration complete!');
  await pool.end();
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
