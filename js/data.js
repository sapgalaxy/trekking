/*
  YOUR EXPEDITIONS
  ----------------
  This is the only file you need to edit to make the site yours.
  Below are three SAMPLE expeditions so you can see how everything looks.
  Delete them (or leave them as reference) and add your own the same way.

  HOW TO ADD YOUR PHOTOS
  1. Inside the "images" folder, make a new folder named after your trek's
     slug (lowercase, words separated by dashes) — e.g. images/langtang-valley
  2. Drop your photos in there. Name one of them as the "cover" — it's the
     photo shown on the home page card.
  3. In the "photos" list below, write the path to each photo, e.g.
     "images/langtang-valley/1.jpg"

  HOW ELEVATION PROFILES WORK
  The little mountain-line squiggle on each card and detail page is drawn
  from the "elevationProfile" numbers — they're just relative height
  values (0-100) at points along the trek. They don't need to be exact;
  a rough shape of the climb is all that's needed. Add as many or as few
  points as you like.

  HOW STORIES WORK
  Instead of writing your trip story here in data.js, each expedition
  points to a plain .txt file inside the "stories" folder via
  "storyFile". Write your story in that text file using any text editor —
  it'll be loaded automatically when someone opens that expedition.

  IMPORTANT: because the story text is loaded from a separate file, this
  only works when the site is opened through a local web server (or once
  it's hosted online) — not when double-clicking index.html directly.
  See the README for the one-line command to run a local server.
*/

const EXPEDITIONS = [
  {
    slug: "everest-base-camp",
    title: "Everest Base Camp",
    region: "Khumbu, Nepal",
    dateRange: "Oct 12 – Oct 26, 2024",
    difficulty: "Strenuous",
    distanceKm: 130,
    maxAltitudeM: 5364,
    durationDays: 14,
    elevationProfile: [20, 25, 30, 45, 40, 55, 65, 60, 78, 95, 70, 50],
    cover: "images/everest-base-camp/cover.jpg",
    photos: [
      "images/everest-base-camp/1.jpg",
      "images/everest-base-camp/2.jpg",
      "images/everest-base-camp/3.jpg",
      "images/everest-base-camp/4.jpg"
    ],
    storyFile: "stories/everest-base-camp.txt"
  },
  {
    slug: "kilimanjaro",
    title: "Kilimanjaro — Machame Route",
    region: "Kilimanjaro, Tanzania",
    dateRange: "Jul 3 – Jul 9, 2024",
    difficulty: "Strenuous",
    distanceKm: 62,
    maxAltitudeM: 5895,
    durationDays: 7,
    elevationProfile: [15, 30, 42, 38, 55, 68, 72, 60, 90, 40],
    cover: "images/kilimanjaro/cover.jpg",
    photos: [
      "images/kilimanjaro/1.jpg",
      "images/kilimanjaro/2.jpg",
      "images/kilimanjaro/3.jpg"
    ],
    storyFile: "stories/kilimanjaro.txt"
  },
  {
    slug: "annapurna-circuit",
    title: "Annapurna Circuit",
    region: "Annapurna, Nepal",
    dateRange: "Nov 2 – Nov 18, 2023",
    difficulty: "Moderate–Strenuous",
    distanceKm: 160,
    maxAltitudeM: 5416,
    durationDays: 16,
    elevationProfile: [25, 30, 28, 40, 50, 65, 85, 95, 60, 35, 20, 18],
    cover: "images/annapurna-circuit/20221015_000001.jpg",
    photos: [
      "images/annapurna-circuit/20221015_000001.jpg",
      "images/annapurna-circuit/20221015_120009.jpg",
      "images/annapurna-circuit/20221015_000002.jpg",
      "images/annapurna-circuit/20221015_000003.jpg",
      "images/annapurna-circuit/20221015_000004.jpg"
    ],
    storyFile: "stories/annapurna-circuit.txt"
  },
  {
    slug: "langtang-valley",
    title: "Langtang Valley Trek",
    region: "Langtang, Nepal",
    dateRange: "Apr 14 – Apr 22, 2025",
    difficulty: "Moderate",
    distanceKm: 80,
    maxAltitudeM: 4773,
    durationDays: 9,
    elevationProfile: [15, 25, 35, 50, 70, 85, 60, 40, 20],
    cover: "images/annapurna-circuit/20221015_000001.jpg",
    photos: [
      "images/annapurna-circuit/20221015_000001.jpg",
      "images/annapurna-circuit/20221015_120009.jpg",
      "images/annapurna-circuit/20221015_000002.jpg"
    ],
    storyFile: "stories/langtang-valley.txt"
  }
];
