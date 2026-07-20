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
  github?: string;
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
    bio: "Staff Data Engineer with 10+ years of experience building scalable data pipelines, cloud warehouses, and analytics solutions. Hands-on expertise across GCP, BigQuery, Databricks, AWS, PostgreSQL, Python, SQL, and Tableau. Track record of modernizing legacy systems, optimizing high-volume SQL, and delivering reliable, reusable data products in close partnership with business, product, and engineering teams.",
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
    linkedin: "julia-velicev",
    resume: "/documents/julia_velicev_resume_2026.pdf",
  },
};

export const adventures: Adventure[] = [
  {
    id: 1,
    name: "Databricks Data+AI Conference",
    location: "San Franciso, CA",
    lat: 37.784590467519806,
    lng: -122.40062026495632,
    date: "2026-06-15",
    type: "sightseeing",
    who: "Just Us",
    nights: 3,
    emoji: "🌁",
    description:
      "Tagged along with Julia to Databricks Data+AI Conference and worked from my old Asana office.",
    imageUrl: "https://picsum.photos/seed/zion/400/250",
  },
  {
    id: 2,
    name: "Summar in Italy",
    location: "Sicily, Italy",
    lat: 37.984094193765635,
    lng: 13.695563710328907,
    date: "2026-05-26",
    type: "sightseeing",
    who: "Family",
    nights: 10,
    emoji: "🇮🇹",
    description:
      "Spent a little over a week at my moms place in Sicily, we loved the beach at Chefalu.",
    imageUrl: "https://picsum.photos/seed/bryce/400/250",
  },
  {
    id: 3,
    name: "Roman Holiday",
    location: "Rome, Italy",
    lat: 41.88814586569183,
    lng: 12.479167464654216,
    date: "2026-05-23",
    type: "sightseeing",
    who: "Family",
    nights: 2,
    emoji: "🇮🇹",
    description:
      "A few days sightseeing Rome with the whole family, then headed to Sicily.",
    imageUrl: "https://picsum.photos/seed/parkcity/400/250",
  },
  {
    id: 4,
    name: "July 4th in Vegas",
    location: "Las Vegas",
    lat: 36.169798592946364,
    lng: -115.1674570783433,
    date: "2026-07-03",
    type: "sightseeing",
    who: "Family",
    nights: 3,
    emoji: "🇺🇸",
    description:
      "Drove the whole family including the animals to see my mom in Las Vegas.",
    imageUrl: "https://picsum.photos/seed/slc/400/250",
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
  photosInLibrary: 3847,
  totalHikes: 53,
  skiResortsVisited: 8,
  utahNationalParks: 5,
  elevationRecord: 11752,
  githubCommits: 1203,
  milesHiked: 847,
  skiDays: 34,
  statesVisited: 28,
  booksReadThisYear: 7,
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
    title: "Backrooms",
    year: 2026,
    director: "Kane Parsons",
    posterColor: "#C8973E",
    genre: "Horror",
    rating: 5,
    platform: "Theater",
  },
  {
    title: "Obsession",
    year: 2025,
    director: "Curry Barker",
    posterColor: "#D4614A",
    genre: "Horror",
    rating: 4,
    platform: "Theater",
  },
  {
    title: "Project Hail Mary",
    year: 2024,
    director: "Phil Lord / Christopher Miller",
    posterColor: "#8B6B2A",
    genre: "Sci-Fi",
    rating: 5,
    platform: "AppleTV+",
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
    name: "Tahiti",
    state: "French Polynesia",
    description: "We do love beaches.",
    imageUrl:
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFqGv3nPOT8Yf94pbS8BLo8C-2wCmjapIKitsiV0HNDgEF9NTPngQT9eVvwU-OiTXygr-9P7n2xZTuZNDBOACMnFVlcGe9kAzR0eQEILqUGZRFpmFutuV2p3eff5kSGxqUUA0L6mg=w426-h240-k-no",
    type: "beach",
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
  { label: "Ski Days", current: 0, goal: 40, pct: 0 },
  { label: "Books Read", current: 7, goal: 20, pct: 35 },
  { label: "Blog Posts", current: 3, goal: 5, pct: 60 },
];

export const booksPerQuarter = [
  { quarter: "Q2 25", books: 0 },
  { quarter: "Q3 25", books: 0 },
  { quarter: "Q4 25", books: 0 },
  { quarter: "Q1 26", books: 0 },
  { quarter: "Q2 26", books: 4 },
  { quarter: "Q3 26", books: 3 },
];
