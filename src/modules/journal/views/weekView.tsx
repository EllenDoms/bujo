import React, { useEffect, useMemo, useState } from 'react';
import cx from 'clsx';
import { addDays, endOfWeek, format, isEqual, startOfDay, startOfWeek } from 'date-fns';

import { BulletList } from '../../../components/bullet/bulletList';
import { IconButton } from '../../../components/button/button';
import { FloatingButton } from '../../../components/button/floatingButton';
import { AddBulletDialog } from '../../../components/dialog/addBulletDialog';
import { AddBulletStatusDialog } from '../../../components/dialog/addBulletStatusDialog';
import { groupBy } from '../../../hooks/groupBy';
import { onChangeWeek } from '../../../hooks/useChangeWeek';
import { handleStatusChange } from '../../../hooks/useStatusUpdate';
import { useBulletContext } from '../../../supabase/bullets';
import { BulletStatusEnum, IBulletWithStatus } from '../../../types/bullets';
import { btnEnum } from '../../../types/buttons';
import { DATE_FORMAT, TimeframesEnum } from '../../../types/dates';

export function WeekView() {
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [showAddBulletDialog, setShowAddBulletDialog] = useState<boolean>(false);
  const [migratingBullet, setMigratingBullet] = useState<IBulletWithStatus | undefined>(undefined);
  const today = startOfDay(new Date());

  const { bulletsWithStatus, loading, setStartDate, setTimeframe } = useBulletContext();

  useEffect(() => {
    setStartDate && setStartDate(selectedWeek);
    setTimeframe && setTimeframe(TimeframesEnum.WEEK);
  }, [selectedWeek, setStartDate, setTimeframe]);

  const groupedBulletsWithStatus =
    (bulletsWithStatus &&
      groupBy(bulletsWithStatus, (i) => format(new Date(i.date), DATE_FORMAT.SUPABASE_DAY))) ||
    [];

  const handleMigrate = (newDate: Date, selectedBullet: IBulletWithStatus) => {
    selectedBullet && handleStatusChange(selectedBullet, BulletStatusEnum.MIGRATED, newDate);
    setSelectedWeek(startOfWeek(new Date(newDate), { weekStartsOn: 1 }));
  };

  const weekdays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(selectedWeek, i));
    }

    return days;
  }, [selectedWeek]);

  const handleChangeweek = (action: btnEnum, date: Date) => {
    const newDate = onChangeWeek(action, date);
    newDate && setSelectedWeek(newDate);
  };

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="flex flex-row items-center mt-4 ">
        <IconButton
          icon="ChevronLeftIcon"
          onClick={() => handleChangeweek(btnEnum.PREV, selectedWeek)}
          withBg
        />

        {selectedWeek && (
          <h1 className=" mx-4 w-64 text-center font-semibold text-rose-500 text-lg">
            {format(selectedWeek, DATE_FORMAT.DATE_WRITTEN)} -
            {format(endOfWeek(selectedWeek), DATE_FORMAT.DATE_WRITTEN)}
          </h1>
        )}
        <IconButton
          icon="ChevronRightIcon"
          onClick={() => handleChangeweek(btnEnum.NEXT, selectedWeek)}
          withBg
        />
      </div>
      <div className="grid-cols-7	grid w-full overflow-x-scroll">
        {weekdays?.map((day: Date) => {
          const isToday = isEqual(day, today);

          return (
            <div className="mt-4" key={day.toString()}>
              <div
                className={cx(
                  'flex flex-col items-center justify-center rounded text-gray-500 p-2',
                  isToday && 'bg-gray-200 text-gray-700 hover:text-gray-900',
                )}
                key={day.toString()}
              >
                <p className="text-sm">{format(day, DATE_FORMAT.WEEK_DAY)}</p>
                <p className="text-xs">{format(day, DATE_FORMAT.DATE_WRITTEN)}</p>
              </div>
              <div>
                {!loading && groupedBulletsWithStatus && (
                  <BulletList
                    bulletsWithStatus={
                      groupedBulletsWithStatus[format(day, DATE_FORMAT.SUPABASE_DAY)]
                    }
                    date={day}
                    onChangeBulletStatus={(newStatus, bulletStatus) =>
                      newStatus === BulletStatusEnum.MIGRATED
                        ? setMigratingBullet(bulletStatus)
                        : handleStatusChange(bulletStatus, newStatus)
                    }
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <FloatingButton onClick={() => setShowAddBulletDialog(true)} />
      <AddBulletDialog
        defaultDate={selectedWeek}
        isShown={showAddBulletDialog}
        onClose={() => setShowAddBulletDialog(false)}
      />
      <AddBulletStatusDialog
        bulletStatus={migratingBullet}
        defaultDate={addDays(selectedWeek, 1)}
        isShown={migratingBullet ? true : false}
        onClose={() => setMigratingBullet(undefined)}
        onMigrate={handleMigrate}
      />
    </div>
  );
}
