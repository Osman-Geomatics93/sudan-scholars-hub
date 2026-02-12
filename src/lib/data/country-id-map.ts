// Maps legacy study-hub country IDs (from study-hub-data.js) to ISO alpha-2 codes
// Used for one-time localStorage migration of saved materials

export const LEGACY_COUNTRY_ID_TO_ISO: Record<string, string> = {
  // Middle East
  sudan: 'sd',
  egypt: 'eg',
  saudi: 'sa',
  uae: 'ae',
  jordan: 'jo',
  qatar: 'qa',
  kuwait: 'kw',
  oman: 'om',
  // Africa
  ethiopia: 'et',
  nigeria: 'ng',
  south_africa: 'za',
  kenya: 'ke',
  uganda: 'ug',
  morocco: 'ma',
  tunisia: 'tn',
  // Asia
  turkey: 'tr',
  malaysia: 'my',
  india: 'in',
  china: 'cn',
  japan: 'jp',
  south_korea: 'kr',
  indonesia: 'id',
  // Europe
  uk: 'gb',
  germany: 'de',
  france: 'fr',
  netherlands: 'nl',
  sweden: 'se',
  italy: 'it',
  russia: 'ru',
  poland: 'pl',
  // Americas
  usa: 'us',
  canada: 'ca',
  brazil: 'br',
  mexico: 'mx',
  // Oceania
  australia: 'au',
};
