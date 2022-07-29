function getUserInfo() {
  const userName = '김동현';
  const wards = ['커닝시티', '강남구', '송파구'];
  const tags = ['ENFP', '맛집', '쇼핑', '피망', '피클', '피타고라스'];
  const questionList = [
    {
      id: 1,
      title: '비오는 날 음식 추천해주세요!',
      commnets: [
        {
          userName: '김동현',
          content: '파전에 막걸리 어때요?',
        },
      ],
    },
    {
      id: 2,
      title: '푸바오 TV 좋아요 구독 알림설정까지!',
      commnets: [
        {
          userName: '김동현',
          content: '푸바오는 최고야',
        },
      ],
    },
    {
      id: 3,
      title: '바푸오 TV 좋아요 구독 알림설정까지!',
      commnets: [
        {
          userName: '푸바오',
          content: '김동현은 최고야',
        },
      ],
    },
  ];

  return {
    userName,
    wards,
    tags,
    questionList,
  } as const;
}

export default getUserInfo;
