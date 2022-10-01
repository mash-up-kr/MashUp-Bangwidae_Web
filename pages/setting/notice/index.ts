import api from 'src/api/core';

export function getNoticeList() {
  return api.get({
    url: `/notice?size=${100}`,
  });
}

export { default } from 'pages/Notice';
