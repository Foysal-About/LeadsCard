# Western Group E-card

A festive e-card maker for Western Group and its companies. Staff choose their company, pick a design, type their name and designation, and download a 1080 × 1350 PNG with their company's name on it.

Plain HTML, CSS and JavaScript — no build step, no backend.

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | "Welcome to Western Group" landing page |
| `companies.html` | Company picker |
| `cards.html?company=<id>` | Swipeable deck of designs for that company; tap one to use it |
| `create.html?company=<id>&card=<id>` | Type name and designation, live preview, download or share |
| `gallery.html` | All designs with sample names, plus social share links |

The chosen company is also remembered in the browser, so later pages keep it. Opening `cards.html` or `create.html` without a company sends you to the company picker.

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight from disk also works with the built-in designs, but image-based designs (below) need a server.

## Deploy

Upload the whole folder to any static host (GitHub Pages, Netlify, cPanel `public_html`, S3, etc.). There is nothing to build.

## Customize

- **Companies:** the `companies` list in `assets/js/config.js`. Each has an `id` (used in links), the full `name` printed on cards, a `short` name for the "Corporate Blue" wordmark, a `logo` image for the company picker (files in `assets/img/logos/`; the `mark` badge letters show if it is missing), a one-line `sector` and an accent `color`. Add, remove or reorder entries freely. The list and logos follow the sister concerns on https://westerngroupbd.com/, and the site uses the Western Group logo (`assets/img/western-group.png`) with its charcoal and bronze-gold colours.
- **Occasion text, sample people, file names:** also `assets/js/config.js`. To reuse the site for Eid, Pohela Boishakh or New Year, change `occasion` there.
- **Designs:** `assets/js/templates.js`. Each design has artwork plus a `text` block with the position, size and colour of each line on the card (in 1080 × 1350 card pixels). Leave a line out to hide it.
- **Use your designer's artwork:** export a 1080 × 1350 JPG/PNG with no text on it, put it in `assets/cards/`, and add a design such as:

  ```js
  {
    id: "eid-moon",
    name: "Eid Moon",
    image: "assets/cards/eid-moon.jpg",
    text: {
      greeting: { y: 900, size: 78, color: "#ffffff" },
      name: { y: 1160, size: 60, color: "#ffffff" },
      designation: { y: 1210, size: 30, color: "#f5b82e" },
      company: { y: 1258, size: 22, color: "#dddddd" },
    },
  }
  ```

- **Site colours and fonts:** CSS variables at the top of `assets/css/style.css`.
- **Logo:** the header uses a text wordmark ("WESTERN GROUP"). Swap the `.logo` link in each HTML page for an `<img>` of the official logo.
