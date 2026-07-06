// Types
type AdventureType = "hike" | "ski" | "camp" | "bike" | "sightseeing" | "beach";
type Author = "him" | "her" | "both";

interface Skill {
  skill: string;
  value: number;
}

interface CareerEntry {
  company: string;
  title: string;
  years: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
}

export interface Profile {
  name: string;
  title: string;
  company: string;
  bio: string;
  skills: Skill[];
  career: CareerEntry[];
  projects: Project[];
  github: string;
  linkedin: string;
  resume?: string;
}

interface Adventure {
  id: number;
  name: string;
  location: string;
  country?: string;
  lat: number;
  lng: number;
  date: string;
  type: AdventureType;
  who: "Family" | "Just Us" | "Solo";
  nights: number;
  emoji: string;
  description: string;
  imageUrl: string;
}

interface BlogPost {
  id: number;
  title: string;
  author: Author;
  date: string;
  readTime: number;
  tags: string[];
  excerpt: string;
  coverImage: string;
  slug: string;
  draft?: boolean;
}

interface SkiResort {
  name: string;
  days: number;
  vertical: number;
  runs: number;
}

interface MonthlyHiking {
  month: string;
  hikes: number;
}

interface Book {
  title: string;
  author: string;
  progress: number;
  coverColor: string;
  genre: string;
}

interface Movie {
  title: string;
  year: number;
  director: string;
  posterColor: string;
  genre: string;
  rating: number;
  platform?: string;
}

interface Photo {
  id: number;
  url: string;
  width: number;
  height: number;
  caption: string;
}

interface FamilyPost {
  id: number;
  author: string;
  date: string;
  caption: string;
  imageUrl: string;
  reactions: { heart: number; laugh: number; wow: number };
}

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  type: string;
}

interface BucketListItem {
  id: number;
  name: string;
  state: string;
  description: string;
  imageUrl: string;
  type: AdventureType;
}

// Data Exports

export const profiles: { him: Profile; her: Profile } = {
  him: {
    name: "Tommy Oyarzun",
    title: "Manager, Analytics",
    company: "Domo",
    bio: "Analytics and data leader with 12+ years building D&A organizations at consumer subscription, SaaS, and enterprise software companies. Specializes in transforming analytics teams from reporting functions into strategic partners through org design, experimentation, self-serve BI products, and AI-native workflows. Based in Sandy, UT.",
    skills: [
      { skill: "SQL", value: 95 },
      { skill: "Python", value: 75 },
      { skill: "dbt", value: 75 },
      { skill: "Apache Spark", value: 30 },
      { skill: "Airflow", value: 50 },
      { skill: "Tableau/Looker", value: 82 },
      { skill: "Data Modeling", value: 90 },
      { skill: "Cloud (Databricks/GCP)", value: 75 },
      { skill: "Domo", value: 95 },
      { skill: "AI (Cluade/Gemini)", value: 75 },
    ],
    career: [
      {
        company: "Domo",
        title: "Manager, Analytics",
        years: "2025–Present",
        description:
          "Built the marketing analytics team from scratch; drove a statistically significant 2.9% MQL-to-SAL lift on the Gated Free Trial launch, tripling conversion rate from 1.1% to 4.1%.",
      },
      {
        company: "Thrive Market",
        title: "Manager, Data Analytics",
        years: "2024–2025",
        description:
          "Launched Brand Insights, a self-serve analytics platform for brand partners, and directed EDW 2.0 to reduce latency and improve reliability across all analytics domains.",
      },
      {
        company: "Asana",
        title: "Manager, Enterprise Data & Intelligence",
        years: "2022–2024",
        description:
          "Achieved 80% improvement in data accuracy and delivery speed; eliminated ~5,000 hours of annual prospecting effort through data-driven sales insights.",
      },
      {
        company: "Fluke Corporation",
        title: "Director, Marketing Data & Analytics",
        years: "2019–2022",
        description:
          "Founded Fluke's first analytics department and led multi-year BI modernization onto Azure Cloud, standardizing on Power BI across the enterprise.",
      },
      {
        company: "Overstock.com",
        title: "Manager, BI Development",
        years: "2014–2019",
        description:
          "Grew from BI Developer to Manager; introduced Scrum/Agile to the BI org and supported a $4M+ revenue initiative with automated executive dashboards.",
      },
    ],
    projects: [
      {
        title: "Oyarzun.com",
        description:
          "This very site — a Next.js 14 personal/family website with Framer Motion animations, an interactive world travel map, and data dashboards.",
        tags: [
          "Next.js",
          "TypeScript",
          "Tailwind",
          "Recharts",
          "Framer Motion",
        ],
        githubUrl: "https://github.com/tjoyarzun/oyarzun-com",
        liveUrl: "https://oyarzun.com",
      },
    ],
    github: "tjoyarzun",
    linkedin: "tom-oyarzun",
    resume: "/documents/tommy_oyarzun_resume_2026.pdf",
  },
  her: {
    name: "Julia Velicev",
    title: "Data Engineer III",
    company: "SeekWell",
    bio: "Data Engineer III at SeekWell. Brazilian, came to the US as a teenager and stayed. The kind of person who listens more than she talks and somehow always knows exactly what to say. Outside of engineering she advocates for recycling, high-density housing, and women and moms in tech. Snowboarder, swimmer, and the reason this family actually finishes hikes.",
    skills: [
      { skill: "SQL", value: 95 },
      { skill: "Python", value: 90 },
      { skill: "dbt", value: 65 },
      { skill: "Apache Spark", value: 85 },
      { skill: "Airflow", value: 88 },
      { skill: "Tableau/Looker", value: 70 },
      { skill: "Data Modeling", value: 90 },
      { skill: "Cloud (Databricks/GCP)", value: 95 },
      { skill: "AI (Cluade/Gemini)", value: 70 },
    ],
    career: [
      {
        company: "SeekWell",
        title: "Data Engineer III",
        years: "2025–Present",
        description: "Full-time hybrid role based in Draper, UT.",
      },
      {
        company: "Hello Eyes",
        title: "Data Engineer III",
        years: "2023–2025",
        description: "Remote data engineering role for two years.",
      },
      {
        company: "Overstock.com",
        title: "BI Developer → Manager, Data Engineering",
        years: "2014–2023",
        description:
          "Grew from BI Developer to managing the Marketing Data Engineering team over 8 years. Led the warehouse migration from on-premise Teradata to BigQuery, saving $1.6M/year. Built the company's first Cloud Functions for real-time streaming. Managed a team of 6–8 engineers and mentored staff to present at technical conferences.",
      },
      {
        company: "Department of Workforce Services",
        title: "Employment Counselor → Senior Business Analyst",
        years: "2008–2014",
        description:
          "Started as an Employment Counselor and grew into project management and senior analytics roles. Built automated federal reporting in IBM Cognos and used Agile to deliver a large Youth Services program in-house.",
      },
    ],
    projects: [
      {
        title: "Tech Moms — Career Journey Talk",
        description:
          "Speaker at Tech Moms on navigating data engineering as a foreign-born woman with a non-traditional education and career path. On making it work without the typical CS degree or Silicon Valley on-ramp.",
        tags: ["Speaking", "Career", "Women in Tech"],
        githubUrl: "https://www.linkedin.com/in/julia-velicev",
      },
    ],
    github: "jvelicev",
    linkedin: "julia-velicev",
  },
};

export const adventures: Adventure[] = [
  {
    id: 1,
    name: "Angels Landing",
    location: "Zion National Park",
    lat: 37.269,
    lng: -112.9469,
    date: "2024-04-15",
    type: "hike",
    who: "Just Us",
    nights: 0,
    emoji: "🥾",
    description:
      "The iconic chains section with breathtaking views of Zion Canyon.",
    imageUrl: "https://picsum.photos/seed/zion/400/250",
  },
  {
    id: 2,
    name: "Snowshoe Tour",
    location: "Bryce Canyon National Park",
    lat: 37.593,
    lng: -112.1871,
    date: "2023-12-28",
    type: "hike",
    who: "Family",
    nights: 1,
    emoji: "❄️",
    description: "Winter wonderland through the hoodoos on snowshoes.",
    imageUrl: "https://picsum.photos/seed/bryce/400/250",
  },
  {
    id: 3,
    name: "Ski Season 23-24",
    location: "Park City Mountain Resort",
    lat: 40.6514,
    lng: -111.508,
    date: "2024-01-15",
    type: "ski",
    who: "Just Us",
    nights: 0,
    emoji: "⛷️",
    description:
      "18 days of the best snow in the world. Utah truly has the Greatest Snow on Earth.",
    imageUrl: "https://picsum.photos/seed/parkcity/400/250",
  },
  {
    id: 4,
    name: "Home Base",
    location: "Salt Lake City",
    lat: 40.7608,
    lng: -111.891,
    date: "2022-06-01",
    type: "hike",
    who: "Family",
    nights: 0,
    emoji: "🏠",
    description:
      "Our home in the Wasatch foothills. Best backyard in the world.",
    imageUrl: "https://picsum.photos/seed/slc/400/250",
  },
  {
    id: 5,
    name: "Fruita Campground",
    location: "Capitol Reef National Park",
    lat: 38.2897,
    lng: -111.2611,
    date: "2023-09-08",
    type: "camp",
    who: "Family",
    nights: 2,
    emoji: "🏕️",
    description:
      "Camping under the stars with fresh apples from the historic Fruita orchards.",
    imageUrl: "https://picsum.photos/seed/capitolreef/400/250",
  },
  {
    id: 6,
    name: "Snowbird Powder Day",
    location: "Snowbird Ski Resort",
    lat: 40.5826,
    lng: -111.6554,
    date: "2024-02-03",
    type: "ski",
    who: "Just Us",
    nights: 0,
    emoji: "⛷️",
    description: "18 inches overnight. First chair at Mineral Basin. Unreal.",
    imageUrl: "https://picsum.photos/seed/snowbird/400/250",
  },
  {
    id: 7,
    name: "Narrows Bottom-Up",
    location: "Zion National Park",
    lat: 37.3003,
    lng: -112.9469,
    date: "2023-06-17",
    type: "hike",
    who: "Family",
    nights: 0,
    emoji: "💧",
    description:
      "Wading through the Virgin River in Zion's legendary slot canyon.",
    imageUrl: "https://picsum.photos/seed/narrows/400/250",
  },
  {
    id: 8,
    name: "Alta Ski Day",
    location: "Alta Ski Area",
    lat: 40.588,
    lng: -111.6376,
    date: "2024-01-27",
    type: "ski",
    who: "Just Us",
    nights: 0,
    emoji: "⛷️",
    description:
      "Pow day at Alta. Skiing-only resort means less crowds and more powder.",
    imageUrl: "https://picsum.photos/seed/alta/400/250",
  },
  {
    id: 9,
    name: "Goblin Valley Camping",
    location: "Goblin Valley State Park",
    lat: 38.5671,
    lng: -110.7079,
    date: "2023-10-28",
    type: "camp",
    who: "Family",
    nights: 1,
    emoji: "👾",
    description:
      "Camping among the goblins. Kids loved it. Otherworldly landscape.",
    imageUrl: "https://picsum.photos/seed/goblin/400/250",
  },
  {
    id: 10,
    name: "Big Cottonwood Canyon",
    location: "Brighton Ski Resort",
    lat: 40.5975,
    lng: -111.5814,
    date: "2024-03-08",
    type: "ski",
    who: "Just Us",
    nights: 0,
    emoji: "⛷️",
    description:
      "Late season spring skiing at Brighton. Sunshine and corn snow.",
    imageUrl: "https://picsum.photos/seed/brighton/400/250",
  },
  {
    id: 11,
    name: "Zermatt — Matterhorn Glacier",
    location: "Zermatt, Switzerland",
    country: "Switzerland",
    lat: 46.0207,
    lng: 7.7491,
    date: "2023-02-18",
    type: "ski",
    who: "Just Us",
    nights: 5,
    emoji: "⛷️",
    description:
      "Skiing the glacier runs above Zermatt with the Matterhorn in full view. One of the best days on snow either of us has ever had.",
    imageUrl: "https://picsum.photos/seed/zermatt/400/250",
  },
  {
    id: 12,
    name: "Preikestolen (Pulpit Rock)",
    location: "Stavanger, Norway",
    country: "Norway",
    lat: 58.9866,
    lng: 6.1886,
    date: "2022-07-12",
    type: "hike",
    who: "Just Us",
    nights: 7,
    emoji: "🥾",
    description:
      "The classic Norway hike — 604 meters straight down to the Lysefjord. Worth every step.",
    imageUrl: "https://picsum.photos/seed/preikestolen/400/250",
  },
  {
    id: 13,
    name: "Marisias Beach",
    location: "São Sebastião, Brazil",
    country: "Brazil",
    lat: -23.8004,
    lng: -45.5592,
    date: "2023-01-07",
    type: "beach",
    who: "Family",
    nights: 10,
    emoji: "🏖️",
    description:
      "New Year's at Julia's family beach house. Caipirinha, fresh fish, and her whole family. Perfect.",
    imageUrl: "https://picsum.photos/seed/marisias/400/250",
  },
  {
    id: 14,
    name: "Colosseum & Palatine Hill",
    location: "Rome, Italy",
    country: "Italy",
    lat: 41.8902,
    lng: 12.4922,
    date: "2022-09-03",
    type: "hike",
    who: "Just Us",
    nights: 4,
    emoji: "🏛️",
    description:
      "Walking the ancient city on foot. Palatine Hill at golden hour is something we'll never forget.",
    imageUrl: "https://picsum.photos/seed/rome/400/250",
  },
];

export const travelStats = {
  adventuresLogged: adventures.length,
  skiResorts: new Set(
    adventures.filter((a) => a.type === "ski").map((a) => a.location),
  ).size,
  nightsAway: adventures.reduce((sum, a) => sum + a.nights, 0),
  countriesVisited: new Set(adventures.map((a) => a.country ?? "USA")).size,
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Our Utah Ski Resort Tier List — Fully Quantified",
    author: "both",
    date: "2024-03-15",
    readTime: 7,
    tags: ["Utah", "Analytics", "Winter"],
    excerpt:
      "After 34 ski days across 8 Utah resorts, we built a scoring model weighing terrain variety, snow quality, lift lines, and vibes. The rankings might surprise you.",
    coverImage: "https://picsum.photos/seed/blog5/800/450",
    slug: "utah-ski-resort-tier-list",
    draft: true,
  },
  {
    id: 2,
    title: "From Analyst to Data Engineer: My Career Pivot",
    author: "her",
    date: "2024-02-08",
    readTime: 10,
    tags: ["Career", "Data Engineering"],
    excerpt:
      "Three years ago I was writing SQL reports in Tableau. Now I architect Spark streaming pipelines processing billions of events. Here is exactly what the transition looked like, honestly.",
    coverImage: "https://picsum.photos/seed/blog6/800/450",
    slug: "analyst-to-data-engineer",
    draft: true,
  },
  {
    id: 3,
    title: "The Best Hikes Near Salt Lake City (Data-Ranked)",
    author: "both",
    date: "2024-09-20",
    readTime: 9,
    tags: ["Utah", "Analytics", "Outdoors"],
    excerpt:
      "We ranked 47 hikes within 90 minutes of Salt Lake City using a weighted scoring model: scenery, difficulty curve, crowd levels, trail conditions, and elevation payoff.",
    coverImage: "https://picsum.photos/seed/blog3/800/450",
    slug: "best-slc-hikes-data-ranked",
    draft: true,
  },
];

export const dashboardStats = {
  blogPosts: 23,
  booksRead2024: 24,
  photosInLibrary: 3847,
  totalHikes: 53,
  skiResortsVisited: 8,
  utahNationalParks: 5,
  elevationRecord: 11752,
  githubCommits: 1203,
  milesHiked: 847,
  skiDays: 34,
  statesVisited: 28,
  booksReadThisYear: 24,
  countriesVisited: 12,
};

export const familyPhotos: Photo[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/seed/family${i + 100}/${300 + (i % 3) * 100}/${200 + (i % 4) * 50}`,
  width: 300 + (i % 3) * 100,
  height: 200 + (i % 4) * 50,
  caption: [
    "Summer hike at Timp",
    "Ski day at Alta",
    "Bryce Canyon snowshoe",
    "Moab bike trip",
    "Zion narrows",
    "SLC rooftop",
    "Arches sunset",
    "Camping at Capitol Reef",
    "Park City opening day",
    "Wasatch trail run",
    "Family dinner at home",
    "Holiday baking",
    "Canyonlands backpack day 2",
    "Salt flats road trip",
    "Brighton spring skiing",
    "Goblin Valley camp",
    "Timp summit crew",
    "Angels Landing chains",
    "Delicate Arch golden hour",
    "Bonneville Shoreline wildflowers",
  ][i],
}));

export const currentlyReading: Book[] = [
  {
    title: "Do Androids Dream of Electric Sheep?",
    author: "Philip K. Dick",
    progress: 25,
    coverColor: "#1C1917",
    genre: "Sci-Fi",
  },
  {
    title: "The Tell: Oprah's Book Club, A Memoir",
    author: "Amy Griffin",
    progress: 50,
    coverColor: "#C8973E",
    genre: "Memoir",
  },
];

export const favoriteMovies: Movie[] = [
  {
    title: "Anora",
    year: 2024,
    director: "Sean Baker",
    posterColor: "#C8973E",
    genre: "Drama",
    rating: 5,
    platform: "Theater",
  },
  {
    title: "The Substance",
    year: 2024,
    director: "Coralie Fargeat",
    posterColor: "#D4614A",
    genre: "Horror / Satire",
    rating: 4,
    platform: "MUBI",
  },
  {
    title: "Dune: Part Two",
    year: 2024,
    director: "Denis Villeneuve",
    posterColor: "#8B6B2A",
    genre: "Sci-Fi",
    rating: 5,
    platform: "Theater",
  },
];

export const skiResorts: SkiResort[] = [
  { name: "Snowbird", days: 18, vertical: 3100, runs: 330 },
  { name: "Solitude", days: 8, vertical: 3240, runs: 169 },
  { name: "Alta", days: 6, vertical: 2538, runs: 119 },
  { name: "Brighton", days: 3, vertical: 1875, runs: 66 },
  { name: "Park City", days: 2, vertical: 2150, runs: 42 },
];

export const hikingData: MonthlyHiking[] = [
  { month: "Jan", hikes: 2 },
  { month: "Feb", hikes: 2 },
  { month: "Mar", hikes: 4 },
  { month: "Apr", hikes: 6 },
  { month: "May", hikes: 7 },
  { month: "Jun", hikes: 8 },
  { month: "Jul", hikes: 9 },
  { month: "Aug", hikes: 7 },
  { month: "Sep", hikes: 6 },
  { month: "Oct", hikes: 5 },
  { month: "Nov", hikes: 3 },
  { month: "Dec", hikes: 2 },
];

export const bucketListItems: BucketListItem[] = [
  {
    id: 1,
    name: "Havasupai Falls",
    state: "Arizona",
    description:
      "Turquoise waterfalls deep in the Grand Canyon — one of the most beautiful places on earth.",
    imageUrl: "https://picsum.photos/seed/havasupai/400/280",
    type: "hike",
  },
  {
    id: 2,
    name: "The Enchantments",
    state: "Washington",
    description:
      "Alpine lakes and larch trees in the Cascade Mountains. Permit lottery dream destination.",
    imageUrl: "https://picsum.photos/seed/enchantments/400/280",
    type: "hike",
  },
  {
    id: 3,
    name: "Paria Canyon-Vermilion Cliffs",
    state: "Utah/Arizona",
    description:
      "The ultimate slot canyon backpacking trip — 38 miles of otherworldly canyon walls.",
    imageUrl: "https://picsum.photos/seed/paria/400/280",
    type: "camp",
  },
];

export const familyFeedPosts: FamilyPost[] = [
  {
    id: 1,
    author: "Julia",
    date: "2024-11-28",
    caption:
      "Thanksgiving in the mountains. 🍂 Best decision we ever made moving to Utah.",
    imageUrl: "https://picsum.photos/seed/feed1/600/400",
    reactions: { heart: 14, laugh: 2, wow: 3 },
  },
  {
    id: 2,
    author: "Tommy",
    date: "2024-11-15",
    caption:
      "First real snow of the season on the Bonneville Shoreline. Kids were losing their minds. ❄️",
    imageUrl: "https://picsum.photos/seed/feed2/600/400",
    reactions: { heart: 22, laugh: 8, wow: 5 },
  },
  {
    id: 3,
    author: "Julia",
    date: "2024-10-31",
    caption:
      "Halloween 2024 — the kids wanted to be data engineers. We are so proud. 👨‍💻",
    imageUrl: "https://picsum.photos/seed/feed3/600/400",
    reactions: { heart: 31, laugh: 24, wow: 7 },
  },
  {
    id: 4,
    author: "Tommy",
    date: "2024-10-12",
    caption:
      "Fall colors at Tibble Fork. Reminded us why we moved here every single time.",
    imageUrl: "https://picsum.photos/seed/feed4/600/400",
    reactions: { heart: 19, laugh: 1, wow: 11 },
  },
  {
    id: 5,
    author: "Julia",
    date: "2024-09-28",
    caption:
      "New recipe tested: chile verde from scratch. It took 4 hours. Worth every minute. 🌶️",
    imageUrl: "https://picsum.photos/seed/feed5/600/400",
    reactions: { heart: 17, laugh: 3, wow: 6 },
  },
];

export const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Park City Opening Day",
    date: "2024-11-21",
    description:
      "First ski day of the season! Meeting the Rodriguez family for early morning runs.",
    type: "ski",
  },
  {
    id: 2,
    title: "Family Holiday Portraits",
    date: "2024-12-07",
    description:
      "Annual photos at Temple Square before the Christmas lights go up.",
    type: "family",
  },
  {
    id: 3,
    title: "NYE at the Cabin",
    date: "2024-12-31",
    description:
      "Celebrating New Years with the Oyarzun extended family up Big Cottonwood Canyon.",
    type: "celebration",
  },
];

// Strava-style recent activities for dashboard
export const recentActivities = [
  {
    id: 1,
    type: "hike",
    name: "Bonneville Shoreline — Dry Creek",
    distance: 8.1,
    date: "2024-11-12",
    elevation: 720,
    duration: "2h 34m",
  },
  {
    id: 2,
    type: "run",
    name: "Red Butte Canyon Loop",
    distance: 5.4,
    date: "2024-11-10",
    elevation: 480,
    duration: "48m",
  },
  {
    id: 3,
    type: "hike",
    name: "Dog Lake via Mill D",
    distance: 7.2,
    date: "2024-11-05",
    elevation: 1340,
    duration: "3h 10m",
  },
  {
    id: 4,
    type: "run",
    name: "City Creek Canyon out & back",
    distance: 6.0,
    date: "2024-11-02",
    elevation: 390,
    duration: "52m",
  },
  {
    id: 5,
    type: "hike",
    name: "Pfeifferhorn South Face",
    distance: 10.2,
    date: "2024-10-26",
    elevation: 3200,
    duration: "5h 22m",
  },
];

export const goalsYear = "2026";

export const goals = [
  { label: "Adventures", current: 0, goal: 20, pct: 0 },
  { label: "Ski Days", current: 34, goal: 40, pct: 85 },
  { label: "Books Read", current: 24, goal: 30, pct: 80 },
  { label: "Blog Posts", current: 3, goal: 5, pct: 60 },
];

export const booksPerQuarter = [
  { quarter: "Q1 24", books: 5 },
  { quarter: "Q2 24", books: 7 },
  { quarter: "Q3 24", books: 6 },
  { quarter: "Q4 24", books: 8 },
  { quarter: "Q1 25", books: 6 },
  { quarter: "Q2 25", books: 8 },
  { quarter: "Q3 25", books: 9 },
  { quarter: "Q4 25", books: 7 },
  { quarter: "Q1 26", books: 7 },
  { quarter: "Q2 26", books: 8 },
  { quarter: "Q3 26", books: 1 },
];
