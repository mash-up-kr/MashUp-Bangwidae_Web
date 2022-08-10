import { ChangeEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import axios from 'axios';
import FormData from 'form-data';
import TextField from '@/src/components/TextField';
import { typography } from '@/styles';
import { LargeLineButton } from '@/src/components';
import {
  getMyWardList,
  getProfileImg,
  getProfileInfo,
  QUERY_KEYS,
} from '@/pages/setting/my-profile';
import { useProfileImageResetter, useProfileInfoUpdater } from './mutations';

// eslint-disable-next-line @typescript-eslint/naming-convention
type MY_PROFILE_INPUT_TYPE = 'description' | 'interests';

function MyProfile() {
  const { data: profileInfo } = useQuery(QUERY_KEYS.MY_PROFILE, getProfileInfo);
  const { data: wardList } = useQuery(QUERY_KEYS.WARD_LIST, getMyWardList);
  const { data: imageUrl } = useQuery(QUERY_KEYS.OPEN_INQUIRY, getProfileImg);

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
    setProfileImage({ url: imageUrl?.user.profileImageUrl });
  }, [profileInfo, wardList, imageUrl, setProfileInfoValue, setInterestList, setProfileImage]);

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
              <ImgCancelSvg onClick={handleProfileImageReset} />
            </ImgWrapper>
          ) : (
            <StyledImg src="/images/myProfile.png" alt="기본 프로필" width={100} height={100} />
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
        <InterestsWrapper>
          <StyledTextField
            value={profileInfoValue.interests}
            onChange={handleChange('interests')}
            label={`관심 분야 ${interestList.length}/3`}
            maxLength={10}
            disabled={interestList.length >= 3}
            hintText={
              profileInfoValue.interests.length > 10
                ? '관심 분야는 10자 이내로 입력해주세요.'
                : undefined
            }
          />
          <ConfirmButton
            buttonType={profileInfoValue.interests ? 'primary' : 'default'}
            disabled={
              profileInfoValue.interests.length === 0 ||
              interestList.length >= 3 ||
              profileInfoValue.interests.length > 10
            }
            onClick={handleTagAdd}
          >
            등록
          </ConfirmButton>
        </InterestsWrapper>
        <TagGroupWrapper>
          {interestList.map((interest, index) => (
            <Tag key={interest} onClick={handleTagRemove(index)}>
              {interest}
            </Tag>
          ))}
        </TagGroupWrapper>
        {wardList?.length > 0 && (
          <>
            <WardTitle>내 대표 와드</WardTitle>
            <TagGroupWrapper>
              {wardList.map((ward: { id: string; name: string }) => (
                <Tag key={ward.id}>{ward.name}</Tag>
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

// Tag Component
interface TagProps {
  children: ReactNode;
  onClick?: () => void;
}

function Tag({ children, onClick }: TagProps) {
  const handleClick = () => {
    onClick?.();
  };
  return (
    <TagWrapper>
      {onClick && <TagCancelSvg onClick={handleClick} />}
      <StyledTag>{children}</StyledTag>
    </TagWrapper>
  );
}

// SnackBar Component
interface SnackBarProps {
  text: string;
}

function SnackBar({ text }: SnackBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  }, []);
  return <SnackBarWrapper isVisible={isVisible}>{text}</SnackBarWrapper>;
}

// Svg Component
function CancelSvg({ className, onClick }: { className?: string; onClick: () => void }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      onClick={onClick}
    >
      <circle cx="10" cy="10" r="8" fill="#F55E5F" />
      <path
        d="M6.46967 12.4697C6.17678 12.7626 6.17678 13.2374 6.46967 13.5303C6.76256 13.8232 7.23744 13.8232 7.53033 13.5303L6.46967 12.4697ZM7.53033 6.46967C7.23744 6.17678 6.76256 6.17678 6.46967 6.46967C6.17678 6.76256 6.17678 7.23744 6.46967 7.53033L7.53033 6.46967ZM13.5303 7.53033C13.8232 7.23744 13.8232 6.76256 13.5303 6.46967C13.2374 6.17678 12.7626 6.17678 12.4697 6.46967L13.5303 7.53033ZM12.4697 13.5303C12.7626 13.8232 13.2374 13.8232 13.5303 13.5303C13.8232 13.2374 13.8232 12.7626 13.5303 12.4697L12.4697 13.5303ZM9.46967 9.46967L6.46967 12.4697L7.53033 13.5303L10.5303 10.5303L9.46967 9.46967ZM10.5303 9.46967L7.53033 6.46967L6.46967 7.53033L9.46967 10.5303L10.5303 9.46967ZM10.5303 10.5303C10.5326 10.528 10.5349 10.5258 10.5372 10.5235C10.5395 10.5212 10.5418 10.5189 10.544 10.5166C10.5463 10.5143 10.5486 10.5121 10.5509 10.5098C10.5531 10.5075 10.5554 10.5052 10.5577 10.503C10.56 10.5007 10.5622 10.4984 10.5645 10.4962C10.5668 10.4939 10.569 10.4916 10.5713 10.4894C10.5736 10.4871 10.5758 10.4848 10.5781 10.4826C10.5804 10.4803 10.5826 10.478 10.5849 10.4758C10.5871 10.4735 10.5894 10.4713 10.5916 10.469C10.5939 10.4668 10.5961 10.4645 10.5984 10.4623C10.6006 10.46 10.6029 10.4578 10.6051 10.4555C10.6074 10.4533 10.6096 10.451 10.6119 10.4488C10.6141 10.4465 10.6164 10.4443 10.6186 10.4421C10.6208 10.4398 10.6231 10.4376 10.6253 10.4354C10.6275 10.4331 10.6298 10.4309 10.632 10.4287C10.6342 10.4264 10.6365 10.4242 10.6387 10.422C10.6409 10.4197 10.6431 10.4175 10.6454 10.4153C10.6476 10.4131 10.6498 10.4108 10.652 10.4086C10.6543 10.4064 10.6565 10.4042 10.6587 10.402C10.6609 10.3998 10.6631 10.3975 10.6653 10.3953C10.6675 10.3931 10.6698 10.3909 10.672 10.3887C10.6742 10.3865 10.6764 10.3843 10.6786 10.3821C10.6808 10.3799 10.683 10.3777 10.6852 10.3755C10.6874 10.3733 10.6896 10.3711 10.6918 10.3689C10.694 10.3667 10.6962 10.3645 10.6984 10.3623C10.7006 10.3601 10.7028 10.3579 10.705 10.3557C10.7072 10.3535 10.7093 10.3513 10.7115 10.3491C10.7137 10.3469 10.7159 10.3448 10.7181 10.3426C10.7203 10.3404 10.7225 10.3382 10.7246 10.336C10.7268 10.3338 10.729 10.3317 10.7312 10.3295C10.7334 10.3273 10.7355 10.3251 10.7377 10.323C10.7399 10.3208 10.742 10.3186 10.7442 10.3164C10.7464 10.3143 10.7486 10.3121 10.7507 10.3099C10.7529 10.3078 10.7551 10.3056 10.7572 10.3034C10.7594 10.3013 10.7615 10.2991 10.7637 10.297C10.7659 10.2948 10.768 10.2926 10.7702 10.2905C10.7723 10.2883 10.7745 10.2862 10.7766 10.284C10.7788 10.2819 10.781 10.2797 10.7831 10.2776C10.7853 10.2754 10.7874 10.2733 10.7895 10.2711C10.7917 10.269 10.7938 10.2668 10.796 10.2647C10.7981 10.2625 10.8003 10.2604 10.8024 10.2583C10.8045 10.2561 10.8067 10.254 10.8088 10.2518C10.811 10.2497 10.8131 10.2476 10.8152 10.2454C10.8174 10.2433 10.8195 10.2412 10.8216 10.239C10.8238 10.2369 10.8259 10.2348 10.828 10.2326C10.8301 10.2305 10.8323 10.2284 10.8344 10.2263C10.8365 10.2241 10.8386 10.222 10.8408 10.2199C10.8429 10.2178 10.845 10.2157 10.8471 10.2135C10.8492 10.2114 10.8513 10.2093 10.8535 10.2072C10.8556 10.2051 10.8577 10.203 10.8598 10.2009C10.8619 10.1988 10.864 10.1966 10.8661 10.1945C10.8682 10.1924 10.8703 10.1903 10.8724 10.1882C10.8745 10.1861 10.8767 10.184 10.8788 10.1819C10.8809 10.1798 10.883 10.1777 10.8851 10.1756C10.8872 10.1735 10.8892 10.1714 10.8913 10.1693C10.8934 10.1672 10.8955 10.1651 10.8976 10.163C10.8997 10.1609 10.9018 10.1589 10.9039 10.1568C10.906 10.1547 10.9081 10.1526 10.9102 10.1505C10.9122 10.1484 10.9143 10.1463 10.9164 10.1442C10.9185 10.1422 10.9206 10.1401 10.9227 10.138C10.9247 10.1359 10.9268 10.1338 10.9289 10.1318C10.931 10.1297 10.9331 10.1276 10.9351 10.1255C10.9372 10.1235 10.9393 10.1214 10.9413 10.1193C10.9434 10.1172 10.9455 10.1152 10.9476 10.1131C10.9496 10.111 10.9517 10.109 10.9538 10.1069C10.9558 10.1048 10.9579 10.1028 10.9599 10.1007C10.962 10.0987 10.9641 10.0966 10.9661 10.0945C10.9682 10.0925 10.9702 10.0904 10.9723 10.0884C10.9744 10.0863 10.9764 10.0842 10.9785 10.0822C10.9805 10.0801 10.9826 10.0781 10.9846 10.076C10.9867 10.074 10.9887 10.0719 10.9908 10.0699C10.9928 10.0678 10.9949 10.0658 10.9969 10.0637C10.999 10.0617 11.001 10.0597 11.003 10.0576C11.0051 10.0556 11.0071 10.0535 11.0092 10.0515C11.0112 10.0495 11.0132 10.0474 11.0153 10.0454C11.0173 10.0433 11.0194 10.0413 11.0214 10.0393C11.0234 10.0372 11.0255 10.0352 11.0275 10.0332C11.0295 10.0311 11.0315 10.0291 11.0336 10.0271C11.0356 10.0251 11.0376 10.023 11.0397 10.021C11.0417 10.019 11.0437 10.017 11.0457 10.0149C11.0478 10.0129 11.0498 10.0109 11.0518 10.0089C11.0538 10.0068 11.0558 10.0048 11.0579 10.0028C11.0599 10.0008 11.0619 9.99877 11.0639 9.99676C11.0659 9.99474 11.0679 9.99273 11.0699 9.99071C11.072 9.9887 11.074 9.98669 11.076 9.98468C11.078 9.98267 11.08 9.98066 11.082 9.97865C11.084 9.97665 11.086 9.97464 11.088 9.97264C11.09 9.97063 11.092 9.96863 11.094 9.96663C11.096 9.96462 11.098 9.96262 11.1 9.96062C11.102 9.95863 11.104 9.95663 11.106 9.95463C11.108 9.95263 11.11 9.95064 11.112 9.94864C11.114 9.94665 11.116 9.94466 11.118 9.94266C11.12 9.94067 11.122 9.93868 11.124 9.93669C11.126 9.9347 11.1279 9.93271 11.1299 9.93073C11.1319 9.92874 11.1339 9.92676 11.1359 9.92477C11.1379 9.92279 11.1399 9.9208 11.1418 9.91882C11.1438 9.91684 11.1458 9.91486 11.1478 9.91288C11.1498 9.9109 11.1517 9.90892 11.1537 9.90694C11.1557 9.90497 11.1577 9.90299 11.1596 9.90102C11.1616 9.89904 11.1636 9.89707 11.1656 9.8951C11.1675 9.89312 11.1695 9.89115 11.1715 9.88918C11.1734 9.88721 11.1754 9.88525 11.1774 9.88328C11.1794 9.88131 11.1813 9.87934 11.1833 9.87738C11.1852 9.87541 11.1872 9.87345 11.1892 9.87149C11.1911 9.86952 11.1931 9.86756 11.1951 9.8656C11.197 9.86364 11.199 9.86168 11.2009 9.85972C11.2029 9.85777 11.2049 9.85581 11.2068 9.85385C11.2088 9.8519 11.2107 9.84994 11.2127 9.84799C11.2146 9.84604 11.2166 9.84408 11.2185 9.84213C11.2205 9.84018 11.2224 9.83823 11.2244 9.83628C11.2263 9.83433 11.2283 9.83238 11.2302 9.83044C11.2322 9.82849 11.2341 9.82654 11.2361 9.8246C11.238 9.82266 11.2399 9.82071 11.2419 9.81877C11.2438 9.81683 11.2458 9.81489 11.2477 9.81295C11.2497 9.81101 11.2516 9.80907 11.2535 9.80713C11.2555 9.80519 11.2574 9.80325 11.2593 9.80132C11.2613 9.79938 11.2632 9.79745 11.2651 9.79551C11.2671 9.79358 11.269 9.79165 11.2709 9.78971C11.2729 9.78778 11.2748 9.78585 11.2767 9.78392C11.2787 9.78199 11.2806 9.78006 11.2825 9.77814C11.2845 9.77621 11.2864 9.77428 11.2883 9.77236C11.2902 9.77043 11.2922 9.76851 11.2941 9.76659C11.296 9.76466 11.2979 9.76274 11.2998 9.76082C11.3018 9.7589 11.3037 9.75698 11.3056 9.75506C11.3075 9.75314 11.3094 9.75122 11.3114 9.7493C11.3133 9.74739 11.3152 9.74547 11.3171 9.74355C11.319 9.74164 11.3209 9.73973 11.3228 9.73781C11.3248 9.7359 11.3267 9.73399 11.3286 9.73208C11.3305 9.73016 11.3324 9.72825 11.3343 9.72634C11.3362 9.72444 11.3381 9.72253 11.34 9.72062C11.3419 9.71871 11.3439 9.71681 11.3458 9.7149C11.3477 9.713 11.3496 9.71109 11.3515 9.70919C11.3534 9.70728 11.3553 9.70538 11.3572 9.70348C11.3591 9.70158 11.361 9.69968 11.3629 9.69778C11.3648 9.69588 11.3667 9.69398 11.3686 9.69208C11.3705 9.69018 11.3724 9.68829 11.3743 9.68639C11.3762 9.68449 11.3781 9.6826 11.38 9.6807C11.3818 9.67881 11.3837 9.67692 11.3856 9.67502C11.3875 9.67313 11.3894 9.67124 11.3913 9.66935C11.3932 9.66746 11.3951 9.66557 11.397 9.66368C11.3989 9.66179 11.4008 9.6599 11.4026 9.65802C11.4045 9.65613 11.4064 9.65424 11.4083 9.65236C11.4102 9.65047 11.4121 9.64859 11.414 9.64671C11.4158 9.64482 11.4177 9.64294 11.4196 9.64106C11.4215 9.63918 11.4234 9.6373 11.4252 9.63542C11.4271 9.63354 11.429 9.63166 11.4309 9.62978C11.4328 9.6279 11.4346 9.62602 11.4365 9.62415C11.4384 9.62227 11.4403 9.62039 11.4421 9.61852C11.444 9.61664 11.4459 9.61477 11.4478 9.6129C11.4496 9.61102 11.4515 9.60915 11.4534 9.60728C11.4553 9.60541 11.4571 9.60353 11.459 9.60166C11.4609 9.59979 11.4627 9.59793 11.4646 9.59606C11.4665 9.59419 11.4683 9.59232 11.4702 9.59045C11.4721 9.58859 11.4739 9.58672 11.4758 9.58486C11.4777 9.58299 11.4795 9.58113 11.4814 9.57926C11.4833 9.5774 11.4851 9.57553 11.487 9.57367C11.4889 9.57181 11.4907 9.56995 11.4926 9.56809C11.4944 9.56623 11.4963 9.56437 11.4982 9.56251C11.5 9.56065 11.5019 9.55879 11.5037 9.55693C11.5056 9.55507 11.5074 9.55322 11.5093 9.55136C11.5619 9.49873 11.5456 9.51508 11.5979 9.46279C11.5997 9.46096 11.6015 9.45913 11.6034 9.45729C11.6052 9.45546 11.607 9.45363 11.6089 9.45179C11.6186 9.44202 11.6101 9.45057 11.6199 9.44081C11.6217 9.43898 11.6235 9.43715 11.6253 9.43532C11.6272 9.43349 11.629 9.43166 11.6308 9.42984C11.6327 9.42801 11.6345 9.42618 11.6363 9.42435C11.6381 9.42253 11.64 9.4207 11.6418 9.41888C11.6436 9.41705 11.6454 9.41523 11.6473 9.4134C11.6491 9.41158 11.6509 9.40975 11.6527 9.40793C11.6624 9.39822 11.654 9.40671 11.6637 9.397C11.6753 9.38535 11.6739 9.3868 11.6855 9.37517C11.705 9.35571 11.6878 9.37284 11.7073 9.35339C11.715 9.34565 11.7213 9.33938 11.729 9.33165C11.7338 9.32683 11.735 9.32562 11.7399 9.3208C11.7476 9.31309 11.743 9.31767 11.7507 9.30996C11.7748 9.28586 11.7483 9.31239 11.7724 9.2883C11.798 9.26264 11.8332 9.2275 11.8587 9.202C11.8842 9.1765 11.8762 9.18447 11.9017 9.159C11.9398 9.12085 11.9065 9.1542 11.9446 9.11607C11.97 9.09064 11.9621 9.09861 11.9875 9.07319C11.9951 9.06557 12.0013 9.05937 12.0089 9.05176C12.0279 9.03273 12.0113 9.04936 12.0303 9.03033C12.0684 8.99227 12.0137 9.04697 12.0518 9.0089C12.0632 8.99748 12.0618 8.9989 12.0732 8.98747C12.105 8.9557 12.0843 8.97638 12.1161 8.94459C12.1256 8.93505 12.128 8.93268 12.1375 8.92313C12.1471 8.91359 12.1387 8.92194 12.1483 8.9124C12.1793 8.88136 12.128 8.9327 12.159 8.90166C12.1877 8.87301 12.1518 8.90883 12.1805 8.88017C12.1823 8.87838 12.1841 8.87659 12.1859 8.8748C12.1877 8.87301 12.1894 8.87121 12.1912 8.86942C12.196 8.86464 12.1972 8.86345 12.202 8.85866C12.2147 8.84594 12.2754 8.78524 12.2883 8.77236C12.3075 8.75312 12.3124 8.7483 12.3317 8.72901C12.3413 8.71935 12.3437 8.71694 12.3534 8.70727C12.3728 8.68782 12.3557 8.70495 12.3752 8.68549C12.379 8.68162 12.3931 8.66755 12.397 8.66366C12.4035 8.65719 12.4124 8.64827 12.4189 8.64178C12.4384 8.62229 12.4213 8.63936 12.4408 8.61985C12.4426 8.61802 12.4445 8.61619 12.4463 8.61436C12.4481 8.61253 12.45 8.6107 12.4518 8.60887C12.4536 8.60703 12.4555 8.6052 12.4573 8.60337C12.4591 8.60153 12.461 8.5997 12.4628 8.59787C12.4687 8.592 12.479 8.58171 12.4848 8.57582C12.5143 8.54637 12.4664 8.59423 12.4959 8.56477C12.4977 8.56293 12.4996 8.56109 12.5014 8.55924C12.5033 8.5574 12.5051 8.55556 12.5069 8.55371C12.5463 8.51438 12.4898 8.57089 12.5291 8.53154C12.5599 8.50081 12.5206 8.54005 12.5514 8.5093C12.5516 8.50911 12.5958 8.46489 12.5961 8.4646C12.5979 8.46274 12.5998 8.46087 12.6017 8.459C12.6035 8.45713 12.6054 8.45525 12.6073 8.45338C12.6118 8.44885 12.614 8.44669 12.6185 8.44214C12.6265 8.43415 12.6218 8.43888 12.6298 8.43088C12.6524 8.40831 12.6185 8.44218 12.6411 8.4196C12.6611 8.39956 12.6662 8.39443 12.6864 8.37427C12.6883 8.37237 12.6902 8.37048 12.6921 8.36858C12.694 8.36668 12.6959 8.36478 12.6978 8.36288C12.7007 8.35999 12.7063 8.35438 12.7092 8.35147C12.7111 8.34957 12.713 8.34767 12.7149 8.34576C12.7168 8.34385 12.7187 8.34195 12.7206 8.34004C12.7225 8.33813 12.7244 8.33623 12.7263 8.33432C12.7283 8.33241 12.7302 8.3305 12.7321 8.32859C12.7678 8.29281 12.7193 8.34141 12.7551 8.3056C12.7704 8.29022 12.7512 8.30947 12.7666 8.29408C12.7685 8.29215 12.7704 8.29023 12.7724 8.2883C12.7743 8.28638 12.7762 8.28445 12.7781 8.28252C12.7833 8.27739 12.7961 8.26451 12.8013 8.25934C12.8324 8.22831 12.7935 8.26713 12.8246 8.23606C12.8578 8.20286 12.885 8.17564 12.9188 8.14184C12.9294 8.13122 12.9558 8.10482 12.9666 8.09403C12.9686 8.09203 12.9706 8.09003 12.9726 8.08802C12.9746 8.08602 12.9766 8.08401 12.9787 8.08201C12.9893 8.07135 12.98 8.08062 12.9907 8.06995C13.0015 8.05919 12.992 8.06862 13.0028 8.05786C13.0048 8.05584 13.0068 8.05382 13.0089 8.0518C13.0109 8.04978 13.0129 8.04776 13.0149 8.04573C13.0284 8.03224 13.0136 8.04708 13.0271 8.03358C13.0291 8.03155 13.0311 8.02952 13.0332 8.02749C13.0352 8.02546 13.0372 8.02342 13.0393 8.02139C13.0611 7.99959 13.0419 8.01876 13.0637 7.99691C13.0966 7.96411 13.0555 8.00515 13.0884 7.9723C13.106 7.95468 13.0954 7.96523 13.1131 7.94755C13.1486 7.91211 13.1274 7.93326 13.163 7.89763C13.1817 7.87899 13.1695 7.89113 13.1882 7.87244C13.1905 7.8702 13.1986 7.86205 13.2009 7.8598C13.2226 7.83809 13.1918 7.86883 13.2135 7.84711C13.2157 7.84499 13.2178 7.84288 13.2199 7.84075C13.222 7.83863 13.2241 7.83651 13.2263 7.83439C13.2376 7.82305 13.2277 7.83298 13.239 7.82163C13.2884 7.77223 13.2152 7.84543 13.2647 7.79598C13.2692 7.79141 13.273 7.78769 13.2776 7.7831C13.2828 7.77789 13.2853 7.77541 13.2905 7.77018C13.2926 7.76803 13.2948 7.76587 13.297 7.76371C13.2991 7.76155 13.3013 7.75938 13.3034 7.75722C13.3056 7.75506 13.3078 7.75289 13.3099 7.75073C13.3121 7.74856 13.3143 7.74639 13.3164 7.74422C13.355 7.70561 13.33 7.73062 13.3689 7.6918C13.4022 7.65846 13.3884 7.67226 13.422 7.63869C13.4697 7.59096 13.4816 7.57904 13.5303 7.53033L12.4697 6.46967C12.4674 6.47196 12.4651 6.47424 12.4628 6.47653C12.4605 6.47881 12.4582 6.4811 12.456 6.48338C12.4537 6.48566 12.4514 6.48793 12.4491 6.49021C12.4469 6.49249 12.4446 6.49476 12.4423 6.49703C12.396 6.54332 12.4614 6.47799 12.4151 6.52421C12.3839 6.55544 12.3923 6.54704 12.3613 6.57803C12.3138 6.62559 12.3555 6.58381 12.3082 6.63114C12.306 6.63333 12.3038 6.63553 12.3016 6.63773C12.2994 6.63992 12.2972 6.64211 12.295 6.6443C12.2928 6.6465 12.2907 6.64869 12.2885 6.65087C12.2863 6.65306 12.2841 6.65525 12.2819 6.65743C12.2797 6.65962 12.2775 6.6618 12.2754 6.66398C12.2732 6.66616 12.271 6.66834 12.2688 6.67052C12.249 6.69039 12.2756 6.6637 12.2558 6.68356C12.2434 6.69595 12.2552 6.68419 12.2428 6.69656C12.2319 6.70744 12.2407 6.69866 12.2298 6.70952C12.2246 6.71475 12.2221 6.71723 12.2169 6.72244C12.1871 6.7522 12.2338 6.70558 12.204 6.73532C12.2019 6.73747 12.1997 6.73961 12.1976 6.74175C12.1955 6.74389 12.1933 6.74603 12.1912 6.74816C12.1508 6.78853 12.2187 6.72061 12.1784 6.76097C12.1577 6.78166 12.1863 6.75305 12.1656 6.77373C12.1635 6.77585 12.1614 6.77797 12.1592 6.78009C12.1571 6.78221 12.155 6.78433 12.1529 6.78645C12.0955 6.84384 12.1596 6.77977 12.1024 6.83697C12.0489 6.89042 12.1057 6.83363 12.0524 6.88689C12.0504 6.88896 12.0483 6.89103 12.0462 6.89309C12.0442 6.89516 12.0421 6.89722 12.0401 6.89929C12.038 6.90135 12.0359 6.90341 12.0339 6.90547C12.0318 6.90753 12.0298 6.90959 12.0277 6.91164C12.02 6.91933 12.0107 6.92861 12.0031 6.93625C12.001 6.9383 11.999 6.94034 11.997 6.94239C11.9949 6.94443 11.9929 6.94647 11.9908 6.94851C11.9839 6.95543 11.9855 6.95382 11.9786 6.96073C11.9623 6.977 11.9827 6.95666 11.9664 6.97292C11.9644 6.97495 11.9624 6.97697 11.9603 6.979C11.9583 6.98102 11.9563 6.98305 11.9543 6.98507C11.9522 6.9871 11.9502 6.98912 11.9482 6.99114C11.9462 6.99316 11.9442 6.99518 11.9421 6.9972C11.9188 7.02052 11.9534 6.98597 11.9301 7.00929C11.8981 7.04128 11.95 6.98936 11.918 7.02135C11.916 7.02335 11.914 7.02536 11.912 7.02736C11.91 7.02937 11.908 7.03137 11.906 7.03337C11.8754 7.06396 11.9126 7.02679 11.882 7.05734C11.8819 7.05747 11.8583 7.08108 11.8582 7.08118C11.8573 7.08207 11.8353 7.10405 11.8344 7.1049C11.8325 7.10688 11.8305 7.10885 11.8285 7.11082C11.8266 7.11279 11.8246 7.11476 11.8226 7.11672C11.8052 7.13418 11.8283 7.11107 11.8108 7.12851C11.7986 7.14071 11.8113 7.12809 11.7991 7.14028C11.7971 7.14223 11.7951 7.14419 11.7932 7.14615C11.7912 7.1481 11.7893 7.15006 11.7873 7.15201C11.7786 7.16069 11.7726 7.16675 11.7639 7.1754C11.722 7.2173 11.7592 7.1801 11.7175 7.22186C11.7131 7.22627 11.6988 7.24057 11.6944 7.24494C11.6925 7.24686 11.6906 7.24878 11.6886 7.2507C11.6867 7.25261 11.6848 7.25453 11.6829 7.25645C11.681 7.25836 11.6791 7.26027 11.6772 7.26219C11.6752 7.2641 11.6733 7.26601 11.6714 7.26792C11.6595 7.27979 11.6604 7.27898 11.6485 7.29081C11.6442 7.29517 11.6415 7.29788 11.6371 7.30222C11.6352 7.30412 11.6333 7.30602 11.6314 7.30792C11.6295 7.30982 11.6276 7.31171 11.6257 7.31361C11.6036 7.33578 11.6025 7.33689 11.5804 7.35894C11.5389 7.40039 11.5767 7.3626 11.5354 7.40394C11.5321 7.40727 11.5163 7.42302 11.513 7.42633C11.5111 7.42819 11.5093 7.43005 11.5074 7.43191C11.5056 7.43377 11.5037 7.43563 11.5018 7.43749C11.4987 7.44059 11.4938 7.44555 11.4907 7.44864C11.4764 7.46292 11.4827 7.45662 11.4685 7.47088C11.4666 7.47273 11.4648 7.47458 11.4629 7.47643C11.4611 7.47828 11.4592 7.48013 11.4574 7.48197C11.4524 7.4869 11.4512 7.48813 11.4463 7.49305C11.4444 7.4949 11.4426 7.49674 11.4408 7.49858C11.4389 7.50043 11.4371 7.50227 11.4352 7.50411C11.4205 7.51884 11.4389 7.50043 11.4242 7.51516C11.4134 7.52595 11.4129 7.52644 11.4021 7.53721C11.4003 7.53904 11.3985 7.54087 11.3966 7.54271C11.3948 7.54454 11.393 7.54637 11.3911 7.54821C11.374 7.56531 11.3972 7.5421 11.3801 7.55919C11.3783 7.56102 11.3765 7.56285 11.3747 7.56468C11.3728 7.56651 11.371 7.56834 11.3692 7.57016C11.3673 7.57199 11.3655 7.57382 11.3637 7.57565C11.3619 7.57747 11.36 7.5793 11.3582 7.58112C11.3564 7.58295 11.3546 7.58477 11.3527 7.5866C11.3509 7.58842 11.3491 7.59025 11.3473 7.59207C11.3351 7.60421 11.3485 7.59087 11.3363 7.603C11.3266 7.61271 11.3242 7.61514 11.3145 7.62483C11.2853 7.65403 11.3219 7.61742 11.2927 7.64661C11.2869 7.65242 11.2768 7.66255 11.271 7.66835C11.2692 7.67016 11.2674 7.67197 11.2656 7.67377C11.2638 7.67558 11.2619 7.67739 11.2601 7.6792C11.2529 7.68643 11.2565 7.68281 11.2493 7.69004C11.2288 7.71053 11.2481 7.69123 11.2276 7.7117C11.1956 7.74375 11.1732 7.7661 11.1413 7.798C11.1095 7.82987 11.0872 7.85216 11.0554 7.88393C11.0332 7.90618 11.0348 7.90457 11.0125 7.92681C10.9973 7.94205 11.0063 7.93301 10.9911 7.94824C10.9673 7.97203 10.9935 7.94588 10.9697 7.96967C10.9364 8.00298 10.9815 7.95779 10.9482 7.9911C10.9406 7.99871 10.9344 8.00491 10.9268 8.01253C10.895 8.0443 10.9157 8.02362 10.8839 8.05541C10.8744 8.06494 10.8506 8.08879 10.841 8.09834C10.8347 8.10469 10.8044 8.13496 10.798 8.14134C10.7827 8.15664 10.7703 8.16909 10.7549 8.18443C10.7166 8.22277 10.7501 8.18926 10.7117 8.22764C10.6925 8.24689 10.6876 8.2517 10.6683 8.27099C10.6587 8.28065 10.6563 8.28306 10.6466 8.29273C10.6297 8.30966 10.6527 8.28668 10.6357 8.30361C10.6309 8.30846 10.6297 8.30966 10.6248 8.31451C10.586 8.35337 10.6201 8.31929 10.5811 8.35822C10.5616 8.37771 10.5787 8.36064 10.5592 8.38015C10.52 8.41937 10.5764 8.36289 10.5372 8.40213C10.5112 8.42816 10.475 8.46433 10.4486 8.4907C10.4468 8.49256 10.4449 8.49441 10.4431 8.49627C10.4412 8.49813 10.4394 8.49999 10.4375 8.50185C10.4356 8.50371 10.4338 8.50557 10.4319 8.50743C10.4301 8.50929 10.4282 8.51115 10.4263 8.51301C10.4245 8.51487 10.4226 8.51674 10.4207 8.5186C10.4189 8.52046 10.417 8.52233 10.4151 8.52419C10.4133 8.52606 10.4114 8.52793 10.4095 8.52979C10.4077 8.53166 10.4058 8.53353 10.4039 8.5354C10.4021 8.53727 10.4002 8.53913 10.3983 8.541C10.3965 8.54287 10.3946 8.54475 10.3927 8.54662C10.3909 8.54849 10.389 8.55036 10.3871 8.55224C10.3852 8.55411 10.3834 8.55598 10.3815 8.55786C10.3796 8.55973 10.3777 8.56161 10.3759 8.56349C10.374 8.56536 10.3721 8.56724 10.3702 8.56912C10.3683 8.571 10.3665 8.57288 10.3646 8.57476C10.3627 8.57664 10.3608 8.57852 10.3589 8.5804C10.3571 8.58228 10.3552 8.58416 10.3533 8.58605C10.3514 8.58793 10.3495 8.58981 10.3476 8.5917C10.3458 8.59358 10.3439 8.59547 10.342 8.59736C10.3401 8.59924 10.3382 8.60113 10.3363 8.60302C10.3344 8.60491 10.3325 8.6068 10.3306 8.60869C10.3288 8.61058 10.3269 8.61247 10.325 8.61436C10.3231 8.61626 10.3212 8.61815 10.3193 8.62004C10.3174 8.62194 10.3155 8.62383 10.3136 8.62573C10.3117 8.62763 10.3098 8.62952 10.3079 8.63142C10.306 8.63332 10.3041 8.63522 10.3022 8.63712C10.3003 8.63902 10.2984 8.64092 10.2965 8.64282C10.2946 8.64472 10.2927 8.64662 10.2908 8.64853C10.2889 8.65043 10.287 8.65233 10.2851 8.65424C10.2832 8.65615 10.2813 8.65805 10.2794 8.65996C10.2775 8.66187 10.2756 8.66378 10.2737 8.66568C10.2717 8.66759 10.2698 8.6695 10.2679 8.67142C10.266 8.67333 10.2641 8.67524 10.2622 8.67715C10.2603 8.67906 10.2584 8.68098 10.2564 8.68289C10.2545 8.68481 10.2526 8.68673 10.2507 8.68864C10.2488 8.69056 10.2469 8.69248 10.2449 8.6944C10.243 8.69632 10.2411 8.69824 10.2392 8.70016C10.2373 8.70208 10.2353 8.704 10.2334 8.70593C10.2315 8.70785 10.2296 8.70977 10.2276 8.7117C10.2257 8.71362 10.2238 8.71555 10.2219 8.71748C10.2199 8.7194 10.218 8.72133 10.2161 8.72326C10.2141 8.72519 10.2122 8.72712 10.2103 8.72905C10.2084 8.73099 10.2064 8.73292 10.2045 8.73485C10.2026 8.73679 10.2006 8.73872 10.1987 8.74066C10.1967 8.74259 10.1948 8.74453 10.1929 8.74647C10.1909 8.74841 10.189 8.75035 10.1871 8.75229C10.1851 8.75423 10.1832 8.75617 10.1812 8.75811C10.1793 8.76005 10.1773 8.762 10.1754 8.76394C10.1735 8.76588 10.1715 8.76783 10.1696 8.76978C10.1676 8.77172 10.1657 8.77367 10.1637 8.77562C10.1618 8.77757 10.1598 8.77952 10.1579 8.78147C10.1559 8.78342 10.154 8.78538 10.152 8.78733C10.1501 8.78928 10.1481 8.79124 10.1461 8.79319C10.1442 8.79515 10.1422 8.79711 10.1403 8.79906C10.1383 8.80102 10.1364 8.80298 10.1344 8.80494C10.1324 8.8069 10.1305 8.80886 10.1285 8.81083C10.1266 8.81279 10.1246 8.81475 10.1226 8.81672C10.1207 8.81868 10.1187 8.82065 10.1167 8.82262C10.1148 8.82458 10.1128 8.82655 10.1108 8.82852C10.1088 8.83049 10.1069 8.83246 10.1049 8.83444C10.1029 8.83641 10.101 8.83838 10.099 8.84036C10.097 8.84233 10.095 8.84431 10.0931 8.84628C10.0911 8.84826 10.0891 8.85024 10.0871 8.85222C10.0851 8.8542 10.0832 8.85618 10.0812 8.85816C10.0792 8.86014 10.0772 8.86213 10.0752 8.86411C10.0732 8.86609 10.0713 8.86808 10.0693 8.87007C10.0673 8.87205 10.0653 8.87404 10.0633 8.87603C10.0613 8.87802 10.0593 8.88001 10.0573 8.882C10.0553 8.884 10.0534 8.88599 10.0514 8.88798C10.0494 8.88998 10.0474 8.89197 10.0454 8.89397C10.0434 8.89597 10.0414 8.89797 10.0394 8.89996C10.0374 8.90196 10.0354 8.90396 10.0334 8.90597C10.0314 8.90797 10.0294 8.90997 10.0274 8.91198C10.0254 8.91398 10.0234 8.91599 10.0213 8.91799C10.0193 8.92 10.0173 8.92201 10.0153 8.92402C10.0133 8.92603 10.0113 8.92804 10.0093 8.93005C10.0073 8.93207 10.0053 8.93408 10.0032 8.9361C10.0012 8.93811 9.99921 8.94013 9.9972 8.94214C9.99518 8.94416 9.99316 8.94618 9.99114 8.9482C9.98912 8.95022 9.9871 8.95224 9.98507 8.95427C9.98305 8.95629 9.98102 8.95832 9.979 8.96034C9.97697 8.96237 9.97495 8.96439 9.97292 8.96642C9.97089 8.96845 9.96886 8.97048 9.96683 8.97251C9.9648 8.97454 9.96276 8.97658 9.96073 8.97861C9.9587 8.98064 9.95666 8.98268 9.95462 8.98472C9.95259 8.98675 9.95055 8.98879 9.94851 8.99083C9.94647 8.99287 9.94443 8.99491 9.94239 8.99695C9.94034 8.999 9.9383 9.00104 9.93625 9.00309C9.93421 9.00513 9.93216 9.00718 9.93011 9.00923C9.92807 9.01127 9.92602 9.01332 9.92397 9.01537C9.92191 9.01743 9.91986 9.01948 9.91781 9.02153C9.91575 9.02359 9.9137 9.02564 9.91164 9.0277C9.90959 9.02975 9.90753 9.03181 9.90547 9.03387C9.90341 9.03593 9.90135 9.03799 9.89929 9.04005C9.89722 9.04212 9.89516 9.04418 9.89309 9.04625C9.89103 9.04831 9.88896 9.05038 9.88689 9.05245C9.88482 9.05452 9.88276 9.05659 9.88068 9.05866C9.87861 9.06073 9.87654 9.0628 9.87447 9.06487C9.87239 9.06695 9.87032 9.06902 9.86824 9.0711C9.86616 9.07318 9.86408 9.07526 9.862 9.07734C9.85992 9.07942 9.85784 9.0815 9.85576 9.08358C9.85367 9.08567 9.85159 9.08775 9.8495 9.08984C9.84742 9.09192 9.84533 9.09401 9.84324 9.0961C9.84115 9.09819 9.83906 9.10028 9.83697 9.10237C9.83487 9.10447 9.83278 9.10656 9.83069 9.10865C9.82859 9.11075 9.82649 9.11285 9.82439 9.11495C9.8223 9.11704 9.8202 9.11914 9.81809 9.12125C9.81599 9.12335 9.81389 9.12545 9.81178 9.12756C9.80968 9.12966 9.80757 9.13177 9.80547 9.13387C9.80336 9.13598 9.80125 9.13809 9.79914 9.1402C9.79703 9.14231 9.79491 9.14443 9.7928 9.14654C9.79068 9.14866 9.78857 9.15077 9.78645 9.15289C9.78433 9.15501 9.78222 9.15712 9.78009 9.15925C9.77797 9.16137 9.77585 9.16349 9.77373 9.16561C9.7716 9.16774 9.76948 9.16986 9.76735 9.17199C9.76522 9.17412 9.7631 9.17624 9.76097 9.17837C9.75884 9.1805 9.7567 9.18264 9.75457 9.18477C9.75244 9.1869 9.7503 9.18904 9.74816 9.19118C9.74603 9.19331 9.74389 9.19545 9.74175 9.19759C9.73961 9.19973 9.73747 9.20187 9.73532 9.20402C9.73318 9.20616 9.73103 9.20831 9.72889 9.21045C9.72674 9.2126 9.72459 9.21475 9.72244 9.2169C9.72029 9.21905 9.71814 9.2212 9.71599 9.22335C9.71383 9.22551 9.71168 9.22766 9.70952 9.22982C9.70737 9.23197 9.70521 9.23413 9.70305 9.23629C9.70089 9.23845 9.69872 9.24062 9.69656 9.24278C9.6944 9.24494 9.69223 9.24711 9.69007 9.24927C9.6879 9.25144 9.68573 9.25361 9.68356 9.25578C9.68139 9.25795 9.67922 9.26012 9.67704 9.2623C9.67487 9.26447 9.67269 9.26665 9.67052 9.26882C9.66834 9.271 9.66616 9.27318 9.66398 9.27536C9.6618 9.27754 9.65962 9.27972 9.65743 9.28191C9.65525 9.28409 9.65306 9.28628 9.65087 9.28847C9.64869 9.29065 9.6465 9.29284 9.6443 9.29504C9.64211 9.29723 9.63992 9.29942 9.63773 9.30161C9.63553 9.30381 9.63333 9.30601 9.63114 9.3082C9.62894 9.3104 9.62674 9.3126 9.62454 9.31481C9.62233 9.31701 9.62013 9.31921 9.61792 9.32142C9.61572 9.32362 9.61351 9.32583 9.6113 9.32804C9.60909 9.33025 9.60688 9.33246 9.60467 9.33467C9.60246 9.33688 9.60024 9.3391 9.59803 9.34131C9.59581 9.34353 9.59359 9.34575 9.59137 9.34797C9.58915 9.35019 9.58693 9.35241 9.58471 9.35464C9.58248 9.35686 9.58026 9.35908 9.57803 9.36131C9.5758 9.36354 9.57357 9.36577 9.57134 9.368C9.56911 9.37023 9.56688 9.37246 9.56464 9.3747C9.56241 9.37693 9.56017 9.37917 9.55793 9.38141C9.55569 9.38365 9.55345 9.38589 9.55121 9.38813C9.54897 9.39037 9.54673 9.39262 9.54448 9.39486C9.54223 9.39711 9.53999 9.39935 9.53774 9.4016C9.53549 9.40385 9.53323 9.40611 9.53098 9.40836C9.52873 9.41061 9.52647 9.41287 9.52421 9.41513C9.52196 9.41738 9.5197 9.41964 9.51744 9.4219C9.51518 9.42416 9.51291 9.42643 9.51065 9.42869C9.50838 9.43096 9.50612 9.43322 9.50385 9.43549C9.50158 9.43776 9.49931 9.44003 9.49704 9.44231C9.49476 9.44458 9.49249 9.44685 9.49021 9.44913C9.48793 9.45141 9.48566 9.45368 9.48338 9.45596C9.4811 9.45824 9.47881 9.46053 9.47653 9.46281C9.47424 9.4651 9.47196 9.46738 9.46967 9.46967L10.5303 10.5303ZM12.4697 6.46967L9.46967 9.46967L10.5303 10.5303L13.5303 7.53033L12.4697 6.46967ZM9.46967 10.5303L12.4697 13.5303L13.5303 12.4697L10.5303 9.46967L9.46967 10.5303Z"
        fill="white"
      />
    </svg>
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

const SubTitle = styled.div`
  margin-bottom: 15px;
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

const ImgCancelSvg = styled(CancelSvg)`
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

const StyledTag = styled.div`
  min-height: 34px;
  padding: 7px 12px;
  color: ${({ theme }) => theme.color.basic.White};
  background: transparent;
  border: 1px solid;
  border-radius: 40px;
`;

const TagGroupWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const TagWrapper = styled.div`
  position: relative;
  margin-right: 10px;
`;

const TagCancelSvg = styled(CancelSvg)`
  position: absolute;
  top: -6px;
  right: -6px;
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

const SnackBarWrapper = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 104px;
  left: calc(50% - 115px);
  width: 230px;
  height: 38px;
  padding: 10px 32px;
  color: ${({ theme }) => theme.color.basic.White};
  text-align: center;
  /* FIXME: 디자인시스템에 없는 색상 디자인팀에 문의 필요 */
  background-color: rgba(37, 37, 37, 0.8);
  border-radius: 4px;
  opacity: ${({ isVisible }) => (isVisible ? 0.95 : 0)};
  transition: opacity 1s;
  ${typography.Caption1_Regular_13}
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
