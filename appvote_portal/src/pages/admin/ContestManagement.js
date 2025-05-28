import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../components/ui';
import { useContest } from '../../state/appContext';

/**
 * ContestManagement component - Admin interface for creating and managing contests
 * 
 * @returns {JSX.Element} Rendered contest management page
 */
const ContestManagement = () => {
  const { state, send } = useContest();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewContestModal, setShowNewContestModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Load contests
  useEffect(() => {
    if (!state || !state.context || !send) {
      return;
    }
    // In a complete implementation, we would load from the contest state:
    // setContests(state.context.contests || []);
    
    // For now, use mock data
    setTimeout(() => {
      setContests([
        {
          id: '1',
          name: 'Week 1 Contest',
          status: 'completed',
          start_date: '2023-05-01T00:00:00Z',
          end_date: '2023-05-07T23:59:59Z',
        },
        {
          id: '2',
          name: 'Week 2 Contest',
          status: 'active',
          start_date: '2023-05-08T00:00:00Z',
          end_date: '2023-05-14T23:59:59Z',
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  // Handle input change for new contest form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Contest name is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.endDate <= formData.startDate) {
      errors.endDate = 'End date must be after start date';
    }
    
    return errors;
  };
  
  // Create new contest
  const handleCreateContest = () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // In a complete implementation, we would dispatch to the state machine:
    // send({
    //   type: 'CREATE_CONTEST',
    //   name: formData.name,
    //   startDate: formData.startDate,
    //   endDate: formData.endDate
    // });
    
    // For now, just log and close the modal
    console.log('Creating contest:', formData);
    setShowNewContestModal(false);
    
    // Add to local state (mock)
    setContests([
      ...contests,
      {
        id: Date.now().toString(), // temporary ID
        name: formData.name,
        status: 'active',
        start_date: formData.startDate,
        end_date: formData.endDate
      }
    ]);
    
    // Reset form
    setFormData({
      name: '',
      startDate: '',
      endDate: ''
    });
    setFormErrors({});
  };
  
  // End a contest
  const handleEndContest = (contestId) => {
    // In a complete implementation:
    // send({
    //   type: 'END_CONTEST',
    //   contestId
    // });
    
    // For now, just update local state
    setContests(contests.map(contest => 
      contest.id === contestId 
        ? { ...contest, status: 'completed' }
        : contest
    ));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Contest Management</h1>
          <p>Create and manage app submission contests</p>
        </div>
        
        <Button onClick={() => setShowNewContestModal(true)}>
          Create New Contest
        </Button>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading contests...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Contests */}
          <div>
            <h2>Active Contests</h2>
            {contests.filter(c => c.status === 'active').length === 0 ? (
              <Card>
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <p>No active contests found.</p>
                </div>
              </Card>
            ) : (
              contests
                .filter(contest => contest.status === 'active')
                .map(contest => (
                  <Card key={contest.id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0' }}>{contest.name}</h3>
                        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>
                          {formatDate(contest.start_date)} - {formatDate(contest.end_date)}
                        </p>
                      </div>
                      
                      <div>
                        <Button variant="secondary" onClick={() => handleEndContest(contest.id)}>
                          End Contest
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
          
          {/* Completed Contests */}
          <div>
            <h2>Past Contests</h2>
            {contests.filter(c => c.status === 'completed').length === 0 ? (
              <Card>
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <p>No completed contests found.</p>
                </div>
              </Card>
            ) : (
              contests
                .filter(contest => contest.status === 'completed')
                .map(contest => (
                  <Card key={contest.id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0' }}>{contest.name}</h3>
                        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>
                          {formatDate(contest.start_date)} - {formatDate(contest.end_date)}
                        </p>
                        <p style={{ 
                          margin: '8px 0 0',
                          color: 'var(--status-success, green)',
                          fontWeight: 500
                        }}>
                          Completed
                        </p>
                      </div>
                      
                      <div>
                        <Button variant="outline">
                          View Results
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </div>
      )}
      
      {/* New Contest Modal */}
      <Modal
        isOpen={showNewContestModal}
        onClose={() => setShowNewContestModal(false)}
        title="Create New Contest"
        size="medium"
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowNewContestModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateContest}>
              Create Contest
            </Button>
          </div>
        }
      >
        <div>
          <Input
            id="contest-name"
            name="name"
            label="Contest Name"
            placeholder="e.g., Week 3 Contest"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            required
          />
          
          <Input
            id="start-date"
            name="startDate"
            label="Start Date"
            type="datetime-local"
            value={formData.startDate}
            onChange={handleInputChange}
            error={formErrors.startDate}
            required
          />
          
          <Input
            id="end-date"
            name="endDate"
            label="End Date"
            type="datetime-local"
            value={formData.endDate}
            onChange={handleInputChange}
            error={formErrors.endDate}
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default ContestManagement;
