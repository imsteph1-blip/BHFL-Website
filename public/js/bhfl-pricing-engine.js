/* Because He First Loved · booking estimate engine
   Rate sheet v3 (prices locked Oct 10 to 13, 2026).
   PRICING holds every number. calculate(state) turns booking answers into estimate lines.
   No em dashes anywhere in client-facing text. */

const PRICING = {
  version: "Rate sheet v3 · October 13, 2026",

  // Pet Sitting and drop-in zone. Prices include the drive inside the zone.
  zone: {
    zips: {
      "83860": "Sagle", "83813": "Cocolalla", "83809": "Careywood", "83801": "Athol",
      "83835": "Hayden / Hayden Lake", "83815": "Coeur d'Alene / Dalton Gardens",
      "83814": "Coeur d'Alene / Fernan", "83816": "Coeur d'Alene",
      "83854": "Post Falls / Huetter", "83858": "Rathdrum"
    },
    // These zips run past the service line, so the street address is checked by hand.
    addressCheck: {
      "83854": "State Line and Hauser are outside our area",
      "83860": "the Garfield Bay end of Sagle is outside our area",
      "83814": "south of Blackwell Island and Cougar Bay is outside our area"
    }
  },

  // Outside the zone: overnights only, with a per-day travel fee by ring.
  rings: { 1: 10, 2: 20, 3: 35, 4: 45 },
  outsideZips: {
    "99019": ["Liberty Lake, WA", 1], "99025": ["Newman Lake, WA", 1], "99027": ["Otis Orchards, WA", 1],
    "99016": ["Spokane Valley, WA", 2], "99037": ["Spokane Valley, WA", 2], "99206": ["Spokane Valley, WA", 2],
    "99212": ["Spokane Valley, WA", 2], "99216": ["Spokane Valley, WA", 2],
    "99201": ["Spokane, WA", 2], "99202": ["Spokane, WA", 2], "99203": ["Spokane, WA", 2], "99205": ["Spokane, WA", 2],
    "99207": ["Spokane, WA", 2], "99208": ["Spokane, WA", 2], "99223": ["Spokane, WA", 2], "99224": ["Spokane, WA", 2],
    "99006": ["Deer Park, WA", 2], "83876": ["Worley", 2], "83810": ["Cataldo", 2], "83839": ["Kingston", 2],
    "83804": ["Blanchard", 2],
    "83864": ["Sandpoint", 3], "83803": ["Bayview", 3], "83833": ["Harrison", 3], "83837": ["Kellogg", 3],
    "83861": ["St. Maries", 3], "83851": ["Plummer", 3],
    "83811": ["Clark Fork", 4], "83836": ["Hope", 4], "83805": ["Bonners Ferry", 4],
    "83856": ["Priest River", 4], "83873": ["Wallace", 4]
  },

  overnight: { dog: 90, cat: 80 },           // per day (24 hours from arrival)
  petSitting: { dog: 75, cat: 65 },          // per day, two 1-hour visits (Morning + Evening)
  dropIn: { dog: { 1: 45, 2: 65 }, cat: { 1: 40, 2: 60 }, extraPetPerVisit: 5, maxPerDay: 4 },
  extraPet: { largeDog: 15, smallDog: 10, cat: 5, other: 5 }, // per day, Overnight and Pet Sitting

  slots: [
    { id: "morning", label: "Morning", time: "7 to 10 AM" },
    { id: "midday", label: "Midday", time: "10 AM to 1 PM" },
    { id: "afternoon", label: "Afternoon", time: "1 to 4 PM" },
    { id: "evening", label: "Evening", time: "4 to 8 PM" }
  ],

  addOns: {
    // Per pet, per day. The client picks which pets get each one.
    walk: 15, run: 25, medication: 15, brushing: 10, enrichment: 10, // walks, runs, enrichment: per each, per pet
    dogPark: 35, lakeTrail: 50,                                       // per outing
    wasteRemoval: 10, houseRefresh: 60,                               // once per stay
    cageClean: 15                                                     // per cage, once
  },

  // How often a per-pet add-on happens during the stay.
  addOnFrequencies: { daily: "Every day", eod: "Every other day", twice: "Twice a week", weekly: "Once a week", once: "Once during the stay" },

  // Overnight only. Longest time pets are alone, per day.
  moreTime: { 6: 0, 5: 5, 4: 10, 3: 20, 2: 30, 1: 45, 0: 70 },

  home: {
    propertyPackage: 5, safetyPackage: 5, // per day
    welcomeHome: 50,                      // once, plus groceries
    hotTub: 10,                           // per check
    birdFeederFirstWeek: 10, birdFeederEachWeekAfter: 5,
    errand: { short: 15, hour: 25 },      // per errand: under 30 minutes, up to 1 hour (drive included)
    letIn: { quick: 10, hour1: 20, hour2: 30, long: 20 }, // long = let in, leave, come back to lock up
    indoorPlants: { none: 0, small: 5, medium: 10, large: 15 },        // per day
    garden: { none: 0, small: 5, medium: 10, large: 20, xl: null }      // per day, xl = custom
  },

  farm: {
    overnightBase: 80, checkVisit: 40,
    tidyFrequencies: { none: "None", twice: "Twice a week", eod: "Every other day", daily: "Every day" },
    groups: {
      poultry:  { label: "Poultry", note: "Chickens, ducks and turkeys", tidy: 10, cleanout: 49, cleanoutLabel: "Coop clean-out" },
      goats:    { label: "Goats and sheep", tidy: 15, cleanout: 59, cleanoutLabel: "Shelter clean-out" },
      pigs:     { label: "Pigs", tidy: 15, cleanout: 59, cleanoutLabel: "Pen clean-out" },
      llamas:   { label: "Llamas and alpacas", tidy: 10, cleanout: 49, cleanoutLabel: "Shelter clean-out" },
      horses:   { label: "Horses, donkeys and mules", tidy: 15, cleanout: 59, cleanoutLabel: "Stall clean-out", perStall: true },
      cattle:   { label: "Cattle", tidy: 15, cleanout: 59, cleanoutLabel: "Barn clean-out" },
      rabbits:  { label: "Rabbits and small caged animals", tidy: 5, cleanout: 25, cleanoutLabel: "Hutch clean-out" }
    },
    addOns: {
      duckPool: 5, eggWashing: 5, blanketing: 5, flyCare: 5, winterHay: 10, brooder: 10, winterWater: 10, // per day
      feedMixing: 5, medication: 15,         // per day, per animal group
      grooming: 10,                          // per session
      barnCatsFirst4: 5, barnCatEach: 1,     // per day
      guardianDogFirst: 5, guardianDogEach: 3,
      rotationGroup: 10, rotationHorse: 5,   // per move
      feedStoreRun: 25                       // per trip, plus supplies
    }
  },

  holidays: { familyMultiplier: 2, otherMultiplier: 1.5 },
  longStay: { minDays: 8, discount: 0.10 },
  lateReturn: { graceHours: 2, halfDayUpToHours: 8 }
};

/* Farm Essential Care per day. Returns a number, or null for "custom quote". */
function farmEssential(group, n) {
  if (!n || n <= 0) return 0;
  switch (group) {
    case "poultry": return 10 + (n > 12 ? 6 * Math.ceil((n - 12) / 12) : 0);
    case "goats":   return n <= 4 ? 15 : n <= 9 ? 15 + 4 * (n - 4) : n <= 19 ? 40 : 65;
    case "pigs":    return n <= 3 ? 12 : n <= 9 ? 25 : n <= 19 ? 45 : null;
    case "llamas":  return n <= 2 ? 15 : n <= 5 ? 15 + 6 * (n - 2) : null;
    case "horses":  return n * (n <= 3 ? 20 : 18);
    case "cattle":  return n * (n <= 9 ? 18 : 15);
    case "rabbits": return 8 + (n > 4 ? 3 * Math.ceil((n - 4) / 2) : 0);
  }
  return 0;
}

function freqDays(freq, days) {
  if (freq === "eod") return Math.ceil(days / 2);
  if (freq === "twice") return Math.max(1, Math.round(days * 2 / 7));
  if (freq === "weekly") return Math.max(1, Math.ceil(days / 7));
  if (freq === "once") return Math.min(1, days);
  return days;
}
function tidyCount(freq, days) {
  if (freq === "twice") return Math.round(days * 2 / 7);
  if (freq === "eod") return Math.ceil(days / 2);
  if (freq === "daily") return days;
  return 0;
}

/* ---------- dates and holidays ---------- */
function parseDate(s) { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); }
function iso(d) { return d.toISOString().slice(0, 10); }
function addDays(d, n) { return new Date(d.getTime() + n * 86400000); }
function nthWeekday(y, m, wd, n) { // n-th weekday (0=Sun) of month m (0-based); n=-1 = last
  if (n > 0) { const first = new Date(Date.UTC(y, m, 1)); return addDays(first, ((wd - first.getUTCDay() + 7) % 7) + 7 * (n - 1)); }
  const last = new Date(Date.UTC(y, m + 1, 0)); return addDays(last, -((last.getUTCDay() - wd + 7) % 7));
}
function easter(y) { // Anonymous Gregorian algorithm
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
    f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
    i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
    month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(y, month - 1, day));
}
function holidaysFor(y) {
  const H = {};
  const add = (d, name, tier) => { H[iso(d)] = { name, tier }; };
  add(nthWeekday(y, 10, 4, 4), "Thanksgiving", "family");
  add(new Date(Date.UTC(y, 11, 24)), "Christmas Eve", "family");
  add(new Date(Date.UTC(y, 11, 25)), "Christmas Day", "family");
  add(new Date(Date.UTC(y, 11, 31)), "New Year's Eve", "other");
  add(new Date(Date.UTC(y, 0, 1)), "New Year's Day", "other");
  add(easter(y), "Easter", "other");
  add(nthWeekday(y, 4, 1, -1), "Memorial Day", "other");
  add(new Date(Date.UTC(y, 6, 4)), "July 4th", "other");
  add(nthWeekday(y, 8, 1, 1), "Labor Day", "other");
  return H;
}
function holidayOn(dateIso) { return holidaysFor(Number(dateIso.slice(0, 4)))[dateIso] || null; }

/* ---------- zip lookup ---------- */
function lookupZip(zip) {
  zip = String(zip || "").trim();
  if (PRICING.zone.zips[zip]) return { zip, inZone: true, town: PRICING.zone.zips[zip], ring: 0, addressCheck: PRICING.zone.addressCheck[zip] || null };
  if (PRICING.outsideZips[zip]) { const [town, ring] = PRICING.outsideZips[zip]; return { zip, inZone: false, town, ring }; }
  return { zip, inZone: false, town: null, ring: null, unknown: true };
}

/* ---------- main calculation ----------
   state = {
     zip, start: "YYYY-MM-DD", end: "YYYY-MM-DD",
     services: { pet, farm, transport },
     pet:  { type: "overnight"|"sitting"|"dropin", dropLen: 1|2, slots: [slot ids], arrive: "HH:MM", ret: "HH:MM",
             list: [{ id, kind, name }],                       // one entry per pet (see PET_KINDS)
             ext: { walks, runs, enrichment, medication, brushing } (bools: add-on switched on),
             per: { [petId]: { walks, runs, enrichment (qty a day), medication, brushing (bools) } },  // which pets
             freq: { [petId]: { field: "daily"|"eod"|"twice"|"weekly"|"once" } },  // how often, default daily; medication ignores it
             sitMorning, sitEvening (Pet Sitting visit times, e.g. "8 AM", "5 PM"),
             cageCleans, dogPark, lakeTrail, moreTime (6..0), waste (bool), refresh (bool) },
     farm: { base: "overnight"|"checks", checksPerDay, groups: { key: { count, stalls, tidy, cleanouts } },
             addOns: { duckPool, eggWashing, blanketing, flyCare, winterHay, brooder, winterWater (bools),
                       feedMixingGroups, medicationGroups, groomingSessions, barnCats, guardianDogs,
                       rotationGroupMoves, rotationHorseMoves, feedStoreRuns } },
     home: { propertyPackage, safetyPackage, welcomeHome (bools), hotTubChecks, birdFeeders (bool), errandList: ["short"|"hour", ...],
             letIns: ["quick"|"hour1"|"hour2"|"long", ...], hasPlants (bool), indoorPlants, garden },
     removed: [line keys the client took off on the estimate page]
   }
   Returns { days, mode, lines: [{group, label, detail, amount, key, removable}], removed: [lines], total, notes, holidays } */
function calculate(state) {
  const P = PRICING, lines = [], notes = [];
  const loc = lookupZip(state.zip);
  const svc = state.services || {};
  const pet = svc.pet ? (state.pet || {}) : null;
  const farm = svc.farm ? (state.farm || {}) : null;
  const removedKeys = new Set(state.removed || []), removedLines = [];
  // key = a removable line (add-ons). Removed lines are returned separately so the estimate can offer "Add back".
  const add = (group, label, detail, amount, key) => {
    const line = { group, label, detail, amount: Math.round(amount * 100) / 100, key: key || null, removable: !!key };
    if (key && removedKeys.has(key)) { removedLines.push(line); return false; }
    lines.push(line); return true;
  };

  const petOvernight = pet && pet.type === "overnight";
  const farmOvernight = farm && !petOvernight && farm.base === "overnight";
  const overnightMode = !!(petOvernight || farmOvernight);

  // Day count: overnights count 24-hour days (end minus start); visits count calendar days inclusive.
  let days = 0, dayDates = [];
  if (state.start && state.end) {
    const s = parseDate(state.start), e = parseDate(state.end);
    const diff = Math.round((e - s) / 86400000);
    days = overnightMode ? diff : diff + 1;
    for (let i = 0; i < days; i++) dayDates.push(iso(addDays(s, i)));
  }
  if (days <= 0) return { days: 0, mode: overnightMode ? "overnight" : "visits", lines, total: 0, notes: ["Pick your dates to see an estimate."], holidays: [], removed: [], request: true, location: loc };

  const holidays = dayDates.map(d => ({ date: d, h: holidayOn(d) })).filter(x => x.h);
  const mult = d => { const h = holidayOn(d); return h ? (h.tier === "family" ? P.holidays.familyMultiplier : P.holidays.otherMultiplier) : 1; };
  const dayWord = overnightMode ? "day" : "day";
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

  // Daily-rate pieces: these get holiday multipliers and the long-stay discount.
  let dailyRateNormal = 0;           // one ordinary day
  let holidayExtra = 0;              // extra from holiday multipliers across the stay
  let discountableTotal = 0;         // sum of daily-rate charges eligible for the long-stay discount
  const dailyLine = (group, label, detail, perDay, discountable) => {
    const total = perDay * days;
    add(group, label, detail, total);
    dailyRateNormal += perDay;
    let extra = 0; dayDates.forEach(d => { extra += perDay * (mult(d) - 1); });
    holidayExtra += extra;
    if (discountable) discountableTotal += total + extra;
  };

  // ---------- Pet care ----------
  let perDayAddOns = 0; // for late return
  if (pet) {
    const list = petList(pet);
    const n = k => list.filter(x => x.kind === k).length;
    const dL = n("largeDog"), dS = n("smallDog"), c = n("cat");
    const others = list.length - dL - dS - c;
    const dogs = dL + dS, animals = list.length;
    if (animals > 0) {
      const isDog = dogs > 0;
      const kind = isDog ? "dog" : "cat";
      let xL = 0, xS = 0, xC = 0, xO = 0;
      if (dL > 0) { xL = dL - 1; xS = dS; } else if (dS > 0) { xS = dS - 1; }
      if (isDog) { xC = c; xO = others; } else if (c > 0) { xC = c - 1; xO = others; } else { xO = others - 1; }
      const baseLabel = isDog ? "Dogs" : c > 0 ? (others ? "Cats and Other Pets" : "Cats Only") : "Small Animals Only";

      if (pet.type === "overnight" || pet.type === "sitting") {
        const table = pet.type === "overnight" ? P.overnight : P.petSitting;
        const name = pet.type === "overnight" ? "Overnight Pet Sitting" : "Pet Sitting";
        const sub = pet.type === "overnight" ? "24 hours of care each day" : "Morning and Evening visits, 1 hour each";
        const sitTimes = pet.type === "sitting" && pet.sitMorning && pet.sitEvening ? `Visits at ${pet.sitMorning} and ${pet.sitEvening}, 1 hour each` : sub;
        dailyLine("Pet Care", `${name} · ${baseLabel}`, `$${table[kind]} a day × ${days} · ${sitTimes}`, table[kind], true);
        if (xL) dailyLine("Pet Care", `Additional Large Dog${xL > 1 ? "s" : ""}`, `${xL} × $${P.extraPet.largeDog} a day`, xL * P.extraPet.largeDog, true);
        if (xS) dailyLine("Pet Care", `Additional Small or Medium Dog${xS > 1 ? "s" : ""}`, `${xS} × $${P.extraPet.smallDog} a day`, xS * P.extraPet.smallDog, true);
        if (xC) dailyLine("Pet Care", `Additional Cat${xC > 1 ? "s" : ""}`, `${xC} × $${P.extraPet.cat} a day`, xC * P.extraPet.cat, true);
        if (xO) dailyLine("Pet Care", `Small Animals, Birds, Reptiles or Fish`, `${xO} × $${P.extraPet.other} a day`, xO * P.extraPet.other, true);
      } else if (pet.type === "dropin") {
        const len = pet.dropLen === 2 ? 2 : 1;
        const visits = Math.max(1, Math.min(P.dropIn.maxPerDay, (pet.slots || []).length || 1));
        const perVisit = P.dropIn[kind][len] + (animals - 1) * P.dropIn.extraPetPerVisit;
        const slotNames = (pet.slots || []).map(id => (P.slots.find(s => s.id === id) || {}).label).filter(Boolean).join(", ");
        dailyLine("Pet Care", `Drop-In Visits, ${len} Hour${len > 1 ? "s" : ""} · ${baseLabel}`,
          `${plural(visits, "visit")} a day${slotNames ? " · " + slotNames : ""} · $${perVisit} a visit${animals > 1 ? ` (includes ${animals - 1} additional pet${animals > 2 ? "s" : ""} at $${P.dropIn.extraPetPerVisit})` : ""}`,
          perVisit * visits, false);
      }
      if (+pet.cageCleans) add("Pet Care", "Full Cage or Habitat Clean", `${pet.cageCleans} × $${P.addOns.cageClean}`, pet.cageCleans * P.addOns.cageClean, "pet.cageCleans");

      // Per-pet, per-day add-ons (never multiplied or discounted). The client picks which pets.
      const per = pet.per || {};
      const perPet = (field, label, price, qtyWord) => {
        if (pet.ext && pet.ext[field] === false) return; // the client turned this add-on off
        list.forEach(x => {
          const v = per[x.id] ? per[x.id][field] : 0;
          const qty = v === true ? 1 : (+v || 0);
          if (!qty) return;
          // Medication is always every day of the stay; its schedule is talked through in person.
          const freq = field === "medication" ? "daily" : ((pet.freq && pet.freq[x.id] && pet.freq[x.id][field]) || "daily");
          const n = freqDays(freq, days);
          const how = freq === "daily" ? `${days} days` : `${P.addOnFrequencies[freq].toLowerCase()} (${plural(n, "day")})`;
          const detail = qtyWord ? `${qty} a day × $${price} · ${how}` : `$${price} a day · ${how}`;
          if (add("Pet Add-Ons", `${label} · ${x.name}`, detail, qty * price * n, `pet.${field}.${x.id}`) && freq === "daily") perDayAddOns += qty * price;
        });
      };
      perPet("walks", "Walks", P.addOns.walk, true);
      perPet("runs", "Runs", P.addOns.run, true);
      perPet("enrichment", "Enrichment", P.addOns.enrichment, true);
      perPet("medication", "Medication", P.addOns.medication, false);
      perPet("brushing", "Brushing and Grooming", P.addOns.brushing, false);
      if (pet.type === "overnight") {
        const mt = pet.moreTime == null ? 6 : +pet.moreTime, mp = P.moreTime[mt] || 0;
        if (mp && add("Pet Add-Ons", "More Time With Your Pets", `${mt === 0 ? "Never alone" : `Never alone more than ${mt} hour${mt === 1 ? "" : "s"}`} · $${mp} a day × ${days} days`, mp * days, "pet.moreTime")) perDayAddOns += mp;
      }
      if (+pet.dogPark) add("Pet Add-Ons", "Dog Park Outing", `${pet.dogPark} × $${P.addOns.dogPark}`, pet.dogPark * P.addOns.dogPark, "pet.dogPark");
      if (+pet.lakeTrail) add("Pet Add-Ons", "Lake or Trail Adventure", `${pet.lakeTrail} × $${P.addOns.lakeTrail}`, pet.lakeTrail * P.addOns.lakeTrail, "pet.lakeTrail");
      if (pet.waste) add("Pet Add-Ons", "Pet Waste Removal", "End of stay", P.addOns.wasteRemoval, "pet.waste");
      if (pet.refresh) add("Pet Add-Ons", "House Refresh", "End of stay", P.addOns.houseRefresh, "pet.refresh");
      if (+pet.dogPark || +pet.lakeTrail) notes.push("Outings need current vaccines and your written okay for off-leash time.");
    }
  }

  // ---------- Farm ----------
  if (farm) {
    if (petOvernight) {
      add("Farm Care", "Being There for the Farm", "Covered by your overnight", 0);
    } else if (farm.base === "overnight") {
      dailyLine("Farm Care", "Overnight Farm Stay", `$${P.farm.overnightBase} a day · property walk, fence, gate and water checks, photo update`, P.farm.overnightBase, true);
    } else {
      const n = Math.max(1, Math.min(4, +farm.checksPerDay || 1));
      dailyLine("Farm Care", "Farm Check Visits", `${plural(n, "visit")} a day × $${P.farm.checkVisit}`, n * P.farm.checkVisit, false);
    }
    const G = farm.groups || {};
    Object.keys(P.farm.groups).forEach(key => {
      const g = G[key]; if (!g || !(+g.count > 0)) return;
      const meta = P.farm.groups[key], n = +g.count;
      const ess = farmEssential(key, n);
      if (ess === null) { add("Farm Care", `${meta.label}, Essential Care`, `${n} animals · Custom price, we'll confirm with you`, 0); notes.push(`${meta.label}: groups this size get a custom price. We'll confirm it with you.`); }
      else dailyLine("Farm Care", `${meta.label}, Essential Care`, `${n} animal${n > 1 ? "s" : ""} · $${ess} a day`, ess, overnightMode || (pet && pet.type === "sitting"));
      const units = meta.perStall ? (+g.stalls || n) : 1;
      const t = tidyCount(g.tidy, days) * units;
      if (t) add("Farm Care", `${meta.label}, Tidy-Ups`, `${P.farm.tidyFrequencies[g.tidy]} · ${t} × $${meta.tidy}${meta.perStall ? " per stall" : ""}`, t * meta.tidy, `farm.tidy.${key}`);
      const co = (+g.cleanouts || 0) * units;
      if (co) add("Farm Care", `${meta.label}, ${meta.cleanoutLabel}`, `${co} × $${meta.cleanout}${meta.perStall ? " per stall" : ""}`, co * meta.cleanout, `farm.cleanout.${key}`);
    });
    const A = farm.addOns || {}, F = P.farm.addOns;
    const fDay = (on, label, amt) => { if (on && amt > 0 && add("Farm Add-Ons", label, `$${amt} a day × ${days} days`, amt * days, "farm." + label.split(",")[0])) perDayAddOns += amt; };
    fDay(A.duckPool, "Duck Pool Refresh", F.duckPool);
    fDay(A.eggWashing, "Egg Washing and Cartoning", F.eggWashing);
    fDay(A.brooder, "Chick or Brooder Care", F.brooder);
    fDay(A.blanketing, "Horse Blanketing", F.blanketing);
    fDay(A.flyCare, "Horse Fly Care", F.flyCare);
    fDay(A.winterHay, "Winter Hay Feeding", F.winterHay);
    fDay(A.winterWater, "Winter Water Care", F.winterWater);
    fDay(+A.feedMixingGroups > 0, `Special Feed Mixing, ${plural(+A.feedMixingGroups, "group")}`, (+A.feedMixingGroups || 0) * F.feedMixing);
    fDay(+A.medicationGroups > 0, `Farm Medication, ${plural(+A.medicationGroups, "group")}`, (+A.medicationGroups || 0) * F.medication);
    const bc = +A.barnCats || 0; fDay(bc > 0, `Barn Cats, ${bc}`, bc ? F.barnCatsFirst4 + Math.max(0, bc - 4) * F.barnCatEach : 0);
    const gd = +A.guardianDogs || 0; fDay(gd > 0, `Guardian Dogs, ${gd}`, gd ? F.guardianDogFirst + (gd - 1) * F.guardianDogEach : 0);
    if (+A.groomingSessions) add("Farm Add-Ons", "Horse Grooming", `${A.groomingSessions} × $${F.grooming}`, A.groomingSessions * F.grooming, "farm.grooming");
    if (+A.rotationGroupMoves) add("Farm Add-Ons", "Pasture Rotation, Herds", `${A.rotationGroupMoves} moves × $${F.rotationGroup}`, A.rotationGroupMoves * F.rotationGroup, "farm.rotationGroup");
    if (+A.rotationHorseMoves) add("Farm Add-Ons", "Pasture Rotation, Horses", `${A.rotationHorseMoves} horse moves × $${F.rotationHorse}`, A.rotationHorseMoves * F.rotationHorse, "farm.rotationHorse");
    if (+A.feedStoreRuns && add("Farm Add-Ons", "Feed Store Run", `${A.feedStoreRuns} × $${F.feedStoreRun}, plus supplies`, A.feedStoreRuns * F.feedStoreRun, "farm.feedStore")) { notes.push("Feed store runs: the cost of supplies is added, and you get the receipt."); }
  }

  // ---------- Travel (outside the zone, overnights only) ----------
  let travelPerDay = 0;
  if (!loc.inZone && loc.ring && overnightMode) {
    travelPerDay = P.rings[loc.ring];
    add("Travel", `Travel to ${loc.town}`, `$${travelPerDay} a day`, travelPerDay * days);
  }

  // ---------- Home and garden ----------
  const H = state.home || {}, HP = P.home;
  if (svc.pet || svc.farm) {
    const hDay = (on, key, label, detail, amt) => { if (on && amt > 0 && add("Home and Garden", label, `${detail} × ${days} days`, amt * days, key)) perDayAddOns += amt; };
    hDay(H.propertyPackage, "home.property", "Home Property Care Package", `$${HP.propertyPackage} a day`, HP.propertyPackage);
    hDay(H.safetyPackage, "home.safety", "Home Safety Check Package", `$${HP.safetyPackage} a day`, HP.safetyPackage);
    if (H.hasPlants) {
      const ip = HP.indoorPlants[H.indoorPlants || "none"]; hDay(ip > 0, "home.plants", "Indoor Plants", `${{ small: "6 to 15 plants", medium: "16 to 30 plants", large: "30+ or a plant room" }[H.indoorPlants]} · $${ip} a day`, ip);
      const gk = H.garden || "none", gp = HP.garden[gk];
      if (gk === "xl") { add("Home and Garden", "Outdoor Garden, Extra Large", "Custom, quoted at the meet and greet", 0); notes.push("Extra large gardens get a custom price at the meet and greet."); }
      else hDay(gp > 0, "home.garden", "Outdoor Garden", `${{ small: "A few pots or baskets", medium: "1 or 2 raised beds", large: "Full garden or greenhouse" }[gk]} · $${gp} a day`, gp);
    }
    if (H.welcomeHome && add("Home and Garden", "Welcome Home Package", "Once, plus the cost of groceries", HP.welcomeHome, "home.welcome")) notes.push("Welcome Home groceries are added at cost, and you get the receipt.");
    if (+H.hotTubChecks) add("Home and Garden", "Hot Tub Checks", `${H.hotTubChecks} × $${HP.hotTub}`, H.hotTubChecks * HP.hotTub, "home.hottub");
    if (H.birdFeeders) { const w = Math.ceil(days / 7); add("Home and Garden", "Bird Feeders and Birdbaths", `${plural(w, "week")} · $${HP.birdFeederFirstWeek} the first week, $${HP.birdFeederEachWeekAfter} each week after`, HP.birdFeederFirstWeek + (w - 1) * HP.birdFeederEachWeekAfter, "home.birds"); }
    (H.errandList || []).forEach((v, i) => { const pr = HP.errand[v] || HP.errand.short; if (add("Home and Garden", "Errand", `${v === "hour" ? "Up to 1 hour" : "Under 30 minutes"} · $${pr}, plus the cost of anything purchased`, pr, `home.errand.${i}`)) notes.push("Errands: the cost of anything we buy is added, and you get the receipt."); });
    // Longer than 2 hours: we let them in and lock up after they leave. On an overnight we're already there ($10); otherwise it takes a second trip ($20).
    const longPrice = overnightMode ? HP.letIn.quick : HP.letIn.long;
    const LI = { quick: "Quick let-in or delivery", hour1: "We stay with them up to 1 hour", hour2: "We stay with them up to 2 hours", long: overnightMode ? "Longer than 2 hours, we lock up after they leave" : "Longer than 2 hours, we come back to lock up" };
    (H.letIns || []).forEach((v, i) => { const pr = v === "long" ? longPrice : (HP.letIn[v] || HP.letIn.quick); add("Home and Garden", "Letting Someone In", `${LI[v] || LI.quick} · $${pr}`, pr, `home.letin.${i}`); });
  }

  // ---------- Holidays ----------
  if (holidayExtra > 0) {
    const names = holidays.map(x => `${x.h.name} ${fmtShort(x.date)} (${x.h.tier === "family" ? "2x" : "1.5x"})`).join(", ");
    add("Holidays and Discounts", "Holiday Rate", names, holidayExtra);
  }

  // ---------- Long-stay discount ----------
  const eligible = (overnightMode || (pet && pet.type === "sitting")) && days >= P.longStay.minDays;
  if (eligible && discountableTotal > 0) {
    add("Holidays and Discounts", "Long-Stay Discount", `${Math.round(P.longStay.discount * 100)}% off the daily rate, ${days} days`, -discountableTotal * P.longStay.discount);
  }

  // ---------- Late return (overnight with times) ----------
  if (overnightMode && pet && pet.arrive && pet.ret) {
    const toH = t => { const [h, m] = t.split(":").map(Number); return h + m / 60; };
    const over = toH(pet.ret) - toH(pet.arrive);
    if (over > P.lateReturn.graceHours) {
      const dayRate = dailyRateNormal * (eligible ? 1 - P.longStay.discount : 1) + perDayAddOns + travelPerDay;
      const half = over <= P.lateReturn.halfDayUpToHours;
      add("Holidays and Discounts", half ? "Extra Half Day of Care" : "Extra Full Day of Care", `Home ${fmtHours(over)} after the last 24-hour day`, (half ? 0.5 : 1) * dayRate);
    }
  }

  if (svc.transport) { add("Pet Transportation", "Pet Transportation", "Custom quote, we'll reach out", 0); notes.push("Pet Transportation is quoted separately once we know the route and vehicle."); }

  const total = Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100;
  return { days, mode: overnightMode ? "overnight" : "visits", lines, removed: removedLines, total, notes, holidays, request: true, location: loc, dailyRateNormal };
}

/* The pets in the home, one entry each: { id, kind, name }.
   kind: largeDog | smallDog | cat | small | bird | reptile | fish */
const PET_KINDS = {
  largeDog: "Large Dog", smallDog: "Small or Medium Dog", cat: "Cat",
  small: "Small Animal", bird: "Bird", reptile: "Reptile", fish: "Fish Tank"
};
function petList(pet) {
  return (pet.list || []).map((x, i) => ({ ...x, name: (x.name || "").trim() || defaultPetName(pet.list, i) }));
}
function defaultPetName(list, i) {
  const k = list[i].kind, same = list.filter(x => x.kind === k);
  return same.length > 1 ? `${PET_KINDS[k]} ${same.indexOf(list[i]) + 1}` : PET_KINDS[k];
}

function cap(s) { return String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1); }
function fmtShort(isoDate) {
  const d = parseDate(isoDate);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
function fmtHours(h) { const r = Math.round(h * 4) / 4; return `${r} hour${r === 1 ? "" : "s"}`; }
function money(n) {
  const neg = n < 0; n = Math.abs(n);
  const s = Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (neg ? "−$" : "$") + s;
}

if (typeof module !== "undefined") module.exports = { PRICING, PET_KINDS, petList, freqDays, calculate, farmEssential, tidyCount, holidaysFor, holidayOn, lookupZip, money };
