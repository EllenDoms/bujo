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
    <div className="m-4">
      {tabs.map((tab) => (
        <NavLink
          activeClassName="border-rose-500 border-opacity-100 text-rose-500"
          className="border-b border-opacity-0 text-gray-400 font-bold py-2 m-2"
          key={tab.to}
          to={`/journal${tab.to}`}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
