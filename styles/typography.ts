/* eslint-disable @typescript-eslint/naming-convention */
import { css } from 'styled-components';

const Giant1 = css`
  font-size: 24px;
  font-style: normal;
  line-height: 140%;
`;

const Giant1_Bold_24 = css`
  font-weight: 700;
  ${Giant1}
`;

const Giant1_Regular_24 = css`
  font-weight: 400;
  ${Giant1}
`;

const Giant2 = css`
  font-size: 20px;
  font-style: normal;
  line-height: 140%;
`;

const Giant2_Bold_20 = css`
  font-weight: 700;
  ${Giant2}
`;

const Giant2_Regular_20 = css`
  font-weight: 400;
  ${Giant2}
`;

const Title1 = css`
  font-size: 18px;
  font-style: normal;
  line-height: 145%;
`;

const Title1_Bold_18 = css`
  font-weight: 700;
  ${Title1}
`;

const Title1_Regular_18 = css`
  font-weight: 400;
  ${Title1}
`;

const Title2 = css`
  font-size: 16px;
  font-style: normal;
  line-height: 160%;
`;

const Title2_Bold_16 = css`
  font-weight: 700;
  ${Title2}
`;

const Title2_Medium_16 = css`
  font-weight: 500;
  ${Title2}
`;

const Title2_Regular_16 = css`
  font-weight: 400;
  ${Title2}
`;

const Body = css`
  font-size: 14px;
  font-style: normal;
  line-height: 140%;
`;

const Body_Bold_14 = css`
  font-weight: 700;
  ${Body}
`;

const Body_Medium_14 = css`
  font-weight: 500;
  ${Body}
`;

const Body_Regular_14 = css`
  font-weight: 400;
  ${Body}
`;

const Caption1 = css`
  font-size: 13px;
  font-style: normal;
  line-height: 140%;
`;

const Caption1_Bold_13 = css`
  font-weight: 700;
  ${Caption1}
`;

const Caption1_Regular_13 = css`
  font-weight: 400;
  ${Caption1}
`;

const Caption2 = css`
  font-size: 12px;
  font-style: normal;
  line-height: 140%;
`;

const Caption2_Bold_12 = css`
  font-weight: 700;
  ${Caption2}
`;

const Caption2_Regular_12 = css`
  font-weight: 400;
  ${Caption2}
`;

const typography = {
  Giant1_Bold_24,
  Giant1_Regular_24,
  Giant2_Bold_20,
  Giant2_Regular_20,
  Title1_Bold_18,
  Title1_Regular_18,
  Title2_Bold_16,
  Title2_Medium_16,
  Title2_Regular_16,
  Body_Bold_14,
  Body_Medium_14,
  Body_Regular_14,
  Caption1_Bold_13,
  Caption1_Regular_13,
  Caption2_Bold_12,
  Caption2_Regular_12,
};

export default typography;
