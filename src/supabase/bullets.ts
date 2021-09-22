import { useEffect, useMemo, useState } from 'react';
import { RealtimeSubscription } from '@supabase/supabase-js';
import { endOfMonth, endOfWeek, format } from 'date-fns';

import { IBullet, IBulletStatus, IBulletWithStatus } from '../types/bullets';
import { DATE_FORMAT, TimeframesEnum } from '../types/dates';

import { supabase } from './supabaseClient';

type Props = {
  startDate: Date;
  timeframe: TimeframesEnum;
};

type IBulletForm = Pick<IBullet, 'title' | 'description' | 'type'>;
type IBulletStatusForm = Pick<IBulletStatus, 'status' | 'date'> & { bullet_id: string };

export const useBulletsStore = ({ startDate, timeframe }: Props) => {
  const [bulletsWithStatus, setBulletsWithStatus] = useState<IBulletWithStatus[]>([]);
  const [newBulletStatus, setNewBulletStatus] = useState<IBulletWithStatus>();
  const [bulletListener, setBulletListener] = useState<RealtimeSubscription | null>(null);

  const endDate = useMemo(() => {
    if (timeframe === TimeframesEnum.DAY) {
      return startDate;
    } else if (timeframe === TimeframesEnum.WEEK) {
      return endOfWeek(startDate);
    } else {
      return endOfMonth(startDate);
    }
  }, [startDate, timeframe]);

  useEffect(() => {
    fetchBulletsWithStatus(startDate, endDate)
      .then((response) => {
        setBulletsWithStatus(response as IBulletWithStatus[]);
      })
      .catch(console.error);
  }, [endDate, startDate]);

  useEffect(() => {
    const handleAsync = async () => {
      if (newBulletStatus) {
        // could be an update
        let update = bulletsWithStatus.find((status, i) => {
          if (status.id === newBulletStatus.id) {
            bulletsWithStatus[i] = newBulletStatus;

            return true;
          } else {
            return false;
          }
        });
        if (update) {
          setBulletsWithStatus((t) => [...bulletsWithStatus]); // update
        } else {
          bulletsWithStatus.unshift(newBulletStatus);
          setBulletsWithStatus((t) => [...bulletsWithStatus]); // new
        }
      }
    };
    handleAsync();
  }, [newBulletStatus, bulletsWithStatus]);

  useEffect(() => {
    if (!bulletListener && bulletsWithStatus) {
      setBulletListener(
        supabase
          .from('bulletStatusLog')
          .on('*', (payload) => {
            setNewBulletStatus(payload.new);
          })
          .subscribe(),
      );
    }
  }, [bulletsWithStatus, bulletListener]);

  return { bulletsWithStatus, setBulletsWithStatus };
};

export const addBullet = async (values: IBulletForm) => {
  try {
    let { data, error } = await supabase.from<IBullet>('bullets').insert([values]);
    if (error) {
      console.log(error);
    }

    return data && data[0];
  } catch (error) {
    console.log('error', error);
  }
};

export const addBulletStatus = async (values: IBulletStatusForm) => {
  try {
    let { data, error } = await supabase.from<IBulletStatus>('bulletStatusLog').insert([values]);
    if (error) {
      console.log(error);
    }

    return data && data[0];
  } catch (error) {
    console.log('error', error);
  }
};

export const updateBullet = async (bullet_id: string, values: Partial<IBulletForm>) => {
  try {
    let { data, error } = await supabase
      .from<IBullet>('bullets')
      .update(values)
      .eq('id', bullet_id);
    if (error) {
      throw new Error(error.toString());
    }

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const updateBulletStatus = async (status_id: string, values: Partial<IBulletStatusForm>) => {
  try {
    let { data, error } = await supabase
      .from<IBulletStatus>('bulletStatusLog')
      .update(values)
      .eq('id', status_id);
    if (error) {
      throw new Error(error.toString());
    }

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

type fetchBulletsWithStatusType = IBulletWithStatus & { is_active: boolean };

export const fetchBulletsWithStatus = async (startDate: Date, endDate: Date) => {
  let { data: bulletStatusData, error } = await supabase
    .from<fetchBulletsWithStatusType>('bulletStatusLog')
    .select(
      `id,
        date,
        status,
        data: bullet_id (
          id,
          title,
          description,
          type,
          tags
        )
      `,
    )
    .filter('is_active', 'eq', true)
    .filter('date', 'gte', format(startDate, DATE_FORMAT.SUPABASE_DAY))
    .filter('date', 'lte', format(endDate, DATE_FORMAT.SUPABASE_DAY))
    .order('date', { ascending: true });
  if (error) console.log('error', error);
  else return bulletStatusData;
};

type deleteFutureBulletStatusesType = IBulletStatus & { bullet_id: string; is_active: boolean };

export const removeFutureBulletStatuses = async (bullet_id: string, date: Date) => {
  let { data: bulletStatusData, error } = await supabase
    .from<deleteFutureBulletStatusesType>('bulletStatusLog')
    .update({ is_active: false })
    .filter('bullet_id', 'eq', bullet_id)
    .gt('date', format(date, DATE_FORMAT.SUPABASE_DAY));
  if (error) console.log('error', error);
  else return bulletStatusData;
};
