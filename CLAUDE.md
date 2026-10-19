# Because He First Loved · Website Brief

Claude Code reads this file every time. It is the single source of truth for what this website should look like, say, and do. If something here conflicts with a request in chat, ask Stephanie which one wins.

## Who you're working with

Stephanie Rodgers owns Because He First Loved (BHFL), an in-home pet and property caretaking business in North Idaho that she runs with her husband Luke. She is new to code. Please:

- Explain what you're doing in plain, everyday words. No jargon without a one-line explanation.
- Work in small steps. Finish one page or section, tell her what changed, then move on.
- Before any big change (new tools, deleting files, restructuring), stop and ask first.
- Give her choices as short numbered options she can pick from, instead of open-ended questions.
- Show her a preview before anything gets pushed live.
- She edits on her Mac with the Claude desktop app and GitHub Desktop. She pushes to `main` from GitHub Desktop, and Vercel puts it live in about a minute. When a step is ready, tell her exactly what to click in GitHub Desktop (write a summary, Commit to main, Push origin).

## First thing to do

1. Look at what is already in this repo and tell Stephanie in two or three sentences what you found.
2. Open every image in `/design-reference/` and read the notes below about each one.
3. If the repo is empty or only a starter, build the site with **Astro** (simple, fast, each page is one easy-to-read file, and Vercel supports it with no setup). If a framework is already set up and working, keep it unless Stephanie says otherwise.
4. Plain CSS in one shared stylesheet built on the design tokens below. No Tailwind, no heavy libraries.
5. Build the shared pieces first (colors, fonts, header with dropdown, footer), then the homepage, then the other pages. Show Stephanie the homepage before building the rest.

## The main blueprint: The Kindling Studio

Stephanie's favorite reference is **thekindlingstudio.com**. Screenshots are in `/design-reference/kindling-home-1.jpg` through `kindling-home-4.jpg` (top to bottom). Borrow its layout, rhythm, and details closely, but with BHFL's own words, colors, and art. Never copy its text or images.

What makes Kindling feel the way it does, and what to recreate:

- **Full-screen photo hero** with a soft dark overlay, a small round crest centered above the headline, and a big headline in wide-spaced capitals, centered.
- **Earthy khaki-olive bands** (full-width sections in a muted olive-khaki with cream text) alternating with warm cream sections.
- **Photo collages:** two or three photos overlapping at different sizes, one sometimes set like a white-bordered instant photo tilted a few degrees.
- **Small vertical captions** running sideways beside photos (rotated text in tiny spaced capitals).
- **Small bracketed text links** with a thin line arrow, like `[read our story] ⟶`.
- **Hand-drawn line sketches** tucked into corners (Kindling uses a match and a mug; we use our butterflies and lilies).
- **Services shown in a tabbed box:** one outlined box with tabs across the top. Clicking a tab shows that service: photo on the left, name, short description, and a "this is for you if" list on the right, with outlined "Learn more" buttons.
- **Portfolio-style row of wide image cards** you can scroll sideways with arrows (for us: real stays and animals, later).
- **"Meet the founder" section:** photo collage on a khaki band, with a cream card holding the story.
- **Testimonial section:** large italic serif quote, small "01 / 03" counter, left and right arrows, photo beside it. Arrows only, never auto-sliding.
- **Closing call to action:** full-width moody photo, headline, one outlined button.
- **Dark footer** with a big stacked wordmark, a thin row of square photos, and a simple link row.
- Thin hairline borders and outlined, lightly rounded boxes throughout. Calm, lots of breathing room.

## Other references in `/design-reference/`

- `wild-woods-header.png` and `wild-woods-collies.jpeg`: **the header style.** Centered wordmark, a small tagline under it, then a centered row of menu links in small spaced capitals between two thin lines.
- `forager-wordmark.png`: a big elegant serif wordmark with a small emblem tucked inside it. Inspiration for the BHFL wordmark with the butterfly.
- `rogue-river-lodge.png`: **etched illustrations above service names.** Use our line art the same way.
- `junies-hero.png`: centered, spaced-out capital headline over a photo.
- `ettas-acres.jpeg`, `swann-hill-farm.jpeg`: farm and homestead warmth, photo beside a colored text panel, four photo cards in a row.
- `pet-photographer-carlos.jpeg`, `jackson-dog-services.jpeg`: olive and cream together, pill buttons, a thin trust strip of three short facts.
- `the-club.jpeg`: restraint and etched art on cream.
- `color-palette.png`: she likes the Earth Brown and Beige Sand. She does NOT want the dark pine or any deep forest green.
- `the-meadows-fonts.jpeg`, `goodboy-trainer.jpeg`, `red-sailor-labradoodle.jpeg`: general mood.

Stephanie is still finding her exact colors and fonts. Build everything from the tokens below so changing one value changes it everywhere.

## Colors

Olive greens, khaki, earth browns, and creams. No deep forest green. No bright or pastel colors.

```css
:root {
  --warm-white: #FCFAF4;  /* main page background */
  --cream:      #F4EFE3;  /* cards, panels, alternating sections */
  --sand:       #E1DBC9;  /* soft bands, dividers */
  --khaki:      #9A906F;  /* Kindling-style full-width bands */
  --olive:      #6E7052;  /* signature color, butterfly art, links */
  --olive-ink:  #46422F;  /* headings */
  --earth:      #8C6E51;  /* filled buttons, warm accents */
  --bark:       #454339;  /* footer background */
  --taupe:      #8A8268;  /* small labels, captions, fine lines */
  --charcoal:   #3A3A34;  /* body text */
}
```

Text must stay easy to read (aim for WCAG AA contrast). Cream text on khaki, olive, earth, or bark is fine for headings and short copy; check smaller text on khaki carefully.

## Fonts (Google Fonts)

- **Headings:** Cormorant Garamond, weights 300 to 500. Big section headings in wide-spaced capitals (letter-spacing around 0.06em), Kindling style. Quotes in Cormorant italic.
- **Body and buttons:** Nunito Sans, weights 300, 400, 600. Body size 17 to 19px, generous line spacing.
- **Small labels, captions, bracketed links:** Nunito Sans in small spaced capitals.
- **No handwritten or script fonts.** She wants it clean.

## Brand art

In `/public/images/brand/`:

- `butterfly-lily-wide.png`: butterfly with lilies, horizontal. Footer or section divider.
- `butterfly-lily-diagonal.png`: butterfly landing on lilies, tall. Beside the Our Story section or the closing call to action.
- `butterfly-front.png`: the small round crest above the hero headline and inside the wordmark.
- `butterfly-side.png`, `lily.png`: small corner sketches, like Kindling's match and mug.

These have white backgrounds. On cream use `mix-blend-mode: multiply` so the white disappears. On dark or photo backgrounds, make a cream version (CSS `filter: invert(1)` plus `mix-blend-mode: screen` works, or ask Stephanie for a transparent file). Use them sparingly. Art should never cover people in photos.

## Photos

No real photos yet. Use tasteful placeholder blocks (a soft khaki-to-sand gradient with a small "photo coming soon" note) at the right sizes. Keep every photo in `/public/images/photos/` with clear names like `hero-home.jpg`, `our-story-stephanie-luke.jpg`, so Stephanie can drop in real photos later using the same names. Every image needs real alt text.

## Words and voice

- Warm, genuine, brief, specific. Sounds like Stephanie talking to a neighbor.
- **Never use em dashes anywhere** (the long dash). Use commas, periods, or colons.
- Faith is part of the why, shown, not preached. The name comes from 1 John 4:19: "We love because He first loved us." Use the verse once or twice, elegantly (footer and Our Story).
- "Caretaker, not sitter": they stay in the home, two caretakers on overnights, care for the home and the animals.
- Never mention Rover or Rover prices.
- Write complete draft copy on every page, kept simple so Stephanie can reshape it. Mark any made-up detail with `[confirm]`.
- **Reviews:** never invent reviews. Use clearly marked placeholders that say `[Paste real review here]`.

## Business facts

- Because He First Loved · Pet & Property Caretaking · North Idaho
- Owners: Stephanie & Luke Rodgers
- Phone: (208) 571-5555 [confirm] · Email: stephanie@hefirstloved.com [confirm] · Site: hefirstloved.com
- Trust facts: 13+ years caring for animals · 100+ stays · 5-star reviews
- Service area: Coeur d'Alene, Hayden, Post Falls, Rathdrum, Sandpoint, Sagle, Harrison and Gozzer Ranch, Black Rock, Clark Fork, Hope, Bonners Ferry, Spokane and Spokane Valley WA. "We travel for the right fit."
- No deposit required. Free meet-and-greet before every first booking.

## Header and menu

Wild Woods style: centered "Because He First Loved" wordmark in Cormorant capitals with the small butterfly crest, "Pet & Property Caretaking" in tiny spaced capitals beneath, then one centered row of menu links between two thin lines:

**Home · Our Story · Our Services ▾ · Blog**

The **Our Services** dropdown holds four pages:
1. Pet Care
2. Home & Property
3. Farm & Homestead
4. Pet Transportation

Only these four menu items appear in the header. On phones, the menu collapses into a simple three-line menu button that opens a full-screen cream menu, with the services listed under Our Services. The dropdown must work with a tap on phones and with the keyboard.

Pricing, Reviews, Contact, and Service Area still exist as pages. Reach them through buttons within the pages ("Request care," "See pricing," "Read reviews") and through the footer.

## Pages

### Home (top to bottom, Kindling rhythm)
1. **Slim khaki announcement bar:** "Now booking holiday stays" [confirm].
2. **Header** as above.
3. **Hero:** full-screen photo, butterfly crest centered, big spaced-capitals headline: "In-home pet & property care across North Idaho." One line under it: "We stay in your home and care for what you love like it's our own." A small bracketed link with a thin line down: `[meet us]`.
4. **Trust strip:** 13+ years caring for animals · 100+ stays · 5-star reviews.
5. **Caretaker, not sitter:** Kindling's "Standing out online" layout. Photo collage on the left with a sideways caption, heading and two short columns of text on the right, a small corner sketch, and a `[request care] ⟶` link.
6. **Khaki band:** "What we believe" with a big centered heading about treating every home and animal as entrusted to us, a short line, one button, and two photos floating at the edges.
7. **Our Services tabbed box:** tabs for Pet Care, Home & Property, Farm & Homestead, Pet Transportation. Each tab: photo, etched art, name, short description, "This is for you if" list, "Learn more" button linking to that page.
8. **Meet Stephanie & Luke:** khaki band, overlapping photos, cream card with a short story and `[read our story] ⟶`.
9. **Reviews:** Kindling testimonial layout with placeholders.
10. **Where we serve:** simple list of towns.
11. **FAQ:** short questions (insured [confirm], do you stay overnight, will both of you be there, can you give medications, do you care for homes with no pets, deposit, emergencies). Tap to open each answer.
12. **Closing call to action:** full-width photo, "Planning time away? Let's talk about your home and your animals," outlined "Request care" button, phone number.
13. **Footer.**

### Our Story
The heart of the site. Stephanie's story (loving animals since childhood, volunteering at the Humane Society as a kid, 13+ years, Oregon to Idaho), the couple, the faith why, and how they treat a home entrusted to them (no parties, no unauthorized guests). Collages, sideways captions, the tall butterfly art. Mark details `[confirm]`.

### Pet Care
Overnight in-home care, drop-in visits, extended visits, dog walking, medication and special-needs care, and calm handling of anxious and reactive animals (her specialty). Do NOT advertise injections, subq fluids, or other skilled medical care yet.

### Home & Property
Overnight house sitting with no pets, plants, mail and packages, bins, lights, home walk-throughs. A soft line that full property oversight is something they're growing into, not offered yet.

### Farm & Homestead
The daily basics done faithfully: feeding and fresh water, mucking and clean bedding, eggs, turnout, locking up at night, headcounts, a careful eye for anything off. Honest line: caretakers, not vets, so no injections, hoof or medical work, milking, birthing, or solo large-animal handling. "We'll tell you plainly and help you find the right hands."

### Pet Transportation
Private door-to-door, state to state, only your animals on board. Safety first: about 7 hours of driving a day at most, breaks every 2 to 3 hours, pet-friendly overnight stops, two caretakers on long trips when possible. Can pair with pet sitting at the destination. Always a custom quote.

Each service page: Kindling-style hero (shorter), what's included, "This is for you if," a starting price line, a review placeholder, and a closing "Request care" section.

### Blog
Simple list of posts (image, title, short preview) plus one sample post Stephanie can copy. Starter topics: what "caretaker, not sitter" means; a snowbird's home-watch checklist; caring for a senior or special-needs pet while you travel; why we stay in your home instead of boarding.

### Pricing (linked from buttons and footer)
Calm and confident. "Starting from" rates with what's included, then "Request your custom quote." All numbers `[confirm before launch]`:

| Service | Starting at |
|---|---|
| Overnight in-home care, dogs | from $100 / night |
| Overnight in-home care, cats | from $90 / night |
| Each additional dog / cat | +$15 / +$10 per night |
| Home & Property Watch, no pets | from $80 / night |
| Drop-in visit, 30 min | $30 |
| Extended visit, 60 min | $45 |
| Dog walk, 30 min | $30 |
| Farm & homestead care | add-on, from $10 / day |
| Pet transportation | custom quote |
| Holidays | +$15 per night or visit |
| Extended stays | reduced rate from night 8 |

Note: travel, special needs, and farm animals are quoted after the free meet-and-greet. No deposit.

### Reviews, Service Area, Contact (linked from buttons and footer)
- **Reviews:** grid of placeholder cards, space for a Google link later.
- **Service Area:** short intro, towns with one line each (helps Google), "We travel for the right fit."
- **Contact / Request Care:** call or text first, big and tappable. Then a short form: name, phone or email, dates, town, pets and/or property, notes. "We reply within [confirm] hours." "No deposit needed to talk." Ask Stephanie how she wants form messages delivered (for example Formspree to her email) before wiring it up.

## Footer (every page)
Bark background, big stacked "Because He First Loved" wordmark with the butterfly, a row of square photo placeholders (future Instagram), link row (Home, Our Story, Pet Care, Home & Property, Farm & Homestead, Pet Transportation, Pricing, Reviews, Contact, Blog), phone, email, service area, the 1 John 4:19 line, and space for Instagram and Facebook later.

## Polish rules

- Mobile first: single column, big tap targets, tap-to-call phone numbers.
- Lots of cream space. Let sections breathe.
- Buttons: outlined with thin borders (Kindling), or filled earth brown with cream text for the main action.
- Gentle fade-in on scroll at most. No pop-ups, no auto-sliding carousels, no autoplay video or music, no parallax. Respect "reduce motion" settings.
- Fast loading. Compress images.
- Each page gets a clear title and description for Google, with town names used naturally.
- No live booking calendar.
