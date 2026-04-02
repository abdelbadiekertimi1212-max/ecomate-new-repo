const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function makeAdmin(email) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // 1. Get user by email
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
  const user = users.find(u => u.email === email)

  if (!user) {
    console.error(`User with email ${email} not found.`)
    return
  }

  // 2. Upsert admin role
  const { error: roleError } = await supabase
    .from('admin_roles')
    .upsert({ 
      user_id: user.id, 
      role: 'super_admin',
      updated_at: new Date().toISOString()
    })

  if (roleError) {
    if (roleError.code === '42P01') {
      console.log("Table 'admin_roles' does not exist. Creating it...")
      // In a real scenario, we'd run a SQL migration here.
      // But for this project, the user should have the table via Supabase migrations.
    }
    console.error('Error promoting user:', roleError)
    return
  }

  console.log(`Success! User ${email} has been promoted to super_admin.`)
}

const email = process.argv[2]
if (!email) {
  console.log('Usage: node scripts/make-admin.js user@example.com')
} else {
  makeAdmin(email)
}
