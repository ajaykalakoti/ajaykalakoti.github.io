# Ajay Kalakota — Portfolio

Personal portfolio site for Ajay Kalakota, Full Stack Developer.

Built with vanilla HTML, CSS and JavaScript — no build step, no dependencies.

## Structure

```
Portfolio/
├── index.html      # All sections: hero, about, skills, experience, projects, education, contact
├── css/style.css   # Design tokens, components, responsive breakpoints
├── js/main.js      # Theme, nav, scroll reveal, counters, skills filter, form
└── README.md
```

## Running locally

Open `index.html` directly in a browser, or serve it:

```bash
python -m http.server 8000     # then visit http://localhost:8000
```

## Features

- **Dark / light theme** — follows the OS by default, remembers a manual choice in `localStorage`
- **Responsive** — mobile-first, breakpoints at 1024px / 860px / 560px / 380px
- **Scroll reveal + active nav** — via `IntersectionObserver`
- **Animated stat counters and proficiency bars**
- **Skills filter** — All / Front-End / Back-End / Databases / Tools
- **Contact form** — client-side validation + real delivery via FormSubmit (see below)
- **Resume download** — served from `assets/`, linked in the navbar, hero and contact section
- **Accessible** — skip link, ARIA labels, keyboard-navigable, honours `prefers-reduced-motion`
- **Print stylesheet** — the page prints as a clean resume

## ⚠️ Contact form — one-time activation required

The form POSTs to [FormSubmit](https://formsubmit.co) (no signup, no API key). Messages are
delivered to `ajaykalakoti34@gmail.com` and CC'd to `ajaykalakota11042002@gmail.com`.

**FormSubmit will not deliver anything until you activate the address once:**

1. Deploy the site (or run it locally).
2. Submit the form yourself once, with real values.
3. FormSubmit emails `ajaykalakoti34@gmail.com` a confirmation link — click it.
4. Every submission from then on lands in your inbox.

Until step 3, submissions are accepted but not delivered. If the network or FormSubmit is
unreachable, `js/main.js` falls back to opening the visitor's mail client so the message
isn't lost silently.

To change the addresses: update `action` on the form in `index.html` and the
`PRIMARY_EMAIL` / `ALT_EMAIL` constants in `js/main.js`.

## Customising

| What | Where |
|---|---|
| Colors, spacing, radii | `:root` tokens at the top of `css/style.css` |
| Dark theme colors | `html[data-theme='dark']` block in `css/style.css` |
| Typing phrases | `PHRASES` array in `js/main.js` |
| Stat numbers | `data-target` attributes on `.count` in `index.html` |
| Proficiency levels | `data-width` attributes on `.bar__fill` in `index.html` |

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/ajaykalakoti/Portfolio.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: main branch / root**.

Alternatively, drag the folder onto [netlify.com/drop](https://app.netlify.com/drop) or run `vercel` in this directory.

## Suggested next steps

- Add a profile photo and a downloadable `resume.pdf` (link it from the hero)
- Add screenshots for the Telinfy and Vijaya Educational App project cards
- Swap the `mailto:` form for [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) so messages arrive without opening a mail client
