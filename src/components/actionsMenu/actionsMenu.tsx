import React, { MouseEvent, useState } from 'react';
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

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(true);
  };
  const handleAction = (e: MouseEvent<HTMLButtonElement>, option: MenuOption) => {
    e.stopPropagation();
    option.onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <IconButton icon="DotsVerticalIcon" onClick={(e) => handleOpen(e)} />
      {isOpen && (
        <div className="absolute bg-white rounded right-0 w-max p-2 shadow-xl z-20">
          {options.map((option) => {
            const HeroIcon = option.icon ? Icons[option.icon] : null;

            return (
              <button
                className="text-sm py-2 px-4 hover:bg-gray-100 rounded flex flex-row gap-2 items-center w-full"
                key={option.label}
                onClick={(e) => handleAction(e, option)}
              >
                {HeroIcon && <HeroIcon className="h-4 w-4 text-rose-500" />} {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
