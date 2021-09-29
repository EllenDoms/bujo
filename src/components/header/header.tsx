import React, { ReactNode, useState } from 'react';

import { useBulletContext } from '../../supabase/bullets.store';
import { supabase } from '../../supabase/supabaseClient';
import { Button } from '../button/button';
import { Wrapup } from '../Wrapup/Wrapup';

interface Props {
  children: ReactNode;
}

export function Header({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [handleWrapup, setHandleWrapup] = useState<boolean>();
  const { openBulletStatus } = useBulletContext();

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

  const countNumber = openBulletStatus.length > 0 ? openBulletStatus.length : undefined;

  return (
    <div className="fixed flex justify-between border-b-2 border-gray-100 w-full h-14 items-center px-8">
      {children}
      <div className="flex flex-row gap-2">
        <Button
          countNumber={countNumber}
          isDisabled={openBulletStatus.length <= 0}
          label="Wrapup"
          onClick={() => setHandleWrapup(true)}
        />
        <div>{loading ? 'loading' : <Button label="Sign out" onClick={handleLogout} />}</div>
      </div>
      {handleWrapup && <Wrapup onClose={() => setHandleWrapup(false)} />}
    </div>
  );
}
