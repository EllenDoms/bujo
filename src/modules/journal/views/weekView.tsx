import React, { useEffect, useMemo } from 'react';
import cx from 'clsx';
import { addDays, endOfWeek, format, isEqual } from 'date-fns';

import { BulletList } from '../../../components/bullet/bulletList';
import { IconButton } from '../../../components/button/button';
import { groupBy } from '../../../hooks/groupBy';
import { onChangeWeek } from '../../../hooks/useChangeWeek';
import { handleStatusChange } from '../../../hooks/useStatusUpdate';
import { useBulletContext } from '../../../supabase/bullets.store';
import { BulletStatusEnum, IBullet, IBulletWithStatus } from '../../../types/bullets';
import { btnEnum } from '../../../types/buttons';
import { DATE_FORMAT, getStartOfWeek, TimeframesEnum, today } from '../../../types/dates';

type Props = {
  setMigratingBullet: (bullet: IBulletWithStatus) => void;
  setEditBullet: (bullet: IBullet) => void;
};

export function WeekView({ setEditBullet, setMigratingBullet }: Props) {
  const { bulletsWithStatus, initialLoading, selectedDate, setSelectedDate, setTimeframe } =
    useBulletContext();
  const selectedWeek = getStartOfWeek(selectedDate);

  useEffect(() => {
    setSelectedDate && setSelectedDate(selectedDate);
    setTimeframe && setTimeframe(TimeframesEnum.WEEK);
  }, [selectedDate, setSelectedDate, setTimeframe]);

  const groupedBulletsWithStatus =
    (bulletsWithStatus &&
      groupBy(bulletsWithStatus, (i) => format(new Date(i.date), DATE_FORMAT.SUPABASE_DAY))) ||
    [];

  const weekdays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(selectedWeek, i));
    }

    return days;
  }, [selectedWeek]);

  const handleChangeweek = (action: btnEnum, date: Date) => {
    const newDate = onChangeWeek(action, date);
    newDate && setSelectedDate(newDate);
  };

  return (
    <>
      <div className="flex flex-row items-center my-6">
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
      <div className="w-full h-full overflow-scroll">
        <div className="flex flex-row min-w-full min-h-full px-4">
          {weekdays?.map((day: Date) => {
            const isToday = isEqual(day, today);

            return (
              <div className="mt-4 flex-1 min-w-56" key={day.toString()}>
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
                  {!initialLoading && groupedBulletsWithStatus && (
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
                      onEditBullet={setEditBullet}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
