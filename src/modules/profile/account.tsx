import { useEffect, useState } from 'react';
import { Session } from '@supabase/gotrue-js/src/lib/types';

import { supabase } from '../../supabase/supabaseClient';

type Props = {
  session: Session;
};

export default function Account({ session }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      error instanceof Error && alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  type profileProps = {
    avatar_url: string | null;
    username: string | null;
    website: string | null;
  };

  async function updateProfile({ avatar_url, username, website }: profileProps) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user?.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      error instanceof Error && alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user?.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          value={username || ''}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          onChange={(e) => setWebsite(e.target.value)}
          type="website"
          value={website || ''}
        />
      </div>

      <div>
        <button
          className="button block primary"
          disabled={loading}
          onClick={() => updateProfile({ username, website, avatar_url })}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
