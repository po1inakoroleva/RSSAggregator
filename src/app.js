import i18next from 'i18next';
import { uniqueId } from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import ru from './locales/ru.js';
import render from './render.js';
import parser from './parser.js';

const validate = (url, urlList) => {
  const schema = yup.string().trim().required().url().notOneOf(urlList);
  return schema.validate(url);
};

const getAxiosResponse = (url) => {
  const allOrigins = 'https://allorigins.hexlet.app/get';
  const newUrl = new URL(allOrigins);
  newUrl.searchParams.set('url', url);
  newUrl.searchParams.set('disableCache', 'true');
  return axios.get(newUrl);
};

const createPosts = (state, posts, feedId) =>
  posts.map((post) => state.content.posts.push({ post, feedId }));

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru,
      },
    })
    .then(() => {
      const initialState = {
        valid: true,
        inputValue: '',
        process: {
          processState: 'filling',
          error: {},
        },
        content: {
          feeds: [],
          posts: [],
        },
        uiState: {
          visitedLinksIds: new Set(),
          modalId: '',
        },
        i: '0',
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('input[name="url"]'),
        submitBtn: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
      };

      const state = onChange(initialState, render(elements, initialState, i18nextInstance));

      elements.form.addEventListener('input', (e) => {
        e.preventDefault();

        state.process.processState = 'filling';
        state.inputValue = e.target.value;
      });

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const urlList = state.content.feeds.map(({ link }) => link);
        validate(state.inputValue, urlList)
          .then(() => {
            state.valid = true;
            state.process.processState = 'sending';
            return getAxiosResponse(state.inputValue);
          })
          .then((responce) => {
            const data = responce.data.contents;
            const { feed, posts } = parser(data);
            const feedId = uniqueId();

            state.content.feeds.push({ ...feed, feedId, link: state.inputValue });
            createPosts(state, posts, feedId);
            state.process.processState = 'finished';
            console.log(state);
          })
          .catch((error) => {
            state.valid = false;
            state.process.error = error.message ?? 'defaultError';
            state.process.processState = 'error';
          });
      });
    });
};
