import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GuestDetailPage from './components/GuestDetailPage';

const App: React.FC = () => {
  // Get base path from package.json homepage or default to '/'
  const basePath = process.env.PUBLIC_URL || '/wedding';
  
  return (
    <Router basename={basePath}>
      <div className="App">
        <Switch>
          <Route path="/guest" component={GuestDetailPage} />
          <Route path="/" component={LandingPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App; 