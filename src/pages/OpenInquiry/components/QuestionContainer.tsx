import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import TwoLayerContainer from './TwoLayerComponent';
import { ContainerTitle } from './styledComponent';

interface Props {
  id: string;
  title: string;
  content: ReactNode;
}

function QuestionContainer({ id, title, content }: Props) {
  const router = useRouter();

  return (
    <TwoLayerContainer
      withBackground
      top={<ContainerTitle>Q. {title}</ContainerTitle>}
      bottom={content}
      onClick={() => router.push(`/question-detail?questionId=${id}`)}
      style={{ marginRight: 8, padding: '0 16px', minWidth: 220 }}
    />
  );
}

export default QuestionContainer;
