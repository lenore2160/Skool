import cottageBakeryHero from './images/cottage_bakery_hero_1789796124901.jpg';
import chapter1PartyHero from './images/mila_birthday_cottage_1791265061856.jpg';
import chapter2PanHero from './images/barnaby_pan_mice_1791027096793.jpg';
import chapter3RulesHero from './images/chapter_three_dressed_1791134096899.jpg';
import chapter4LineHero from './images/chapter_four_bakery_line_1791136910327.jpg';
import chapter5TeacherHero from './images/chapter_five_teacher_hazel_1791203382305.jpg';
import chapter6WholeHero from './images/chapter_six_whole_number_1791473519761.jpg';
import chapter7RushHero from './images/chapter_seven_rush_hero_1791474502799.jpg';
import chocolatePanCakeThumb from './images/oven_pan_cake_thumb_1791028843543.jpg';
import teacherHazel3d from './images/teacher_hazel_3d_1789796138303.jpg';
import barnabyBear3d from './images/barnaby_bear_3d_1789796151461.jpg';
import pipPenguin3d from './images/pip_penguin_3d_1789796163191.jpg';
import birthdayCelebration3d from './images/birthday_celebration_3d_1789796175653.jpg';

import chapter1Cake3d from './images/tenth_birthday_cake_1790084577250.jpg';
import chapter2Pan3d from './images/chapter_two_pan_fix_1790085493788.jpg';
import chapter3Rules3d from './images/chapter_three_rules_1790082773989.jpg';
import chapter4Puzzle3d from './images/chapter_four_puzzle_wood_1790085852158.jpg';
import chapter5Addition3d from './images/chapter_five_addition_1790082795956.jpg';
import chapter6Rush3d from './images/chapter_six_rush_characters_1790085839453.jpg';

import ruleSlice3d from './images/rule_slice_3d_1791134622935.jpg';
import ruleWhole3d from './images/rule_whole_3d_1791134638737.jpg';
import ruleMixed3d from './images/rule_mixed_3d_1791134651815.jpg';
import ruleDivide3d from './images/rule_divide_3d_1791134663398.jpg';

export const STORY_3D_ASSETS = {
  cottageBakeryHero,
  chapter1PartyHero,
  chapter2PanHero,
  chapter3RulesHero,
  chapter4LineHero,
  chapter5TeacherHero,
  chapter6WholeHero,
  chapter7RushHero,
  chocolatePanCakeThumb,
  teacherHazel3d,
  barnabyBear3d,
  pipPenguin3d,
  birthdayCelebration3d,
  chapter1Cake3d,
  chapter2Pan3d,
  chapter3Rules3d,
  chapter4Puzzle3d,
  chapter5Addition3d,
  chapter6Rush3d,
  ruleSlice3d,
  ruleWhole3d,
  ruleMixed3d,
  ruleDivide3d,
} as const;

export function getCharacter3dAvatar(characterId: string): string | null {
  const lower = characterId.toLowerCase();
  if (lower.includes('hazel') || lower.includes('teacher') || lower.includes('juffrou')) {
    return teacherHazel3d;
  }
  if (lower.includes('barnaby') || lower.includes('bear') || lower.includes('beer')) {
    return barnabyBear3d;
  }
  if (lower.includes('pip') || lower.includes('penguin') || lower.includes('pikkewyn')) {
    return pipPenguin3d;
  }
  if (lower.includes('mia') || lower.includes('birthday') || lower.includes('party')) {
    return birthdayCelebration3d;
  }
  return null;
}
