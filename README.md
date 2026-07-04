# Field Journal — Your Trekking Expedition Gallery

A self-contained website for your trekking photos and stories. No install,
no build step, no server required — just open it in a browser.

## Running it locally

Because each expedition's story now lives in its own text file (see
"Adding your stories" below), the site needs to be run through a local
web server rather than opened by double-clicking `index.html` directly.
Browsers block a page from reading separate local files (like a `.txt`
story) when it's opened as a bare file — this is a standard browser
security restriction, not a bug.

1. **Fully unzip/extract this folder** to a location on your computer.
2. Open a terminal/command prompt **in this folder** and run:
   ```
   python3 -m http.server 8000
   ```
   (On Windows, this may just be `python -m http.server 8000` instead.)
3. Open **http://localhost:8000** in your browser.

Leave that terminal window open while you're viewing the site — closing
it stops the server. To stop it yourself, click into the terminal and
press `Ctrl+C`.

> Don't have Python? Node.js works too: `npx serve` (after running `npm
> install -g serve` once) does the same thing.

> **If you just double-click `index.html` instead:** the page and photos
> will still show up, but each expedition's story will show an error
> message telling you to run a local server — that's expected, and the
> fix is the steps above.

> **If the page loads but looks broken or blank even through the local
> server:** open your browser's console (press F12, or right-click →
> Inspect → Console tab) and look for a red error message. The site will
> also show an on-screen message if `js/data.js` has a typo.

## Adding your own expeditions

Everything you need to edit lives in **`js/data.js`**. Open it in any text
editor (Notepad, TextEdit, VS Code, etc.).

Each expedition looks like this:

```js
{
  slug: "langtang-valley",           // used for the folder name — lowercase, dashes
  title: "Langtang Valley",
  region: "Rasuwa, Nepal",
  dateRange: "May 4 – May 11, 2025",
  difficulty: "Moderate",
  distanceKm: 60,
  maxAltitudeM: 3870,
  durationDays: 8,
  elevationProfile: [10, 25, 40, 60, 80, 55, 30],  // rough shape of the climb, 0-100
  cover: "images/langtang-valley/cover.jpg",
  photos: [
    "images/langtang-valley/1.jpg",
    "images/langtang-valley/2.jpg"
  ],
  story: "Write a few sentences about the trek here."
}
```

Copy one of the sample entries, paste it as a new item in the list, and
fill in your own details.

## Adding your photos

1. Inside the `images` folder, create a new folder named to match the
   `slug` you used above (e.g. `images/langtang-valley`).
2. Copy your photos into that folder.
3. Name one photo `cover.jpg` (or update the `cover` path in `data.js` to
   match whatever you named it) — this is the photo shown on the home page.
4. List the rest of the photos you want in the gallery under `photos` in
   `data.js`, using their file paths.

Any photo that hasn't been added yet will show a dashed placeholder
telling you exactly which file path it's expecting, so it's easy to see
what's still missing.

## Adding your stories

Each expedition's story lives in its own `.txt` file inside the `stories`
folder, instead of being written directly in `data.js`.

1. Inside the `stories` folder, create a new text file named after your
   trek's slug — e.g. `stories/langtang-valley.txt`.
2. Open it in any text editor and write your story as plain text — no
   special formatting needed, just paragraphs.
3. In `js/data.js`, point that expedition's `storyFile` at it, e.g.
   ```js
   storyFile: "stories/langtang-valley.txt"
   ```

That's it — the site loads the text from that file automatically when
someone opens that expedition's detail view.

## Removing the sample expeditions

Once you've added your own, delete the three sample entries (Everest Base
Camp, Kilimanjaro, Annapurna Circuit) from `js/data.js`, their matching
folders inside `images/`, and their `.txt` files inside `stories/`.

## File structure

```
trekking-gallery/
├── index.html          — the page itself, no need to edit
├── css/style.css        — visual styling, edit if you want to change colors/fonts
├── js/data.js            — YOUR EXPEDITIONS — edit this
├── js/main.js             — rendering logic, no need to edit
├── images/                — your photos, organized by expedition folder
├── stories/                — one .txt file per expedition — edit these
└── README.md                — this file
```

## Publishing it online later

If you ever want this reachable from outside your computer, this folder
is a static site — you could drag-and-drop it onto a service like Netlify
or GitHub Pages with no changes needed. But it's built to work perfectly
fine staying local.
