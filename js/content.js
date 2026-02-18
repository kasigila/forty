/**
 * Forty — Static content: prompts, wisdom, Stations, liturgical dates
 * All content works offline; no external APIs.
 */

const DAILY_PROMPTS = [
  'What drew you to begin this journey today?',
  'Where did you notice God today?',
  'What are you most grateful for right now?',
  'What habit or thought are you ready to release?',
  'How can you be more present to someone today?',
  'Where did you feel resistance? What might it be teaching you?',
  'What small act of kindness can you offer today?',
  'When did you feel closest to peace?',
  'What scripture or phrase stayed with you?',
  'How has your "why" shown up this week?',
  'What are you learning about yourself?',
  'Where do you need to ask for grace?',
  'What would it look like to extend that grace to yourself?',
  'Who in your life needs your prayer today?',
  'What temptation did you face? How did you respond?',
  'Describe a moment of stillness.',
  'What are you adding to your life that brings joy?',
  'Where did you struggle? Where did you persevere?',
  'What would you say to yourself at the start of Lent?',
  'How has your prayer changed?',
  'What are you giving up? Is it easier or harder than expected?',
  'What scripture spoke to you today?',
  'Where do you need strength for tomorrow?',
  'What have you learned about discipline?',
  'How does your body feel? Your spirit?',
  'What would "enough" look like today?',
  'Who has supported you on this journey?',
  'What are you holding onto that you could release?',
  'How has this practice changed your days?',
  'What do you want to carry beyond these 40 days?',
  'Where did you see beauty today?',
  'What prayer do you need to pray for yourself?',
  'How has your "why" evolved?',
  'What would mercy look like for you right now?',
  'What are you most proud of so far?',
  'Where do you need rest?',
  'What would you tell someone starting this journey?',
  'How do you want to greet Easter?',
  'What has surprised you about this Lent?',
  'What are you ready to receive?'
];

const WISDOM_OF_THE_DAY = [
  'Small steps, faithfully taken, lead somewhere holy.',
  'Discipline is not punishment; it is love in action.',
  'Rest is part of the rhythm. Even Jesus withdrew.',
  'Your "why" is stronger than any momentary craving.',
  'Every day you begin again is a day you did not quit.',
  'Progress is rarely linear. Be patient with yourself.',
  'The desert has its own kind of beauty.',
  'Grace covers what effort cannot.',
  'You are not alone in this.',
  'What you sacrifice today becomes what you gain tomorrow.',
  'Prayer changes the one who prays.',
  'Scripture is a mirror. Let it show you what you need.',
  'Community holds us when we cannot hold ourselves.',
  'The hardest days often teach the most.',
  'Your body is a temple. Treat it gently.',
  'Silence can be the loudest prayer.',
  'Comparison steals joy. Run your own race.',
  'Forgiveness—especially of self—is a daily practice.',
  'Hope is not naive. It is courageous.',
  'You are enough, even when you fall short.',
  'The journey is the destination.',
  'What you feed grows. Choose wisely.',
  'Rest is resistance to the myth of constant productivity.',
  'God meets you where you are, not where you "should" be.',
  'Lent is not about proving yourself. It is about becoming.',
  'Your struggles do not define you. Your persistence does.',
  'Joy and discipline can coexist.',
  'Every "no" to temptation is a "yes" to something greater.',
  'The end is not the point. The path is.',
  'You have already begun. That matters.',
  'Breathe. You are held.',
  'Tomorrow is a chance to begin again.',
  'What you cannot do today, you can try again.',
  'Your pace is your pace. No one else walks your path.',
  'Gratitude softens the edges of sacrifice.',
  'The 40 days are a gift, not a test.',
  'You are becoming who you were meant to be.',
  'Trust the process. Trust yourself.',
  'Easter is coming. So is new life.',
  'You have made it this far. That is worth honoring.'
];

const STATIONS = [
  { n: 1, title: 'Jesus is condemned to death', prayer: 'Help me accept the moments when I feel condemned or judged.' },
  { n: 2, title: 'Jesus carries His cross', prayer: 'Give me strength to carry my own burdens without complaint.' },
  { n: 3, title: 'Jesus falls the first time', prayer: 'When I fall, help me rise again with humility.' },
  { n: 4, title: 'Jesus meets His mother', prayer: 'Comfort those who watch their loved ones suffer.' },
  { n: 5, title: 'Simon of Cyrene helps Jesus', prayer: 'Open my heart to help others carry their crosses.' },
  { n: 6, title: 'Veronica wipes the face of Jesus', prayer: 'Help me offer kindness to those in pain.' },
  { n: 7, title: 'Jesus falls the second time', prayer: 'Strengthen me when I stumble again.' },
  { n: 8, title: 'Jesus meets the women of Jerusalem', prayer: 'Let me weep with those who weep.' },
  { n: 9, title: 'Jesus falls the third time', prayer: 'When I feel I cannot go on, sustain me.' },
  { n: 10, title: 'Jesus is stripped of His garments', prayer: 'Help me be vulnerable before You.' },
  { n: 11, title: 'Jesus is nailed to the cross', prayer: 'Hold me in my moments of deepest pain.' },
  { n: 12, title: 'Jesus dies on the cross', prayer: 'Into Your hands I commend my spirit.' },
  { n: 13, title: 'Jesus is taken down from the cross', prayer: 'Receive my grief and my hope.' },
  { n: 14, title: 'Jesus is laid in the tomb', prayer: 'In the darkness, prepare me for resurrection.' }
];

/**
 * Liturgical dates for a given Lent (by start date)
 * Returns { ashWednesday, palmSunday, goodFriday, easterSunday, keyDates }
 */
function getLiturgicalDates(startDateStr) {
  const [y, m, d] = (startDateStr || '').split('-').map(Number);
  if (!y || !m || !d) return { keyDates: [] };
  const start = new Date(y, m - 1, d);
  const easter = getEaster(y);
  const ashWed = new Date(easter);
  ashWed.setDate(ashWed.getDate() - 46);
  const palmSunday = new Date(easter);
  palmSunday.setDate(palmSunday.getDate() - 7);
  const goodFriday = new Date(easter);
  goodFriday.setDate(goodFriday.getDate() - 2);
  const keyDates = [
    { label: 'Ash Wednesday', date: ashWed.toISOString().slice(0, 10) },
    { label: 'Palm Sunday', date: palmSunday.toISOString().slice(0, 10) },
    { label: 'Good Friday', date: goodFriday.toISOString().slice(0, 10) },
    { label: 'Easter', date: easter.toISOString().slice(0, 10) }
  ];
  return { ashWednesday: keyDates[0].date, palmSunday: keyDates[1].date, goodFriday: keyDates[2].date, easterSunday: keyDates[3].date, keyDates };
}

function getEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

window.FortyContent = {
  DAILY_PROMPTS,
  WISDOM_OF_THE_DAY,
  STATIONS,
  getLiturgicalDates
};
