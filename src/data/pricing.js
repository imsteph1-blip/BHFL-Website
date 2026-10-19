/**
 * The rate card.
 *
 * EVERY NUMBER HERE NEEDS CONFIRMING BEFORE THE SITE GOES LIVE.
 * These came from the brief and have not been checked against what
 * Stephanie actually charges today.
 *
 * Changing a price here changes it on the pricing page. The "starting at"
 * line on each service page lives in services.js and has to be changed there
 * as well, because it is worded differently.
 */

export const rates = [
  { service: 'Overnight in-home care, dogs', price: 'from $100 / night' },
  { service: 'Overnight in-home care, cats', price: 'from $90 / night' },
  { service: 'Each additional dog or cat', price: '+$15 / +$10 per night' },
  { service: 'Home & Property watch, no pets', price: 'from $80 / night' },
  { service: 'Drop-in visit, 30 minutes', price: '$30' },
  { service: 'Extended visit, 60 minutes', price: '$45' },
  { service: 'Dog walk, 30 minutes', price: '$30' },
  { service: 'Farm & homestead care', price: 'add-on, from $10 / day' },
  { service: 'Pet transportation', price: 'custom quote' },
  { service: 'Holidays', price: '+$15 per night or visit' },
  { service: 'Extended stays', price: 'reduced rate from night 8' },
];

/** What every stay comes with, whatever it costs. */
export const included = [
  'A free meet-and-greet before your first booking',
  'Photos and honest updates while you are away',
  'Your routine kept the way you leave it',
  'Medication given on time and written down',
  'Mail, bins, plants and lights looked after',
  'The house left the way we found it',
];

/** The honest small print. */
export const notes = [
  'Travel, special needs and farm animals are quoted after the meet-and-greet, once we know what we are actually looking after.',
  'No deposit. You do not pay anything to talk to us.',
  'Long drives and pet transportation are always quoted individually.',
];
