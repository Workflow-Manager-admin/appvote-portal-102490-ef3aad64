import supabase from './supabase';

/**
 * User Management Functions
 */

/**
 * PUBLIC_INTERFACE
 * Registers a new user with email and password
 * @param {string} email User email
 * @param {string} password User password 
 * @param {string} username User display name
 * @returns {Promise<{user: object|null, error: object|null}>} Result object with user data or error
 */
export const registerUser = async (email, password, username) => {
  // Register user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (authError) {
    return { user: null, error: authError };
  }
  
  // Add user details to the users table (role defaults to 'user')
  if (authData?.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        username,
        role: 'user'
      });
      
    if (profileError) {
      return { user: null, error: profileError };
    }
  }
  
  return { user: authData?.user || null, error: null };
};

/**
 * PUBLIC_INTERFACE
 * Login with email and password
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<{user: object|null, error: object|null}>} Result object with user data or error
 */
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { user: data?.user || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Logout the current user
 * @returns {Promise<{error: object|null}>} Result object with error if applicable
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * PUBLIC_INTERFACE
 * Get user profile by ID
 * @param {string} userId User ID
 * @returns {Promise<{profile: object|null, error: object|null}>} Result object with profile data or error
 */
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  return { profile: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Check if user has admin role
 * @param {string} userId User ID
 * @returns {Promise<boolean>} True if user is admin, false otherwise
 */
export const isUserAdmin = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
    
  if (error || !data) {
    return false;
  }
  
  return data.role === 'admin';
};

/**
 * Apps Management Functions
 */

/**
 * PUBLIC_INTERFACE
 * Submit a new app
 * @param {object} appData App data including name, link, description, image_url
 * @param {string} userId User ID of the submitter
 * @param {string} contestId Contest ID
 * @returns {Promise<{app: object|null, error: object|null}>} Result object with app data or error
 */
export const submitApp = async (appData, userId, contestId) => {
  const { data, error } = await supabase
    .from('apps')
    .insert({
      ...appData,
      user_id: userId,
      contest_id: contestId
    })
    .select()
    .single();
    
  return { app: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get app by ID
 * @param {string} appId App ID
 * @returns {Promise<{app: object|null, error: object|null}>} Result object with app data or error
 */
export const getAppById = async (appId) => {
  const { data, error } = await supabase
    .from('apps')
    .select('*, users(username)')
    .eq('id', appId)
    .single();
    
  return { app: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get all apps for a specific contest
 * @param {string} contestId Contest ID
 * @returns {Promise<{apps: array|null, error: object|null}>} Result object with apps data or error
 */
export const getAppsByContest = async (contestId) => {
  const { data, error } = await supabase
    .from('apps')
    .select('*, users(username)')
    .eq('contest_id', contestId);
    
  return { apps: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get apps submitted by a specific user
 * @param {string} userId User ID
 * @returns {Promise<{apps: array|null, error: object|null}>} Result object with apps data or error
 */
export const getUserApps = async (userId) => {
  const { data, error } = await supabase
    .from('apps')
    .select('*, contests(name)')
    .eq('user_id', userId);
    
  return { apps: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Update an existing app
 * @param {string} appId App ID
 * @param {object} appData Updated app data
 * @returns {Promise<{app: object|null, error: object|null}>} Result object with app data or error
 */
export const updateApp = async (appId, appData) => {
  const { data, error } = await supabase
    .from('apps')
    .update(appData)
    .eq('id', appId)
    .select()
    .single();
    
  return { app: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Delete an app
 * @param {string} appId App ID
 * @returns {Promise<{error: object|null}>} Result object with error if applicable
 */
export const deleteApp = async (appId) => {
  const { error } = await supabase
    .from('apps')
    .delete()
    .eq('id', appId);
    
  return { error };
};

/**
 * Voting Functions
 */

/**
 * PUBLIC_INTERFACE
 * Submit a vote for an app
 * @param {string} appId App ID
 * @param {string} userId User ID
 * @param {string} contestId Contest ID
 * @returns {Promise<{vote: object|null, error: object|null}>} Result object with vote data or error
 */
export const submitVote = async (appId, userId, contestId) => {
  // Check if the user has already voted for this app
  const { data: existingVotes, error: checkError } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('contest_id', contestId);
    
  if (checkError) {
    return { vote: null, error: checkError };
  }
  
  if (existingVotes && existingVotes.length > 0) {
    return { 
      vote: null, 
      error: { message: 'You have already voted for this app' } 
    };
  }
  
  // Check if the user has already used all 5 votes for this contest
  const { count, error: countError } = await supabase
    .from('votes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('contest_id', contestId);
    
  if (countError) {
    return { vote: null, error: countError };
  }
  
  if (count >= 5) {
    return { 
      vote: null, 
      error: { message: 'You have used all your votes for this contest' } 
    };
  }
  
  // Submit the vote
  const { data, error } = await supabase
    .from('votes')
    .insert({
      app_id: appId,
      user_id: userId,
      contest_id: contestId
    })
    .select()
    .single();
    
  return { vote: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get all votes for a specific app
 * @param {string} appId App ID
 * @returns {Promise<{votes: array|null, error: object|null}>} Result object with votes data or error
 */
export const getAppVotes = async (appId) => {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('app_id', appId);
    
  return { votes: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get all votes by a specific user in a contest
 * @param {string} userId User ID
 * @param {string} contestId Contest ID
 * @returns {Promise<{votes: array|null, error: object|null}>} Result object with votes data or error
 */
export const getUserVotesInContest = async (userId, contestId) => {
  const { data, error } = await supabase
    .from('votes')
    .select('*, apps(*)')
    .eq('user_id', userId)
    .eq('contest_id', contestId);
    
  return { votes: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Remove a vote
 * @param {string} voteId Vote ID
 * @returns {Promise<{error: object|null}>} Result object with error if applicable
 */
export const removeVote = async (voteId) => {
  const { error } = await supabase
    .from('votes')
    .delete()
    .eq('id', voteId);
    
  return { error };
};

/**
 * Contest Management Functions
 */

/**
 * PUBLIC_INTERFACE
 * Create a new contest
 * @param {object} contestData Contest data including name, start_date, end_date
 * @returns {Promise<{contest: object|null, error: object|null}>} Result object with contest data or error
 */
export const createContest = async (contestData) => {
  const { data, error } = await supabase
    .from('contests')
    .insert({
      ...contestData,
      status: 'active'
    })
    .select()
    .single();
    
  return { contest: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get contest by ID
 * @param {string} contestId Contest ID
 * @returns {Promise<{contest: object|null, error: object|null}>} Result object with contest data or error
 */
export const getContestById = async (contestId) => {
  const { data, error } = await supabase
    .from('contests')
    .select('*')
    .eq('id', contestId)
    .single();
    
  return { contest: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get all contests
 * @returns {Promise<{contests: array|null, error: object|null}>} Result object with contests data or error
 */
export const getAllContests = async () => {
  const { data, error } = await supabase
    .from('contests')
    .select('*')
    .order('start_date', { ascending: false });
    
  return { contests: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get currently active contest
 * @returns {Promise<{contest: object|null, error: object|null}>} Result object with contest data or error
 */
export const getActiveContest = async () => {
  const { data, error } = await supabase
    .from('contests')
    .select('*')
    .eq('status', 'active')
    .single();
    
  return { contest: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Update contest status
 * @param {string} contestId Contest ID
 * @param {string} status New status ('active' or 'completed')
 * @returns {Promise<{contest: object|null, error: object|null}>} Result object with contest data or error
 */
export const updateContestStatus = async (contestId, status) => {
  const { data, error } = await supabase
    .from('contests')
    .update({ status })
    .eq('id', contestId)
    .select()
    .single();
    
  return { contest: data || null, error };
};

/**
 * Winners Management Functions
 */

/**
 * PUBLIC_INTERFACE
 * Declare winners for a contest
 * @param {string} contestId Contest ID
 * @param {array} winners Array of objects with app_id and rank
 * @returns {Promise<{winners: array|null, error: object|null}>} Result object with winners data or error
 */
export const declareWinners = async (contestId, winners) => {
  // Format the winners data for insertion
  const winnersData = winners.map(winner => ({
    contest_id: contestId,
    app_id: winner.appId,
    rank: winner.rank
  }));
  
  const { data, error } = await supabase
    .from('winners')
    .insert(winnersData)
    .select();
    
  return { winners: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get winners for a specific contest
 * @param {string} contestId Contest ID
 * @returns {Promise<{winners: array|null, error: object|null}>} Result object with winners data or error
 */
export const getContestWinners = async (contestId) => {
  const { data, error } = await supabase
    .from('winners')
    .select('*, apps(*), contests(*)')
    .eq('contest_id', contestId)
    .order('rank', { ascending: true });
    
  return { winners: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Get top apps for a contest with vote counts
 * @param {string} contestId Contest ID
 * @param {number} limit Number of apps to return (default: 10)
 * @returns {Promise<{apps: array|null, error: object|null}>} Result object with apps data or error
 */
export const getTopAppsForContest = async (contestId, limit = 10) => {
  // This requires a custom query to count votes
  const { data, error } = await supabase
    .rpc('get_top_apps', { 
      contest_id_param: contestId,
      limit_param: limit
    });
    
  return { apps: data || null, error };
};

/**
 * Helper Functions for Admin Operations
 */

/**
 * PUBLIC_INTERFACE
 * Get all users (admin only)
 * @returns {Promise<{users: array|null, error: object|null}>} Result object with users data or error
 */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
    
  return { users: data || null, error };
};

/**
 * PUBLIC_INTERFACE
 * Update user role (admin only)
 * @param {string} userId User ID
 * @param {string} role New role ('user' or 'admin')
 * @returns {Promise<{user: object|null, error: object|null}>} Result object with user data or error
 */
export const updateUserRole = async (userId, role) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();
    
  return { user: data || null, error };
};
