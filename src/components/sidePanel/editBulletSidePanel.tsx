import React from 'react';
import { format } from 'date-fns';
import { Formik } from 'formik';

import { addBullet, addBulletStatus, updateBullet } from '../../supabase/bullets.store';
import { BulletStatusEnum, BulletTypeEnum, IBullet } from '../../types/bullets';
import { DATE_FORMAT } from '../../types/dates';
import { Button } from '../button/button';
import { DropdownField } from '../form/dropdownField';
import { InputField } from '../form/inputField';
import { TextareaField } from '../form/textareaField';

import { SidePanel } from './sidePanel';

interface Props {
  bullet?: IBullet;
  onClose: () => void;
  isShown: boolean;
  defaultDate: Date;
}

type formProps = {
  title: string;
  description: string;
  type: BulletTypeEnum;
  date: string;
};

export function EditBulletSidePanel({ bullet, defaultDate, isShown, onClose }: Props) {
  const handleSubmit = (values: formProps) => {
    const payload = {
      title: values.title,
      description: values.description,
      type: values.type as BulletTypeEnum,
    };
    if (bullet) {
      // update bullet
      updateBullet(bullet.id, payload).then(() => onClose());
    } else {
      // add new bullet
      addBullet(payload)
        .then(
          (res) =>
            res &&
            addBulletStatus({
              bullet_id: res.id,
              date: new Date(Date.parse(values.date)),
              status: BulletStatusEnum.OPEN,
            }),
        )
        .then(() => onClose());
    }
  };

  return (
    <SidePanel isShown={isShown} onClose={onClose} title="Add new bullet">
      <Formik
        initialValues={{
          title: bullet?.title || '',
          description: bullet?.description || '',
          type: bullet?.type || BulletTypeEnum.TODO,
          date: format(defaultDate, DATE_FORMAT.SUPABASE_DAY),
        }}
        onSubmit={(values, { setSubmitting }) => handleSubmit(values)}
        validate={(values) => {
          let errors = {};
          if (!values.title) {
            errors = { ...errors, title: 'Required' };
          }
          if (!values.type) {
            errors = { ...errors, type: 'Required' };
          }
          if (!values.date) {
            errors = { ...errors, date: 'Required' };
          }

          return errors;
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form onSubmit={handleSubmit}>
            {!bullet && (
              <InputField
                error={errors.date && touched.date && errors.date}
                handleChange={handleChange}
                label="date"
                onBlur={handleBlur}
                type="date"
                value={values.date}
                isRequired
              />
            )}
            <InputField
              error={errors.title && touched.title && errors.title}
              handleChange={handleChange}
              label="title"
              onBlur={handleBlur}
              type="text"
              value={values.title}
              isRequired
            />
            <TextareaField
              error={errors.description && touched.description && errors.description}
              handleChange={handleChange}
              label="description"
              onBlur={handleBlur}
              value={values.description}
            />
            <DropdownField
              error={errors.type && touched.type && errors.type}
              handleChange={handleChange}
              label="type"
              onBlur={handleBlur}
              options={[
                BulletTypeEnum.TODO,
                BulletTypeEnum.EVENT,
                BulletTypeEnum.BIRTHDAY,
                BulletTypeEnum.NOTE,
              ]}
              value={values.type}
              isRequired
            />
            <Button
              buttonType="submit"
              isDisabled={isSubmitting}
              label={bullet ? 'Save bullet' : 'Add bullet'}
            />
          </form>
        )}
      </Formik>
    </SidePanel>
  );
}
