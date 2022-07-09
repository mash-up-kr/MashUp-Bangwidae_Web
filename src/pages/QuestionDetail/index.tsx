import { useState } from 'react';
import TextField from '@/src/components/TextField';

function QuestionDetail() {
  const [value, setValue] = useState('');
  const handleChange = (v: string) => {
    setValue(v);
  };

  return (
    <>
      <div>질문 상세페이지입니다.</div>
      <TextField
        value={value}
        onChange={handleChange}
        label="라벨"
        placeholder="플레이스홀더"
        maxLength={10}
        hintText={value.length > 10 ? '힌트텍스트입니다.' : undefined}
      />
    </>
  );
}

export default QuestionDetail;
