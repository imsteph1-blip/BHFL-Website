/**
 * What each of the four services is, in Stephanie's words.
 *
 * This one file writes all four service pages AND the tabbed box on the
 * homepage, so a wording change only has to happen in one place. To reword a
 * service, edit it here and it updates everywhere at once.
 *
 * Anything marked [confirm] is a detail Stephanie needs to check before the
 * site goes live. Prices are marked separately and all need confirming.
 */

export const serviceDetails = [
  {
    slug: 'pet-care',
    name: 'Pet Care',
    href: '/pet-care/',
    art: 'butterfly-front',
    photo: 'service-pet-care.jpg',
    photoAlt: 'A dog resting on its own bed at home',

    // Shown under the page title, and in the tabbed box on the homepage.
    heroLine: 'Overnight stays, visits and walks, in the home your animals already know.',
    blurb:
      'Overnight stays, drop-in visits, extended visits and walks, all in the home your animals already know. We are calm with anxious and reactive animals, and patient with seniors who need things to go slowly.',

    // What Google shows in search results.
    seoTitle: 'In-home Pet Care & Overnight Pet Sitting in North Idaho',
    seoDescription:
      "Overnight in-home pet care, drop-in visits and dog walking in Coeur d'Alene, Hayden, Post Falls, Rathdrum and Sandpoint. We stay in your home so your animals never have to leave it.",

    included: [
      {
        title: 'Overnight in-home care',
        text: 'We sleep in your home. Morning and evening routines happen at the usual hours, the lights go on and off the way they always do, and your animals sleep where they always sleep.',
      },
      {
        title: 'Drop-in visits',
        text: 'Thirty minutes for feeding, fresh water, litter, a garden break and some company. Good for cats, and for dogs who are fine on their own but need checking on.',
      },
      {
        title: 'Extended visits',
        text: 'A full hour, for animals who need more time. Longer play, a proper walk, or simply someone sitting with them for a while.',
      },
      {
        title: 'Dog walking',
        text: 'Thirty minutes at your dog’s pace, on the routes they know. We keep to the same handling you use, so nothing about it feels new to them.',
      },
      {
        title: 'Medication and special needs',
        text: 'Pills, ear and eye drops, topicals and food-based medication, given on time and written down. Seniors, animals recovering from surgery and animals on a strict schedule are all welcome.',
      },
      {
        title: 'Anxious and reactive animals',
        text: 'This is the part we are known for. We move slowly, we read body language, and we do not force contact. Some animals take three days to decide about us, and that is fine.',
      },
    ],

    forYouIf: [
      'Boarding stresses your animals out, and they do better at home',
      'You have a senior, anxious or reactive animal who needs a gentler hand',
      'Medications need to be given on time, every time',
      'You want photos and honest updates while you are away',
    ],

    startingAt: 'Overnight care from $100 a night for dogs and $90 a night for cats. Drop-in visits from $30. [confirm all prices before launch]',

    honestNote:
      'We give medication by mouth, ear, eye, skin and food. We do not give injections or fluids under the skin, and we do not take on anything that belongs in a vet’s hands. If your animal needs that kind of care, we will say so up front.',
  },

  {
    slug: 'home-and-property',
    name: 'Home & Property',
    href: '/home-and-property/',
    art: 'lily',
    photo: 'service-home-property.jpg',
    photoAlt: 'A warm lamp lit in the window of a house at dusk',

    heroLine: 'House sitting when there are no animals in the picture.',
    blurb:
      'House sitting when there are no animals in the picture. Plants watered, mail and packages brought in, bins out on the right day, lights on at normal hours, and a walk through the rooms with our eyes open.',

    seoTitle: 'House Sitting & Home Watch in North Idaho',
    seoDescription:
      "Overnight house sitting and home watch in Coeur d'Alene, Hayden, Post Falls, Sandpoint and Sagle. Plants, mail, bins and lights, and a home that stays lived in while you are away.",

    included: [
      {
        title: 'Overnight house sitting',
        text: 'Someone actually sleeping in the house. Lights and curtains move the way they would if you were home, and the place never sits dark for a week.',
      },
      {
        title: 'Plants, inside and out',
        text: 'Watered on the schedule you leave us. Tell us which ones are fussy and we will treat them accordingly.',
      },
      {
        title: 'Mail and packages',
        text: 'Brought in daily and stacked somewhere sensible, so nothing sits on the porch advertising that you are gone.',
      },
      {
        title: 'Bins out and back',
        text: 'Out on the right night, back in the next morning.',
      },
      {
        title: 'A walk through the rooms',
        text: 'We look at things. Taps, ceilings, windows, the water heater, the corner of the basement that always worries you. If something is off, you hear about it that day.',
      },
      {
        title: 'Snowbird stays',
        text: 'Longer stretches through the season, with a routine we agree on before you leave. [confirm whether you want to offer season-long arrangements]',
      },
    ],

    forYouIf: [
      'You are away for a stretch and want the house to look lived in',
      'Plants and mail need someone reliable',
      'You would rather one trusted person held the key than several',
      'You are a snowbird and want eyes on the place through the season',
    ],

    startingAt: 'Home watch from $80 a night. [confirm all prices before launch]',

    honestNote:
      'Full property management is something we are growing into, not something we offer yet. We are not contractors and we do not oversee repairs or trades. What we do now is keep a home lived in, looked after and honestly reported on while you are gone.',
  },

  {
    slug: 'farm-and-homestead',
    name: 'Farm & Homestead',
    href: '/farm-and-homestead/',
    art: 'butterfly-side',
    photo: 'service-farm-homestead.jpg',
    photoAlt: 'Chickens in a yard beside a barn',

    heroLine: 'The daily basics, done faithfully, morning and night.',
    blurb:
      'The daily basics, done faithfully. Feed and fresh water, mucking and clean bedding, eggs collected, turnout in the morning, headcounts, and everything locked up at night.',

    seoTitle: 'Farm & Homestead Sitting in North Idaho',
    seoDescription:
      "Farm and homestead care in Rathdrum, Hayden, Sagle, Bonners Ferry and across North Idaho. Feeding, watering, mucking, eggs, turnout and locking up, done the way you leave it.",

    included: [
      {
        title: 'Feed and fresh water',
        text: 'The amounts you specify, at the hours you specify. Buckets and troughs scrubbed rather than topped up.',
      },
      {
        title: 'Mucking and clean bedding',
        text: 'Stalls and coops kept the way you keep them, not the way that is quickest.',
      },
      {
        title: 'Eggs collected',
        text: 'Daily, and stored however you like them stored.',
      },
      {
        title: 'Turnout and bringing in',
        text: 'Out in the morning, in at night, in the groupings you tell us. We do not change who goes with whom.',
      },
      {
        title: 'Headcounts and locking up',
        text: 'Every animal counted, every gate and coop latched, every night. Predator pressure is real here, and we treat it that way.',
      },
      {
        title: 'A careful eye',
        text: 'We notice the one that did not come to feed, the limp, the hen sitting apart. You hear about it the same day, with a photo.',
      },
    ],

    forYouIf: [
      'You have chickens, goats, horses or a mixed small farm',
      'You want the routine kept exactly the way you leave it',
      'You would rather someone noticed early when an animal looks off',
    ],

    startingAt: 'Farm and homestead care from $10 a day, added to a stay. Quoted properly after the meet-and-greet. [confirm all prices before launch]',

    honestNote:
      'We are caretakers, not vets. That means no injections, no hoof or medical work, no milking, no birthing, and no handling large animals on our own. If something needs more than we can give, we will tell you plainly and help you find the right hands.',
  },

  {
    slug: 'pet-transportation',
    name: 'Pet Transportation',
    href: '/pet-transportation/',
    art: 'butterfly-lily-wide',
    photo: 'service-pet-transport.jpg',
    photoAlt: 'A dog settled in the back of a vehicle on a long drive',

    heroLine: 'Private door-to-door travel, with only your animals on board.',
    blurb:
      'Private door-to-door travel, state to state, with only your animals on board. Never a shared van, never a cargo hold.',

    seoTitle: 'Private Pet Transportation from North Idaho',
    seoDescription:
      "Private door-to-door pet transportation from Coeur d'Alene and North Idaho, state to state. Only your animals on board, with safe driving hours and pet-friendly overnight stops.",

    included: [
      {
        title: 'Door to door',
        text: 'We collect your animals from your home and hand them over at the other end. No terminals, no transfers, no strangers in between.',
      },
      {
        title: 'Only your animals',
        text: 'The vehicle carries your animals and nobody else’s. No shared runs, no picking up three more along the way.',
      },
      {
        title: 'Safe hours on the road',
        text: 'About seven hours of driving a day at most, with a break every two to three hours for water, a stretch and a garden stop.',
      },
      {
        title: 'Pet-friendly overnight stops',
        text: 'Booked ahead, so nobody sleeps in a vehicle. Your animals come into the room with us.',
      },
      {
        title: 'Two of us on long trips',
        text: 'Whenever we can manage it, both of us come. One drives and one stays with the animals. [confirm how you want to word this]',
      },
      {
        title: 'Care waiting at the other end',
        text: 'If you are not there yet, we can stay on and look after them until you arrive. Worth asking about when you get your quote.',
      },
    ],

    forYouIf: [
      'You are moving and would rather your animals were driven than flown',
      'You are bringing home an animal from another state',
      'Your animal travels badly and needs a calmer, slower option',
    ],

    startingAt: 'Always a custom quote, based on distance, animals and timing.',

    honestNote:
      'Every trip is planned before anyone gets in the vehicle: the route, the stops, the overnight places and your vet details along the way. If the weather or an animal tells us to slow down, we slow down.',
  },
];

/** The seven questions people actually ask. */
export const faqs = [
  {
    q: 'Do you stay overnight in our home?',
    a: 'Yes. That is the heart of what we do. We sleep in your home, keep the lights and the routine normal, and your animals stay in the only place that already smells like you.',
  },
  {
    q: 'Will both of you be there?',
    a: 'On overnight stays, both of us come. [confirm] That means two sets of hands for your animals and a home that is rarely empty. On shorter drop-in visits it is usually one of us.',
  },
  {
    q: 'Can you give medications?',
    a: 'Yes. Pills, ear and eye drops, topicals and food-based medications are all fine, and we are careful about timing. We do not give injections or fluids, or do anything that belongs in a vet’s hands.',
  },
  {
    q: 'Do you care for homes with no pets?',
    a: 'We do. Plants, mail, packages, bins, lights and a regular walk through the rooms. Some of our stays have no animals in them at all.',
  },
  {
    q: 'Is a deposit required?',
    a: 'No deposit. We also do a free meet-and-greet before every first booking, so you can decide whether we are the right fit without committing to anything.',
  },
  {
    q: 'What happens in an emergency?',
    a: 'We call you first, and we keep going until we reach you. If we cannot, we take your animal to the vet you have named and follow the instructions you left us. We would rather be cautious than wait.',
  },
  {
    q: 'Are you insured?',
    a: '[confirm: add insurance details here before the site goes live, including the carrier and what it covers.]',
  },
];
