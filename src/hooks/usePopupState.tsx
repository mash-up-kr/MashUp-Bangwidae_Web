import { useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function usePopupState(closeAnimationDuration: number) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isBeforePopupClose, setIsBeforePopupClose] = useState(false);
  const adjustedCloseAnimationDuration = closeAnimationDuration * 100 + 100;

  const onOpen = (value: boolean) => {
    if (value) {
      setIsPopupOpen(true);
      return;
    }

    setIsBeforePopupClose(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      setIsBeforePopupClose(false);
    }, adjustedCloseAnimationDuration);
  };

  return { isPopupOpen, setIsPopupOpen: onOpen, isBeforePopupClose };
}
