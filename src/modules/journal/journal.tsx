import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Tabs } from '../../components/tabs/tabs';

import { DayView } from './views/dayView';
import { MonthView } from './views/monthView';
import { YearView } from './views/yearView';

interface Props {}

const tabs = [
  {
    label: 'day',
    to: '/day',
  },
  {
    label: 'month',
    to: '/month',
  },
  {
    label: 'year',
    to: '/year',
  },
];

export function Journal(props: Props) {
  return (
    <div>
      <Tabs tabs={tabs} />
      <Switch>
        <Route path="/journal/day">
          <DayView />
        </Route>
        <Route path="/journal/month">
          <MonthView />
        </Route>
        <Route path="/journal/year">
          <YearView />
        </Route>
        <Route path="/journal/">
          <Redirect to="/journal/day" />
        </Route>
      </Switch>
    </div>
  );
}
