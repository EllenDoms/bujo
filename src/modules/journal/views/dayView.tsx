import React, { useEffect, useState } from 'react';
import { addDays, format, startOfDay } from 'date-fns';

import { BulletList } from '../../../components/bullet/bulletList';
import { FloatingButton } from '../../../components/button/floatingButton';
import WeekCalendar from '../../../components/calendar/weekCalendar';
import { AddBulletSidePanel } from '../../../components/sidePanel/addBulletSidePanel';
import { AddBulletStatusSidePanel } from '../../../components/sidePanel/addBulletStatusSidePanel';
import { groupBy } from '../../../hooks/groupBy';
import { handleStatusChange } from '../../../hooks/useStatusUpdate';
import { useBulletContext } from '../../../supabase/bullets';
import { BulletStatusEnum, IBulletWithStatus } from '../../../types/bullets';
import { DATE_FORMAT, TimeframesEnum } from '../../../types/dates';

export function DayView() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [showAddBulletDialog, setShowAddBulletDialog] = useState<boolean>(false);
  const [migratingBullet, setMigratingBullet] = useState<IBulletWithStatus | undefined>(undefined);
  const { bulletsWithStatus, initialLoading, setStartDate, setTimeframe } = useBulletContext();

  useEffect(() => {
    setStartDate && setStartDate(selectedDate);
    setTimeframe && setTimeframe(TimeframesEnum.DAY);
  }, [selectedDate, setStartDate, setTimeframe]);

  const handleMigrate = (newDate: Date, selectedBullet: IBulletWithStatus) => {
    selectedBullet && handleStatusChange(selectedBullet, BulletStatusEnum.MIGRATED, newDate);
    setSelectedDate(startOfDay(new Date(newDate)));
  };

  // TODO grouping should not be necessary since we fetch again, but the loading state is too long on false?
  const groupedBulletsWithStatus =
    (bulletsWithStatus &&
      groupBy(bulletsWithStatus, (i) => format(new Date(i.date), DATE_FORMAT.SUPABASE_DAY))) ||
    [];

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <WeekCalendar selectedDate={selectedDate} setSelectedDate={(day) => setSelectedDate(day)} />
      {selectedDate && (
        <h1 className="mt-4 font-semibold text-rose-500 text-lg">
          {format(selectedDate, DATE_FORMAT.DATE_WRITTEN)}
        </h1>
      )}
      {!initialLoading && groupedBulletsWithStatus && (
        <BulletList
          bulletsWithStatus={
            groupedBulletsWithStatus[format(selectedDate, DATE_FORMAT.SUPABASE_DAY)]
          }
          date={selectedDate}
          onChangeBulletStatus={(newStatus, bulletStatus) =>
            newStatus === BulletStatusEnum.MIGRATED
              ? setMigratingBullet(bulletStatus)
              : handleStatusChange(bulletStatus, newStatus)
          }
        />
      )}
      <FloatingButton onClick={() => setShowAddBulletDialog(true)} />
      <AddBulletSidePanel
        defaultDate={selectedDate}
        isShown={showAddBulletDialog}
        onClose={() => setShowAddBulletDialog(false)}
      />
      <AddBulletStatusSidePanel
        bulletStatus={migratingBullet}
        defaultDate={addDays(selectedDate, 1)}
        isShown={migratingBullet ? true : false}
        onClose={() => setMigratingBullet(undefined)}
        onMigrate={handleMigrate}
      />
    </div>
  );
}
