# AppVote Portal - Supabase Setup

This document provides instructions for setting up Supabase for the AppVote Portal application.

## 1. Create a Supabase Project

1. Sign up for a Supabase account at [supabase.com](https://supabase.com) if you haven't already.
2. Create a new project from the Supabase dashboard.
3. Make note of your project URL and API keys (found in Project Settings > API).

## 2. Configure Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

For production deployment, set these environment variables in your hosting platform.

## 3. Set Up the Database Schema

1. In the Supabase dashboard, navigate to the SQL Editor.
2. Create a new query.
3. Copy the entire content of the `supabaseSchema.sql` file in this directory.
4. Execute the query to create all tables, functions, and policies.

## 4. Configure Authentication

1. In the Supabase dashboard, go to Authentication > Settings.
2. Under Email Auth, make sure "Enable Email Signup" is turned on.
3. Configure site URL and redirect URLs (for your local and production environments).
4. Set up any additional auth providers as needed.

## 5. Create Storage Buckets

1. Go to Storage in the Supabase dashboard.
2. Create a bucket named `app-images` for storing app preview images.
3. Set the bucket privacy to either:
   - **Public** - if you want images to be accessible without authentication
   - **Authenticated** - if you want only authenticated users to access images

4. Set up the CORS configuration for your bucket:
   ```json
   [
     {
       "origin": "*",
       "methods": ["GET", "POST", "PUT", "DELETE"],
       "allowedHeaders": ["*"]
     }
   ]
   ```

## 6. Create an Admin User

1. Register a new user through the application.
2. In the Supabase SQL Editor, run the following query to make this user an admin:
   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```

## 7. Testing the Setup

1. After completing the setup, restart your application.
2. Test user registration and login functionality.
3. Create a test contest as an admin user.
4. Try submitting an app to the contest.
5. Test the voting system with multiple test users.

## Common Issues and Troubleshooting

### Authentication Issues
- Make sure the redirect URLs are properly set in the Supabase Auth settings.
- Check that your environment variables are correctly set.

### Row Level Security Errors
- Ensure you're properly signed in when testing admin features.
- Verify that the RLS policies are correctly applied by checking the SQL logs in Supabase.

### Storage Issues
- Verify the bucket permissions match your requirements.
- Ensure the CORS configuration allows requests from your application domain.

## Using the Helper Functions

The `supabaseSchemaSetup.js` file provides helper functions for common database operations. Import these functions in your components to interact with the Supabase database. For example:

```javascript
import { submitApp, getActiveContest } from '../services/supabaseSchemaSetup';

// In a component function
const handleSubmitApp = async (appData) => {
  const { contest } = await getActiveContest();
  if (contest) {
    const { app, error } = await submitApp(appData, userId, contest.id);
    // Handle response
  }
};
```

For more information, refer to the [Supabase documentation](https://supabase.com/docs).
