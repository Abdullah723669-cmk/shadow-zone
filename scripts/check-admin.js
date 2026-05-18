const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAdmin() {
  const { data: users, error } = await supabase.from('users').select('*').eq('role', 'admin');
  if (error) {
    console.error('Error fetching admin users:', error);
    return;
  }
  
  if (users && users.length > 0) {
    console.log('Admin users found:', users);
    
    // Update the first admin user's password to 'admin123'
    const admin = users[0];
    const newHash = bcrypt.hashSync('admin123', 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: newHash })
      .eq('id', admin.id);
      
    if (updateError) {
      console.error('Error updating admin password:', updateError);
    } else {
      console.log('Admin password updated to "admin123" for email:', admin.email);
    }
  } else {
    console.log('No admin users found. Creating one...');
    const adminHash = bcrypt.hashSync('admin123', 10);
    const { data: newAdmin, error: insertError } = await supabase
      .from('users')
      .insert([{
        name: 'Admin',
        email: 'admin@shadowzone.com',
        password: adminHash,
        role: 'admin'
      }])
      .select();
      
    if (insertError) {
      console.error('Error creating admin:', insertError);
    } else {
      console.log('Created new admin user:', newAdmin[0].email, 'Password: admin123');
    }
  }
}

checkAdmin();
