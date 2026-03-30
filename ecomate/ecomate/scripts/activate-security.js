const https = require('https')
const fs = require('fs')
const path = require('path')

// 1. Read Env
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY
const MASTER_EMAIL = 'abdelbadie.kertimi1212@gmail.com'

async function runLockdown() {
  console.log(`🔒 Activating Exclusive Security for: ${MASTER_EMAIL}`)

  // A. Find User ID
  const listData = await supabaseRequest('/auth/v1/admin/users')
  const masterUser = listData.find(u => u.email === MASTER_EMAIL)

  if (!masterUser) {
    console.error(`❌ User ${MASTER_EMAIL} NOT FOUND. Please register first.`)
    return
  }

  console.log(`✨ Found Master User: ${masterUser.id}`)

  // B. Execute SQL (Promote and Purge)
  const sql = `
    DELETE FROM admin_roles WHERE user_id != '${masterUser.id}';
    INSERT INTO admin_roles (user_id, role, updated_at)
    VALUES ('${masterUser.id}', 'super_admin', now())
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', updated_at = now();
    INSERT INTO admin_users (user_id, email, role, created_at)
    VALUES ('${masterUser.id}', '${MASTER_EMAIL}', 'super_admin', now())
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
  `

  await supabaseRequest('/rest/v1/rpc/execute_sql', 'POST', { query: sql })
  console.log('✅ EcoMate Security Activated. All other admin records purged.')
}

async function supabaseRequest(urlPath, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL.replace('https://', ''),
      port: 443,
      path: urlPath,
      method: method,
      headers: {
        'apikey': SERVICE_ROLE,
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'application/json'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {})
        } catch (e) { resolve({}) }
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

runLockdown()
