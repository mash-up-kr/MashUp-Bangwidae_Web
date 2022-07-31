function getUserInfo() {
  const nickname = '김동현';
  const tags = ['ENFP', '맛집', '쇼핑', '피망', '피클', '피타고라스'];
  const questions = [
    {
      questionId: 1,
      questionContent: '강남에서 뭔일 있었어?',
      answerContent: '강남에서 연예인 봤잖아!',
    },
    {
      questionId: 2,
      questionContent: '비오는 날에는 뭘 먹으면 좋을까?',
      answerContent: '피자에 맥주가 최고지(?)',
    },
  ];

  return {
    userId: 1,
    nickname,
    profileDescription: `안녕하세요! 도리를 찾아서입니다:)\n모든 질문 환영해요`,
    profileImageUrl: 'https://image.url',
    representativeWardName: '우리집',
    tags,
    questions,
  } as const;
}

export default getUserInfo;
