import axios from 'axios';
import { uniqueId } from 'lodash';
import parser from './parser.js';

const getAxiosResponse = (url) => {
  const allOrigins = 'https://allorigins.hexlet.app/get';
  const newUrl = new URL(allOrigins);
  newUrl.searchParams.set('url', url);
  newUrl.searchParams.set('disableCache', 'true');
  return axios.get(newUrl);
};

const createPosts = (state, posts, feedId) => {
  posts.map((post) => {
    const id = uniqueId();
    return state.content.posts.push({ ...post, feedId, id });
  });
};

const getNewPosts = (state) => {
  const promises = state.content.feeds.map(({ link, feedId }) =>
    getAxiosResponse(link).then((response) => {
      const { posts } = parser(response.data.contents);
      const addedPosts = state.content.posts.map((post) => post.link);
      const newPosts = posts.filter((post) => !addedPosts.includes(post.link));
      if (newPosts.length > 0) {
        createPosts(state, newPosts, feedId);
      }
      return Promise.resolve();
    })
  );

  Promise.allSettled(promises).finally(() => {
    setTimeout(() => getNewPosts(state), 5000);
  });
};

export { getAxiosResponse, createPosts, getNewPosts };
