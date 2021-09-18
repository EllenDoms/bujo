import { useState } from 'react';

import { Button } from '../../components/button/button';
import { supabase } from '../../supabase/supabaseClient';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      error instanceof Error && alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full h-screen bg-indigo-900 items-center">
      <div className="my-2 flex flex-col items-center text-indigo-400">
        <h1 className="text-rose-500 text-4xl font-bold leading-14">BuJo</h1>
        <p className="text-sm">Fill in your email below, so we can send you the magic link</p>
      </div>
      <input
        className="inputField my-2"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        type="email"
        value={email}
      />
      <div className="my-2">
        <Button
          isDisabled={loading}
          label={loading ? 'loading' : 'Send magic link'}
          onClick={(e) => {
            e.preventDefault();
            handleLogin(email);
          }}
        />
      </div>
    </div>
  );
}
