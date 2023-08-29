/* eslint-disable no-param-reassign, no-console  */

const renderFeedback = (elements, i18nextInstance) => {
  if (elements.input.classList.contains('is-invalid')) {
    elements.input.classList.remove('is-invalid');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
  }

  elements.feedback.textContent = i18nextInstance.t('finished');
};

const renderErrors = (elements, error) => {
  if (!elements.input.classList.contains('is-invalid')) {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = error;
  } else {
    elements.feedback.textContent = error;
  }
};

const renderFeeds = (state, divCard) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  state.content.feeds.forEach((feed) => {
    const { title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class="h6 m-0">${title}</h3>
    <p class="m-0 small text-black-50">${description}</p>`;
    ul.append(li);
  });
  divCard.append(ul);
};

const renderPosts = (state, divCard, i18nextInstance) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  state.content.posts.forEach((post) => {
    const { link, title, id } = post;
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0'
    );

    const a = document.createElement('a');
    a.href = link;
    a.classList.add('fw-bold');
    a.dataset.id = id;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = title;

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bstarget = '#modal';
    button.textContent = i18nextInstance.t('content.watchPost');

    ul.append(li);
    li.append(a, button);
  });

  divCard.append(ul);
};

const createContainer = (elements, state, type, i18nextInstance) => {
  const container = elements[type];
  container.textContent = '';

  const divCard = document.createElement('div');
  divCard.classList.add('card', 'border-0');

  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nextInstance.t(`content.${type}`);

  container.append(divCard);
  divCard.append(divCardBody);
  divCardBody.append(h2);

  if (type === 'feeds') {
    renderFeeds(state, divCard);
  }
  if (type === 'posts') {
    renderPosts(state, divCard, i18nextInstance);
  }
};

const handleProcessState = (elements, processState, i18nextInstance) => {
  switch (processState) {
    case 'error':
      elements.submitBtn.disabled = false;
      break;

    case 'finished':
      elements.submitBtn.disabled = false;
      renderFeedback(elements, i18nextInstance);
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

export default (elements, state, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'process.error':
      renderErrors(elements, value);
      break;

    case 'process.processState':
      handleProcessState(elements, state.process.processState, i18nextInstance);
      break;

    case 'content.feeds':
      createContainer(elements, state, 'feeds', i18nextInstance);
      break;

    case 'content.posts':
      createContainer(elements, state, 'posts', i18nextInstance);
      break;

    default:
      break;
  }
};
