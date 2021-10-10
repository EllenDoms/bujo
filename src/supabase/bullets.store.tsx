import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RealtimeSubscription } from '@supabase/realtime-js';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { endOfDay } from 'date-fns/esm';

import { BulletStatusEnum, IBullet, IBulletStatus, IBulletWithStatus } from '../types/bullets';
import { DATE_FORMAT, TimeframesEnum, today } from '../types/dates';

import { supabase } from './supabaseClient';

type ContextType = {
  bulletsWithStatus: IBulletWithStatus[];
  openBulletStatus: IBulletWithStatus[];
  initialLoading: boolean;
  error: string | null;
  selectedDate: Date;
  setSelectedDate: (startDate: Date) => void;
  setTimeframe: (timeframse: TimeframesEnum) => void;
};

type IBulletForm = Pick<IBullet, 'title' | 'description' | 'type'>;
type IBulletStatusForm = Pick<IBulletStatus, 'status' | 'date' | 'bullet_id'>;

export const BulletContext = React.createContext<ContextType>({
  bulletsWithStatus: [],
  openBulletStatus: [],
  initialLoading: true,
  error: null,
  selectedDate: today,
  setSelectedDate: () => {
    throw new Error('Did you use useBulletContext() outside of the ToastProvider?');
  },
  setTimeframe: () => {
    throw new Error('Did you use useBulletContext() outside of the ToastProvider?');
  },
});

const BulletContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [timeframe, setTimeframe] = useState<TimeframesEnum | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [bulletsWithStatus, setBulletsWithStatus] = useState<IBulletWithStatus[]>([]);
  const [newBulletStatus, setNewBulletStatus] = useState<IBulletStatus>();
  const [updatedBullet, setUpdatedBullet] = useState<IBullet>();
  const [openBulletStatus, setOpenBulletStatus] = useState<IBulletWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bulletStatusSubscription, setBulletStatusSubscription] =
    useState<RealtimeSubscription | null>(null);
  const [bulletSubscription, setBulletSubscription] = useState<RealtimeSubscription | null>(null);

  const dates = useMemo(() => {
    if (!selectedDate) return null;

    if (timeframe === TimeframesEnum.DAY) {
      let end = endOfDay(selectedDate);

      return { start: selectedDate, end };
    } else if (timeframe === TimeframesEnum.WEEK) {
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });

      return { start, end };
    } else {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);

      return { start, end };
    }
  }, [selectedDate, timeframe]);

  useEffect(() => {
    setError('');

    if (dates?.start && dates?.end) {
      const getInitialBulletsWithStatus = async (startDate: Date, endDate: Date) => {
        let { data: bulletStatusData, error } = await supabase
          .from<IBulletWithStatus>('bulletStatusLog')
          .select(
            `id,
              date,
              status,
              is_active,
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

      bulletsWithStatus.length === 0 && getInitialBulletsWithStatus(dates.start, dates.end);

      if (!bulletStatusSubscription) {
        setBulletStatusSubscription(
          supabase
            .from<IBulletStatus>('bulletStatusLog')
            .on('*', (payload) => {
              setNewBulletStatus(payload.new);
              getOpenBulletsWithStatus(subDays(today, 1)).then((res) => {
                res && setOpenBulletStatus(res);
              });
            })
            .subscribe(),
        );
      }
      if (!bulletSubscription) {
        setBulletSubscription(
          supabase
            .from<IBullet>('bullets')
            .on('UPDATE', (payload) => {
              setUpdatedBullet(payload.new);
              getOpenBulletsWithStatus(subDays(today, 1)).then((res) => {
                res && setOpenBulletStatus(res);
              });
            })
            .subscribe(),
        );
      }
    }
  }, [dates, bulletStatusSubscription, bulletsWithStatus.length, bulletSubscription]);

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
            // it's an update
            if (newBulletStatus.is_active) {
              // update is active, update it
              bulletsWithStatus[i] = { ...newBulletWithStatus };
            } else {
              // update is not active, remove it
              bulletsWithStatus.splice(i);
            }

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

  useEffect(() => {
    const handleAsync = async () => {
      if (updatedBullet) {
        // get all bulletstatuses in bulletswithstatus where bullet is this bullet
        bulletsWithStatus.forEach((bulletStatus, i) => {
          if (bulletStatus.data.id === updatedBullet.id) {
            bulletsWithStatus[i].data = updatedBullet;
          }
        });
      }
    };
    handleAsync();
  }, [bulletsWithStatus, newBulletStatus, updatedBullet]);

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
        error,
        setTimeframe,
        selectedDate,
        setSelectedDate,
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

type addBulletType = IBullet & { created_by: string };

export const addBullet = async (values: IBulletForm) => {
  const user = supabase.auth.user();
  if (!user) return null;

  try {
    let { data, error } = await supabase
      .from<addBulletType>('bullets')
      .insert([{ ...values, created_by: user.id }]);
    if (error) {
      console.log(error);
    }

    return data && data[0];
  } catch (error) {
    console.log('error', error);
  }
};

type addBulletStatusType = IBulletStatus & { created_by: string };

export const addBulletStatus = async (values: IBulletStatusForm) => {
  const user = supabase.auth.user();
  if (!user) return null;

  try {
    let { data, error } = await supabase
      .from<addBulletStatusType>('bulletStatusLog')
      .insert([{ ...values, created_by: user.id }]);
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

type deleteFutureBulletStatusesType = IBulletStatus & { bullet_id: string };

export const removeFutureBulletStatuses = async (bullet_id: string, date: Date) => {
  let { data: bulletStatusData, error } = await supabase
    .from<deleteFutureBulletStatusesType>('bulletStatusLog')
    .update({ is_active: false })
    .filter('bullet_id', 'eq', bullet_id)
    .filter('is_active', 'eq', true)
    .gt('date', date);
  if (error) console.log('error', error);
  else return bulletStatusData;
};

export const getOpenBulletsWithStatus = async (endDate: Date) => {
  let { data: bulletStatusData, error } = await supabase
    .from<IBulletWithStatus>('bulletStatusLog')
    .select(
      `id,
          date,
          status,
          is_active,
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
