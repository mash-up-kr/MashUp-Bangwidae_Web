import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { TERMS } from '@/src/consts/query';
import { dateTime } from '@/src/utils/DateTime';
import { sendPostMessage } from '@/src/utils/sendPostMessage';
import { ItemWrapper, Title, Date, Content, SettingWrapper } from '@/src/components/Setting';
import { getTerms } from '@/pages/setting/terms';

type TermsType = {
  id: string;
  title: string;
  necessary: boolean;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

function Terms() {
  const { query } = useRouter();
  const { data, isLoading }: { data?: TermsType[]; isLoading: boolean } = useQuery(TERMS, getTerms);

  const handleClick = (value: TermsType) => () => {
    sendPostMessage({
      url: `/setting/terms?termsId=${value.id}`,
      title: value.title,
    });
  };

  if (isLoading) {
    return <div />;
  }

  if (query.termsId) {
    const terms = data?.find((i) => query.termsId === i.id) as TermsType;
    return (
      <SettingWrapper>
        <Content>{terms.content}</Content>
      </SettingWrapper>
    );
  }

  return (
    <SettingWrapper>
      {data?.map((terms: TermsType) => (
        <ItemWrapper key={terms.id} onClick={handleClick(terms)}>
          <Title>{terms.title}</Title>
          <Date>
            {dateTime.format(terms.updatedAt, 'YYYY.MM.DD')}{' '}
            {terms.updatedAt === terms.createdAt ? '최초 공지' : '개정'}
          </Date>
        </ItemWrapper>
      ))}
    </SettingWrapper>
  );
}

export default Terms;
