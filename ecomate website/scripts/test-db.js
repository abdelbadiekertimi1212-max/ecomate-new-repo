const { createServerClient } = require('@supabase/ssr');

async function test() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log('Testing URL:', url);
  
  try {
    const res = await fetch(`${url}/rest/v1/partners?select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      },
      signal: AbortSignal.timeout(5000)
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data found:', !!data);
  } catch (e) {
    console.error('Fetch Error:', e.message);
  }
}

test();
