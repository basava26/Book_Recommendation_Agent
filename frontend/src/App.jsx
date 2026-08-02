import { useState } from 'react';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Recommendations from './pages/Recommendations.jsx';
import { UserPreferencesProvider } from './context/UserPreferencesContext.jsx';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'profile', label: 'Profile' },
  { id: 'recommendations', label: 'Recommendations' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <UserPreferencesProvider>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">
            <span className="brand-mark">Marginal<em>ia</em></span>
            <span className="brand-tag">Book Recommendation Agent</span>
          </div>
          <nav className="nav-tabs" aria-label="Main navigation">
            {TABS.map((tab) => (
              <button key={tab.id} className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)} aria-current={activeTab === tab.id ? 'page' : undefined}>
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <main>
          {activeTab === 'home' && <Home onGetStarted={() => setActiveTab('profile')} />}
          {activeTab === 'profile' && <Profile onSeeRecommendations={() => setActiveTab('recommendations')} />}
          {activeTab === 'recommendations' && <Recommendations onEditProfile={() => setActiveTab('profile')} />}
        </main>
      </div>
    </UserPreferencesProvider>
  );
}