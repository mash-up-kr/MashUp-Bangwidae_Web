/* eslint-disable @typescript-eslint/naming-convention */
import { css } from 'styled-components';

const K_font_family = css`
  /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
  font-family: 'Spoqa Han Sans Neo';
`;

const E_font_family = css`
  /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
  font-family: 'SF Pro';
`;

const Giant1 = css`
  font-size: 24px;
  font-style: normal;
  line-height: 140%;
`;

const K_Giant1 = css`
  ${K_font_family}
  ${Giant1}
`;

const E_Giant1 = css`
  ${E_font_family}
  ${Giant1}
`;

const K_Giant1_Bold_24 = css`
  font-weight: 700;
  ${K_Giant1}
`;

const K_Giant1_Regular_24 = css`
  font-weight: 400;
  ${K_Giant1}
`;

const E_Giant1_Bold_24 = css`
  font-weight: 700;
  ${E_Giant1}
`;

const E_Giant1_Regular_24 = css`
  font-weight: 400;
  ${E_Giant1}
`;

const Giant2 = css`
  font-size: 20px;
  font-style: normal;
  line-height: 140%;
`;

const K_Giant2 = css`
  ${Giant2}
  ${K_font_family}
`;

const E_Giant2 = css`
  ${Giant2}
  ${E_font_family}
`;

const K_Giant2_Bold_20 = css`
  font-weight: 700;
  ${K_Giant2}
`;

const K_Giant2_Regular_20 = css`
  font-weight: 400;
  ${K_Giant2}
`;

const E_Giant2_Bold_20 = css`
  font-weight: 700;
  ${E_Giant2}
`;

const E_Giant2_Regular_20 = css`
  font-weight: 400;
  ${E_Giant2}
`;

const Title1 = css`
  font-size: 18px;
  font-style: normal;
  line-height: 145%;
`;

const K_Title1 = css`
  ${Title1}
  ${K_font_family}
`;

const E_Title1 = css`
  ${Title1}
  ${E_font_family}
`;

const K_Title1_Bold_18 = css`
  font-weight: 700;
  ${K_Title1}
`;

const K_Title1_Regular_18 = css`
  font-weight: 400;
  ${K_Title1}
`;

const E_Title1_Bold_18 = css`
  font-weight: 700;
  ${E_Title1}
`;

const E_Title1_Regular_18 = css`
  font-weight: 400;
  ${E_Title1}
`;

const Title2 = css`
  font-size: 16px;
  font-style: normal;
  line-height: 160%;
`;

const K_Title2 = css`
  ${Title2}
  ${K_font_family}
`;

const E_Title2 = css`
  ${Title2}
  ${E_font_family}
`;

const K_Title2_Bold_16 = css`
  font-weight: 700;
  ${K_Title2}
`;

const K_Title2_Medium_16 = css`
  font-weight: 500;
  ${K_Title2}
`;

const K_Title2_Regular_16 = css`
  font-weight: 400;
  ${K_Title2}
`;

const E_Title2_Bold_16 = css`
  font-weight: 700;
  ${E_Title2}
`;

const E_Title2_Medium_16 = css`
  font-weight: 500;
  ${E_Title2}
`;

const E_Title2_Regular_16 = css`
  font-weight: 400;
  ${E_Title2}
`;

const Body = css`
  font-size: 14px;
  font-style: normal;
  line-height: 140%;
`;

const K_Body = css`
  ${Body}
  ${K_font_family}
`;

const E_Body = css`
  ${Body}
  ${E_font_family}
`;

const K_Body_Bold_14 = css`
  font-weight: 700;
  ${K_Body}
`;

const K_Body_Medium_14 = css`
  font-weight: 500;
  ${K_Body}
`;

const K_Body_Regular_14 = css`
  font-weight: 400;
  ${K_Body}
`;

const E_Body_Bold_14 = css`
  font-weight: 700;
  ${E_Body}
`;

const E_Body_Medium_14 = css`
  font-weight: 500;
  ${E_Body}
`;

const E_Body_Regular_14 = css`
  font-weight: 400;
  ${E_Body}
`;

const Caption1 = css`
  font-size: 13px;
  font-style: normal;
  line-height: 140%;
`;

const K_Caption1 = css`
  ${Caption1}
  ${K_font_family}
`;

const E_Caption1 = css`
  ${Caption1}
  ${E_font_family}
`;

const K_Caption1_Bold_13 = css`
  font-weight: 700;
  ${K_Caption1}
`;

const K_Caption1_Regular_13 = css`
  font-weight: 400;
  ${K_Caption1}
`;

const E_Caption1_Bold_13 = css`
  font-weight: 700;
  ${E_Caption1}
`;

const E_Caption1_Regular_13 = css`
  font-weight: 400;
  ${E_Caption1}
`;

const Caption2 = css`
  font-size: 12px;
  font-style: normal;
  line-height: 140%;
`;

const K_Caption2 = css`
  ${Caption2}
  ${K_font_family}
`;

const E_Caption2 = css`
  ${Caption2}
  ${E_font_family}
`;

const K_Caption2_Bold_12 = css`
  font-weight: 700;
  ${K_Caption2}
`;

const K_Caption2_Regular_12 = css`
  font-weight: 400;
  ${K_Caption2}
`;

const E_Caption2_Bold_12 = css`
  font-weight: 700;
  ${E_Caption2}
`;

const E_Caption2_Regular_12 = css`
  font-weight: 400;
  ${E_Caption2}
`;

const typography = {
  K_Giant1_Bold_24,
  K_Giant1_Regular_24,
  K_Giant2_Bold_20,
  K_Giant2_Regular_20,
  K_Title1_Bold_18,
  K_Title1_Regular_18,
  K_Title2_Bold_16,
  K_Title2_Medium_16,
  K_Title2_Regular_16,
  K_Body_Bold_14,
  K_Body_Medium_14,
  K_Body_Regular_14,
  K_Caption1_Bold_13,
  K_Caption1_Regular_13,
  K_Caption2_Bold_12,
  K_Caption2_Regular_12,
  E_Giant1_Bold_24,
  E_Giant1_Regular_24,
  E_Giant2_Bold_20,
  E_Giant2_Regular_20,
  E_Title1_Bold_18,
  E_Title1_Regular_18,
  E_Title2_Bold_16,
  E_Title2_Medium_16,
  E_Title2_Regular_16,
  E_Body_Bold_14,
  E_Body_Medium_14,
  E_Body_Regular_14,
  E_Caption1_Bold_13,
  E_Caption1_Regular_13,
  E_Caption2_Bold_12,
  E_Caption2_Regular_12,
};

export default typography;
