import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import WeekCalendar from '../../../components/calendar/weekCalendar';
import { supabase } from '../../../supabase/supabaseClient';
import { Bullet } from '../../../types/bullets';
import { DATE_FORMAT } from '../../../types/dates';

export function DayView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bullets, setBullets] = useState<Bullet[]>([]);

  useEffect(() => {
    fetchBullets().catch(console.error);
  }, []);

  const fetchBullets = async () => {
    let { data: bulletsData, error } = await supabase
      .from('bullets')
      .select('*')
      .order('id', { ascending: false });
    if (error) console.log('error', error);
    else setBullets(bulletsData as Bullet[]);
  };

  return (
    <div className="flex flex-col items-center">
      <WeekCalendar showDetailsHandle={(day) => setSelectedDate(day)} />
      {selectedDate && <div>{format(selectedDate, DATE_FORMAT.DATE_WRITTEN)}</div>}
      {bullets && <div>{bullets.map((bullet) => bullet.title)}</div>}
    </div>
  );
}
