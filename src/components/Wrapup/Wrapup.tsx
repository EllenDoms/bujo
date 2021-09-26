import React, { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';

import { useBulletContext } from '../../supabase/bullets';
import { DATE_FORMAT } from '../../types/dates';
import { DotCounter } from '../dotCounter/dotCounter';

import { WrapupActions } from './WrapupActions';

interface Props {
  onClose: () => void;
}

export function Wrapup({ onClose }: Props) {
  // the wrapup is used by the user to go over all open bullets in the past and tell us what action to perform on it to close it for that date.
  const { openBulletStatus } = useBulletContext();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selectedBullet = openBulletStatus[selectedIndex];

  return (
    <div className="fixed w-screen h-screen left-0 top-0 bg-white bg-opacity-90 z-50 flex justify-center">
      <div className="m-10 justify-self-center max-w-4xl w-full">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold text-rose-500">Let's wrap up some todo's!</h1>
          <XIcon className="w-10 h-10 cursor-pointer" onClick={onClose} />
        </div>
        {selectedBullet ? (
          <div className="items-center flex flex-col text-center ">
            <div className="text-xs w-full">
              <DotCounter selectedNumber={selectedIndex + 1} total={openBulletStatus.length} />
            </div>
            <div className="text-center flex flex-col p-4 max-w-lg w-full justify-between my-4 overflow-y-scroll h-3/4 border border-gray-200 shadow-md rounded bg-white">
              <p className="font-bold text-gray-400 text-xs uppercase mt-4">
                {format(new Date(selectedBullet.date), DATE_FORMAT.WEEK_DAY_LONG)}
              </p>
              <h2 className="font-bold text-xl mb-4">
                {format(new Date(selectedBullet.date), DATE_FORMAT.DATE_WRITTEN)}
              </h2>
              <div>{selectedBullet.data.title}</div>
              <div>{selectedBullet.data.description}</div>
            </div>
            <WrapupActions
              goToNextBullet={() => setSelectedIndex(selectedIndex + 1)}
              selectedBullet={selectedBullet}
            />
          </div>
        ) : (
          <p>Done with the wrapup!</p>
        )}
      </div>
    </div>
  );
}
