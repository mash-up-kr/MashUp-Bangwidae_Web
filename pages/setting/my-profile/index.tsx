import api from 'src/api/core';
import { dehydrate, QueryClient } from 'react-query';

// TODO: 공용 const 폴더로 이동
export const QUERY_KEYS = {
  MY_PROFILE: 'myProfile/info',
  OPEN_INQUIRY: 'openInquiry',
  WARD_LIST: 'myProfile/wardList',
  UPDATE_PROFILE: 'myProfile/update',
  UPDATE_PROFILE_IMAGE: 'myProfile/image/update',
  RESET_PROFILE_IMAGE: 'myProfile/image/reset',
};

const TEST_USER_ID = '62d7f4776ad96c51d4330ea2';

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QUERY_KEYS.MY_PROFILE], getProfileInfo);
  await queryClient.prefetchQuery([QUERY_KEYS.WARD_LIST], getMyWardList);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export function getProfileInfo() {
  return api.get({
    url: `/api/user/${TEST_USER_ID}/info`,
  });
}

export function getMyWardList() {
  return api.get({
    url: `/api/ward`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/MyProfile';
