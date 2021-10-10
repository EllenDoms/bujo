import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { FloatingButton } from '../../components/button/floatingButton';
import { Header } from '../../components/header/header';
import { AddBulletStatusSidePanel } from '../../components/sidePanel/addBulletStatusSidePanel';
import { EditBulletSidePanel } from '../../components/sidePanel/editBulletSidePanel';
import { Tabs } from '../../components/tabs/tabs';
import { handleStatusChange } from '../../hooks/useStatusUpdate';
import { useBulletContext } from '../../supabase/bullets.store';
import { BulletStatusEnum, IBullet, IBulletWithStatus } from '../../types/bullets';

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
  const [showBulletDialog, setShowBulletDialog] = useState<boolean>(false);
  const [editBullet, setEditBullet] = useState<IBullet | undefined>(undefined);
  const [migratingBullet, setMigratingBullet] = useState<IBulletWithStatus | undefined>(undefined);
  const { selectedDate, setSelectedDate } = useBulletContext();

  const handleMigrate = (newDate: Date, selectedBullet: IBulletWithStatus) => {
    selectedBullet && handleStatusChange(selectedBullet, BulletStatusEnum.MIGRATED);
    setSelectedDate(new Date(newDate));
  };

  const handleEditBullet = (bullet: IBullet) => {
    setEditBullet(bullet);
    setShowBulletDialog(true);
  };

  return (
    <div className="h-screen">
      <Header>
        <Tabs tabs={tabs} />
      </Header>
      <div className="pt-14 h-full overflow-y-scroll flex flex-col items-center">
        <Switch>
          <Route path="/journal/day">
            <DayView setEditBullet={handleEditBullet} setMigratingBullet={setMigratingBullet} />
          </Route>
          <Route path="/journal/week">
            <WeekView setEditBullet={handleEditBullet} setMigratingBullet={setMigratingBullet} />
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

      <FloatingButton onClick={() => setShowBulletDialog(true)} />
      <EditBulletSidePanel
        bullet={editBullet}
        defaultDate={selectedDate}
        isShown={showBulletDialog}
        onClose={() => {
          setShowBulletDialog(false);
          // set timeout for animation
          setTimeout(() => {
            setEditBullet(undefined);
          }, 100);
        }}
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
