import React, { ReactNode, useState } from 'react';

import { supabase } from '../../supabase/supabaseClient';
import { Button } from '../button/button';

interface Props {
  children: ReactNode;
}

export function Header({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      error instanceof Error && alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between border-b-2 border-gray-100 w-full h-14 items-center px-8">
      {children}
      <div>{loading ? 'loading' : <Button label="Sign out" onClick={handleLogout} />}</div>
    </div>
  );
}
