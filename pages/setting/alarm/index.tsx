import api from 'src/api/core';

export function getMyNotificationSetting() {
  return api.get({
    url: `/api/user/settings`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/Alarm';
