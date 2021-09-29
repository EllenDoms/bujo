import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { FloatingButton } from '../../components/button/floatingButton';
import { Header } from '../../components/header/header';
import { AddBulletSidePanel } from '../../components/sidePanel/addBulletSidePanel';
import { AddBulletStatusSidePanel } from '../../components/sidePanel/addBulletStatusSidePanel';
import { Tabs } from '../../components/tabs/tabs';
import { handleStatusChange } from '../../hooks/useStatusUpdate';
import { BulletStatusEnum, IBulletWithStatus } from '../../types/bullets';
import { today } from '../../types/dates';

import { DayView } from './views/dayView';
import { MonthView } from './views/monthView';
import { WeekView } from './views/weekView';
import { YearView } from './views/yearView';

interface Props {}

const tabs = [
  {
    label: 'day',
    to: '/day',
  },
  {
    label: 'week',
    to: '/week',
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
  const [showAddBulletDialog, setShowAddBulletDialog] = useState<boolean>(false);
  const [migratingBullet, setMigratingBullet] = useState<IBulletWithStatus | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const handleMigrate = (newDate: Date, selectedBullet: IBulletWithStatus) => {
    selectedBullet && handleStatusChange(selectedBullet, BulletStatusEnum.MIGRATED);
    setSelectedDate(new Date(newDate));
  };

  return (
    <div className="h-screen">
      <Header>
        <Tabs tabs={tabs} />
      </Header>
      <div className="pt-14 h-full overflow-y-scroll flex flex-col items-center">
        <Switch>
          <Route path="/journal/day">
            <DayView
              selectedDate={selectedDate}
              setMigratingBullet={setMigratingBullet}
              setSelectedDate={setSelectedDate}
            />
          </Route>
          <Route path="/journal/week">
            <WeekView
              selectedDate={selectedDate}
              setMigratingBullet={setMigratingBullet}
              setSelectedDate={setSelectedDate}
            />
          </Route>
          <Route path="/journal/month">
            <MonthView />
          </Route>
          <Route path="/journal/year">
            <YearView />
          </Route>
          <Route path="/journal/">
            <Redirect to="/journal/week" />
          </Route>
        </Switch>
      </div>

      <FloatingButton onClick={() => setShowAddBulletDialog(true)} />
      <AddBulletSidePanel
        defaultDate={selectedDate}
        isShown={showAddBulletDialog}
        onClose={() => setShowAddBulletDialog(false)}
      />
      <AddBulletStatusSidePanel
        bulletStatus={migratingBullet}
        isShown={migratingBullet ? true : false}
        onClose={() => setMigratingBullet(undefined)}
        onMigrate={handleMigrate}
      />
    </div>
  );
}
