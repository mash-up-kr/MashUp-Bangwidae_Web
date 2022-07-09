import 'styled-components';
import { Basic } from './color/Basic';
import { Error } from './color/Error';
import { Gray } from './color/Gray';
import { Primary } from './color/Primary';
import { Secondary01 } from './color/Secondary01';
import { Secondary02 } from './color/Secondary02';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      basic: Basic;
      error: Error;
      gray: Gray;
      primary: Primary;
      secondary01: Secondary01;
      secondary02: Secondary02;
    };
  }
}
