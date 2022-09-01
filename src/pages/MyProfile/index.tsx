import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import axios from 'axios';
import FormData from 'form-data';
import Cancel from 'public/icons/cancel.svg';
import Cookies from 'js-cookie';
import TextField from '@/src/components/TextField';
import { typography } from '@/styles';
import { LargeLineButton } from '@/src/components';
import { getMyWardList, getProfileInfo, QUERY_KEYS } from '@/pages/setting/my-profile';
import { useProfileImageResetter, useProfileInfoUpdater } from './mutations';
import SnackBar from '@/src/components/SnackBar';
import LineChip from '@/src/components/LineChip';
import RadioButton from '@/src/components/RadioButton';

type MyProfileInputType = 'description' | 'interests' | 'representativeWardId';
const NOT_APPLICABLE = 'notApplicable';

function MyProfile() {
  const { data: profileInfo, isLoading: isLoadingProfileInfo } = useQuery(
    QUERY_KEYS.MY_PROFILE,
    getProfileInfo,
  );
  const { data: wardList, isLoading: isLoadingWardList } = useQuery(
    QUERY_KEYS.WARD_LIST,
    getMyWardList,
  );

  const [profileInfoValue, setProfileInfoValue] = useState<Record<MyProfileInputType, string>>({
    description: '',
    interests: '',
    representativeWardId: NOT_APPLICABLE,
  });
  const [interestList, setInterestList] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<{ file?: Blob; url?: string }>({
    file: undefined,
    url: undefined,
  });
  const [snackBarText, setSnackBarText] = useState<string>();
  const imageInput = useRef<HTMLInputElement>(null);

  const handleComplete = () => setSnackBarText('변경 완료!');

  const updateProfileImage = async () => {
    if (profileImage.file) {
      alert(`cookie: ${Cookies.get('accessToken')}`);
      alert(Cookies.get('accessToken') ?? `Bearer ${process.env.NEXT_PUBLIC_MOCK_TOKEN}`);
      // FIXME: react-qeury로 변경 필요
      const formData = new FormData();
      formData.append('image', profileImage.file);
      try {
        await axios.post(`/api/user/profile/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache',
            Authorization:
              Cookies.get('accessToken') ?? `Bearer ${process.env.NEXT_PUBLIC_MOCK_TOKEN}`,
          },
        });
      } catch (e: any) {
        alert(`error: ${e.message}`);
      }
      handleComplete();
      return;
    }
    if (profileImage.url === undefined) {
      submitProfileDefaultImg();
    }
  };

  const { mutate: submitProfileInfo } = useProfileInfoUpdater(
    {
      description: profileInfoValue.description,
      tags: interestList,
      representativeWardId:
        profileInfoValue.representativeWardId === NOT_APPLICABLE
          ? null
          : profileInfoValue.representativeWardId,
    },
    !!profileImage.file || profileImage.url === undefined ? updateProfileImage : handleComplete,
  );
  const { mutate: submitProfileDefaultImg } = useProfileImageResetter(handleComplete);

  useEffect(() => {
    setProfileInfoValue({
      description: profileInfo?.profileDescription ?? '',
      interests: '',
      representativeWardId: profileInfo?.representativeWard?.id ?? NOT_APPLICABLE,
    });
    setInterestList(profileInfo?.tags || []);
    setProfileImage({ url: profileInfo?.profileImageUrl, file: undefined });
  }, [profileInfo, wardList, setProfileInfoValue, setInterestList, setProfileImage]);

  const handleChange = useCallback(
    (key: MyProfileInputType) => (value: string) => {
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
      if (list.length === 0) {
        setSnackBarText('관심 분야를 작성해주세요!');
      }
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
        alert(`url: ${reader.result}`);
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

  if (isLoadingProfileInfo || isLoadingWardList) {
    return <div>Loading...</div>;
  }

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
              src={process.env.NEXT_PUBLIC_DEFAULT_PROFILE}
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
            <RadioButton
              options={[
                { key: NOT_APPLICABLE, value: NOT_APPLICABLE, text: '해당없음' },
                ...wardList.map((ward: { id: string; name: string }) => ({
                  key: ward.id,
                  value: ward.id,
                  text: ward.name,
                })),
              ]}
              value={profileInfoValue.representativeWardId}
              onChange={handleChange('representativeWardId')}
            />
          </>
        )}
      </div>
      <StickyButton>
        <StyledButton
          type="button"
          disabled={interestList.length === 0 || profileInfoValue.description.length > 10}
          onClick={handleSubmit}
        >
          프로필 변경하기
        </StyledButton>
      </StickyButton>
      {snackBarText && <SnackBar onClose={() => setSnackBarText(undefined)} text={snackBarText} />}
    </Wrapper>
  );
}

export default MyProfile;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 28px 30px 0px;
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
  right: 0;
`;

const StyledButton = styled.button`
  width: 100%;
  min-height: 54px;
  color: ${({ theme }) => theme.color.basic.DarkGray};
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

const StickyButton = styled.div`
  position: sticky;
  bottom: 0px;
  padding: 10px 0 20px;
  background-color: ${({ theme }) => theme.color.basic.DarkGray};
`;
