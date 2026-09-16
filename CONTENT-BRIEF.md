# Ramirez Pro Tile LLC — content brief

Raw content handed over by the client, 2026-09-10. Source of truth until the real site copy is written.

## Company

- Name: Ramirez Pro Tile LLC
- Slogan: "Craftsmanship in every tile"
- Logo: TBD (see open questions)

## About

Ramirez Pro Tile LLC provides professional tile installation services with a focus on quality craftsmanship, attention to detail, and customer satisfaction. We work with homeowners, contractors, and builders to transform floors, walls, bathrooms, showers, and other spaces with high-quality tile installations.

## Services

- Floor Tile Installation
- Wall Tile Installation
- Bathroom Tile
- Shower Tile
- Backsplashes
- Kitchen Tile
- Custom Tile Designs
- Tile Repairs / Replacements
- Waterproofing
- Large-Format Tile
- Residential Tile Installation
- Contractor / Builder Projects
- Commercial / Residential Construction
- Free Estimates

## Process

1. **Consultation** — Discuss the project, design, tile, and customer expectations.
2. **Measurements** — Measure the space and determine the amount of tile/material needed.
3. **Preparation** — Prepare the surface properly before installation.
4. **Installation** — Install the tile with attention to layout, spacing, level, and detail.
5. **Finishing** — Complete grout, caulking, trim, and final details.
6. **Final Walkthrough** — Make sure the customer is satisfied with the finished project.

## Pricing

Not provided — client left this blank. Default assumption: lead with "Free Estimates" as the CTA instead of listed prices (standard for trade contractors, avoids underquoting sight-unseen). Confirm with client.

## Gallery photos (received as images, not yet saved as files)

8 in-progress/finished shower photos showing a range of premium tile work:
1. White subway tile shower, penny-round tile floor
2. Textured off-white stone-look tile, hexagon marble floor
3. Patterned cement-look wall tile with wood-trimmed niches/bench, hex floor
4. Calacatta gold marble slab tile, arched ceiling
5. Gray stone-look tile with black trim/fixtures, hex marble floor
6. Black-and-white checkerboard marble tile, arched entry
7. Green ceramic subway tile (in progress)
(Correction: there are 7 photos total, not 8 — item 8 above was a miscount in the original list and does not correspond to a distinct additional image.)

These demonstrate range: classic subway, natural stone/marble, bold pattern work (checkerboard), and color. Strong evidence this contractor can do both clean/classic and statement/custom work — worth leaning on in the gallery and "Custom Tile Designs" service section.

## Final section

"Contacts, social media" — resolved 2026-09-13, see below.

## Decisions (2026-09-10)

- **Pricing:** no listed prices — "Free Estimates" CTA drives to contact/quote request.
- **Repo:** Edwin creates the empty GitHub repo and sends the URL; Claude pushes code to it (no gh/netlify CLI installed locally).

## Decisions (2026-09-13) — client feedback round 1

- **Logo:** real file received (`images/originals/logo-full-source.jpg`, a gold-chrome "RP" badge + "RAMIREZ PRO TILE LLC" wordmark on black). Cropped just the circular RP badge to `images/logo-icon.png` for the header/footer icon, paired with live text "Ramirez Pro Tile LLC" beside it (client wanted the name kept in writing, not just the image).
- **Contact info:** phone `(828) 242-1537` (tel:+18282421537), email `ramirezprotilellc@gmail.com`, Instagram `https://www.instagram.com/ramirez_protile?stkn=MWJ2bzl0d2FianN2NQ==`. Wired into the hero/services/contact CTA buttons, the contact card, and the social row. No Facebook link was provided, so the Facebook placeholder icon was removed rather than left as a dead link.
- **Color scheme overhaul:** full black-and-gold rework, replacing the original warm-stone/terracotta palette.
  - Background: near-black `#0a0a0a` (client chose this over pure `#000000` for readability on large sections).
  - Titles/headings: gold `#e0b23c`, sampled directly from the logo file's flat gold tone.
  - Subtext/body copy: stayed grey, retuned to a lighter warm grey (`#a39a8c`) for contrast against the new black background.
  - Buttons: cream/ivory outline (ghost style) with gold text, replacing the old solid terracotta-orange fill (client's pick over a solid-gold or bronze/copper alternative Claude also offered).

## Gallery lightbox (2026-09-16)

Added click/tap-to-open lightbox for all 7 gallery photos, showing the full uncropped image (thumbnails stay cropped for the bento grid). True pinch-to-zoom (mobile) and scroll-wheel zoom (desktop) anchored wherever the user points, not just centered — first version used a click-to-toggle-to-native-res zoom that only showed the center of the photo and felt broken; replaced with continuous transform-based zoom per client feedback. Double-tap/double-click as a quick shortcut. Also fixed the lightbox not covering the full viewport on mobile (iOS Safari dynamic toolbar / 100vh issue), which let the gallery grid peek through at the bottom.

## SEO/meta pass (2026-09-16)

Added, all using the client's real logo/contact info:
- Favicon (`images/favicon-32.png`, `favicon.png`) and Apple touch icon (`images/apple-touch-icon.png`), generated from the cropped logo.
- Open Graph + Twitter card meta tags, with a custom-composed `images/og-image.jpg` (logo + name + tagline on the site's black/gold background) so shared links show a proper preview instead of nothing.
- `robots.txt` and `sitemap.xml` at the repo root.
- `HomeAndConstructionBusiness` JSON-LD structured data (name, phone, email, areaServed, Instagram) for search engines.
- Header now shows a click-to-call phone number/icon at all times (previously only reachable by scrolling to the contact section).
- **Skipped on purpose:** a "Licensed & Insured" trust badge — client confirmed the business is not licensed, so this should not be added unless that changes.

**Note:** `og:url`, `og:image`, `twitter:image`, `robots.txt`'s Sitemap line, and `sitemap.xml`'s `<loc>` are all hardcoded to `https://ramirez-pro-tile.netlify.app/`. **These need updating once a custom domain goes live** (see the domain/production conversation) — search for that URL across `index.html`, `robots.txt`, and `sitemap.xml` when that happens.

## Still open

Nothing outstanding content-wise. Only follow-up: update hardcoded Netlify URLs (see note above) once a custom domain is attached.
