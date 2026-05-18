const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixMissingStock() {
  console.log('Fetching all products...');
  const { data: products, error: pError } = await supabase.from('products').select('id, name');
  if (pError) throw pError;

  console.log('Fetching all stock...');
  const { data: stock, error: sError } = await supabase.from('stock').select('product_id');
  if (sError) throw sError;

  const stockProductIds = new Set(stock.map(s => s.product_id));
  
  const missingStockProducts = products.filter(p => !stockProductIds.has(p.id));
  
  if (missingStockProducts.length === 0) {
    console.log('All products have stock entries!');
    return;
  }

  console.log(`Found ${missingStockProducts.length} products missing stock entries. Creating them...`);
  
  const newStockEntries = missingStockProducts.map(p => ({
    product_id: p.id,
    quantity: 0
  }));

  const { error: insertError } = await supabase.from('stock').insert(newStockEntries);
  
  if (insertError) {
    console.error('Failed to create missing stock entries:', insertError);
  } else {
    console.log('Successfully created missing stock entries!');
  }
}

fixMissingStock();
