import React from 'react';
import { PlusIcon } from '@heroicons/react/outline';

interface Props {
  onClick: () => void;
}

export function FloatingButton({ onClick }: Props) {
  return (
    <button
      className="bg-rose-500 p-4 shadow-lg rounded-full hover:shadow-xl hover:bg-rose-700 fixed bottom-10 right-10"
      onClick={onClick}
    >
      <PlusIcon className="w-6 h-6 text-white" />
    </button>
  );
}
