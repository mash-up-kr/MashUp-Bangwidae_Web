import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';

export default class DateTime {
  private target = dayjs;

  constructor() {
    this.setup();
  }

  setup() {
    this.target.extend(relativeTime);
    this.target.locale('ko');
  }

  fromNow(pastDate: string) {
    return this.target(pastDate).fromNow();
  }

  format(targetDate: Date, formatString: string) {
    return this.target(targetDate).format(formatString);
  }
}

export const dateTime = new DateTime();
