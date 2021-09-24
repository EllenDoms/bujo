import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Session } from '@supabase/gotrue-js/src/lib/types';

import { Journal } from './modules/journal/journal';
import Login from './modules/profile/login';
import { Profile } from './modules/profile/profile';
import { BulletContextProvider } from './supabase/bullets';
import { supabase } from './supabase/supabaseClient';

import './styles/output.css';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router>
      {!session ? (
        <Login />
      ) : (
        <BulletContextProvider>
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
        </BulletContextProvider>
      )}
    </Router>
  );
}

export default App;
