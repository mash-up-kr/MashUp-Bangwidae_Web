import api from 'src/api/core';

export function getTerms() {
  return api.get({
    url: `/api/terms`,
  });
}

export { default } from 'pages/Terms';
