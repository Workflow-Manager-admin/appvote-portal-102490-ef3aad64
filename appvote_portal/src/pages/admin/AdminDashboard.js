import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui';

/**
 * AdminDashboard component - Admin control panel for monitoring apps, users, and contests
 * 
 * @returns {JSX.Element} Rendered admin dashboard
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalApps: 0,
    totalUsers: 0,
    totalVotes: 0,
    activeContests: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  // Simulate data loading in useEffect
  useEffect(() => {
    // In a complete implementation, we would fetch real data from the backend
    // For now, use mock data
    setTimeout(() => {
      setStats({
        totalApps: 42,
        totalUsers: 128,
        totalVotes: 376,
        activeContests: 1
      });
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <h1>Admin Dashboard</h1>
      <p>Manage app submissions, contests, and user data</p>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '16px',
            marginTop: '24px'
          }}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--primary-main)' }}>{stats.totalApps}</h3>
                <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>App Submissions</p>
              </div>
            </Card>
            
            <Card>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--primary-main)' }}>{stats.totalUsers}</h3>
                <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>Registered Users</p>
              </div>
            </Card>
            
            <Card>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--primary-main)' }}>{stats.totalVotes}</h3>
                <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>Total Votes</p>
              </div>
            </Card>
            
            <Card>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--primary-main)' }}>{stats.activeContests}</h3>
                <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>Active Contests</p>
              </div>
            </Card>
          </div>
          
          {/* Recent Activity Section */}
          <div style={{ marginTop: '32px' }}>
            <h2>Recent Activity</h2>
            <Card>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border-light)' }}>Event</th>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border-light)' }}>User</th>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border-light)' }}>Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>New App Submission</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>user123@example.com</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>2 hours ago</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>New User Registration</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>newuser@example.com</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>3 hours ago</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>Vote Submitted</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>voter@example.com</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>5 hours ago</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
          
          {/* Quick Links Section */}
          <div style={{ marginTop: '32px', marginBottom: '32px' }}>
            <h2>Admin Actions</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '16px'
            }}>
              <Card
                title="Contest Management"
                subtitle="Create, edit and manage contests"
              >
                <p>Start a new contest or manage existing ones.</p>
                <div style={{ marginTop: '16px' }}>
                  <a 
                    href="/admin/contests"
                    style={{ 
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: 'var(--primary-main)',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    Manage Contests
                  </a>
                </div>
              </Card>
              
              <Card
                title="App Review"
                subtitle="Review submitted applications"
              >
                <p>Review submitted apps and moderation tools.</p>
                <div style={{ marginTop: '16px' }}>
                  <a 
                    href="#app-review"
                    style={{ 
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: 'var(--primary-main)',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    Review Apps
                  </a>
                </div>
              </Card>
              
              <Card
                title="User Management"
                subtitle="Manage user accounts"
              >
                <p>View and manage user accounts and roles.</p>
                <div style={{ marginTop: '16px' }}>
                  <a 
                    href="#user-management"
                    style={{ 
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: 'var(--primary-main)',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    Manage Users
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
