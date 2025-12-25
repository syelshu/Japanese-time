
const HOUR_READINGS: Record<number, string> = {
  1: 'いち',
  2: 'に',
  3: 'さん',
  4: 'よ', // Special: yoji
  5: 'ご',
  6: 'ろく',
  7: 'しち', // Special: shichiji
  8: 'はち',
  9: 'く', // Special: kuji
  10: 'じゅう',
  11: 'じゅういち',
  12: 'じゅうに',
};

const MINUTE_UNITS: Record<number, string> = {
  1: 'いっ',
  2: 'に',
  3: 'さん',
  4: 'よん',
  5: 'ご',
  6: 'ろっ',
  7: 'なな',
  8: 'はっ',
  9: 'きゅう',
  0: 'じゅっ', 
};

export const getTimeReading = (hour: number, minute: number): string => {
  let reading = HOUR_READINGS[hour] + 'じ';

  if (minute === 0) {
    return reading;
  }

  if (minute === 30) {
    return reading + 'はん / ' + reading + 'さんじゅっぷん';
  }

  const tens = Math.floor(minute / 10);
  const units = minute % 10;

  let minutePart = '';

  if (units === 0) {
    // 10, 20, 40, 50 minutes (30 is handled above)
    if (tens === 1) {
      minutePart = 'じゅっぷん';
    } else {
      minutePart = MINUTE_UNITS[tens] + 'じゅっぷん';
    }
  } else {
    // 1-9, 11-19, 21-29, etc.
    if (tens > 0) {
      if (tens === 1) {
        minutePart += 'じゅう';
      } else {
        minutePart += MINUTE_UNITS[tens] + 'じゅう';
      }
    }
    
    const unitReading = MINUTE_UNITS[units];
    // Minutes ending in 1, 3, 4, 6, 8, 0 usually take 'pun'
    const isPun = [1, 3, 4, 6, 8].includes(units);
    minutePart += unitReading + (isPun ? 'ぷん' : 'ふん');
  }

  return reading + minutePart;
};

export const getRandomTime = (): { hour: number; minute: number } => {
  const hour = Math.floor(Math.random() * 12) + 1;
  const minute = Math.floor(Math.random() * 60); // 0-59
  return { hour, minute };
};

export const isSpecialTime = (hour: number, minute: number): boolean => {
  // Special Hours: 4, 7, 9
  if ([4, 7, 9].includes(hour)) return true;

  if (minute === 0) return false;

  // Special Minutes: Ends in 1, 3, 4, 6, 8, 0 (including 10, 20...)
  // 30 is also special (han)
  if (minute === 30) return true;

  const unit = minute % 10;
  // User list: 1, 3, 4, 6, 8, 10(0)
  if ([1, 3, 4, 6, 8, 0].includes(unit)) return true;

  return false;
};
