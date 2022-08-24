import Flex from '@/src/components/Flex';
import TwoLayerContainer from './TwoLayerComponent';
import { ContainerTitle, TendencyTag } from './styledComponent';

interface Props {
  title: string;
  tags: string[];
}

function TendencyContainer({ title, tags }: Props) {
  return (
    <TwoLayerContainer
      withBackground
      top={<ContainerTitle>{title}</ContainerTitle>}
      bottom={
        <Flex>
          {tags.slice(0, 3).map((tag) => (
            <TendencyTag key={tag}>{tag}</TendencyTag>
          ))}
          <TendencyTag>+{tags.length - 3}</TendencyTag>
        </Flex>
      }
      style={{ margin: '0 8px', padding: '0 16px' }}
    />
  );
}

export default TendencyContainer;
