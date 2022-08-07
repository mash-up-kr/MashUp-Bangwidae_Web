/* eslint-disable react/button-has-type */
import { useState } from 'react';
import Flex from '@/src/components/Flex';
import WardInfoContainer from './components/WardInfoContainer';
import WardConfirmModal from './components/WardConfirmModal';

function MyWard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex style={{ padding: 16 }}>
      <Flex style={{}}>
        <button onClick={() => setIsOpen(true)}>모달 테스트를 위한 버튼</button>
        <WardInfoContainer type="new" location="강남구" remainDays="D-10" />
        {isOpen && (
          <WardConfirmModal
            location="강남구"
            onConfirm={() => {
              setIsOpen(false);
            }}
            onCancel={() => {
              setIsOpen(false);
            }}
          />
        )}
      </Flex>
    </Flex>
  );
}

export default MyWard;
