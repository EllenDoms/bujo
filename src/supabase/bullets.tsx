import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RealtimeSubscription } from '@supabase/realtime-js';
import { endOfMonth, endOfWeek, format, subDays } from 'date-fns';

import { BulletStatusEnum, IBullet, IBulletStatus, IBulletWithStatus } from '../types/bullets';
import { DATE_FORMAT, TimeframesEnum } from '../types/dates';

import { supabase } from './supabaseClient';

type ContextType = {
  bulletsWithStatus: IBulletWithStatus[];
  openBulletStatus: IBulletWithStatus[];
  initialLoading: boolean;
  setStartDate: (startDate: Date) => void;
  setTimeframe: (timeframse: TimeframesEnum) => void;
};

type IBulletForm = Pick<IBullet, 'title' | 'description' | 'type'>;
type IBulletStatusForm = Pick<IBulletStatus, 'status' | 'date' | 'bullet_id'>;
type fetchBulletsWithStatusType = IBulletWithStatus & { is_active: boolean };

export const BulletContext = React.createContext<ContextType>({
  bulletsWithStatus: [],
  openBulletStatus: [],
  initialLoading: true,
  setStartDate: () => {
    throw new Error('Did you use useBulletContext() outside of the ToastProvider?');
  },
  setTimeframe: () => {
    throw new Error('Did you use useBulletContext() outside of the ToastProvider?');
  },
});

const BulletContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [timeframe, setTimeframe] = useState<TimeframesEnum | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [bulletsWithStatus, setBulletsWithStatus] = useState<IBulletWithStatus[]>([]);
  const [newBulletStatus, setNewBulletStatus] = useState<IBulletStatus>();
  const [openBulletStatus, setOpenBulletStatus] = useState<IBulletWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bulletStatusSubscription, setBulletStatusSubscription] =
    useState<RealtimeSubscription | null>(null);

  const endDate = useMemo(() => {
    if (!startDate) return null;

    if (timeframe === TimeframesEnum.DAY) {
      return startDate;
    } else if (timeframe === TimeframesEnum.WEEK) {
      return endOfWeek(startDate, { weekStartsOn: 1 });
    } else {
      return endOfMonth(startDate);
    }
  }, [startDate, timeframe]);

  useEffect(() => {
    setInitialLoading(true);
    setError('');

    if (startDate && endDate) {
      getInitialBulletsWithStatus(startDate, endDate);

      if (!bulletStatusSubscription) {
        setBulletStatusSubscription(
          supabase
            .from<IBulletStatus>('bulletStatusLog')
            .on('*', (payload) => {
              setNewBulletStatus(payload.new);
              getOpenBulletsWithStatus(new Date()).then((res) => {
                res && setOpenBulletStatus(res);
              });
            })
            .subscribe(),
        );
      }
    }

    return () => {
      bulletStatusSubscription && supabase.removeSubscription(bulletStatusSubscription);
      console.log('Remove supabase subscription by useEffect unmount');
    };
  }, [startDate, endDate, bulletStatusSubscription]);

  useEffect(() => {
    const handleAsync = async () => {
      if (newBulletStatus) {
        const { bulletData, bulletError } = await getBullet(newBulletStatus.bullet_id);
        if (!bulletData || bulletError) return;

        const newBulletWithStatus: IBulletWithStatus = {
          ...newBulletStatus,
          data: bulletData,
        };

        let update = bulletsWithStatus.find((bulletStatus, i) => {
          if (bulletStatus.id === newBulletStatus.id) {
            bulletsWithStatus[i] = { ...newBulletWithStatus };

            return true;
          } else {
            return false;
          }
        });

        if (update) {
          setBulletsWithStatus((t) => [...bulletsWithStatus]); // update
          setNewBulletStatus(undefined);
        } else {
          bulletsWithStatus.push(newBulletWithStatus);
          setBulletsWithStatus((t) => [...bulletsWithStatus]); // update
          setNewBulletStatus(undefined);
        }
      }
    };
    handleAsync();
  }, [bulletsWithStatus, newBulletStatus]);

  const getInitialBulletsWithStatus = async (startDate: Date, endDate: Date) => {
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
      .order('date' && 'id', { ascending: true });

    if (error) {
      setError(error.message);
      bulletStatusSubscription && supabase.removeSubscription(bulletStatusSubscription);
      setBulletStatusSubscription(null);

      return;
    }

    bulletStatusData && setBulletsWithStatus(bulletStatusData);
    setInitialLoading(false);
  };

  useEffect(() => {
    getOpenBulletsWithStatus(subDays(new Date(), 1)).then((res) => {
      res && setOpenBulletStatus(res);
    });
  }, []);

  return (
    <BulletContext.Provider
      value={{
        bulletsWithStatus,
        openBulletStatus,
        initialLoading,
        setTimeframe,
        setStartDate,
      }}
    >
      {children}
    </BulletContext.Provider>
  );
};

const useBulletContext = () => useContext(BulletContext);

export const getBullet = async (id: string) => {
  let { data: bulletData, error: bulletError } = await supabase
    .from<IBullet>('bullets')
    .select()
    .filter('id', 'eq', id);
  if (bulletError) {
    console.log('error: ', bulletError);
  }

  return { bulletData: bulletData && bulletData[0], bulletError };
};

export { BulletContextProvider, BulletContext as default, useBulletContext };

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
type getOpenBulletStatusesType = IBulletWithStatus & { is_active: boolean };

export const getOpenBulletsWithStatus = async (endDate: Date) => {
  let { data: bulletStatusData, error } = await supabase
    .from<getOpenBulletStatusesType>('bulletStatusLog')
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
    .filter('status', 'eq', BulletStatusEnum.OPEN)
    .filter('date', 'lte', format(endDate, DATE_FORMAT.SUPABASE_DAY))
    .order('date', { ascending: true });

  if (error) console.log('error', error);
  else return bulletStatusData;
};
