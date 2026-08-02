export interface ImageCredit {
  asset: string;
  title: string;
  creator: string;
  sourceUrl: string;
  license: string;
  replacementStatus: 'temporary' | 'final';
}

export const imageCredits: ImageCredit[] = [
  {
    asset: 'chapel-light.jpg',
    title: '1959 chapel light',
    creator: 'Dsmack (attribution inferred from the Commons record)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:1959chapellight.jpg',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'chapel-pond.jpg',
    title: 'Class of 1959 Chapel koi pond',
    creator: 'Dsmack (attribution inferred from the Commons record)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:1959chapelgardenfromtop2.JPG',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'specimen-01.jpg',
    title: '2002-08 Koi in pond',
    creator: 'Magnus Manske',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2002-08_Koi_in_pond.jpg',
    license: 'CC BY 1.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'specimen-02.jpg',
    title: '2 year old Aka Muji',
    creator: 'Paulman',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2_year_old_Aka_Muji.jpg',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'specimen-03.jpg',
    title: '2 year old Platina',
    creator: 'Paulman',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2_year_old_Platina.jpg',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'specimen-04.jpg',
    title: '2 year old Yamabuki',
    creator: 'Paulman',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2_year_old_Yamabuki.jpg',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'oleg-engraved.png',
    title: 'Oleg Mashtaler engraving',
    creator: 'Supplied project asset',
    sourceUrl: 'supplied locally',
    license: 'Project asset',
    replacementStatus: 'final',
  },
];
