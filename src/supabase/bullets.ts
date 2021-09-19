import { useEffect, useState } from 'react';
import { RealtimeSubscription } from '@supabase/supabase-js';
import { format } from 'date-fns';

import { Bullet, BulletStatus } from '../types/bullets';
import { DATE_FORMAT } from '../types/dates';

import { supabase } from './supabaseClient';

type Props = {
  selectedDate: Date;
};

export const useBulletsStore = ({ selectedDate }: Props) => {
  const [bulletsWithStatus, setBulletsWithStatus] = useState<BulletStatus[]>([]);
  const [newBulletStatus, setNewBulletStatus] = useState<BulletStatus>();
  const [bulletListener, setBulletListener] = useState<RealtimeSubscription | null>(null);

  useEffect(() => {
    fetchBulletsWithStatus(selectedDate)
      .then((response) => {
        setBulletsWithStatus(response as BulletStatus[]);
      })
      .catch(console.error);
  }, [selectedDate]);

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

export const addBullet = async (values: Bullet) => {
  try {
    let { data, error } = await supabase.from('bullets').insert([values]);
    if (error) {
      console.log(error);
    }

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const addBulletStatus = async (values: BulletStatus) => {
  try {
    let { data, error } = await supabase.from('bulletStatusLog').insert([values]);
    if (error) {
      console.log(error);
    }

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const updateBullet = async (bullet_id: string, values: Bullet) => {
  try {
    let { data, error } = await supabase.from('bullets').update(values).eq('id', bullet_id);
    if (error) {
      throw new Error(error.toString());
    }

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const updateBulletStatus = async (status_id: string, values: any) => {
  try {
    let { data, error } = await supabase.from('bulletStatusLog').update(values).eq('id', status_id);
    if (error) {
      throw new Error(error.toString());
    }

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const fetchBulletsWithStatus = async (selectedDate: Date) => {
  let { data: bulletStatusData, error } = await supabase
    .from('bulletStatusLog')
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
    .filter('date', 'eq', format(selectedDate, DATE_FORMAT.SUPABASE_DAY))
    .order('id', { ascending: true });
  if (error) console.log('error', error);
  else return bulletStatusData;
};
