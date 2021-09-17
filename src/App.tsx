import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { Journal } from './modules/journal/journal';
import { Profile } from './modules/profile/profile';

import './styles/output.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/journal">
          <Journal />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/">
          <Redirect to="/journal" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
