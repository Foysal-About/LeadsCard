/* Site-wide settings. Change the occasion here to reuse the site for Eid,
   Pohela Boishakh, New Year, etc. — every page and card reads from this file. */
window.ECARD = {
  group: {
    name: "Western Group",
  },

  /* The companies people can make a card for. `name` is printed on the card,
     `short` is used for the wordmark on the "Corporate Blue" design,
     `logo` is shown on the company picker (`mark` letters stand in if it is missing),
     `color` is its accent. */
  companies: [
    {
      id: "western-engineering",
      name: "Western Engineering (Pvt.) Ltd.",
      short: "Western Engineering",
      mark: "WE",
      sector: "Civil works, hydraulic structures and land development since 1984",
      color: "#C8102E",
      logo: "assets/img/logos/western-engineering.png",
    },
    {
      id: "western-dredgetech",
      name: "Western Dredgetech",
      short: "Western Dredgetech",
      mark: "WD",
      sector: "Bangladesh's largest dredger fleet, for rivers, land and water infrastructure",
      color: "#0E9AA7",
      logo: "assets/img/logos/western-dredgetech.png",
    },
    {
      id: "tiger-cement",
      name: "Tiger Cement",
      short: "Tiger Cement",
      mark: "TC",
      sector: "Premium cement for bridges, flyovers and high-rises",
      color: "#F26B1D",
      logo: "assets/img/logos/tiger-cement.png",
    },
    {
      id: "tiger-concrete",
      name: "Tiger Concrete Products",
      short: "Tiger Concrete",
      mark: "TCP",
      sector: "Concrete products crafted with German precision",
      color: "#F26B1D",
      logo: "assets/img/logos/tiger-concrete.png",
    },
    {
      id: "western-jute",
      name: "Western Superior Jute Industries Ltd.",
      short: "Western Jute",
      mark: "WJ",
      sector: "Geo-textiles and eco-friendly jute products",
      color: "#1B7F3B",
      logo: "assets/img/logos/western-jute.png",
    },
    {
      id: "vincen",
      name: "Vincen Consultancy Pvt. Ltd.",
      short: "Vincen Consultancy",
      mark: "VC",
      sector: "Modern railway ticketing for millions of travellers",
      color: "#14B8B0",
      logo: "assets/img/logos/vincen.png",
    },
    {
      id: "western-overseas",
      name: "Western Overseas Ltd.",
      short: "Western Overseas",
      mark: "WO",
      sector: "Global careers and world-class travel solutions",
      color: "#D7192D",
      logo: "assets/img/logos/western-overseas.png",
    },
    {
      id: "impero",
      name: "The Impero Properties Ltd.",
      short: "Impero Properties",
      mark: "IP",
      sector: "Luxury living under the ZENITH brand",
      color: "#A8743F",
      logo: "assets/img/logos/impero.png",
    },
    {
      id: "leads",
      name: "LEADS Corporation Limited",
      short: "LEADS",
      mark: "LC",
      sector: "Core banking, ERP, HRM, healthcare and insurance software",
      color: "#1C9AD6",
      logo: "assets/img/logos/leads.jpg",
    },
    {
      id: "western-renewable",
      name: "Western Renewable Energy (Pvt.) Ltd.",
      short: "Western Renewable",
      mark: "WR",
      sector: "Clean, renewable energy for a greener Bangladesh",
      color: "#5DAA2F",
      logo: "assets/img/logos/western-renewable.png",
    }
  ],

  occasion: {
    tagline: "Durga Puja 2026",
    bangla: "শুভ শারদীয়া",
    greeting: "Shubho Sharodiya",
    message: "May Maa Durga bless you and your loved ones with joy, peace and prosperity.",
  },

  // Downloaded files are named "<filePrefix>-<company>-<your-name>.png".
  filePrefix: "puja-ecard-2026",

  placeholders: {
    name: "Your Name",
    designation: "Your Designation",
  },

  // Example people shown on the design carousel and the samples page.
  samples: [
    { card: "mandala", name: "Ananya Roy", designation: "Senior Engineer" },
    { card: "diya", name: "Tanvir Hasan", designation: "Project Manager" },
    { card: "marigold", name: "Nusrat Jahan", designation: "Business Analyst" },
    { card: "corporate", name: "Rafiq Ahmed", designation: "General Manager" },
    { card: "alpona", name: "Priya Saha", designation: "HR Executive" },
  ],
};
