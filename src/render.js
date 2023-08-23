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
    elements.error.textContent = '';
  }
  if (!fieldHadError && fieldHasError) {
    elements.input.classList.add('is-invalid');
    elements.error.textContent = error.url.message;
  }
  if (fieldHadError && fieldHasError) {
    elements.error.textContent = error.url.message;
  }
};

export default (elements, initialState) => (path, value, prevValue) => {
  switch (path) {
    case 'form.errors':
      renderErrors(elements, value, prevValue);
      break;

    default:
      break;
  }
};
