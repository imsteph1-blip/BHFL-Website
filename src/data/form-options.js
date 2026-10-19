/**
 * Every choice on the Request Care form.
 *
 * Reword a choice here and it changes on the form. Nothing else needs
 * touching. Add one to a list and it appears in order.
 */

/* ---- Section 3: Your dates ------------------------------------------- */

/** Every half hour of the day, written the way people say them. */
function everyHalfHour() {
  const times = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += 30) {
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const suffix = hour24 < 12 ? 'AM' : 'PM';
    times.push(`${hour12}:${String(minute).padStart(2, '0')} ${suffix}`);
  }
  return times;
}

export const timeOptions = [...everyHalfHour(), 'Not sure yet'];

export const datesFinalOptions = [
  { value: 'final', label: 'Yes, these are our final dates' },
  { value: 'deciding', label: 'No, we are still deciding on dates' },
  { value: 'other', label: 'Other', opensText: true },
];

/* ---- Section 4: What you need ----------------------------------------- */

/**
 * The cards people check. `animals: true` means checking it opens the
 * "Your animals" section. `follow` is the id of the follow-up section that
 * slides down underneath.
 */
export const careOptions = [
  { id: 'pet-sitting', label: 'In-Home Pet Sitting', animals: true },
  { id: 'drop-in', label: 'Drop-in Visits', animals: true, follow: true },
  { id: 'dog-walking', label: 'Dog Walking', animals: true, follow: true },
  { id: 'home-watch', label: 'Home and Property Watch', note: 'Does not include pets', follow: true },
  { id: 'farm', label: 'Farm and Homestead Care', follow: true },
  { id: 'transport', label: 'State-to-State Transportation', animals: true, follow: true },
  { id: 'other', label: 'Other', follow: true },
];

export const perDayOptions = ['1', '2', '3', 'Not sure'];
export const lengthOptions = ['30 minutes', '60 minutes', 'Not sure'];

/* ---- Home and Property Watch ------------------------------------------ */

export const homeWatchTasks = [
  'Water indoor and outdoor plants',
  'Bring in mail and packages',
  'Take trash and recycling bins out and back',
  'Check the yard, garage and outbuildings',
];

export const homeWatchHelp = [
  'Meet deliveries',
  'Let in tradespeople, cleaners or repair crews',
  'Get the home ready before you return',
];

export const homeWatchIncluded =
  'A walk-through of the whole home, checks for leaks, locks and anything out of place, and photo updates so you know all is well.';

/* ---- Farm and Homestead ------------------------------------------------ */

export const farmGroups = [
  'Chickens, ducks or turkeys',
  'Goats or sheep',
  'Pigs',
  'Llamas or alpacas',
  'Horses, donkeys or mules',
  'Cattle',
  'Rabbits or small caged animals',
  'Other',
];

export const farmChores = [
  'Feeding',
  'Fresh water',
  'Mucking or bedding',
  'Egg collection',
  'Turnout',
  'Lock-up at night',
  'Other',
];

/* ---- State-to-State Transportation ------------------------------------- */

export const tripTypeOptions = [
  { value: 'one-way', label: 'One way' },
  { value: 'round-trip', label: 'Round trip', opensReturn: true },
  { value: 'not-sure', label: 'Not sure' },
];

export const vehicleOptions = ['Yours', 'A rental', 'Not sure'];
export const careOnArrivalOptions = ['Yes', 'No', 'Not sure'];
export const carBehaviorOptions = [
  'Great travelers',
  'A little nervous',
  'Get carsick',
  'Have not traveled much',
  'Not sure',
];
export const crateTrainedOptions = ['Yes', 'Some of them', 'No', 'Not sure'];
export const rideAlongOptions = ['Yes', 'No', 'Not sure'];

/* ---- Section 5: Your animals -------------------------------------------- */

export const petTypes = ['Dog', 'Cat', 'Bird', 'Small animal', 'Reptile', 'Other'];
export const petSexOptions = ['Male', 'Female'];
export const spayedOptions = ['Yes', 'No', 'Not sure'];
export const houseTrainedOptions = ['Yes', 'Mostly', 'No', 'Not applicable'];
export const newPeopleOptions = [
  'Warms up fast',
  'A little shy at first',
  'Nervous or reactive',
  'Not sure',
];
export const medicationGivenOptions = [
  'Pill',
  'In food',
  'Liquid',
  'Eye or ear drops',
  'Cream or topical',
  'Injection',
  'Other',
];
export const timesADayOptions = ['1', '2', '3 or more'];

/* ---- Section 6: Anything we should know ---------------------------------- */

export const heardAboutOptions = [
  'A friend or family member',
  'A past client',
  'Google',
  'Facebook',
  'Instagram',
  'Rover',
  'Other',
];
