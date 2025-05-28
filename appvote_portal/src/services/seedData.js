import supabase from './supabase';

/**
 * This file contains functions to seed initial data into the database.
 * Useful for development and testing purposes.
 * 
 * IMPORTANT: This should never be used in production!
 */

/**
 * Seeds the database with sample data for testing
 * @returns {Promise<{success: boolean, error: object|null}>} Result of the seeding operation
 */
export const seedDatabase = async () => {
  try {
    // Check if we already have data to avoid duplicate seeding
    const { data: existingUsers } = await supabase.from('users').select('id');
    if (existingUsers && existingUsers.length > 0) {
      console.log('Database already contains data, skipping seed operation');
      return { success: true, error: null };
    }

    // Create an admin user - this requires the user to already exist in Supabase Auth
    // You'll need to replace this UUID with a real user UUID from your Auth
    const adminId = 'replace-with-actual-admin-uuid';
    
    // Add admin user to users table
    await supabase.from('users').insert({
      id: adminId,
      email: 'admin@example.com',
      username: 'Admin User',
      role: 'admin'
    });
    
    // Create sample contests
    const { data: contest1 } = await supabase
      .from('contests')
      .insert({
        name: 'Week 1 Contest',
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      })
      .select()
      .single();
      
    await supabase
      .from('contests')
      .insert({
        name: 'Week 2 Contest',
        status: 'completed',
        start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      });
      
    // Create sample users (non-admin)
    const { data: user1 } = await supabase
      .from('users')
      .insert({
        email: 'user1@example.com',
        username: 'Demo User 1',
        role: 'user'
      })
      .select()
      .single();
      
    const { data: user2 } = await supabase
      .from('users')
      .insert({
        email: 'user2@example.com',
        username: 'Demo User 2',
        role: 'user'
      })
      .select()
      .single();
      
    // Create sample apps
    const { data: app1 } = await supabase
      .from('apps')
      .insert({
        user_id: user1.id,
        contest_id: contest1.id,
        name: 'Cool Weather App',
        link: 'https://example.com/weather-app',
        image_url: 'https://via.placeholder.com/300x200?text=Weather+App',
        description: 'A beautifully designed weather application with real-time updates.'
      })
      .select()
      .single();
      
    const { data: app2 } = await supabase
      .from('apps')
      .insert({
        user_id: user2.id,
        contest_id: contest1.id,
        name: 'Task Manager Pro',
        link: 'https://example.com/task-app',
        image_url: 'https://via.placeholder.com/300x200?text=Task+Manager',
        description: 'Stay organized with this intuitive task management application.'
      })
      .select()
      .single();
      
    // Add some votes
    await supabase.from('votes').insert([
      { user_id: user1.id, app_id: app2.id, contest_id: contest1.id },
      { user_id: user2.id, app_id: app1.id, contest_id: contest1.id }
    ]);
    
    console.log('Database seeded successfully');
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
};

/**
 * Clears all data from the database (for development only)
 * @returns {Promise<{success: boolean, error: object|null}>} Result of the operation
 */
export const clearDatabase = async () => {
  try {
    // Clear tables in reverse order of dependencies
    await supabase.from('winners').delete().gt('id', '0');
    await supabase.from('votes').delete().gt('id', '0');
    await supabase.from('apps').delete().gt('id', '0');
    await supabase.from('contests').delete().gt('id', '0');
    await supabase.from('users').delete().gt('id', '0');
    
    console.log('Database cleared successfully');
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error clearing database:', error);
    return { success: false, error };
  }
};

export default seedDatabase;
