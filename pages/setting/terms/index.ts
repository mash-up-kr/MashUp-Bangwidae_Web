import api from 'src/api/core';

export function getTerms() {
  return api.get({
    url: `/terms`,
  });
}

export { default } from 'pages/Terms';
