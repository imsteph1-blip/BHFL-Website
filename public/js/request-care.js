const $ = s => document.querySelector(s);
let petSeq = 0;
const blank = () => ({
  zip: "", start: "", end: "", final: "",
  services: { pet: false, farm: false, transport: false },
  pet: { type: "", dropLen: 1, slots: [], arrive: "09:00", ret: "09:00", sitMorning: "", sitEvening: "", list: [], per: {}, ext: {}, freq: {},
    cageCleans: 0, dogPark: 0, lakeTrail: 0, moreTime: 6, waste: false, refresh: false },
  farm: { base: "", checksPerDay: 1, groups: {}, addOns: {} },
  transport: { from: "", to: "", pets: "", when: "" },
  home: { propertyPackage: false, safetyPackage: false, welcomeHome: false, hotTubChecks: 0, birdFeeders: false, errandList: [], letIns: [], hasPlants: false, indoorPlants: "none", garden: "none" },
  contact: { first: "", last: "", email: "", phone: "", street: "", town: "", heard: "", notes: "" },
  removed: [], returnTo: ""
});
let S = blank(), idx = 0, err = "";

const get = p => p.split(".").reduce((o, k) => (o == null ? o : o[k]), S);
function set(p, v) { const ks = p.split("."), last = ks.pop(); let o = S; ks.forEach(k => { if (o[k] == null) o[k] = {}; o = o[k]; }); o[last] = v; }
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const loc = () => lookupZip(S.zip);
const petOvernight = () => S.services.pet && S.pet.type === "overnight";
const pets = () => petList(S.pet);
const countKind = k => S.pet.list.filter(x => x.kind === k).length;
const dogs = () => pets().filter(x => x.kind === "largeDog" || x.kind === "smallDog");
const hasGroup = k => S.farm.groups[k] && +S.farm.groups[k].count > 0;
const pretty = iso => iso ? parseDate(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }) : "";
const clock = t => { if (!t) return ""; let [h, m] = t.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${String(m).padStart(2, "0")} ${ap}`; };

/* ---------- small UI builders ---------- */
const opt = (path, val, title, sub, price, disabled, extra) =>
  `<button type="button" class="opt" data-set="${path}" data-val="${esc(val)}" aria-pressed="${get(path) === val}" ${disabled ? "disabled" : ""}>
     <span class="dot"></span><span class="txt"><b>${title}</b>${sub ? `<span class="sub">${sub}</span>` : ""}${extra || ""}</span>${price ? `<span class="price">${price}</span>` : ""}</button>`;
const multi = (path, title, sub, price) =>
  `<button type="button" class="opt" data-flip="${path}" aria-pressed="${!!get(path)}">
     <span class="dot"></span><span class="txt"><b>${title}</b>${sub ? `<span class="sub">${sub}</span>` : ""}</span>${price ? `<span class="price">${price}</span>` : ""}</button>`;
const stepBtns = (path, label, min = 0, max = 20) =>
  `<div class="step"><button type="button" data-inc="${path}" data-d="-1" data-min="${min}" data-max="${max}" aria-label="Fewer ${esc(label)}">−</button>
     <output>${get(path) || 0}</output>
     <button type="button" data-inc="${path}" data-d="1" data-min="${min}" data-max="${max}" aria-label="More ${esc(label)}">+</button></div>`;
const stepper = (path, title, sub, min = 0, max = 20) =>
  `<div class="row"><div class="txt"><b>${title}</b>${sub ? `<div class="sub">${sub}</div>` : ""}</div>${stepBtns(path, title, min, max)}</div>`;
const togBtn = (path, label) => `<button type="button" class="tog" data-flip="${path}" aria-pressed="${!!get(path)}" aria-label="${esc(label)}"></button>`;
const toggle = (path, title, sub) =>
  `<div class="row"><div class="txt"><b>${title}</b>${sub ? `<div class="sub">${sub}</div>` : ""}</div>${togBtn(path, title)}</div>`;
const chips = (path, options) => `<div class="chips">${options.map(([v, l]) => `<button type="button" class="chip" data-set="${path}" data-val="${v}" aria-pressed="${get(path) === v}">${l}</button>`).join("")}</div>`;
const field = (path, label, type = "text", attrs = "", optional) =>
  `<div class="field"><label for="f-${path}">${label}${optional ? `<span class="optional">Optional</span>` : ""}</label><input id="f-${path}" type="${type}" data-bind="${path}" value="${esc(get(path))}" ${attrs}></div>`;
const note = (html, warn) => `<div class="note${warn ? " warn" : ""}">${html}</div>`;
const included = items => `<details class="inc"><summary>See what's included</summary><ul>${items.map(i => `<li>${i}</li>`).join("")}</ul></details>`;
const pkg = (path, title, summary, items, control) =>
  `<div class="pkg"><div class="row"><div class="txt"><b>${title}</b><div class="sub">${summary}</div></div>${control || togBtn(path, title)}</div>${included(items)}</div>`;

/* ---------- pets: keep one entry per animal ---------- */
function setKindCount(kind, n) {
  const list = S.pet.list, have = list.filter(x => x.kind === kind);
  if (n > have.length) for (let i = have.length; i < n; i++) list.push({ id: "p" + (++petSeq), kind, name: "", breed: "", age: "" });
  else if (n < have.length) {
    const drop = have.slice(n).map(x => x.id);
    S.pet.list = list.filter(x => !drop.includes(x.id));
    drop.forEach(id => delete S.pet.per[id]);
  }
}
const kindStepper = (kind, title, sub) =>
  `<div class="row"><div class="txt"><b>${title}</b>${sub ? `<div class="sub">${sub}</div>` : ""}</div>
     <div class="step"><button type="button" data-kind="${kind}" data-d="-1" aria-label="Fewer ${esc(title)}">−</button><output>${countKind(kind)}</output>
     <button type="button" data-kind="${kind}" data-d="1" aria-label="More ${esc(title)}">+</button></div></div>${petDetails(kind)}`;
/* Optional name, breed and age, shown right under the animal type as soon as one is added. */
function petDetails(kind) {
  const L = S.pet.list, listId = "dl-" + breedListFor(kind);
  const typeLabel = { largeDog: "Breed", smallDog: "Breed", cat: "Breed", small: "Type of Animal", bird: "Type of Bird", reptile: "Type of Reptile", fish: "What's in It" }[kind];
  return L.map((x, i) => x.kind !== kind ? "" : `<div class="petcard"><div class="petcard-h">${defaultPetName(L, i)}<span class="optional">All optional</span></div>
    <div class="names">
      <div class="field"><label for="f-pn-${x.id}">${kind === "fish" ? "Tank Name" : "Name"}</label><input id="f-pn-${x.id}" data-bind="pet.list.${i}.name" value="${esc(x.name)}" placeholder="${kind === "fish" ? "Tank name" : "Name"}"></div>
      <div class="field"><label for="f-pb-${x.id}">${typeLabel}</label><input id="f-pb-${x.id}" data-bind="pet.list.${i}.breed" value="${esc(x.breed)}" list="${listId}" placeholder="${typeLabel}" autocomplete="off"></div>
      ${kind === "fish" ? "" : `<div class="field"><label for="f-pa-${x.id}">Age</label><select id="f-pa-${x.id}" data-bind="pet.list.${i}.age" class="${x.age ? "" : "ph"}"><option value="">Age</option>${ageOptions(kind).map(a => `<option ${x.age === a ? "selected" : ""}>${a}</option>`).join("")}</select></div>`}
    </div></div>`).join("");
}
/* Type-ahead lists for breed and type fields, added to the page once. */
(function addDatalists() {
  const html = Object.keys(PET_OPTIONS).filter(k => Array.isArray(PET_OPTIONS[k])).map(k => `<datalist id="dl-${k}">${PET_OPTIONS[k].map(v => `<option value="${esc(v)}"></option>`).join("")}</datalist>`).join("");
  document.body.insertAdjacentHTML("beforeend", html);
})();

/* Daily extras: one list. Switching an extra on opens "Which pets?" with a checkbox per pet,
   then how many each time (walks, runs, enrichment) and how often for each pet picked.
   Medication has no "how often": it's $15 for every day of the stay. */
const FREQ = [["daily", "Every Day"], ["eod", "Every Other Day"], ["twice", "Twice a Week"], ["weekly", "Once a Week"], ["once", "Once During the Stay"]];
const UNIT = { walks: ["walk", "walks"], runs: ["run", "runs"], enrichment: ["session", "sessions"] };
const PRICE = () => ({ walks: PRICING.addOns.walk, runs: PRICING.addOns.run, enrichment: PRICING.addOns.enrichment, brushing: PRICING.addOns.brushing, medication: PRICING.addOns.medication });
function stayDays() { const r = calculate(S); return r.days || 0; }
function extraSummary(field, x, qty) {
  const days = stayDays(); if (!days) return "";
  const freq = field === "medication" ? "daily" : ((S.pet.freq[x.id] && S.pet.freq[x.id][field]) || "daily");
  const n = freqDays(freq, days), price = PRICE()[field];
  const q = qty ? (+S.pet.per[x.id][field] || 1) : 1;
  const dayWord = `${n} of your ${days} day${days === 1 ? "" : "s"}`;
  if (qty) {
    const [one, many] = UNIT[field], total = q * n;
    return `${esc(x.name)} gets ${q} ${q === 1 ? one : many} on ${n === days ? `each of your ${days} days` : dayWord}, ${total} ${total === 1 ? one : many} in all · ${money(total * price)}`;
  }
  if (field === "medication") return `$${price} for each of your ${days} days · ${money(days * price)}`;
  return `${esc(x.name)} gets brushed on ${n === days ? `each of your ${days} days` : dayWord} · ${money(n * price)}`;
}
function eligible(field) {
  if (field === "walks" || field === "runs") return dogs();
  if (field === "brushing") return pets().filter(x => ["largeDog", "smallDog", "cat"].includes(x.kind));
  return pets();
}
function extraRow(field, title, sub, who, qty) {
  const list = who(); if (!list.length) return "";
  const on = !!(S.pet.ext && S.pet.ext[field]);
  const noFreq = field === "medication";
  return `<div class="pkg"><div class="row"><div class="txt"><b>${title}</b><div class="sub">${sub}</div></div>${togBtn(`pet.ext.${field}`, title)}</div>
    ${on ? `<div class="which"><div class="which-h">Which pets?</div>${noFreq ? `<div class="desc" style="margin:0 0 6px">Medication is $15 for every day of the stay. We'll go over each pet's schedule with you before we start.</div>` : ""}${list.map(x => {
      const picked = !!(S.pet.per[x.id] && S.pet.per[x.id][field]);
      const fpath = `pet.freq.${x.id}.${field}`;
      return `<div class="whichpet"><button type="button" class="cb" data-pick="${field}:${x.id}:${qty ? 1 : 0}" aria-pressed="${picked}"><span class="box-cb" aria-hidden="true"></span><span>${esc(x.name)}</span></button>
        ${picked ? `<div class="whichopts">
          ${qty ? `<div class="mini"><span>${UNIT[field][1]} each time</span>${stepBtns(`pet.per.${x.id}.${field}`, `${title} each time for ${x.name}`, 1, field === "walks" ? 10 : 4)}</div>` : ""}
          ${noFreq ? "" : `<div class="mini"><span>How often</span>${chips(fpath, FREQ)}</div>`}
          <div class="summary">${extraSummary(field, x, qty)}</div></div>` : ""}</div>`;
    }).join("")}</div>` : ""}</div>`;
}

/* ---------- the questions ---------- */
const STEPS = [
  { id: "zip", eyebrow: "Where", title: "Where will we be caring for your animals?",
    lede: "We serve North Idaho along Highway 95 from Sagle to Coeur d'Alene, plus Post Falls and Rathdrum. Overnight stays reach farther.",
    render() {
      const z = S.zip.length === 5 ? loc() : null;
      let msg = "", street = "";
      if (z && z.inZone) { msg = note(`<b>Good news, we serve ${esc(z.town)}.</b> Every service is open to you.`); street = `<div class="fields" style="margin-top:16px">${field("contact.street", "Street Address", "text", 'autocomplete="street-address" placeholder="123 Lakeview Dr"')}</div>`; }
      else if (z && !z.unknown) { msg = note(`<b>We come to ${esc(z.town)} for overnight stays.</b> Pet Sitting and Drop-In Visits are only offered inside our local area. A travel charge of $${PRICING.rings[z.ring]} a day is part of the estimate.`); street = `<div class="fields" style="margin-top:16px">${field("contact.street", "Street Address", "text", 'autocomplete="street-address"')}</div>`; }
      else if (z) msg = note(`<b>We don't have ${esc(S.zip)} on our map yet.</b> You can still send a request for an overnight stay, and we'll let you know within 24 hours if we can make it.`, true);
      return `<div class="fields" style="max-width:260px">${field("zip", "Zip Code", "text", 'inputmode="numeric" maxlength="5" autocomplete="postal-code" placeholder="83813"')}</div>${msg}${street}`;
    },
    valid: () => !/^\d{5}$/.test(S.zip) ? "Enter a 5-digit zip code." : (loc().inZone && !S.contact.street.trim()) ? "Add your street address." : true },

  { id: "dates", eyebrow: "When", title: "When do you need us?",
    lede: "Pick the day care starts and the day it ends. You'll choose the times a little later.",
    render() {
      const hs = (S.start && S.end && S.end >= S.start) ? (() => { const out = []; for (let d = parseDate(S.start); iso(d) <= S.end; d = addDays(d, 1)) { const h = holidayOn(iso(d)); if (h) out.push(`${h.name} (${pretty(iso(d))})`); } return out; })() : [];
      return `<div class="fields">${field("start", "Start Date", "date")}${field("end", "End Date", "date")}</div>
        <h3 style="margin:26px 0 10px;font-size:1.45rem">Are These Dates Final?</h3>
        <div class="stack">${opt("final", "yes", "Yes, these are our final dates")}${opt("final", "no", "No, we're still deciding on dates")}</div>
        ${hs.length ? note(`<b>Your dates include ${hs.join(", ")}.</b> Holidays are family time for us too. We take a limited number of holiday bookings, and holiday dates are priced to match.`) : ""}`;
    },
    valid: () => (!S.start || !S.end) ? "Pick a start and end date." : S.start < new Date().toLocaleDateString("en-CA") ? "Pick a start date that hasn't passed yet." : S.end < S.start ? "The end date comes after the start date." : !S.final ? "Let us know if these dates are final." : true },

  { id: "services", eyebrow: "Services", title: "How can we help?", lede: "Pick as many as you need. We'll walk through each one.",
    render: () => `<div class="stack">
      ${multi("services.pet", "Pet Care", "This includes Overnight Pet Sitting, Pet Sitting and Drop-In Visits for dogs, cats and small animals.")}
      ${multi("services.farm", "Farm and Homestead Care", "This includes care for your farm animals and the farm itself, from chickens and goats to horses and cattle.")}
      ${multi("services.transport", "Pet Transportation", "State-to-state travel with your pets.")}</div>`,
    valid: () => (S.services.pet || S.services.farm || S.services.transport) || "Pick at least one." },

  /* ---- Pet care ---- */
  { id: "petType", show: () => S.services.pet, eyebrow: "Pet Care", title: "What kind of care works best for your pets?",
    render() {
      const out = !loc().inZone;
      return `<div class="stack">
        ${opt("pet.type", "overnight", "Overnight Pet Sitting", "We stay in your home every night and care for your animals around the clock. Includes feeding twice a day, and your pets are never alone more than 6 hours at a time.", "From $80<small>a day</small>")}
        ${opt("pet.type", "sitting", "Pet Sitting", "Two 1-hour visits a day, one in the morning and one in the evening. You choose when we come: anytime between 7 and 10 AM, and between 4 and 8 PM.", "From $65<small>a day</small>", out)}
        ${opt("pet.type", "dropin", "Drop-In Visits", "Up to 4 visits a day. Pick 1 or 2 hours per visit, and the time slots that work best for you and your pets.", "From $40<small>a visit</small>", out)}</div>
        ${out ? note("Pet Sitting and Drop-In Visits are only offered in our local area. Overnight stays are open to you.") : ""}`;
    },
    valid: () => !S.pet.type ? "Pick one kind of care."
      : (!loc().inZone && S.pet.type !== "overnight") ? "Pet Sitting and Drop-In Visits aren't offered at this address. Please choose Overnight Pet Sitting."
      : (S.pet.type === "overnight" && S.start === S.end) ? "An overnight needs an end date after the start date. Go back to change your dates, or pick Pet Sitting or Drop-In Visits."
      : true },

  { id: "petSitTimes", show: () => S.services.pet && S.pet.type === "sitting", eyebrow: "Pet Care", title: "When should we come by each day?",
    lede: "Pet Sitting includes two 1-hour visits a day. Pick the time that suits your pets' routine in each window, and we'll arrive then.",
    render: () => `<div class="box"><h3>Morning Visit</h3><div class="desc">Anytime between 7 and 10 AM</div>${chips("pet.sitMorning", [["7 AM", "7:00 AM"], ["8 AM", "8:00 AM"], ["9 AM", "9:00 AM"]])}<div style="height:12px"></div></div>
      <div class="box"><h3>Evening Visit</h3><div class="desc">Anytime between 4 and 8 PM</div>${chips("pet.sitEvening", [["4 PM", "4:00 PM"], ["5 PM", "5:00 PM"], ["6 PM", "6:00 PM"], ["7 PM", "7:00 PM"]])}<div style="height:12px"></div></div>`,
    valid: () => (S.pet.sitMorning && S.pet.sitEvening) ? true : "Pick a morning and an evening time." },

  { id: "petTimes", show: () => S.services.pet && S.pet.type === "overnight", eyebrow: "Pet Care", title: "What time should we arrive, and when will you be home?",
    lede: "Each day is 24 hours of care, starting when we arrive. If you're home more than 2 hours past that time on your last day, a half or full day of care is added, so an early start or a late return is always covered.",
    render: () => `<div class="fields">${field("pet.arrive", `We arrive ${pretty(S.start)}`, "time")}${field("pet.ret", `You're home ${pretty(S.end)}`, "time")}</div>`,
    valid: () => true },

  { id: "petVisits", show: () => S.services.pet && S.pet.type === "dropin", eyebrow: "Pet Care", title: "How long should each visit be, and when?",
    lede: "Each visit happens inside the time slot you pick. Choose one slot for each visit you want in a day.",
    render: () => `<div class="stack">${opt("pet.dropLen", 1, "1-Hour Visits", "Feeding, fresh water, potty break or litter, playtime and a photo update. Each additional pet is $5 a visit.", "From $40<small>a visit</small>")}${opt("pet.dropLen", 2, "2-Hour Visits", "Everything in a 1-hour visit, with more time together. Each additional pet is $5 a visit.", "From $60<small>a visit</small>")}</div>
      <h3 style="margin:26px 0 10px;font-size:1.45rem">Time Slots</h3>
      <div class="stack">${PRICING.slots.map(s => `<button type="button" class="opt" data-slot="${s.id}" aria-pressed="${S.pet.slots.includes(s.id)}"><span class="dot"></span><span class="txt"><b>${s.label}</b><span class="sub">${s.time}</span></span></button>`).join("")}</div>`,
    valid: () => S.pet.slots.length ? true : "Pick at least one time slot." },

  { id: "pets", show: () => S.services.pet, eyebrow: "Pet Care", title: "Who will we be caring for?",
    lede: "Any dog in the home sets the dog rate. Every pet after the first adds a little.",
    render: () => `<div class="box">
      <h3>Dogs and Cats</h3>
      ${kindStepper("largeDog", "Large Dogs", "Over 50 lb · each additional large dog +$15 a day")}
      ${kindStepper("smallDog", "Small or Medium Dogs", "50 lb and under · each additional +$10 a day")}
      ${kindStepper("cat", "Cats", "Each additional cat +$5 a day")}</div>
      <div class="box"><h3>Other Animals</h3>
      ${kindStepper("small", "Small Animals", "Rabbits, guinea pigs, hamsters, rats, ferrets · +$5 each a day")}
      ${kindStepper("bird", "Birds", "+$5 each a day")}
      ${kindStepper("reptile", "Reptiles or Amphibians", "+$5 each a day · frozen or pre-killed feeders only")}
      ${kindStepper("fish", "Fish Tanks", "+$5 per tank a day")}</div>
      ${S.pet.type === "dropin" ? note("Drop-In Visits add $5 a visit for each pet after the first.") : ""}`,
    valid: () => S.pet.list.length > 0 || "Add at least one pet." },

  { id: "petDaily", show: () => S.services.pet, eyebrow: "Pet Care Add-Ons", title: "Anything extra each day?",
    lede: "Play and cuddles are part of every visit. Turn on an extra, then choose which pets it's for and how often. Only the pets and days you pick are charged.",
    render: () => `<div class="box"><h3>Daily Extras</h3>
      ${extraRow("walks", "Walks", "30 minutes each · $15 a walk", dogs, true)}
      ${extraRow("runs", "Runs", "30 minutes each · $25 a run", dogs, true)}
      ${extraRow("enrichment", "Enrichment Sessions", "About 20 minutes of focused brain work, like puzzle toys, sniff games or practicing commands · $10 a session", pets, true)}
      ${extraRow("medication", "Medication", "Any medication your pet needs, given on your schedule · $15 a day for the whole stay", pets, false)}
      ${extraRow("brushing", "Brushing and Grooming", "A brush-out, paw and ear check, and a wipe-down · $10 a day", () => pets().filter(x => ["largeDog", "smallDog", "cat"].includes(x.kind)), false)}</div>
      ${S.pet.type === "overnight" ? `<div class="box"><h3>More Time With Your Pets</h3>
        <div class="desc">Every overnight includes care at least every 6 hours, day and night. If your pets can't be alone that long, pick the longest they can be on their own. We plan our day around it, and the price is added to each day of the stay.</div>
        ${chips("pet.moreTime", [[6, "6 Hours · Included"], [5, "5 Hours · +$5 a day"], [4, "4 Hours · +$10 a day"], [3, "3 Hours · +$20 a day"], [2, "2 Hours · +$30 a day"], [1, "1 Hour · +$45 a day"], [0, "Never Alone · +$70 a day"]])}<div style="height:12px"></div></div>` : ""}
      <div class="callout"><h3>Pricing Subject to Change</h3><p>Some pets need a little more from us, like extra help getting around, special care routines, or a more careful approach with other pets or people. If that's your pet, the price may change once we know what's needed, so we can prepare and care for them well. We'll always talk it through with you before anything is final.</p></div>`,
    valid: () => true },

  { id: "petExtras", show: () => S.services.pet, eyebrow: "Pet Care Add-Ons", title: "Outings and End of Stay",
    render: () => `${dogs().length ? `<div class="box"><h3>Outings</h3><div class="desc">Choose how many outings you'd like during your stay, and we'll take your dog out that many times while we're caring for them.</div>
      ${stepper("pet.dogPark", "Dog Park Outing", "A trip to a local dog park for off-leash play, with us right there watching the whole time. We bring water, then towel off and clean muddy paws before heading home. · $35 each", 0, 10)}
      ${stepper("pet.lakeTrail", "Lake or Trail Adventure", "An hour or more exploring the lake shore or an easy trail. We pack water, treats, a favorite toy and towels, stay close the whole way, and handle the rinse and clean-up when we're back. · $50 each", 0, 10)}<div class="sub" style="color:var(--muted);font-size:.85rem;padding-bottom:12px">Outings need current vaccines and your written okay for off-leash time.</div></div>` : ""}
      <div class="box"><h3>End of Stay</h3>
      ${toggle("pet.waste", "Pet Waste Removal", "The yard cleaned up before you're home · $10")}
      <div class="pkg">${`<div class="row"><div class="txt"><b>House Refresh</b><div class="sub">Come home to a clean, fresh house · $60</div></div>${togBtn("pet.refresh", "House refresh")}</div>`}
        ${included(["Bedding washed and beds made up", "Kitchen counters and bathroom surfaces wiped and sanitized", "Dusting in the main living areas", "Floors in the main living areas swept, vacuumed and mopped"])}</div>
      ${S.pet.list.some(x => ["small", "bird", "reptile", "fish"].includes(x.kind)) ? stepper("pet.cageCleans", "Full Cage or Habitat Clean", "Bedding or substrate changed, cage wiped down · $15 each", 0, 10) : ""}</div>`,
    valid: () => true },

  /* ---- Farm ---- */
  { id: "farmBase", show: () => S.services.farm && !petOvernight(), eyebrow: "Farm and Homestead Care", title: "How would you like us there for the farm?",
    lede: "This covers a walk of the property, fence and gate checks, water checks and a daily photo update. Animal care is added next.",
    render() {
      const out = !loc().inZone, petVisits = S.services.pet && S.pet.type && S.pet.type !== "overnight";
      return `<div class="stack">
        ${opt("farm.base", "overnight", "Overnight Farm Stay", "We stay on the property, so someone is always close by.", "$80<small>a day</small>", petVisits)}
        ${opt("farm.base", "checks", "Farm Check Visits", "We come by for each visit and handle everything on the list.", "$40<small>a visit</small>", out)}</div>
        ${S.farm.base === "checks" ? `<div class="box" style="margin-top:14px">${stepper("farm.checksPerDay", "Visits a Day", "", 1, 4)}</div>` : ""}
        ${petVisits ? note("To have us stay the night, choose Overnight Pet Sitting in Pet Care. Your farm is then covered by that overnight.") : ""}
        ${out ? note("Farm Check Visits are only offered in our local area. Overnight Farm Stays are open to you.") : ""}`;
    },
    valid: () => !S.farm.base ? "Pick one."
      : (S.farm.base === "checks" && !loc().inZone) ? "Farm Check Visits aren't offered at this address. Please choose an Overnight Farm Stay."
      : (S.farm.base === "overnight" && S.services.pet && S.pet.type && S.pet.type !== "overnight") ? "To have us stay the night, choose Overnight Pet Sitting in Pet Care."
      : (S.farm.base === "overnight" && S.start === S.end) ? "An overnight needs an end date after the start date."
      : true },

  { id: "farmCovered", show: () => S.services.farm && petOvernight(), eyebrow: "Farm and Homestead Care", title: "Your overnight covers being there for the farm",
    lede: "Since we're already staying with your pets, there's no second base. You only pay for the animal care you pick next.",
    render: () => note("<b>Included with your overnight:</b> a walk of the property, fence and gate checks, water checks and a daily photo update."), valid: () => true },

  { id: "farmAnimals", show: () => S.services.farm, eyebrow: "Farm and Homestead Care", title: "Which animals will we care for?",
    lede: "Each group has a daily Essential Care price. Tidy-ups and clean-outs are optional, so you only pay for the cleaning you want.",
    render() {
      const G = PRICING.farm.groups, freq = Object.entries(PRICING.farm.tidyFrequencies);
      return Object.keys(G).map(k => {
        const g = S.farm.groups[k] || (S.farm.groups[k] = { count: 0, stalls: 0, tidy: "none", cleanouts: 0 });
        const meta = G[k], n = +g.count, ess = farmEssential(k, n);
        return `<div class="box"><h3>${meta.label}</h3>${meta.note ? `<div class="desc">${meta.note}</div>` : ""}
          ${stepper(`farm.groups.${k}.count`, "How Many", n ? (ess === null ? "Custom price for a group this size" : `Essential Care $${ess} a day`) : "", 0, 200)}
          ${n ? `${meta.perStall ? stepper(`farm.groups.${k}.stalls`, "Stalls", "Tidy-ups and clean-outs are priced per stall", 0, 40) : ""}
            <div class="row" style="display:block"><b>Tidy-Ups</b><div class="sub">$${meta.tidy} each${meta.perStall ? " per stall" : ""} · how often?</div>${chips(`farm.groups.${k}.tidy`, freq)}</div>
            ${stepper(`farm.groups.${k}.cleanouts`, meta.cleanoutLabel + "s", `All old bedding out, fresh in · $${meta.cleanout} each${meta.perStall ? " per stall" : ""}`, 0, 20)}` : ""}</div>`;
      }).join("");
    },
    valid: () => Object.keys(S.farm.groups).some(hasGroup) || "Add at least one animal group." },

  { id: "farmExtras", show: () => S.services.farm, eyebrow: "Farm Add-Ons", title: "Anything extra around the farm?",
    render() {
      const poultry = hasGroup("poultry"), horses = hasGroup("horses"), cattle = hasGroup("cattle"), herds = ["goats", "pigs", "llamas", "cattle"].some(hasGroup);
      const groups = Object.keys(S.farm.groups).filter(hasGroup).length;
      return `${poultry ? `<div class="box"><h3>Poultry</h3>${toggle("farm.addOns.duckPool", "Duck Pool Refresh", "Dump, rinse and refill · $5 a day")}${toggle("farm.addOns.eggWashing", "Egg Washing and Cartoning", "$5 a day")}${toggle("farm.addOns.brooder", "Chick or Brooder Care", "Heat lamp, feed and water for baby chicks · $10 a day")}</div>` : ""}
        ${horses ? `<div class="box"><h3>Horses</h3>${toggle("farm.addOns.blanketing", "Blanketing", "Blankets on and off with the weather · $5 a day")}${toggle("farm.addOns.flyCare", "Fly Care", "Fly masks and spray you supply · $5 a day")}${stepper("farm.addOns.groomingSessions", "Grooming Sessions", "Brush-out and hooves picked · $10 each", 0, 30)}${stepper("farm.addOns.rotationHorseMoves", "Pasture Rotation, per Horse Moved", "$5 per horse, per move", 0, 60)}</div>` : ""}
        ${(cattle || herds) ? `<div class="box"><h3>Herds</h3>${cattle ? toggle("farm.addOns.winterHay", "Winter Hay Feeding", "Hand-fed bales, no equipment · $10 a day") : ""}${herds ? stepper("farm.addOns.rotationGroupMoves", "Pasture Rotation Moves", "Moving a herd between paddocks · $10 per move", 0, 30) : ""}</div>` : ""}
        <div class="box"><h3>Whole Farm</h3>
          ${stepper("farm.addOns.medicationGroups", "Medication, Animal Groups", "Including shots once you've shown us how · $15 a day per group", 0, groups)}
          ${stepper("farm.addOns.feedMixingGroups", "Special Feed Mixing, Animal Groups", "$5 a day per group", 0, groups)}
          ${stepper("farm.addOns.barnCats", "Barn Cats", "$5 a day for up to 4, +$1 each after", 0, 30)}
          ${stepper("farm.addOns.guardianDogs", "Guardian Dogs", "$5 a day for the first, +$3 each after", 0, 10)}
          ${toggle("farm.addOns.winterWater", "Winter Water Care", "Break ice and check tank heaters twice a day · $10 a day")}
          ${stepper("farm.addOns.feedStoreRuns", "Feed Store Runs", "$25 a trip, plus supplies", 0, 10)}</div>`;
    },
    valid: () => true },

  /* ---- Transport ---- */
  { id: "transport", show: () => S.services.transport, eyebrow: "Pet Transportation", title: "Where are your pets headed?",
    lede: "We drive your pets in your vehicle or a rental. Every trip is quoted on its own, so tell us the basics and we'll reach out.",
    render: () => `<div class="fields">${field("transport.from", "Leaving From")}${field("transport.to", "Going To (City and State)")}${field("transport.pets", "Which Pets")}${field("transport.when", "Around When", "date")}</div>`,
    valid: () => (S.transport.from && S.transport.to) ? true : "Tell us where the trip starts and ends." },

  /* ---- Home ---- */
  { id: "home", show: () => S.services.pet || S.services.farm, eyebrow: "Home Add-Ons", title: "Want us to look after the house too?",
    render: () => `<div class="box"><h3>Packages</h3>
        ${pkg("home.propertyPackage", "Home Property Care Package", "Your home looks lived-in and the everyday chores are handled · $5 a day",
          ["Mail, packages and newspapers brought inside", "Trash and recycling bins taken to the curb on pickup day and brought back", "Up to 5 indoor plants watered"])}
        ${pkg("home.safetyPackage", "Home Safety Check Package", "A daily look around so your home stays safe and secure while you're away · $5 a day",
          ["<b>Doors, windows and locks:</b> every outside door and window checked to make sure it's closed, locked and shows no sign of tampering",
           "<b>Water:</b> a look under sinks, around toilets and the water heater for drips or leaks, and in winter, a check that pipes aren't freezing",
           "<b>Heat:</b> the thermostat is holding the temperature you set and the furnace or heat is running",
           "<b>Smoke and CO alarms:</b> each alarm is powered, with no warning lights or low-battery chirps. We let you know right away if one needs attention",
           "<b>Photo report:</b> photos of your doors, thermostat and anything worth a second look, sent to you each day"])}
        ${pkg("home.welcomeHome", "Welcome Home Package", "Come home to a stocked fridge and a house that's ready for you · $50, plus groceries",
          ["Fridge checked, with anything spoiled or expired cleared out", "Groceries from your list picked up, put away and organized", "Heat or air set to a comfortable temperature and a few lights on for your arrival", "The grocery receipt sent to you, so groceries are added at cost"])}</div>
      <div class="box"><h3>Single add-ons</h3>
        <div class="pkg"><div class="row"><div class="txt"><b>Hot Tub Checks</b><div class="sub">$10 a check · you supply the chemicals</div></div>${stepBtns("home.hotTubChecks", "hot tub checks", 0, 30)}</div>
          ${included(["Water tested and chemicals added", "Temperature checked", "Water level topped up if needed", "Cover checked and secured"])}</div>
        <div class="pkg"><div class="row"><div class="txt"><b>Bird Feeders and Birdbaths</b><div class="sub">$10 the first week, $5 each week after</div></div>${togBtn("home.birdFeeders", "Bird feeders and birdbaths")}</div>
          ${included(["Bird feeders refilled with your seed", "Birdbaths dumped, rinsed and refilled"])}</div>
        <div class="pkg"><b style="color:var(--ink)">Errands</b>
          <div class="sub" style="color:var(--muted);font-size:.88rem">Quick trips under 1 hour, like a prescription pickup, a package drop-off or a few groceries. Add one for each errand and choose how long it takes. The cost of anything we buy is added, and you get the receipt.</div>
          ${S.home.errandList.map((v, i) => `<div class="letin"><label for="f-er-${i}" style="position:absolute;left:-9999px">Errand ${i + 1}</label><select id="f-er-${i}" data-bind="home.errandList.${i}">
             ${[["short", "Under 30 minutes, including the drive · $15"], ["hour", "Up to 1 hour, including the drive · $25"]].map(([k, l]) => `<option value="${k}" ${v === k ? "selected" : ""}>${l}</option>`).join("")}
             </select><button type="button" class="x" data-errand-del="${i}">Remove</button></div>`).join("")}
          <button type="button" class="add" data-errand-add="1">+ Add an errand</button>
          ${S.home.errandList.length ? `<div class="desc">If something is urgent and you're unsure it fits, please don't hesitate to ask. We always want to help.</div>` : ""}</div>
        <div class="pkg"><b style="color:var(--ink)">Letting Someone Into Your Home</b>
          <div class="sub" style="color:var(--muted);font-size:.88rem">Expecting a repair person, cleaner or delivery while you're away? We'll meet them at your home, let them in, and make sure everything is locked up after they leave. Add one for each visitor and choose how long we stay with them.</div>
          ${S.home.letIns.map((v, i) => `<div class="letin"><label class="sr" for="f-li-${i}" style="position:absolute;left:-9999px">Visit ${i + 1}</label><select id="f-li-${i}" data-bind="home.letIns.${i}">
             ${[["quick", "Quick let-in or delivery, we lock up after · $10"], ["hour1", "We stay with them up to 1 hour · $20"], ["hour2", "We stay with them up to 2 hours · $30"], ["long", petOvernight() ? "Longer than 2 hours, we let them in and lock up once they leave · $10" : "Longer than 2 hours, we let them in and come back to lock up once they leave · $20"]].map(([k, l]) => `<option value="${k}" ${v === k ? "selected" : ""}>${l}</option>`).join("")}
             </select><button type="button" class="x" data-letin-del="${i}">Remove</button></div>`).join("")}
          <button type="button" class="add" data-letin-add="1">+ Add a visit</button></div></div>
      <button type="button" class="check" data-flip="home.hasPlants" aria-pressed="${S.home.hasPlants}"><span class="tog" aria-hidden="true" ${S.home.hasPlants ? 'style="background:var(--olive);border-color:var(--olive);box-shadow:inset 0 0 0 5px var(--panel)"' : ""}></span><span><b style="color:var(--ink);display:block">We have plants or a garden we'd like cared for</b><span style="color:var(--muted);font-size:.9rem">More than 5 indoor plants, or an outdoor garden. You'll choose sizes on the next page.</span></span></button>`,
    valid: () => true },

  { id: "plants", show: () => (S.services.pet || S.services.farm) && S.home.hasPlants, eyebrow: "Home Add-Ons", title: "Plants and Garden",
    lede: "The first 5 indoor plants come with the Home Property Care Package.",
    render: () => `<div class="box"><h3>Indoor Plants</h3>${chips("home.indoorPlants", [["none", "None"], ["small", "6 to 15 Plants · $5 a day"], ["medium", "16 to 30 Plants · $10 a day"], ["large", "30+ or a Plant Room · $15 a day"]])}<div style="height:10px"></div></div>
      <div class="box"><h3>Outdoor Garden</h3>${chips("home.garden", [["none", "None"], ["small", "A Few Pots or Baskets · $5 a day"], ["medium", "1 or 2 Raised Beds · $10 a day"], ["large", "Full Garden or Greenhouse · $20 a day"], ["xl", "Orchard or Acreage · Custom"]])}<div style="height:10px"></div></div>`,
    valid: () => true },

  /* ---- Review and contact ---- */
  { id: "review", eyebrow: "Your Care Plan", title: "Here's your estimate",
    lede: "This is an estimate. Every booking comes to us as a request, and we'll reply within 24 hours to confirm the details and final price.",
    render() {
      const r = calculate(S);
      const jumps = [
        S.services.pet && ["petDaily", "Daily Extras"], S.services.pet && ["petExtras", "Outings and End of Stay"],
        S.services.farm && ["farmExtras", "Farm Add-Ons"], (S.services.pet || S.services.farm) && ["home", "Home Add-Ons"],
        (S.services.pet || S.services.farm) && S.home.hasPlants && ["plants", "Plants and Garden"]].filter(Boolean);
      return `<div class="review">${planLines(r, true)}</div>
        ${r.removed.length ? `<div class="removed"><div class="grp">Removed</div>${r.removed.map(l => `<div class="li"><div class="l"><b>${esc(l.label)}</b><small>${esc(l.detail)}</small></div><div class="a"><span>${money(l.amount)}</span><button type="button" class="x" data-restore="${esc(l.key)}">Add back</button></div></div>`).join("")}</div>` : ""}
        ${jumps.length ? `<div class="forgot"><h3>Forgot Anything?</h3><div class="desc" style="color:var(--muted);font-size:.9rem;margin-bottom:10px">Add it now. You'll come right back here.</div><div class="chips">${jumps.map(([id, l]) => `<button type="button" class="chip" data-jump="${id}">+ ${l}</button>`).join("")}</div></div>` : ""}`;
    }, valid: () => true, next: "Looks good, continue" },

  { id: "contact", eyebrow: "About You", title: "Where can we reach you?",
    render: () => `<div class="fields">${field("contact.first", "First Name")}${field("contact.last", "Last Name")}${field("contact.email", "Email", "email")}${field("contact.phone", "Phone", "tel")}${field("contact.street", "Street Address")}${field("contact.town", "Town")}</div>
      <div class="field" style="margin-top:16px"><label for="f-contact.notes">Anything We Should Know?<span class="optional">Optional</span></label><textarea id="f-contact.notes" data-bind="contact.notes" placeholder="Feeding routines, quirks, door codes, who to call if something comes up...">${esc(S.contact.notes)}</textarea></div>
      <div class="fields" style="margin-top:16px">${field("contact.heard", "How Did You Hear About Us?", "text", "", true)}</div>
      ${note("You're always welcome to call or text us at (208) 571-5555.")}`,
    valid: () => (S.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.contact.email.trim())) ? "Check your email address, it doesn't look complete." : (S.contact.first && S.contact.last && S.contact.email && S.contact.phone && (loc().inZone ? S.contact.street : true)) ? true : `Fill in your name, email, phone${loc().inZone ? " and street address" : ""}.`, next: "Send my request" },

  { id: "done", eyebrow: "Request Sent", title: "Thank you. We'll be in touch within 24 hours.",
    render: () => `<p class="lede">A copy of your care plan is on its way to ${esc(S.contact.email) || "your inbox"}. We'll look over the details, check our calendar and reply to confirm.</p>`,
    valid: () => true, last: true }
];

const visible = () => STEPS.filter(s => !s.show || s.show());

/* ---------- care plan ---------- */
function planLines(r, editable) {
  if (!r.lines.length) return `<div class="empty">Your care plan builds here as you answer.</div>`;
  let html = "", grp = "";
  r.lines.forEach(l => {
    if (l.group !== grp) { grp = l.group; html += `<div class="grp">${grp}</div>`; }
    const amt = l.amount === 0 ? (/custom|quote/i.test(l.detail) ? "Quote" : "Included") : money(l.amount);
    html += `<div class="li"><div class="l"><b>${esc(l.label)}</b><small>${esc(l.detail)}</small></div><div class="a"><span>${amt}</span>${editable && l.removable ? `<button type="button" class="x" data-remove="${esc(l.key)}" aria-label="Remove ${esc(l.label)}">Remove</button>` : ""}</div></div>`;
  });
  html += `<div class="total"><span>Estimated total</span><strong>${money(r.total)}</strong></div>`;
  const fine = [...new Set(r.notes)];
  fine.push("Every booking is a request. We confirm within 24 hours.");
  html += `<ul class="fine">${fine.map(n => `<li>${esc(n)}</li>`).join("")}</ul>`;
  return html;
}
function renderPlan() {
  const r = calculate(S);
  let when = "Dates not picked yet";
  if (S.start && S.end && r.days > 0) {
    if (r.mode === "overnight" && S.services.pet && S.pet.type === "overnight")
      { const ex = r.lines.find(l => /^Extra (half|full) day/i.test(l.label));
        when = `${pretty(S.start)}, ${clock(S.pet.arrive)} to ${pretty(S.end)}, ${clock(S.pet.ret)} · ${r.days} day${r.days === 1 ? "" : "s"} of overnight care${ex ? (/half/i.test(ex.label) ? " + a half day" : " + 1 extra day") : ""}`; }
    else if (!S.services.pet && !S.services.farm) when = `${pretty(S.start)} to ${pretty(S.end)}`;
    else when = `${pretty(S.start)} to ${pretty(S.end)} · ${r.days} day${r.days === 1 ? "" : "s"} of ${r.mode === "overnight" ? "overnight care" : "visits"}`;
  }
  const z = S.zip.length === 5 ? loc() : null;
  $("#plan").innerHTML = `<h2>Your Care Plan</h2><div class="meta">${z && z.town ? esc(z.town) + " · " : ""}${when}</div>${planLines(r)}`;
  $("#mtotal").textContent = money(r.total);
}

/* ---------- render ---------- */
function render(focus) {
  const steps = visible();
  if (idx >= steps.length) idx = steps.length - 1;
  const s = steps[idx];
  const total = steps.length - 1, pct = Math.round((idx / total) * 100);
  const back = S.returnTo && s.id !== "review";
  $("#q").innerHTML = `
    ${s.last ? "" : `<div class="progress"><span>Step ${idx + 1} of ${total}</span><div class="bar"><i style="width:${pct}%"></i></div></div>`}
    <div class="eyebrow">${s.eyebrow}</div><h1>${s.title}</h1>${s.lede ? `<p class="lede">${s.lede}</p>` : ""}
    <div>${s.render()}</div>
    ${err ? `<p class="err" role="alert">${esc(err)}</p>` : ""}
    <div class="nav">${idx > 0 && !s.last && !back ? `<button class="btn ghost" id="back" type="button">Back</button>` : ""}
      ${s.last ? `<button class="btn primary" id="again" type="button">Start a new request</button>` : `<button class="btn primary" id="next" type="button">${back ? "Back to my estimate" : (s.next || "Continue")}</button>`}</div>`;
  renderPlan();
  if (focus) { const el = document.getElementById(focus); if (el) { el.focus(); const v = el.value; if (el.setSelectionRange && el.type === "text") el.setSelectionRange(v.length, v.length); } }
}
const go = id => { const i = visible().findIndex(s => s.id === id); if (i >= 0) idx = i; };

document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.set) { let v = t.dataset.val; if (/moreTime|dropLen/.test(t.dataset.set)) v = +v; set(t.dataset.set, v); err = ""; render(); return; }
  if (t.dataset.flip) {
    const v = !get(t.dataset.flip); set(t.dataset.flip, v);
    // One eligible pet: tick it automatically when an extra is switched on.
    const m = t.dataset.flip.match(/^pet\.ext\.(\w+)$/);
    if (m && v) { const f = m[1], list = eligible(f);
      if (list.length === 1) { const id = list[0].id; if (!(S.pet.per[id] && S.pet.per[id][f])) set(`pet.per.${id}.${f}`, ["walks", "runs", "enrichment"].includes(f) ? 1 : true); if (!get(`pet.freq.${id}.${f}`)) set(`pet.freq.${id}.${f}`, "daily"); } }
    err = ""; render(); return; }
  if (t.dataset.slot) { const a = S.pet.slots, i = a.indexOf(t.dataset.slot); i >= 0 ? a.splice(i, 1) : a.push(t.dataset.slot); a.sort((x, y) => PRICING.slots.findIndex(s => s.id === x) - PRICING.slots.findIndex(s => s.id === y)); err = ""; render(); return; }
  if (t.dataset.kind) { setKindCount(t.dataset.kind, Math.max(0, Math.min(20, countKind(t.dataset.kind) + +t.dataset.d))); err = ""; render(); return; }
  if (t.dataset.inc) { const p = t.dataset.inc, v = Math.max(+t.dataset.min, Math.min(+t.dataset.max, (+get(p) || 0) + +t.dataset.d)); set(p, v);
    const m = p.match(/^farm\.groups\.(\w+)\.count$/); if (m && m[1] === "horses") { const g = S.farm.groups.horses; if (!g.stalls || g.stalls > v || g.stalls === v - 1) g.stalls = v; }
    err = ""; render(); return; }
  if (t.dataset.pick) { const [f, id, q] = t.dataset.pick.split(":"); const cur = S.pet.per[id] && S.pet.per[id][f];
    set(`pet.per.${id}.${f}`, cur ? (q === "1" ? 0 : false) : (q === "1" ? 1 : true)); if (!cur && !get(`pet.freq.${id}.${f}`)) set(`pet.freq.${id}.${f}`, "daily"); render(); return; }
  if (t.dataset.errandAdd) { S.home.errandList.push("short"); render(); return; }
  if (t.dataset.errandDel) { S.home.errandList.splice(+t.dataset.errandDel, 1); S.removed = S.removed.filter(k => !k.startsWith("home.errand.")); render(); return; }
  if (t.dataset.letinAdd) { S.home.letIns.push("quick"); render(); return; }
  if (t.dataset.letinDel) { S.home.letIns.splice(+t.dataset.letinDel, 1); S.removed = S.removed.filter(k => !k.startsWith("home.letin.")); render(); return; }
  if (t.dataset.remove) { if (!S.removed.includes(t.dataset.remove)) S.removed.push(t.dataset.remove); render(); return; }
  if (t.dataset.restore) { S.removed = S.removed.filter(k => k !== t.dataset.restore); render(); return; }
  if (t.dataset.jump) { S.returnTo = "review"; go(t.dataset.jump); err = ""; render(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  if (t.id === "next") {
    const steps = visible(), ok = steps[idx].valid(); if (ok !== true) { err = ok; render(); return; }
    err = "";
    if (S.returnTo && steps[idx].id !== "review") { go(S.returnTo); S.returnTo = ""; }
    else if (steps[idx].id === "contact") {
      // Only show the thank-you screen once the request has actually been sent.
      t.disabled = true; t.textContent = "Sending...";
      submitRequest().then(() => { idx++; render(); window.scrollTo({ top: 0, behavior: "smooth" }); })
        .catch(() => { err = "We couldn't send your request just now. Please try again, or call or text us at (208) 571-5555."; render(); });
      return;
    }
    else idx++;
    render(); window.scrollTo({ top: 0, behavior: "smooth" }); return;
  }
  if (t.id === "back") { err = ""; idx = Math.max(0, idx - 1); render(); return; }
  if (t.id === "again" || t.id === "restart") { S = blank(); idx = 0; err = ""; render(); return; }
  if (t.id === "mtoggle") { const p = $("#plan"); p.classList.toggle("open"); t.textContent = p.classList.contains("open") ? "Hide care plan" : "See care plan"; if (p.classList.contains("open")) p.scrollIntoView({ behavior: "smooth" }); }
});
document.addEventListener("input", e => {
  const t = e.target; if (!t.dataset.bind) return;
  let v = t.value; if (t.dataset.bind === "zip") v = v.replace(/\D/g, "").slice(0, 5);
  set(t.dataset.bind, v);
  if (t.dataset.bind === "zip" && (v.length === 5 || v.length === 4)) { render(t.id); return; }
  if (["start", "end", "pet.arrive", "pet.ret"].includes(t.dataset.bind) || t.tagName === "SELECT") { render(); return; }
  renderPlan();
});
document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); $("#next") && $("#next").click(); } });

render();


/* ---------- sending the request ----------
   TODO (Claude Code): connect this to the email service chosen with Stephanie (see START_HERE.md, step 5).
   Define window.BHFL_SEND_REQUEST = async payload => { ... } that resolves when the email is sent
   and throws if it fails. The client only sees the thank-you screen after it resolves.
   The payload has everything: every answer, the pets, the estimate lines, total, notes and flags. */
function buildRequestPayload() {
  const r = calculate(S), z = lookupZip(S.zip);
  const flags = [];
  if (r.holidays.length) flags.push("Holiday dates: " + r.holidays.map(h => `${h.h.name} (${pretty(h.date)})`).join(", "));
  if (z.addressCheck) flags.push("Check the street address: " + z.addressCheck);
  if (z.unknown) flags.push("Zip code not on our map: " + S.zip);
  if (r.lines.some(l => /custom|quote/i.test(l.detail))) flags.push("Has custom-price or quote items");
  if (S.services.transport) flags.push("Pet Transportation requested");
  if (S.contact.notes) flags.push("Client left notes");
  return { submittedAt: new Date().toISOString(), answers: JSON.parse(JSON.stringify(S)), pets: petList(S.pet), estimate: r, flags };
}
async function submitRequest() {
  const payload = buildRequestPayload();
  if (typeof window.BHFL_SEND_REQUEST === "function") return window.BHFL_SEND_REQUEST(payload);
  // Until email is connected, refuse to pretend it was sent.
  console.log("BHFL request (not sent: email service not connected yet):", payload);
  throw new Error("Email service not connected");
}
