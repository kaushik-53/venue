const bcrypt = require('bcryptjs')

async function test() {
  try {
    console.log('Testing bcryptjs...')
    const hash = await bcrypt.hash('password123', 12)
    console.log('Hash success:', hash)
    const match = await bcrypt.compare('password123', hash)
    console.log('Match success:', match)
  } catch (err) {
    console.error('Bcrypt error:', err)
  }
}

test()
