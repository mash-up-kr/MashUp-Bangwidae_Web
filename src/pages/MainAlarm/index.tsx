import { useQuery } from 'react-query';
import AlarmListRow from './components/ListRow';
import { ALARM_QUERY_KEY, fetchAlarmList } from './remote/fetchAlarmList';
import { Alarm } from './utils/types';

function MainAlarm() {
  const { data, isLoading } = useQuery(ALARM_QUERY_KEY.ALRAM, fetchAlarmList);

  if (isLoading) return null;

  return data.values.map((alarm: Alarm) => <AlarmListRow key={alarm.id} {...alarm} />);
}

export default MainAlarm;
