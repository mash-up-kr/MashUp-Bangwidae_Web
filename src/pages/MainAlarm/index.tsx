import { useQuery } from 'react-query';
import AlarmListRow from './components/ListRow';
import fetchAlarmList, { ALARM_QUERY_KEY } from './remote/fetchAlarmList';

function MainAlarm() {
  const { data, isLoading } = useQuery(ALARM_QUERY_KEY.ALRAM, fetchAlarmList);

  if (isLoading) return null;

  console.log(data.values);

  return data.values.map((alarm: any) => (
    <AlarmListRow title={alarm.title} content={alarm.content} createdAt={} />
  ));
}

export default MainAlarm;
