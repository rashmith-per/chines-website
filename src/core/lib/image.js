/**
 * Image registry. All photography is served from the Unsplash CDN and sized on demand.
 * Modules refer to images by semantic key so assets can be swapped in one place.
 */
const IMAGES = {
  dimsum: '1563245372-f21724e3856d',
  dumpling: '1496116218417-1a781b1c416c',
  manchurian: '1525755662778-989d0524087e',
  hakkaDark: '1585032226651-759b368d7246',
  friedRice: '1603133872878-684f208fb84b',
  ramenEgg: '1569718212165-3a8278d5f624',
  ramenDark: '1552611052-33e04de081de',
  chilliNoodles: '1612929633738-8fe44f7ec841',
  crispyPotato: '1585109649139-366815a0d713',
  laksa: '1617093727343-374698b1b08d',
  sichuanNoodles: '1626804475297-41608ea09aeb',
  prawnCurry: '1559847844-5315695dadae',
  wontonSoup: '1555126634-323283e090fa',
  hakka: '1617622141675-d3005b9067c5',
  interior: '1552566626-52f8b828add9',
  interiorDark: '1517248135467-4c7edcad34c4',
  fineDining: '1414235077428-338989a2e8c0',
  spread: '1504674900247-0877df9cc836',
  bar: '1514933651103-005eec06c04b',
  interiorWarm: '1590846406792-0adc7f938f1d',
  beefSoup: '1582878826629-29b7ad1cdc43',
  ramenBeer: '1623341214825-9f4f963727da',
  garlicRice: '1512058564366-18510be2db19',
  friedChicken: '1569058242253-92a9c755a0ec',
  chilliChicken: '1609183480237-ccbb2d7c5772',
  pho: '1576577445504-6af96477db52',
  icedTea: '1556679343-c7306c1976bc',
  teapot: '1564890369478-c89ca6d9cde9',
  greenTea: '1576092768241-dec231879fc3',
  sundae: '1563805042-7684c019e1cb',
  macarons: '1528975604071-b4dc52a2d18c',
  interiorBright: '1555396273-367ea4eb4db5',
  tableSpread: '1600891964599-f61ba0e24092',
  greensSoup: '1583835746434-cf1534674b41',
  chefPlating: '1577219491135-ce391730fb2c',
  headChef: '1581299894007-aaa50297cf16',
  tableBg: '1505935428862-770b6f24f629',
  momos: '1534422298391-e4f8c172dddb',
  vegBowl: '1547592180-85f173990554',
  tofuCurry: '1588166524941-3bf61a9c41db',
  garlicChicken: '1631292784640-2b24be784d5d',
  fish: '1580959375944-abd7e991f971',
  curryNoodles: '1607330289024-1535c6b4e1c1',
  meatballs: '1529042410759-befb1204b468',
  friedPrawns: '1562967914-608f82629710',
  prawnNoodles: '1559314809-0d155014e29e',
}

export function img(key, { w = 800, h, q = 75 } = {}) {
  const id = IMAGES[key] ?? IMAGES.spread
  const size = h ? `&h=${h}&fit=crop` : ''
  return `https://images.unsplash.com/photo-${id}?auto=format&w=${w}${size}&q=${q}`
}

export const imageKeys = Object.keys(IMAGES)
