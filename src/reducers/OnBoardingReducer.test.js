/* eslint-disable flowtype/require-valid-file-annotation */

/* globals test expect */
import { onBoarding as onBoardingReducer } from './OnBoardingReducer.js'
import s from '../locales/strings.js'

test('initialState', () => {
  const expected = {
    currentIndex: 0,
    totalSlides: 4,
    slides: [
      {
        text: s.strings.onboarding_slide_1,
        iOSImage: 'onboard1',
        iPadImage: 'iPadOnboarding1Vert',
        iPadImageHoriz: 'iPadOnboarding1Horiz',
        androidImage: 'onboard1',
        androidTabletHorizontalImage: 'onboardingHorizTab1',
        androidTabletVerticalImage: 'onboardingVertTab1'
      },
      {
        text: s.strings.onboarding_slide_2,
        iOSImage: 'onboard2',
        iPadImage: 'iPadOnboarding2Vert',
        iPadImageHoriz: 'iPadOnboarding2Horiz',
        androidImage: 'onboard2',
        androidTabletHorizontalImage: 'onboardingHorizTab2',
        androidTabletVerticalImage: 'onboardingVertTab2'
      },
      {
        text: s.strings.onboarding_slide_3,
        iOSImage: 'onboard3',
        iPadImage: 'iPadOnboarding3Vert',
        iPadImageHoriz: 'iPadOnboarding3Horiz',
        androidImage: 'onboard3',
        androidTabletHorizontalImage: 'onboardingHorizTab3',
        androidTabletVerticalImage: 'onboardingVertTab3'
      },
      {
        text: s.strings.onboarding_slide_4,
        iOSImage: 'onboard4',
        iPadImage: 'iPadOnboarding4Vert',
        iPadImageHoriz: 'iPadOnboarding4Horiz',
        androidImage: 'onboard4',
        androidTabletHorizontalImage: 'onboardingHorizTab4',
        androidTabletVerticalImage: 'onboardingVertTab4'
      }
    ]
  }
  const actual = onBoardingReducer(undefined, {})

  expect(actual).toEqual(expected)
})
