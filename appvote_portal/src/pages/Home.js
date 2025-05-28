import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

/**
 * Home page component - Main landing page for the AppVote portal
 * 
 * @returns {JSX.Element} Rendered home page
 */
const Home = () => {
  return (
    <div className="container">
      <div className="hero">
        <div className="subtitle">App Submission & Voting Platform</div>
        
        <h1 className="title">AppVote Portal</h1>
        
        <div className="description">
          Submit your app, participate in contests, and vote for your favorites!
          <br />
          <small>Backend powered by Supabase</small>
        </div>
        
        <Button size="large" as={Link} to="/submit-app">Submit Your App</Button>
      </div>
      
      <div style={{ marginTop: '80px' }}>
        <h2>Current Contest</h2>
        <p>Vote for your favorite apps in our current contest!</p>
        
        <div style={{ marginTop: '20px' }}>
          <Card
            title="How It Works"
            subtitle="Easy steps to participate"
          >
            <ol style={{ paddingLeft: '20px' }}>
              <li>Sign up or log in to your account</li>
              <li>Submit your app during the active contest period</li>
              <li>Vote for up to 5 apps per contest (not including your own)</li>
              <li>Winners are announced after each contest ends</li>
            </ol>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <Button variant="outline" as={Link} to="/winners">Past Winners</Button>
              <Button as={Link} to="/submit-app">Submit App</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
