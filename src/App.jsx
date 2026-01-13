import React, { useState, useEffect } from 'react';

function App() {
  const [screen, setScreen] = useState('onboarding');
  const [userData, setUserData] = useState({
    isTeenMode: false,
    goal: '',
    checkIn: {
      sleep: '',
      energy: '',
      mood: '',
      soreness: '',
      movement: ''
    },
    readinessLevel: '',
    currentActivity: null,
    activityHistory: [],
    weeklyData: []
  });

  // Onboarding Screen
  const OnboardingScreen = () => (
    <div className="screen">
      <div className="header">
        <div className="logo">💪</div>
        <h1 className="title">Welcome to FitSense</h1>
        <p className="subtitle">Smart fitness for real people</p>
      </div>
      <div className="content">
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Are you under 18?</h3>
          <div className="button-group">
            <button 
              className="button"
              onClick={() => {
                setUserData({ ...userData, isTeenMode: true });
                setScreen('goal-selection');
              }}
            >
              Yes (Teen Safety Mode ON)
            </button>
            <button 
              className="button button-secondary"
              onClick={() => {
                setUserData({ ...userData, isTeenMode: false });
                setScreen('goal-selection');
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Goal Selection Screen
  const GoalSelectionScreen = () => (
    <div className="screen">
      <div className="header">
        <h1 className="title">What matters to you?</h1>
        <p className="subtitle">Choose what feels right today</p>
      </div>
      <div className="content">
        <div className="button-group">
          {['Energy', 'Consistency', 'Confidence'].map(goal => (
            <button
              key={goal}
              className={`option-button ${userData.goal === goal ? 'selected' : ''}`}
              onClick={() => setUserData({ ...userData, goal })}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                {goal === 'Energy' ? '⚡' : goal === 'Consistency' ? '📅' : '💫'}
              </div>
              <div style={{ fontWeight: '600' }}>{goal}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="footer">
        <button 
          className="button"
          disabled={!userData.goal}
          onClick={() => setScreen('daily-checkin')}
        >
          Continue
        </button>
      </div>
    </div>
  );

  // Daily Check-In Screen
  const DailyCheckInScreen = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const questions = [
      { key: 'sleep', label: 'How did you sleep?', options: [{ emoji: '😴', label: 'Poor', value: 'poor' }, { emoji: '😊', label: 'Okay', value: 'okay' }, { emoji: '😄', label: 'Good', value: 'good' }] },
      { key: 'energy', label: 'Energy level?', options: [{ emoji: '🔋', label: 'Low', value: 'low' }, { emoji: '⚡', label: 'Medium', value: 'medium' }, { emoji: '🚀', label: 'High', value: 'high' }] },
      { key: 'mood', label: 'How are you feeling?', options: [{ emoji: '😊', label: 'Happy', value: 'happy' }, { emoji: '😐', label: 'Neutral', value: 'neutral' }, { emoji: '😔', label: 'Low', value: 'low' }] },
      { key: 'soreness', label: 'Body soreness?', options: [{ emoji: '✨', label: 'None', value: 'none' }, { emoji: '💪', label: 'Light', value: 'light' }, { emoji: '😣', label: 'Heavy', value: 'heavy' }] },
      { key: 'movement', label: 'Yesterday movement?', options: [{ emoji: '🎯', label: 'Yes', value: 'yes' }, { emoji: '🚶', label: 'A little', value: 'little' }, { emoji: '🛋️', label: 'No', value: 'no' }] }
    ];

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    const handleAnswer = (value) => {
      const newCheckIn = { ...userData.checkIn, [currentQuestion.key]: value };
      setUserData({ ...userData, checkIn: newCheckIn });
      
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Calculate readiness
        calculateReadiness(newCheckIn);
      }
    };

    const calculateReadiness = (checkIn) => {
      let score = 0;
      if (checkIn.sleep === 'good') score += 2;
      if (checkIn.sleep === 'okay') score += 1;
      if (checkIn.energy === 'high') score += 2;
      if (checkIn.energy === 'medium') score += 1;
      if (checkIn.mood === 'happy') score += 1;
      if (checkIn.soreness === 'none') score += 2;
      if (checkIn.soreness === 'light') score += 1;
      if (checkIn.movement === 'no') score += 1;

      let level = 'green';
      if (score <= 3) level = 'red';
      else if (score <= 6) level = 'yellow';

      setUserData({ ...userData, checkIn, readinessLevel: level });
      setScreen('readiness-result');
    };

    return (
      <div className="screen">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="header">
          <h1 className="title">Daily Check-In</h1>
          <p className="subtitle">Help us understand how you feel today</p>
        </div>
        <div className="content">
          <div className="card">
            <div className="question-label">{currentQuestion.label}</div>
            <div className="emoji-options">
              {currentQuestion.options.map(option => (
                <button
                  key={option.value}
                  className={`emoji-button ${userData.checkIn[currentQuestion.key] === option.value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Readiness Result Screen
  const ReadinessResultScreen = () => {
    const messages = {
      green: { icon: '🌟', title: 'Your body feels ready today', message: 'Great energy! Let\'s make the most of it.' },
      yellow: { icon: '🌤️', title: 'Let\'s keep it light and easy', message: 'Your body needs gentle movement today.' },
      red: { icon: '🌙', title: 'Rest helps you grow', message: 'Today still counts. Recovery is progress.' }
    };

    const current = messages[userData.readinessLevel];

    return (
      <div className="screen">
        <div className="content">
          <div className={`status-card ${userData.readinessLevel}`}>
            <div className="status-icon">{current.icon}</div>
            <div className="status-title">{current.title}</div>
            <div className="status-message">{current.message}</div>
          </div>
          <button 
            className="button"
            onClick={() => setScreen('smart-action')}
          >
            See Today's Action
          </button>
        </div>
      </div>
    );
  };

  // Smart Action Screen
  const SmartActionScreen = () => {
    const getRecommendation = () => {
      const { readinessLevel, checkIn } = userData;
      
      if (readinessLevel === 'red') {
        return {
          type: 'rest',
          title: 'Full Rest Day',
          duration: 'All day',
          intensity: 'None',
          reason: 'Your body needs recovery to come back stronger',
          emoji: '🌙'
        };
      }
      
      if (readinessLevel === 'yellow') {
        if (checkIn.soreness === 'heavy') {
          return {
            type: 'stretch',
            title: 'Gentle Stretching',
            duration: '10 minutes',
            intensity: 'Easy',
            reason: 'Light movement helps sore muscles recover',
            emoji: '🧘'
          };
        }
        return {
          type: 'walk',
          title: 'Easy Walk',
          duration: '15 minutes',
          intensity: 'Easy',
          reason: 'Fresh air and light movement boost your mood',
          emoji: '🚶'
        };
      }
      
      // Green level
      if (checkIn.movement === 'no') {
        return {
          type: 'workout',
          title: 'Bodyweight Basics',
          duration: '15 minutes',
          intensity: 'Moderate',
          reason: 'Your body is ready for some movement',
          emoji: '💪'
        };
      }
      
      return {
        type: 'workout',
        title: 'Full Body Flow',
        duration: '20 minutes',
        intensity: 'Moderate',
        reason: 'You\'re feeling great - let\'s build on yesterday',
        emoji: '🔥'
      };
    };

    const recommendation = getRecommendation();

    return (
      <div className="screen">
        <div className="header">
          <h1 className="title">Today's Smart Action</h1>
          <p className="subtitle">Personalized just for you</p>
        </div>
        <div className="content">
          <div className="activity-card">
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{recommendation.emoji}</div>
            <div className="activity-title">{recommendation.title}</div>
            <div className="activity-details">
              <div className="activity-detail">
                <span>⏱️</span>
                <span>{recommendation.duration}</span>
              </div>
              <div className="activity-detail">
                <span>📊</span>
                <span>{recommendation.intensity}</span>
              </div>
            </div>
            <div className="activity-reason">{recommendation.reason}</div>
          </div>
          
          {recommendation.type !== 'rest' && (
            <button 
              className="button"
              onClick={() => {
                setUserData({ ...userData, currentActivity: recommendation });
                setScreen('activity-player');
              }}
            >
              Start Activity
            </button>
          )}
          
          <button 
            className="button button-secondary"
            onClick={() => setScreen('weekly-insights')}
            style={{ marginTop: '12px' }}
          >
            View Weekly Insights
          </button>
        </div>
      </div>
    );
  };

  // Activity Player Screen
  const ActivityPlayerScreen = () => {
    const [timeLeft, setTimeLeft] = useState(300);
    const [isRunning, setIsRunning] = useState(false);
    const activity = userData.currentActivity;

    useEffect(() => {
      let interval;
      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(time => time - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        handleComplete();
      }
      return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleComplete = () => {
      setScreen('post-activity');
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="screen">
        <div className="content">
          <div className="timer">
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <div className="exercise-name">{activity?.title}</div>
            
            <div className="button-group">
              <button 
                className="button"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? '⏸️ Pause' : '▶️ Start'}
              </button>
              <button 
                className="button button-secondary"
                onClick={handleComplete}
              >
                Stop Anytime - That's Okay!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Post Activity Screen
  const PostActivityScreen = () => {
    const praises = [
      { text: 'Nice job showing up today', suggestion: 'Tomorrow will feel easier' },
      { text: 'You did it! That\'s what matters', suggestion: 'Consistency beats intensity every time' },
      { text: 'Every step counts', suggestion: 'Your body thanks you for moving' },
      { text: 'You\'re building a healthy habit', suggestion: 'Keep this momentum going' }
    ];

    const praise = praises[Math.floor(Math.random() * praises.length)];

    return (
      <div className="screen">
        <div className="content">
          <div className="praise-card">
            <div className="praise-icon">🎉</div>
            <div className="praise-text">{praise.text}</div>
            <div className="suggestion-text">{praise.suggestion}</div>
          </div>
          
          <button 
            className="button"
            onClick={() => setScreen('weekly-insights')}
          >
            View Your Progress
          </button>
          
          <button 
            className="button button-secondary"
            onClick={() => setScreen('daily-checkin')}
            style={{ marginTop: '12px' }}
          >
            Done for Today
          </button>
        </div>
      </div>
    );
  };

  // Weekly Insights Screen
  const WeeklyInsightsScreen = () => {
    const insights = [
      'You feel better on days you sleep well',
      'Light movement helps when you\'re sore',
      'You\'ve shown up 4 days this week - that\'s amazing',
      'Your energy is highest in the mornings',
      'Rest days help you perform better'
    ];

    return (
      <div className="screen">
        <div className="header">
          <h1 className="title">Your Weekly Insights</h1>
          <p className="subtitle">What we learned together</p>
        </div>
        <div className="content">
          {insights.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-text">💡 {insight}</div>
            </div>
          ))}
          
          <button 
            className="button"
            onClick={() => setScreen('profile')}
            style={{ marginTop: '20px' }}
          >
            View Safety Settings
          </button>
        </div>
      </div>
    );
  };

  // Profile & Safety Screen
  const ProfileScreen = () => (
    <div className="screen">
      <div className="header">
        <h1 className="title">Safety & Settings</h1>
        <p className="subtitle">Your well-being comes first</p>
      </div>
      <div className="content">
        {userData.isTeenMode && (
          <div className="safety-section">
            <div className="safety-title">🛡️ Teen Safety Mode Active</div>
            <ul className="safety-list">
              <li>No calorie counting</li>
              <li>No supplement recommendations</li>
              <li>No extreme workouts</li>
              <li>Focus on health, not appearance</li>
              <li>Rest is always encouraged</li>
            </ul>
          </div>
        )}
        
        <div className="safety-section">
          <div className="safety-title">Our Promise to You</div>
          <ul className="safety-list">
            <li>We never shame you</li>
            <li>We never push through pain</li>
            <li>We never promote fast results</li>
            <li>Rest days are progress</li>
            <li>Consistency over intensity</li>
          </ul>
        </div>
        
        <button 
          className="button"
          onClick={() => setScreen('daily-checkin')}
        >
          Back to Check-In
        </button>
      </div>
    </div>
  );

  // Screen Router
  const renderScreen = () => {
    switch (screen) {
      case 'onboarding': return <OnboardingScreen />;
      case 'goal-selection': return <GoalSelectionScreen />;
      case 'daily-checkin': return <DailyCheckInScreen />;
      case 'readiness-result': return <ReadinessResultScreen />;
      case 'smart-action': return <SmartActionScreen />;
      case 'activity-player': return <ActivityPlayerScreen />;
      case 'post-activity': return <PostActivityScreen />;
      case 'weekly-insights': return <WeeklyInsightsScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <OnboardingScreen />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;