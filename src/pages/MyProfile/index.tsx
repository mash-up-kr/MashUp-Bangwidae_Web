import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import axios from 'axios';
import FormData from 'form-data';
import Cancel from 'public/icons/cancel.svg';
import TextField from '@/src/components/TextField';
import { typography } from '@/styles';
import { LargeLineButton } from '@/src/components';
import { getMyWardList, getProfileInfo, QUERY_KEYS } from '@/pages/setting/my-profile';
import { useProfileImageResetter, useProfileInfoUpdater } from './mutations';
import SnackBar from '@/src/components/SnackBar';
import LineChip from '@/src/components/LineChip';

// eslint-disable-next-line @typescript-eslint/naming-convention
type MY_PROFILE_INPUT_TYPE = 'description' | 'interests';

// TODO
// 관심분야 3개 모두 지정한 경우 → input 히든 처리 O
// 변경하기 완료 후 snackbar 표출
// snackbar 꺼진 뒤 콜백받도록 수정
// 대표와드 설정 api
// 대표와드 표출
// radio button 컴포넌트 생성
// radio button 컴포넌트 적용
// LineChip active 색상 필요
function MyProfile() {
  const { data: profileInfo } = useQuery(QUERY_KEYS.MY_PROFILE, getProfileInfo);
  const { data: wardList } = useQuery(QUERY_KEYS.WARD_LIST, getMyWardList);

  const [profileInfoValue, setProfileInfoValue] = useState<Record<MY_PROFILE_INPUT_TYPE, string>>({
    description: '',
    interests: '',
  });
  const [interestList, setInterestList] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<{ file?: Blob; url?: string }>({
    file: undefined,
    url: undefined,
  });
  const imageInput = useRef<HTMLInputElement>(null);

  const updateProfileImage = async () => {
    if (profileImage.file) {
      // FIXME: react-qeury로 변경 필요
      const formData = new FormData();
      formData.append('image', profileImage.file);
      await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/profile/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOCK_TOKEN}`,
        },
      });
      return;
    }
    submitProfileDefaultImg();
  };

  const { mutate: submitProfileInfo } = useProfileInfoUpdater(
    {
      description: profileInfoValue.description,
      tags: interestList,
    },
    updateProfileImage,
  );
  const { mutate: submitProfileDefaultImg } = useProfileImageResetter();

  useEffect(() => {
    setProfileInfoValue({ description: profileInfo?.profileDescription || '', interests: '' });
    setInterestList(profileInfo?.tags || []);
    setProfileImage({ url: profileInfo?.profileImageUrl });
  }, [profileInfo, wardList, setProfileInfoValue, setInterestList, setProfileImage]);

  const handleChange = useCallback(
    (key: MY_PROFILE_INPUT_TYPE) => (value: string) => {
      setProfileInfoValue({
        ...profileInfoValue,
        [key]: value,
      });
    },
    [profileInfoValue, setProfileInfoValue],
  );

  const handleTagAdd = useCallback(() => {
    if (!profileInfoValue.interests) {
      return;
    }
    setInterestList([...interestList, profileInfoValue.interests]);
    setProfileInfoValue({ ...profileInfoValue, interests: '' });
  }, [interestList, setInterestList, profileInfoValue.interests]);

  const handleTagRemove = useCallback(
    (index: number) => () => {
      const list = interestList;
      list.splice(index, 1);
      setInterestList([...list]);
    },
    [interestList, setInterestList],
  );

  const handleProfileUpload = useCallback(() => {
    imageInput.current?.click();
  }, [imageInput.current]);

  const handleProfileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage({
          file,
          url: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    },
    [setProfileImage],
  );

  const handleProfileImageReset = useCallback(() => {
    setProfileImage({ file: undefined, url: undefined });
  }, [setProfileImage]);

  const handleSubmit = () => {
    submitProfileInfo();
  };

  return (
    <Wrapper>
      <div>
        <SubTitle>프로필 사진</SubTitle>
        <ProfileWrapper>
          {profileImage.url ? (
            <ImgWrapper>
              <StyledImg src={profileImage.url} alt="내 프로필" width={100} height={100} />
              {!profileImage.url.includes('DEFAULT_IMAGE') && (
                <ImgCancelSvg onClick={handleProfileImageReset}>
                  <Cancel />
                </ImgCancelSvg>
              )}
            </ImgWrapper>
          ) : (
            <StyledImg
              src="https://dori-dori-bucket.kr.object.ncloudstorage.com/PROFILE/DEFAULT_IMAGE.png"
              alt="기본 프로필"
              width={100}
              height={100}
            />
          )}
          <FileInput
            type="file"
            accept={'image/*'}
            ref={imageInput}
            onChange={handleProfileChange}
          />
          <LargeLineButton buttonType="default" onClick={handleProfileUpload}>
            사진 변경하기
          </LargeLineButton>
        </ProfileWrapper>
        <StyledTextField
          value={profileInfoValue.description}
          onChange={handleChange('description')}
          label="내 소개"
          maxLength={10}
          marginBottom={43}
          hintText={
            profileInfoValue.description.length > 10
              ? '내 소개는 10자 이내로 입력해주세요.'
              : undefined
          }
        />
        <SubTitle
          marginBottom={interestList.length < 3 ? 0 : 22}
        >{`관심 분야 ${interestList.length}/3`}</SubTitle>
        {interestList.length < 3 && (
          <InterestsWrapper>
            <StyledTextField
              value={profileInfoValue.interests}
              onChange={handleChange('interests')}
              maxLength={10}
              hintText={
                profileInfoValue.interests.length > 10
                  ? '관심 분야는 10자 이내로 입력해주세요.'
                  : undefined
              }
            />
            <ConfirmButton
              buttonType={profileInfoValue.interests ? 'primary' : 'default'}
              disabled={
                profileInfoValue.interests.length === 0 || profileInfoValue.interests.length > 10
              }
              onClick={handleTagAdd}
            >
              등록
            </ConfirmButton>
          </InterestsWrapper>
        )}
        <TagGroupWrapper>
          {interestList.map((interest, index) => (
            <LineChip key={interest} onClick={handleTagRemove(index)}>
              {interest}
            </LineChip>
          ))}
        </TagGroupWrapper>
        {wardList?.length > 0 && (
          <>
            <WardTitle>내 대표 와드</WardTitle>
            <TagGroupWrapper>
              {wardList.map((ward: { id: string; name: string }) => (
                <LineChip key={ward.id}>{ward.name}</LineChip>
              ))}
            </TagGroupWrapper>
          </>
        )}
      </div>
      {/* TODO: disabled 조건 확인 필요 */}
      <StyledButton
        type="button"
        disabled={interestList.length === 0 || profileInfoValue.description.length > 10}
        onClick={handleSubmit}
      >
        프로필 변경하기
      </StyledButton>
      {interestList.length === 0 && <SnackBar text="관심 분야를 작성해주세요!" />}
    </Wrapper>
  );
}

export default MyProfile;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 28px 30px 20px;
`;

const SubTitle = styled.div<{ marginBottom?: number }>`
  margin-bottom: ${({ marginBottom }) => marginBottom ?? 15}px;
  color: ${({ theme }) => theme.color.gray.Gray400};
  ${typography.Body_Medium_14}
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 52px;
`;

const ImgWrapper = styled.div`
  position: relative;
  height: 100px;
`;

const ImgCancelSvg = styled.i`
  position: absolute;
  top: 6px;
  right: 0px;
`;

const StyledButton = styled.button`
  width: 100%;
  min-height: 54px;
  background-color: ${({ theme }) => theme.color.primary.Lime300};
  border: none;
  border-radius: 10px;
  ${typography.Title2_Bold_16}
  &:disabled {
    color: ${({ theme }) => theme.color.gray.Gray300};
    background-color: ${({ theme }) => theme.color.gray.Gray700};
  }
`;

const StyledTextField = styled(TextField)<{ marginBottom?: number }>`
  flex: 1;
  margin-bottom: ${({ marginBottom }) => `${marginBottom ?? '0'}px`};
`;

const TagGroupWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledImg = styled.img`
  object-fit: contain;
  border-radius: 100px;
`;

const WardTitle = styled.div`
  margin: 30px 0 16px 0;
  color: ${({ theme }) => theme.color.gray.Gray400};
  ${typography.Body_Medium_14}
`;

const FileInput = styled.input`
  display: none;
`;

const InterestsWrapper = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 33px;
`;

const ConfirmButton = styled(LargeLineButton)`
  margin-bottom: 25px;
  margin-left: 20px;
`;
