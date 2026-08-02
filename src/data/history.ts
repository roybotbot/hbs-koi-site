export interface HistoryEvent {
  date: string;
  title: string;
  body: string;
  sourceLabel: string;
  sourceUrl: string;
}

const hbsHistoryUrl =
  'https://www.hbs.edu/about/campus-and-culture/campus-built-on-philanthropy/class-of-1959-chapel';
const referenceArticleUrl = 'https://en.wikipedia.org/wiki/The_Class_of_1959_Chapel';
const olegProfileUrl = 'https://www.hbs.edu/news/stories/oleg-mashtaler';

export const historyEvents: HistoryEvent[] = [
  {
    date: '1959',
    title: 'A class gift takes shape',
    body: 'The graduating class that later funded the chapel through its 25th- and 30th-reunion campaigns.',
    sourceLabel: 'HBS history',
    sourceUrl: hbsHistoryUrl,
  },
  {
    date: '1992',
    title: 'Chapel and water garden completed',
    body: 'Moshe Safdie and Associates completed the chapel and enclosed water garden.',
    sourceLabel: 'Reference article',
    sourceUrl: referenceArticleUrl,
  },
  {
    date: '1997',
    title: 'A chamber organ is added',
    body: 'A chamber organ designed by Taylor & Boody Organbuilders was added.',
    sourceLabel: 'HBS chapel source',
    sourceUrl: hbsHistoryUrl,
  },
  {
    date: '2011',
    title: 'Resource use is reduced',
    body: 'The building achieved LEED Gold certification after work reducing energy and water use.',
    sourceLabel: 'HBS sustainability source',
    sourceUrl: hbsHistoryUrl,
  },
  {
    date: 'Present',
    title: 'The koi receive daily care',
    body: "Oleg Mashtaler cares for the pond's 17 koi and monitors its treatment systems.",
    sourceLabel: 'HBS staff profile',
    sourceUrl: olegProfileUrl,
  },
];
