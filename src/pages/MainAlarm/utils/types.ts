export interface Alarm {
  id: string;
  type: 'QUESTION_RECEIVED' | 'QUESTION_ANSWERED' | 'LEVEL_UP';
  title: string;
  content: string;
  read: boolean;
  urlScheme: string;
  createdAt: Date;
}
