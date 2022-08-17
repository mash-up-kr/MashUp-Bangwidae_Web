import { useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useTranslateAnimation(closeAnimationDuration: number) {
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [isBeforeTargetClose, setIsBeforeTargetClose] = useState(false);
  const adjustedCloseAnimationDuration = closeAnimationDuration * 100 + 100;

  const onTranslate = (value: boolean) => {
    if (value) {
      setIsTargetOpen(true);
      return;
    }

    setIsBeforeTargetClose(true);
    setTimeout(() => {
      setIsTargetOpen(false);
      setIsBeforeTargetClose(false);
    }, adjustedCloseAnimationDuration);
  };

  return { isTargetOpen, setIsTargetOpen: onTranslate, isBeforeTargetClose };
}
