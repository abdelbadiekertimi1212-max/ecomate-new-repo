const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://grywmjqfsounbhpnisny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyeXdtanFmc291bmJocG5pc255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI3NDI4NCwiZXhwIjoyMDg5ODUwMjg0fQ.9l6USMNHCvumCQkIFIp40RXIwXBZBUUBs-xndYL1NNE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDiagnostics() {
  console.log('--- Supabase Database Diagnostics ---');
  console.log(`Project ID: grywmjqfsounbhpnisny`);
  
  try {
    // 1. Connection Check
    const { data: tables, error: tableError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tableError) {
      console.error('❌ Error fetching tables:', tableError.message);
      return;
    }
    
    console.log('✅ Connection Successful');
    console.log(`Found ${tables.length} tables in public schema.`);
    
    const criticalTables = ['profiles', 'orders', 'products', 'inventory', 'categories'];
    for (const table of criticalTables) {
      const exists = tables.some(t => t.tablename === table);
      if (exists) {
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.log(`⚠️ Table [${table}]: Exists but error counting rows: ${countError.message}`);
        } else {
          console.log(`✅ Table [${table}]: Exists, Row Count: ${count}`);
        }
      } else {
        console.log(`❌ Table [${table}]: Missing!`);
      }
    }

    // 2. Performance/Health hint (Simple Query)
    const start = Date.now();
    await supabase.from('profiles').select('id').limit(1);
    const duration = Date.now() - start;
    console.log(`⏱️ Query Latency: ${duration}ms`);

  } catch (err) {
    console.error('❌ Unexpected Error:', err.message);
  }
}

runDiagnostics();
