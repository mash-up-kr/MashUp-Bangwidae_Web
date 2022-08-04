// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/QuestionDetail';

export async function getServerSideProps() {
  // TODO: Fetch data from external API
  const { success, data } = {
    success: true,
    data: {
      id: '62e5408427d0d407aaeedb38',
      user: {
        id: '62d7f4776ad96c51d4330ea2',
        tags: ['test1', 'test2', 'test3'],
        nickname: '정종민',
        profileImageUrl:
          'https://dori-dori-bucket.kr.object.ncloudstorage.com/profile/da26c773-30f4-473e-989b-e2f3fdf825ff%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%91%E1%85%B5%E1%86%AF.png',
      },
      content: '포스트 노익명 작성',
      likeCount: 0,
      commentCount: 0,
      userLiked: false,
      representativeAddress: '서초구',
      anonymous: false,
      createdAt: '2022-07-30T23:30:28.261',
      updatedAt: '2022-07-30T23:30:28.261',
    },
  };

  if (!success) {
    // TODO: Handle fetching error
    return { props: { data: null } };
  }

  return { props: { data } };
}
