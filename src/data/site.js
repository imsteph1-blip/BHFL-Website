/**
 * Every business fact and menu link for the whole site, in one place.
 *
 * Change a phone number or a town here and it updates on every page.
 * Anything marked "confirm" still needs Stephanie to check it before launch.
 */

/**
 * Where we work, with a line about each place.
 *
 * The lines are here for two reasons: they tell a visitor what we actually do
 * in their town, and naming towns plainly is what helps people find us on
 * Google. Each line describes our service there, not the town itself.
 */
export const serviceAreas = [
  {
    name: "Coeur d'Alene",
    line: 'Overnight stays, drop-in visits and home watch across Coeur d\u2019Alene and the neighborhoods around the lake.',
  },
  {
    name: 'Hayden',
    line: 'In-home pet care and house sitting throughout Hayden and Hayden Lake.',
  },
  {
    name: 'Post Falls',
    line: 'Overnight care, dog walking and drop-in visits across Post Falls.',
  },
  {
    name: 'Rathdrum',
    line: 'Pet care plus small farm and homestead help on the properties around Rathdrum.',
  },
  {
    name: 'Sandpoint',
    line: 'Overnight stays and home watch in Sandpoint, including longer winter stays.',
  },
  {
    name: 'Sagle',
    line: 'In-home care and farm chores for the properties south of Sandpoint.',
  },
  {
    name: 'Harrison',
    line: 'Overnight care and home watch along the south end of the lake.',
  },
  {
    name: 'Gozzer Ranch',
    line: 'Discreet in-home care and home watch for Gozzer Ranch members and their guests.',
  },
  {
    name: 'Black Rock',
    line: 'Overnight stays and home watch at Black Rock, in season and out of it.',
  },
  {
    name: 'Clark Fork',
    line: 'In-home pet care and homestead help out toward Clark Fork.',
  },
  {
    name: 'Hope',
    line: 'Overnight stays and home watch in Hope and East Hope.',
  },
  {
    name: 'Bonners Ferry',
    line: 'Pet care, farm chores and home watch up in Boundary County.',
  },
  {
    name: 'Spokane, WA',
    line: 'Overnight care and drop-in visits across the state line in Spokane.',
  },
  {
    name: 'Spokane Valley, WA',
    line: 'In-home pet care and house sitting throughout Spokane Valley.',
  },
];

export const business = {
  name: 'Because He First Loved',
  tagline: 'Pet & Property Caretaking',
  region: 'North Idaho',

  // Phone confirmed by Stephanie. Email still to confirm.
  phone: '(208) 571-5555',
  phoneLink: '+12085715555',
  email: 'stephanie@hefirstloved.com',

  verse: 'We love because He first loved us.',
  verseRef: '1 John 4:19',

  trust: [
    '13+ years caring for animals',
    '100+ stays',
    '5-star reviews',
  ],

  towns: serviceAreas.map((area) => area.name),

  travelNote: 'We travel for the right fit.',
};

/** The four service pages, used by the menu, the homepage tabs and the footer. */
export const services = [
  {
    name: 'Pet Care',
    href: '/pet-care/',
    art: 'butterfly-front',
    blurb: 'Overnight care, drop-in visits and walks, in the home your animals already know.',
  },
  {
    name: 'Home & Property',
    href: '/home-and-property/',
    art: 'lily',
    blurb: 'A lived-in house while you are away, with plants, mail and a careful eye on things.',
  },
  {
    name: 'Farm & Homestead',
    href: '/farm-and-homestead/',
    art: 'butterfly-side',
    blurb: 'The daily basics done faithfully: feed, water, clean bedding, eggs, turnout, locking up.',
  },
  {
    name: 'Pet Transportation',
    href: '/pet-transportation/',
    art: 'butterfly-lily-wide',
    blurb: 'Private door-to-door travel, state to state, with only your animals on board.',
  },
];

/** The four items that show in the header. Nothing else belongs up there. */
export const mainNav = [
  { name: 'Home', href: '/' },
  { name: 'Our Story', href: '/our-story/' },
  { name: 'Our Services', href: '/services/', children: services },
  { name: 'Blog', href: '/blog/' },
];

/**
 * The footer links, in three short columns.
 *
 * Everything the header leaves out lives here, grouped so it is quick to scan
 * rather than one long row of names.
 */
export const footerColumns = [
  {
    title: 'Explore',
    links: [
      { name: 'Our Story', href: '/our-story/' },
      { name: 'Reviews', href: '/reviews/' },
      { name: 'Blog', href: '/blog/' },
      { name: 'Contact', href: '/request-care/' },
    ],
  },
  {
    title: 'Services',
    links: services.map(({ name, href }) => ({ name, href })),
  },
  {
    title: 'Info',
    links: [
      { name: 'Pricing', href: '/pricing/' },
      { name: 'Service Area', href: '/service-area/' },
      { name: 'Request Care', href: '/request-care/' },
    ],
  },
];
