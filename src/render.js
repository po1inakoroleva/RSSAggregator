/* eslint-disable no-param-reassign, no-console  */

const renderFeedback = (elements, i18nextInstance) => {
  if (elements.input.classList.contains('is-invalid')) {
    elements.input.classList.remove('is-invalid');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
  }

  elements.feedback.textContent = i18nextInstance.t('finished');
};

const renderErrors = (elements, value, i18nextInstance) => {
  let error = '';

  if (value === 'isEmpty') {
    error = i18nextInstance.t('errors.isEmpty');
  } else if (value === 'invalidUrl') {
    error = i18nextInstance.t('errors.invalidUrl');
  } else if (value === 'rssAlreadyExists') {
    error = i18nextInstance.t('errors.rssAlreadyExists');
  } else if (value === 'parserError') {
    error = i18nextInstance.t('errors.invalidRss');
  } else {
    error = i18nextInstance.t('errors.networkError');
  }

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

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;

    ul.append(li);
    li.append(h3);
    li.append(p);
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
      'border-end-0',
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
    button.dataset.bsTarget = '#modal';
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

const renderModal = (elements, state) => {
  const { modalId } = state.uiState;
  const post = state.content.posts.find(({ id }) => id === modalId);
  elements.modalTitle.innerHTML = `<h5 class="modal-title">${post.title}</h5>`;
  elements.modalBody.textContent = post.description;
  elements.modalButton.setAttribute('href', post.link);
};

const renderPreview = (elements, state) => {
  const posts = elements.posts.querySelectorAll('li');
  posts.forEach((post) => {
    const aElement = post.querySelector('a');
    if (
      state.uiState.visitedLinksIds.has(aElement.dataset.id)
      && aElement.classList.contains('fw-bold')
    ) {
      aElement.classList.remove('fw-bold');
      aElement.classList.add('fw-normal', 'link-secondary');
    }
  });
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
      renderErrors(elements, value, i18nextInstance);
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

    case 'uiState.modalId':
      renderModal(elements, state);
      break;

    case 'uiState.visitedLinksIds':
      renderPreview(elements, state);
      break;

    default:
      break;
  }
};
