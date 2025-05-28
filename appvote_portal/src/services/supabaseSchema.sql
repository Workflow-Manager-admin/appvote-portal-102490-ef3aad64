-- AppVote Portal Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE users IS 'User accounts for the AppVote Portal';
COMMENT ON COLUMN users.id IS 'Unique identifier for user, matches Supabase Auth UUID';
COMMENT ON COLUMN users.email IS 'User email address';
COMMENT ON COLUMN users.username IS 'User display name';
COMMENT ON COLUMN users.role IS 'User role - either user or admin';

-- Contests table
CREATE TABLE IF NOT EXISTS contests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed')) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date > start_date)
);
COMMENT ON TABLE contests IS 'App submission contests';
COMMENT ON COLUMN contests.id IS 'Unique identifier for contest';
COMMENT ON COLUMN contests.name IS 'Contest name (e.g., "Week 1")';
COMMENT ON COLUMN contests.status IS 'Contest status - either active or completed';
COMMENT ON COLUMN contests.start_date IS 'Contest start date and time';
COMMENT ON COLUMN contests.end_date IS 'Contest end date and time';

-- Apps table
CREATE TABLE IF NOT EXISTS apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    link TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE apps IS 'App submissions';
COMMENT ON COLUMN apps.id IS 'Unique identifier for app submission';
COMMENT ON COLUMN apps.user_id IS 'User who submitted the app';
COMMENT ON COLUMN apps.contest_id IS 'Contest the app was submitted to';
COMMENT ON COLUMN apps.name IS 'App name';
COMMENT ON COLUMN apps.link IS 'Link to the app';
COMMENT ON COLUMN apps.image_url IS 'Preview image URL for the app';
COMMENT ON COLUMN apps.description IS 'App description';

-- Create indexes for apps table for better query performance
CREATE INDEX IF NOT EXISTS idx_apps_user_id ON apps(user_id);
CREATE INDEX IF NOT EXISTS idx_apps_contest_id ON apps(contest_id);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (app_id, user_id, contest_id) -- Prevent duplicate votes
);
COMMENT ON TABLE votes IS 'User votes for apps';
COMMENT ON COLUMN votes.id IS 'Unique identifier for vote';
COMMENT ON COLUMN votes.app_id IS 'App being voted for';
COMMENT ON COLUMN votes.user_id IS 'User who cast the vote';
COMMENT ON COLUMN votes.contest_id IS 'Contest the vote belongs to';

-- Create indexes for votes table for better query performance
CREATE INDEX IF NOT EXISTS idx_votes_app_id ON votes(app_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_contest_id ON votes(contest_id);

-- Winners table
CREATE TABLE IF NOT EXISTS winners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 3), -- Top 3 winners
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (contest_id, rank) -- Prevent duplicate ranks for same contest
);
COMMENT ON TABLE winners IS 'Contest winners';
COMMENT ON COLUMN winners.id IS 'Unique identifier for winner record';
COMMENT ON COLUMN winners.contest_id IS 'Contest the winner belongs to';
COMMENT ON COLUMN winners.app_id IS 'Winning app';
COMMENT ON COLUMN winners.rank IS 'Winner rank (1-3)';

-- Create indexes for winners table for better query performance
CREATE INDEX IF NOT EXISTS idx_winners_contest_id ON winners(contest_id);
CREATE INDEX IF NOT EXISTS idx_winners_app_id ON winners(app_id);

-- Create a function to get top apps by vote count for a contest
CREATE OR REPLACE FUNCTION get_top_apps(contest_id_param UUID, limit_param INTEGER)
RETURNS TABLE (
    app_id UUID,
    app_name TEXT,
    app_link TEXT,
    app_image_url TEXT,
    app_description TEXT,
    user_id UUID,
    username TEXT,
    vote_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id as app_id,
        a.name as app_name,
        a.link as app_link,
        a.image_url as app_image_url,
        a.description as app_description,
        a.user_id as user_id,
        u.username as username,
        COUNT(v.id)::BIGINT as vote_count
    FROM apps a
    JOIN users u ON a.user_id = u.id
    LEFT JOIN votes v ON a.id = v.app_id
    WHERE a.contest_id = contest_id_param
    GROUP BY a.id, a.name, a.link, a.image_url, a.description, a.user_id, u.username
    ORDER BY vote_count DESC
    LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Security policies (Row Level Security) 
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- Users policies
-- Everyone can read users
CREATE POLICY users_select ON users FOR SELECT USING (true);
-- Only the user or admins can update their own profile
CREATE POLICY users_update ON users FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
-- Only admins can delete users
CREATE POLICY users_delete ON users FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Apps policies
-- Everyone can read apps
CREATE POLICY apps_select ON apps FOR SELECT USING (true);
-- Only the owner can update their apps
CREATE POLICY apps_update ON apps FOR UPDATE USING (auth.uid() = user_id);
-- Only the owner or admins can delete apps
CREATE POLICY apps_delete ON apps FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
-- Users can insert apps only during active contests
CREATE POLICY apps_insert ON apps FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM contests
        WHERE id = contest_id 
        AND status = 'active'
        AND CURRENT_TIMESTAMP BETWEEN start_date AND end_date
    )
);

-- Votes policies
-- Everyone can read votes
CREATE POLICY votes_select ON votes FOR SELECT USING (true);
-- Only the voter can delete their own votes
CREATE POLICY votes_delete ON votes FOR DELETE USING (auth.uid() = user_id);
-- Users can only vote during active contests and not for their own apps
CREATE POLICY votes_insert ON votes FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM contests
        WHERE id = contest_id 
        AND status = 'active'
        AND CURRENT_TIMESTAMP BETWEEN start_date AND end_date
    ) AND
    NOT EXISTS (
        SELECT 1 FROM apps
        WHERE id = app_id AND user_id = auth.uid()
    )
);

-- Contests policies
-- Everyone can read contests
CREATE POLICY contests_select ON contests FOR SELECT USING (true);
-- Only admins can create, update or delete contests
CREATE POLICY contests_insert ON contests FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY contests_update ON contests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY contests_delete ON contests FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Winners policies
-- Everyone can read winners
CREATE POLICY winners_select ON winners FOR SELECT USING (true);
-- Only admins can create, update or delete winners
CREATE POLICY winners_insert ON winners FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY winners_update ON winners FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY winners_delete ON winners FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Initial admin user (replace with your own email/username)
-- Note: This will need to be manually inserted after the user signs up through Supabase Auth
-- INSERT INTO users (id, email, username, role) 
-- VALUES ('REPLACE_WITH_USER_UUID', 'admin@example.com', 'Admin User', 'admin');
