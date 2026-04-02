const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function secureAdmin(email) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  console.log(`🔒 Starting Security Lockdown for EcoMate Master Admin: ${email}...`)

  // 1. Get user by email
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
  const user = users.find(u => u.email === email)

  if (!user) {
    console.error(`❌ User with email ${email} not found in Auth system.`)
    console.log(`💡 Tip: Register this account first via the /auth/register page.`)
    return
  }

  // 2. PURGE all other admins for absolute exclusivity
  console.log('🧹 Purging any other admin roles for absolute exclusivity...')
  const { error: purgeError } = await supabase
    .from('admin_roles')
    .delete()
    .neq('user_id', user.id)

  if (purgeError) console.error('⚠️ Warning: Could not purge other admins:', purgeError.message)

  // 3. Promote Master Admin
  const { error: roleError } = await supabase
    .from('admin_roles')
    .upsert({ 
      user_id: user.id, 
      role: 'super_admin',
      updated_at: new Date().toISOString()
    })

  if (roleError) {
    console.error('❌ Critical Error promoting master admin:', roleError.message)
    return
  }

  console.log(`✅ Success! EcoMate Admin Panel LOCKED to: ${email}`)
}

const masterEmail = 'abdelbadie.kertimi1212@gmail.com'
secureAdmin(masterEmail)
