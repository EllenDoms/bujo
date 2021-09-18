import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Bullet } from '../../../components/bullet/bullet';
import WeekCalendar from '../../../components/calendar/weekCalendar';
import { supabase } from '../../../supabase/supabaseClient';
import { BulletStatus } from '../../../types/bullets';
import { DATE_FORMAT } from '../../../types/dates';

export function DayView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bullets, setBullets] = useState<BulletStatus[]>([]);

  useEffect(() => {
    const fetchBullets = async () => {
      let { data: bulletsData, error } = await supabase
        .from('bulletStatusLog')
        .select(
          `date,
          status (title), 
          data: bullet_id (
            title, 
            description,
            type (title),
            tags
          )
        `,
        )
        .filter('date', 'eq', format(selectedDate, DATE_FORMAT.SUPABASE_DAY))
        .order('date', { ascending: true });
      if (error) console.log('error', error);
      else setBullets(bulletsData as BulletStatus[]);
    };
    fetchBullets().catch(console.error);
  }, [selectedDate]);

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <WeekCalendar showDetailsHandle={(day) => setSelectedDate(day)} />
      {selectedDate && <h1 className="mt-4">{format(selectedDate, DATE_FORMAT.DATE_WRITTEN)}</h1>}
      {bullets && (
        <div className="w-full max-w-md flex flex-col justify-items-start">
          {bullets.map((bullet) => (
            <Bullet key={bullet.id} status={bullet.status.title} type={bullet.data.type.title}>
              {bullet.data.title}
            </Bullet>
          ))}
        </div>
      )}
    </div>
  );
}
