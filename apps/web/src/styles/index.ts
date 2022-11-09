import { mauve, gray, blue, red, green } from '@radix-ui/colors';

// Spread the scales in your light and dark themes
import { createStitches } from '@stitches/react';

const { styled } = createStitches({
  theme: {
    colors: {
      ...gray,
      ...blue,
      ...red,
      ...green,
      ...mauve,

      neutral1: '$mauve1',
      neutral2: '$mauve2',
      neutral3: '$mauve3',
      neutral4: '$mauve4',
      neutral5: '$mauve5',
      neutral6: '$mauve6',
      neutral7: '$mauve7',
      neutral8: '$mauve8',
      neutral9: '$mauve9',
      neutral10: '$mauve10',
      neutral11: '$mauve11',
      neutral12: '$mauve12',

      // Semantic aliases for colors, prefer to use these in styles
      accent1: '$blue1',
      accent2: '$blue2',
      accent3: '$blue3',
      accent4: '$blue4',
      accent5: '$blue5',
      accent6: '$blue6',
      accent7: '$blue7',
      accent8: '$blue8',
      accent9: '$blue9',
      accent10: '$blue10',
      accent11: '$blue11',
      accent12: '$blue12',

      success1: '$green1',
      success2: '$green2',
      success3: '$green3',
      success4: '$green4',
      success5: '$green5',
      success6: '$green6',
      success7: '$green7',
      success8: '$green8',
      success9: '$green9',
      success10: '$green10',
      success11: '$green11',
      success12: '$green12',

      warning1: '$yellow1',
      warning2: '$yellow2',
      warning3: '$yellow3',
      warning4: '$yellow4',
      warning5: '$yellow5',
      warning6: '$yellow6',
      warning7: '$yellow7',
      warning8: '$yellow8',
      warning9: '$yellow9',
      warning10: '$yellow10',
      warning11: '$yellow11',
      warning12: '$yellow12',

      danger1: '$red1',
      danger2: '$red2',
      danger3: '$red3',
      danger4: '$red4',
      danger5: '$red5',
      danger6: '$red6',
      danger7: '$red7',
      danger8: '$red8',
      danger9: '$red9',
      danger10: '$red10',
      danger11: '$red11',
      danger12: '$red12',
    },
  },
});

// const darkTheme = createTheme({
//   colors: {
//     ...grayDark,
//     ...blueDark,
//     ...redDark,
//     ...greenDark,
//   },
// });

export { styled };
