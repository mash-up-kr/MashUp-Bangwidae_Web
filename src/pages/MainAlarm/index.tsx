import { useQuery } from 'react-query';
import { dateTime } from 'src/utils/DateTime';
import AlarmListRow from './components/ListRow';
import fetchAlarmList, { ALARM_QUERY_KEY } from './remote/fetchAlarmList';

interface Alarm {
  id: string;
  type: 'QUESTION_RECEIVED' | 'QUESTION_ANSWERED' | 'LEVEL_UP';
  title: string;
  content: string;
  read: boolean;
  urlScheme: string;
  createdAt: Date;
}

function MainAlarm() {
  const { data, isLoading } = useQuery(ALARM_QUERY_KEY.ALRAM, fetchAlarmList);

  if (isLoading) return null;

  return data.values.map((alarm: Alarm) => (
    <AlarmListRow
      key={alarm.id}
      type={alarm.type}
      title={alarm.title}
      content={alarm.content}
      createdAt={dateTime.format(alarm.createdAt, 'MM.DD')}
    />
  ));
}

export default MainAlarm;
