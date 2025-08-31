import React, { useState, useEffect } from 'react';
import './styles.css';

const API = process.env.REACT_APP_API || 'http://localhost:5000';

function App(){
  const [token, setToken] = useState(localStorage.getItem('ft_token') || '');
  const [view, setView] = useState('landing');
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({name:'Running', hours:0, minutes:30});

  useEffect(() => {
    if (token) {
      fetchActivities();
    }
  }, [token]);

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  // Function to handle view changes with authentication check
  const handleViewChange = (newView) => {
    // Views that require authentication
    const protectedViews = ['dashboard', 'diet', 'expert'];
    
    if (protectedViews.includes(newView) && !isAuthenticated()) {
      alert('Please log in to access this page'); 
      setView('login');
      return;
    }
    
    setView(newView);
  };

  async function fetchActivities(){
    if (!token) return;
    
    const res = await fetch(`${API}/api/activities`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if(res.ok){
      const data = await res.json();
      setActivities(data);
    } else {
      console.error('Failed to load activities');
    }
  }

  async function handleRegister(e){
    e.preventDefault();
    const formEl = e.target;
    const body = {
      username: formEl.username.value,
      email: formEl.email.value,
      password: formEl.password.value
    };
    const res = await fetch(`${API}/api/auth/register`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    const data = await res.json();
    alert(data.message || JSON.stringify(data));
  }

  async function handleLogin(e){
    e.preventDefault();
    const formEl = e.target;
    const body = {
      email: formEl.email.value,
      password: formEl.password.value
    };
    const res = await fetch(`${API}/api/auth/login`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    const data = await res.json();
    if(data.token){
      setToken(data.token);
      localStorage.setItem('ft_token', data.token);
      setView('dashboard');
    } else {
      alert(data.message || 'Login failed');
    }
  }

  async function addActivity(e){
    e.preventDefault();
    if (!token) {
      alert('Please log in to add activities');
      setView('login');
      return;
    }
    
    const totalMinutes = parseInt(form.hours||0)*60 + parseInt(form.minutes||0);
    const body = { name: form.name, durationMinutes: totalMinutes, date: new Date().toISOString() };
    const res = await fetch(`${API}/api/activities`, {
      method:'POST',
      headers: {'Content-Type':'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(body)
    });
    if(res.ok){
      setForm({name:'Running', hours:0, minutes:30});
      fetchActivities();
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to add');
    }
  }

  function logout(){
    localStorage.removeItem('ft_token');
    setToken('');
    setView('landing');
  }

  const LandingPage = () => (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <h1 className="header-brand">FitTrack</h1>
          <nav className="nav-menu">
            <button onClick={() => handleViewChange('register')} className="nav-btn">🌱Register</button>
            <button onClick={() => handleViewChange('login')} className="nav-btn">🔑Login</button>
            <button onClick={() => handleViewChange('diet')} className="nav-btn">🍽️ Diet</button>
            <button onClick={() => handleViewChange('expert')} className="nav-btn">💪Expert Help</button> 
            <button onClick={() => handleViewChange('dashboard')} className="nav-btn">📊  Dashboard</button> 
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Transform Your Fitness Journey</h2>
          <p>Track activities, follow diets, and get expert guidance - all in one place</p>
          <button onClick={() => handleViewChange('register')} className="cta-btn">Start Your Journey</button>
        </div>
        <div className="hero-image">
          <img 
            src={require('./capture.jpg')} 
            alt="Fitness Transformation" 
            className="hero-img"
          />
        </div>
      </section>
      
      <section className="how-to-use section">
        <h2>Why choose Fittrack?</h2>
        <div className="steps-container">
          <div className="step">
            <h3>1. Comprehensive Health Management in One Platform</h3>
            <p>FitTracker consolidates all aspects of your wellness journey into a single, intuitive application, eliminating the need to juggle multiple disconnected tools. By seamlessly integrating activity monitoring, nutritional guidance, and expert support, our platform provides a holistic approach to health that addresses both physical activity and dietary habits simultaneously</p>
          </div>
          <div className="step">
            <h3>No costly services!</h3>
            <p>100% Free Core Features - Full tracking, diet plans, and progress tools with no subscription fees.
                                        Zero Cost Barriers - Quality fitness guidance for everyone, regardless of budget.

                                        Democratizing Wellness - Breaking down financial obstacles to health resources.

                                        Inclusive Health - Pursue fitness goals without financial strain or paywalls.

                                        Always Accessible - Essential features remain free forever for all users.</p>
          </div>
          <div className="step">
            <h3>Professional Guidance</h3>
At FitTrack, our coaching team brings a minimum of 7 years of hands-on field experience, ensuring you receive expert guidance rooted in practical knowledge and proven results. Our certified professionals have successfully trained diverse clients across multiple fitness domains, from athletic performance to transformative wellness journeys. Trust our seasoned experts to provide safe, effective, and scientifically-backed guidance that delivers real, sustainable outcomes.          </div>
          
        </div>
      </section>

      <section className="how-to-use section">
        <h2>How to Use FitTrack</h2>
        <div className="steps-container">
          <div className="step">
            <h3>1. Register & Login</h3>
            <p>Create your account and log in to access personalized features</p>
          </div>
          <div className="step">
            <h3>2. Track Activities</h3>
            <p>Log your workouts, runs, swims, and other activities with duration tracking</p>
          </div>
          <div className="step">
            <h3>3. Follow Diet Plans</h3>
            <p>Access customized diet recommendations based on your goals</p>
          </div>
          <div className="step">
            <h3>4. 💪Expert Guidance</h3>
            <p>Connect with certified fitness experts for personalized training</p>
          </div>
        </div>
      </section>

      <section className="experts-section section">
        <h2>Contact Our Fitness Experts</h2>
        <div className="experts-container">
          <div className="expert-card">
            <h3>John Fitness</h3>
            <p>Certified Personal Trainer</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>✉️ john@fittrack.com</p>
          </div>
          <div className="expert-card">
            <h3>Sarah Nutrition</h3>
            <p>Registered Dietitian</p>
            <p>📞 +1 (555) 987-6543</p>
            <p>✉️ sarah@fittrack.com</p>
          </div>
          <div className="expert-card">
            <h3>Mike Wellness</h3>
            <p>Yoga & Meditation Expert</p>
            <p>📞 +1 (555) 456-7890</p>
            <p>✉️ mike@fittrack.com</p>
          </div>
        </div>
      </section>

      <section className="slogan-section">
        <div className="slogan-content">
          <h2>"Your Journey to Better Health Starts Here"</h2>
          <p>Join thousands of users who have transformed their lives with FitTrack</p>
        </div>
      </section>
    </div>
  );

  if(view === 'landing'){
    return <LandingPage />;
  }

  if(view === 'login' || view === 'register'){
    return (
      <div className="auth-container">
        <div className="auth-forms">
          <div className="auth-form" style={{display: view === 'register' ? 'block' : 'none'}}>
            <h3>Create Account</h3>
            <form onSubmit={handleRegister}>
              <input name="username" placeholder="Username" required className="auth-input"/>
              <input name="email" placeholder="Email" required className="auth-input"/>
              <input name="password" type="password" placeholder="Password" required className="auth-input"/>
              <button type="submit" className="auth-submit">Get Started</button>
            </form>
            <p className="switch-mode" onClick={() => setView('login')}>
              Already have an account? Login here
            </p>
          </div>

          <div className="auth-form" style={{display: view === 'login' ? 'block' : 'none'}}>
            <h3>Welcome Back</h3>
            <form onSubmit={handleLogin}>
              <input name="email" placeholder="Email" required className="auth-input"/>
              <input name="password" type="password" placeholder="Password" required className="auth-input"/>
              <button type="submit" className="auth-submit">Login</button>
            </form>
            <p className="switch-mode" onClick={() => setView('register')}>
              Don't have an account? Register here
            </p>
          </div>
        </div>
        <button onClick={() => setView('landing')} className="back-home-btn">
          ← Back to Home🏠
        </button>
      </div>
    );
  }

  if(view === 'dashboard'){
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      setView('login');
      return null;
    }
    
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>FitTrack Dashboard</h1>
          <div className="dashboard-nav">
            <button onClick={() => handleViewChange('diet')}>🍽️ Diet Plans</button>
            <button onClick={() => handleViewChange('expert')}>💪 Expert Help</button>
            <button onClick={logout} className="logout-btn">🚪 Logout</button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-value">{activities.length}</div>
            <div className="stat-label">Total Activities</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {activities.reduce((total, act) => total + act.durationMinutes, 0)}m
            </div>
            <div className="stat-label">Total Minutes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {new Set(activities.map(a => new Date(a.date).toDateString())).size}
            </div>
            <div className="stat-label">Active Days</div>
          </div>
        </div>

        <main className="dashboard-main">
          {/* Add Activity Section */}
          <section className="add-activity">
            <h2>➕ Add New Activity</h2>
            <form onSubmit={addActivity} className="add-form">
              <div className="form-group">
                <label>Activity Type:</label>
                <select value={form.name} onChange={e=>setForm({...form,name:e.target.value})}>
                  <option>Running</option>
                  <option>Swimming</option>
                  <option>Cycling</option>
                  <option>Gym/Workout</option>
                  <option>Yoga</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Duration:</label>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div style={{flex: 1}}>
                    <label>Hours:</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={form.hours} 
                      onChange={e=>setForm({...form,hours:e.target.value})}
                      placeholder="0"
                      className="auth-input"
                    />
                  </div>
                  <div style={{flex: 1}}>
                    <label>Minutes:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="59" 
                      value={form.minutes} 
                      onChange={e=>setForm({...form,minutes:e.target.value})}
                      placeholder="30"
                      className="auth-input"
                    />
                  </div>
                </div>
              </div>
              
              <button type="submit" className="add-btn">
                📝 Add Activity
              </button>
            </form>
          </section>

          {/* Activities List Section */}
          <section className="activities-list">
            <h2>📊 Your Activities</h2>
            <div className="activity-items">
              {activities.length === 0 ? (
                <div className="empty-state">
                  <p>No activities yet! Start tracking your fitness journey.</p>
                </div>
              ) : (
                activities.map(a => (
                  <div key={a._id} className="activity-item">
                    <div className="activity-info">
                      <div className="activity-name">{a.name}</div>
                      <div className="activity-details">
                        ⏱️ {Math.floor(a.durationMinutes/60)}h {a.durationMinutes%60}m • 
                        📅 {new Date(a.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        <button onClick={() => setView('landing')} className="back-home-btn">
          ← Back to Home🏠
        </button>
      </div>
    );
  }

  if(view === 'diet'){
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      setView('login');
      return null;
    }
    
    return (
      <div className="diet-plans-page">
        <header className="diet-header">
          <h1>FitTrack — Diet Plans</h1>
          <div className="diet-nav">
            <button onClick={() => handleViewChange('dashboard')}>📊Dashboard</button>
            <button onClick={() => handleViewChange('expert')}>💪Expert Help</button>
            <button onClick={logout} className="logout-btn">🚪Logout</button>          </div>
        </header>
        
        <main>
          <div className="diet-plans-container">
            <h2>Choose Your Fitness Goal</h2>
            <p className="diet-subtitle">Select a plan that matches your body transformation goals</p>
            
            <div className="diet-plan-card">
              <div className="plan-header">
                <h3>🔥 Overweight to Slim & Perfect Cut</h3>
                <span className="plan-badge">Most Popular</span>
              </div>
              <div className="plan-content">
                <div className="plan-image">
                  <img 
                    src={require('./motaadmi.jpg')}
                    alt="Overweight to Slim Transformation" 
                    className="diet-img"
                  />
                </div>
                <div className="plan-details">
                  <h4>Daily Diet Plan:</h4>
                  <ul>
                    <li>🍳 <strong>Breakfast:</strong> High-protein meal with eggs/oatmeal (300-400 calories)</li>
                    <li>🥗 <strong>Lunch:</strong> Grilled chicken/fish with vegetables (400-500 calories)</li>
                    <li>🥜 <strong>Snacks:</strong> Nuts, Greek yogurt, or protein shake (200 calories)</li>
                    <li>🍗 <strong>Dinner:</strong> Lean protein with green vegetables (300-400 calories)</li>
                    <li>💧 <strong>Hydration:</strong> 3-4 liters of water daily</li>
                  </ul>
                  
                  <h4>Key Guidelines:</h4>
                  <ul>
                    <li>✅ Calorie deficit: 500-700 calories daily</li>
                    <li>✅ 40% Protein, 30% Carbs, 30% Healthy Fats</li>
                    <li>✅ Intermittent fasting recommended (16:8)</li>
                    <li>✅ Avoid sugar, processed foods, and alcohol</li>
                    <li>✅ Cardio 4-5 times per week + strength training</li>
                  </ul>
                  
                  <div className="progress-timeline">
                    <h4>Expected Progress:</h4>
                    <div className="timeline">
                      <div className="timeline-item">
                        <span>1 Month: 4-6 kg weight loss</span>
                      </div>
                      <div className="timeline-item">
                        <span>3 Months: 12-18 kg weight loss</span>
                      </div>
                      <div className="timeline-item">
                        <span>6 Months: Transformation complete</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="diet-plan-card">
              <div className="plan-header">
                <h3>⚡ Underweight to Healthy & Slim</h3>
                <span className="plan-badge">Weight Gain</span>
              </div>
              <div className="plan-content">
                <div className="plan-image">
                  <img 
                    src={require('./patladandi.webp')} 
                    alt="Underweight to Healthy Transformation" 
                    className="diet-img"
                  />
                </div>
                <div className="plan-details">
                  <h4>Daily Diet Plan:</h4>
                  <ul>
                    <li>🍳 <strong>Breakfast:</strong> Calorie-dense smoothie with peanut butter (500-600 calories)</li>
                    <li>🍚 <strong>Lunch:</strong> Complex carbs + protein (rice, chicken, avocado) (600-700 calories)</li>
                    <li>🥜 <strong>Snacks:</strong> High-calorie snacks every 2-3 hours (300-400 calories)</li>
                    <li>🍗 <strong>Dinner:</strong> Protein + healthy fats (salmon, sweet potato) (500-600 calories)</li>
                    <li>🥛 <strong>Before bed:</strong> Casein protein shake</li>
                  </ul>
                  
                  <h4>Key Guidelines:</h4>
                  <ul>
                    <li>✅ Calorie surplus: 300-500 calories daily</li>
                    <li>✅ 30% Protein, 50% Carbs, 20% Healthy Fats</li>
                    <li>✅ Eat every 2-3 hours (5-6 meals daily)</li>
                    <li>✅ Focus on calorie-dense healthy foods</li>
                    <li>✅ Strength training 4 times per week</li>
                  </ul>
                  
                  <div className="progress-timeline">
                    <h4>Expected Progress:</h4>
                    <div className="timeline">
                      <div className="timeline-item">
                        <span>1 Month: 2-3 kg healthy weight gain</span>
                      </div>
                      <div className="timeline-item">
                        <span>3 Months: 6-9 kg muscle gain</span>
                      </div>
                      <div className="timeline-item">
                        <span>6 Months: Healthy physique achieved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="diet-plan-card">
              <div className="plan-header">
                <h3>💪 Bulky Body Transformation</h3>
                <span className="plan-badge">Mass Building</span>
              </div>
              <div className="plan-content">
                <div className="plan-image">
                  <img 
                    src={require('./bulky.jpg')} 
                    alt="Bulky Body Transformation" 
                    className="diet-img"
                  />
                </div>
                <div className="plan-details">
                  <h4>Daily Diet Plan:</h4>
                  <ul>
                    <li>🍳 <strong>Breakfast:</strong> 4 eggs + whole grain toast + avocado (600-700 calories)</li>
                    <li>🍚 <strong>Lunch:</strong> Large portion of meat + complex carbs (700-800 calories)</li>
                    <li>🥜 <strong>Pre-workout:</strong> Complex carbs + protein (400-500 calories)</li>
                    <li>🍗 <strong>Dinner:</strong> Red meat + potatoes + vegetables (600-700 calories)</li>
                    <li>🥛 <strong>Before bed:</strong> Cottage cheese + nuts</li>
                  </ul>
                  
                  <h4>Key Guidelines:</h4>
                  <ul>
                    <li>✅ Calorie surplus: 500-700 calories daily</li>
                    <li>✅ 35% Protein, 45% Carbs, 20% Healthy Fats</li>
                    <li>✅ 1.6-2.2g protein per kg body weight</li>
                    <li>✅ Heavy compound lifts + progressive overload</li>
                    <li>✅ 7-8 hours sleep for recovery</li>
                  </ul>
                  
                  <div className="progress-timeline">
                    <h4>Expected Progress:</h4>
                    <div className="timeline">
                      <div className="timeline-item">
                        <span>1 Month: 2-3 kg muscle mass</span>
                      </div>
                      <div className="timeline-item">
                        <span>3 Months: 6-10 kg solid mass</span>
                      </div>
                      <div className="timeline-item">
                        <span>1 Year: Significant transformation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="diet-resources">
              <h3>📋 Additional Resources</h3>
              <div className="resources-grid">
                <div className="resource-item">
                  <h4>📊 Calorie Calculator</h4>
                  <p>Calculate your daily calorie needs based on your goals</p>
                </div>
                <div className="resource-item">
                  <h4>🥗 Recipe Book</h4>
                  <p>100+ healthy recipes for each diet plan</p>
                </div>
                <div className="resource-item">
                  <h4>📱 Progress Tracker</h4>
                  <p>Track your measurements and progress photos</p>
                  
                </div>
              </div>
            </div>
          </div>
          
        </main>
        <button onClick={() => setView('landing')} className="back-home-btn">
          ← Back to Home🏠
        </button>
      </div>
    );
  }

  if(view === 'expert'){
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      setView('login');
      return null;
    }
    
    return (
      <div className="expert-page">
        <header className="expert-header">
          <h1>FitTrack — Expert Help</h1>
          <div className="expert-nav">
            <button onClick={() => handleViewChange('dashboard')}>📊Dashboard</button>
            <button onClick={() => handleViewChange('diet')}>🍽️Diet Plans</button>
            <button onClick={logout} className="logout-btn">🚪Logout</button>
          </div>
        </header>
        <main>
          <div className="coming-soon">
            <h2>Coming Soon!</h2>
            <p>Connect with certified trainers and nutritionists for personalized guidance. Our expert team is working hard to bring you the best fitness coaching experience.</p>
            
          </div>
        </main>
        <button onClick={() => setView('landing')} className="back-home-btn">
          ← Back to Home🏠 
        </button>
      </div>
    );
  }
}

export default App;