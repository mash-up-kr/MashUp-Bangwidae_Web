import api from '@/src/api/core';

export const ALARM_QUERY_KEY = {
  ALRAM: 'alarm',
};

function fetchAlarmList() {
  return api.get({
    url: `/api/notifications?size=20`,
  });
}

export default fetchAlarmList;
