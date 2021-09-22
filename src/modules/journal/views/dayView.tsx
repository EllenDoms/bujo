import React, { useState } from 'react';
import { addDays, format, startOfDay } from 'date-fns';

import { Bullet } from '../../../components/bullet/bullet';
import { FloatingButton } from '../../../components/button/floatingButton';
import WeekCalendar from '../../../components/calendar/weekCalendar';
import { AddBulletDialog } from '../../../components/dialog/addBulletDialog';
import { AddBulletStatusDialog } from '../../../components/dialog/addBulletStatusDialog';
import { handleStatusChange } from '../../../hooks/useStatusUpdate';
import { useBulletsStore } from '../../../supabase/bullets';
import { BulletStatusEnum, IBulletWithStatus } from '../../../types/bullets';
import { DATE_FORMAT, TimeframesEnum } from '../../../types/dates';

export function DayView() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [showAddBulletDialog, setShowAddBulletDialog] = useState<boolean>(false);
  const [migratingBullet, setMigratingBullet] = useState<IBulletWithStatus | undefined>(undefined);

  const { bulletsWithStatus } = useBulletsStore({
    startDate: selectedDate,
    timeframe: TimeframesEnum.DAY,
  });

  const handleMigrate = (newDate: Date, selectedBullet: IBulletWithStatus) => {
    selectedBullet && handleStatusChange(selectedBullet, BulletStatusEnum.MIGRATED, newDate);
    setSelectedDate(startOfDay(new Date(newDate)));
  };

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <WeekCalendar selectedDate={selectedDate} setSelectedDate={(day) => setSelectedDate(day)} />
      {selectedDate && (
        <h1 className="mt-4 font-semibold text-rose-500 text-lg">
          {format(selectedDate, DATE_FORMAT.DATE_WRITTEN)}
        </h1>
      )}
      {bulletsWithStatus && (
        <div className="w-full max-w-md flex flex-col justify-items-start">
          {bulletsWithStatus.map((bulletStatus) => (
            <Bullet
              key={bulletStatus.id}
              onChangeBulletStatus={(newStatus) =>
                newStatus === BulletStatusEnum.MIGRATED
                  ? setMigratingBullet(bulletStatus)
                  : handleStatusChange(bulletStatus, newStatus, selectedDate)
              }
              status={bulletStatus.status}
              type={bulletStatus.data.type}
            >
              {bulletStatus.data.title}
            </Bullet>
          ))}
        </div>
      )}
      <FloatingButton onClick={() => setShowAddBulletDialog(true)} />
      <AddBulletDialog
        defaultDate={selectedDate}
        isShown={showAddBulletDialog}
        onClose={() => setShowAddBulletDialog(false)}
      />
      <AddBulletStatusDialog
        bulletStatus={migratingBullet}
        defaultDate={addDays(selectedDate, 1)}
        isShown={migratingBullet ? true : false}
        onClose={() => setMigratingBullet(undefined)}
        onMigrate={handleMigrate}
      />
    </div>
  );
}
