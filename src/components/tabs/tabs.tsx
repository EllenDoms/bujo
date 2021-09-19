import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  tabs: {
    label: string;
    to: string;
  }[];
}

export function Tabs({ tabs }: Props) {
  return (
    <div className="flex flex-row h-full items-end">
      {tabs.map((tab) => (
        <NavLink
          activeClassName="border-opacity-100 text-rose-500 "
          className="border-b-2 border-opacity-0 border-rose-500 text-gray-500 font-bold mx-4"
          key={tab.to}
          to={`/journal${tab.to}`}
        >
          <div className="mb-2">{tab.label}</div>
        </NavLink>
      ))}
    </div>
  );
}
