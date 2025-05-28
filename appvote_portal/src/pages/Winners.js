import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui';
import { useContest } from '../state/appContext';

/**
 * Winners page component - Displays winners from past contests
 * 
 * @returns {JSX.Element} Rendered winners page
 */
const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useContest();

  // Simulated winner data (would be fetched from state/context in full implementation)
  useEffect(() => {
    // Placeholder for loading winners from contest state
    setLoading(false);
    
    // In a complete implementation, we would load real data:
    // const contestWinners = state.context.winners;
    // setWinners(contestWinners);
  }, []);

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <h1>Contest Winners</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading winners...</p>
        </div>
      ) : winners && winners.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
          {winners.map((winner) => (
            <Card
              key={winner.id}
              title={`${winner.rank === 1 ? '🏆 ' : winner.rank === 2 ? '🥈 ' : '🥉 '}${winner.app.name}`}
              subtitle={`Rank #${winner.rank} - ${winner.contest.name}`}
            >
              <div>
                {winner.app.image_url && (
                  <img 
                    src={winner.app.image_url} 
                    alt={winner.app.name} 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '12px' }}
                  />
                )}
                <p>{winner.app.description}</p>
                <p style={{ marginTop: '12px' }}>
                  <a 
                    href={winner.app.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary-main)' }}
                  >
                    Visit App
                  </a>
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'var(--background-light)', borderRadius: '8px', marginTop: '24px' }}>
          <p>No contest winners have been declared yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
};

export default Winners;
