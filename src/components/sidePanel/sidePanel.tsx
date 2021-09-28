import React, { ReactNode } from 'react';
import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

interface Props {
  title: string;
  children: ReactNode;
  onClose: () => void;
  isShown: boolean;
}

export function SidePanel({ children, isShown, onClose, title }: Props) {
  return (
    <div className="fixed z-30">
      <Transition
        className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-10 cursor-pointer"
        enter="transition ease-in-out duration-300 transform"
        enterFrom="opacity-0"
        enterTo="opacity-1"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="opacity-1"
        leaveTo="opacity-0"
        onClick={onClose}
        show={isShown}
      ></Transition>
      <Transition
        className="fixed right-0 top-0 pl-16 w-full max-w-lg h-full antialiased"
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-x-full"
        leave="transition ease-in-out duration-300 transform"
        leaveTo="translate-x-full"
        show={isShown}
      >
        <div className="bg-white h-full w-full max-w-lg right-0 top-0 fixed m-0 shadow-lg">
          <div className="flex flex-row justify-between border-b p-8 border-gray-200">
            <h2 className="text-rose-500 text-xl font-bold">{title} </h2>
            <XIcon className="w-6 h-6 text-gray-500 cursor-pointer" onClick={onClose} />
          </div>
          <div className="p-8"> {children}</div>
        </div>
      </Transition>
    </div>
  );
}
