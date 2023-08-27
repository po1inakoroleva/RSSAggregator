/* eslint-disable no-param-reassign, no-console  */
import _ from 'lodash';

const renderErrors = (elements, error, prevError) => {
  const fieldHadError = !_.isEmpty(prevError);
  const fieldHasError = !_.isEmpty(error);

  if (!fieldHadError && !fieldHasError) {
    return;
  }
  if (fieldHadError && !fieldHasError) {
    elements.input.classList.remove('is-invalid');
    elements.feedback.textContent = '';
  }
  if (!fieldHadError && fieldHasError) {
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = error;
  }
  if (fieldHadError && fieldHasError) {
    elements.feedback.textContent = error;
  }
};

const createContainer = (elements, type, i18nextInstance) => {
  const container = elements[type];

  const div1 = document.createElement('div');
  div1.classList.add('card', 'border-0');
  container.append(div1);

  const div2 = document.createElement('div');
  div2.classList.add('card-body');
  div1.append(div2);

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nextInstance.t(`content.${type}`);
  div2.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  ul.dataset.ul = `${type}`;
  div1.append(ul);
};

const renderFeeds = (elements, state, i18nextInstance) => {
  if (state.content.feeds.length === 1) {
    createContainer(elements, 'feeds', i18nextInstance);
  }

  const lastFeed = state.content.feeds.at(-1);
  const ul = document.querySelector('[data-ul="feeds"]');
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  li.innerHTML = `<h3 class="h6 m-0">${lastFeed.title}</h3>
  <p class="m-0 small text-black-50">${lastFeed.description}</p>`;
  ul.append(li);
};

const renderPosts = (elements, state) => {};

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'finished':
      elements.submitBtn.disabled = false;
      break;

    case 'error':
      elements.submitBtn.disabled = false;
      break;

    case 'sending':
      elements.submitBtn.disabled = true;
      break;

    case 'filling':
      elements.submitBtn.disabled = false;
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

export default (elements, state, i18nextInstance) => (path, value, prevValue) => {
  switch (path) {
    case 'process.error':
      renderErrors(elements, value, prevValue);
      break;

    case 'process.processState':
      handleProcessState(elements, state.process.processState);
      break;

    case 'content.feeds':
      renderFeeds(elements, state, i18nextInstance);
      break;

    case 'content.posts':
      renderPosts(elements, state, i18nextInstance);
      break;

    default:
      break;
  }
};
