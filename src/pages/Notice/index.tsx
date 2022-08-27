import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { NOTICE_LIST } from '@/src/consts/query';
import { getNoticeList } from '@/pages/setting/notice';
import { dateTime } from '@/src/utils/DateTime';
import { sendPostMessage } from '@/src/utils/sendPostMessage';
import { ItemWrapper, Title, Date, Content, SettingWrapper } from '@/src/components/Setting';

type NoticeType = {
  id: string;
  title: string;
  createdAt: Date;
  content: string;
};

function Notice() {
  const { query } = useRouter();
  const { data, isLoading }: { data?: { values: NoticeType[] }; isLoading: boolean } = useQuery(
    NOTICE_LIST,
    getNoticeList,
  );

  const handleClick = (value: NoticeType) => () => {
    sendPostMessage({
      url: `/setting/notice?noticeId=${value.id}`,
      title: '공지사항',
    });
  };

  if (isLoading) {
    return <div />;
  }

  if (query.noticeId) {
    const notice = data?.values.find((i) => query.noticeId === i.id) as NoticeType;
    return (
      <SettingWrapper>
        <ItemWrapper>
          <Title>{notice.title}</Title>
          <Date>{dateTime.format(notice.createdAt, 'YYYY.MM.DD')}</Date>
        </ItemWrapper>
        <Content>{notice.content}</Content>
      </SettingWrapper>
    );
  }

  return (
    <SettingWrapper>
      {data?.values.map((notice: NoticeType) => (
        <ItemWrapper key={notice.id} onClick={handleClick(notice)}>
          <Title>{notice.title}</Title>
          <Date>{dateTime.format(notice.createdAt, 'YYYY.MM.DD')}</Date>
        </ItemWrapper>
      ))}
    </SettingWrapper>
  );
}

export default Notice;
