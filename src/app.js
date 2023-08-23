import i18next from 'i18next';
import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import ru from './locales/ru.js';
import render from './render.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    })
    .then(() => {
      const initialState = {
        processState: 'filling',
        catalog: {
          posts: [],
          feeds: [],
        },
        form: {
          valid: true,
          errors: {},
          url: '',
        },
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('input[name="url"]'),
        submitBtn: document.querySelector('button[type="submit"]'),
        error: document.querySelector('.text-danger'),
      };
      const state = onChange(initialState, render(elements, initialState));

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const value = formData.get('url');
        state.form.url = value.trim();

        const schema = yup.object().shape({
          url: yup
            .string(i18nextInstance.t('errors.invalidUrl'))
            .url(i18nextInstance.t('errors.invalidUrl'))
            .notOneOf(state.catalog.feeds, i18nextInstance.t('errors.rssAlreadyExists')),
        });
        const validate = (field) => {
          try {
            schema.validateSync(field, { abortEarly: false });
            return {};
          } catch (err) {
            return _.keyBy(err.inner, 'path');
          }
        };

        const errors = validate(state.form);
        state.form.errors = errors;
        state.form.valid = _.isEmpty(errors);
        if (state.form.valid) {
          state.catalog.feeds.push(value.trim());
          elements.form.reset();
          elements.input.focus();
        }
      });
    });
};
