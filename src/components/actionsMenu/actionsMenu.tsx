import React, { useState } from 'react';
import * as Icons from '@heroicons/react/outline';

import { IconButton } from '../button/button';

interface MenuOption {
  label: string;
  onClick: () => void;
  icon?: keyof typeof Icons;
}

interface Props {
  options: MenuOption[];
}

export function ActionsMenu({ options }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <IconButton icon="DotsVerticalIcon" onClick={() => setIsOpen(true)} />
      {isOpen && (
        <div
          className="absolute bg-white rounded right-0 w-max p-2 shadow-xl z-20"
          onMouseLeave={() => setIsOpen(false)}
        >
          {options.map((option) => {
            const HeroIcon = option.icon ? Icons[option.icon] : null;

            return (
              <div className="text-sm py-2 px-4 hover:bg-gray-100 rounded flex flex-row gap-2 items-center">
                {HeroIcon && <HeroIcon className="h-4 w-4 text-rose-500" />} {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
