export type FormKind = "volunteer" | "foster" | "csr" | null;

export type Program = { slug: string; title: string; kicker: string; summary: string; points: string[]; form?: FormKind; settingKey?: string };

export const programs: Program[] = [
  { slug: "vision", kicker: "Our Vision", title: "A world where every pet is safe, healthy and loved", summary: "We imagine one global family where no animal is left without care, shelter or dignity.", points: ["Compassion for every species", "Responsible, informed pet guardianship", "Communities that protect street and companion animals alike"] },
  { slug: "mission", kicker: "Our Mission", title: "Rescue, heal and rehome — with transparency", summary: "GeoPetCare Foundation works to rescue animals in distress, provide medical care, support community feeding and sterilization, and connect animals with loving homes.", points: ["Rescue and emergency medical support", "Humane population management", "Adoption and fostering", "Public education and awareness"] },
  { slug: "promise", kicker: "Our Promise", title: "Honesty in everything we share", summary: "We will never publish numbers, stories or achievements that are not genuine. Every statistic on this site is entered by our team from real records.", points: ["No fake statistics or testimonials", "Clear records for every rescued animal", "Responsible use of every contribution"] },
  { slug: "rescue", kicker: "Rescue", title: "Rescue for animals in distress", summary: "Our rescue work focuses on injured, abandoned and at-risk animals, bringing them to safety and connecting them with medical care.", points: ["Assessment of animals in distress", "Safe handling and transport", "Coordination with veterinary partners", "Follow-up and rehabilitation"], settingKey: "emergency_number" },
  { slug: "emergency-care", kicker: "Emergency Medical Care", title: "Urgent treatment when it matters most", summary: "Emergency medical care aims to stabilise injured or critically ill animals and support their recovery.", points: ["First aid and stabilisation", "Treatment through qualified veterinarians", "Post-treatment recovery care"], settingKey: "emergency_number" },
  { slug: "community-feeding", kicker: "Community Feeding", title: "Nourishing animals in our neighbourhoods", summary: "Community feeding supports street animals with regular, hygienic nutrition, working with local volunteers.", points: ["Regular, clean feeding points", "Volunteer feeding routes", "Clean water access"] },
  { slug: "sterilization", kicker: "Sterilization Programme", title: "Humane, sustainable population care", summary: "Sterilization reduces suffering, improves animal health and supports peaceful coexistence with communities.", points: ["Safe sterilization through veterinarians", "Post-operative care", "Vaccination alongside sterilization"] },
  { slug: "ambulance", kicker: "Animal Ambulance", title: "Getting help to animals faster", summary: "The animal ambulance service is designed to move injured animals safely to treatment.", points: ["Safe animal transport", "Basic on-board first aid", "Coordinated hand-over to vets"], settingKey: "emergency_number" },
  { slug: "foster", kicker: "Foster Programme", title: "Open your home, temporarily", summary: "Foster parents give recovering or young animals a safe, loving space until they find a permanent home.", points: ["Short and long-term fostering", "Guidance from our team", "A direct path to adoption"], form: "foster" },
  { slug: "volunteer", kicker: "Volunteer With Us", title: "Lend your hands and heart", summary: "Whether you can rescue, feed, foster, treat or organise — there is a place for you.", points: ["Animal rescue", "Feeding routes", "Events and awareness", "Veterinary and student roles"], form: "volunteer" },
  { slug: "csr", kicker: "Corporate CSR", title: "Partner with purpose", summary: "Organisations can support animal welfare through structured CSR engagement — feeding zones, medical care, sterilization drives and employee volunteering.", points: ["Programme sponsorship", "Employee volunteering", "Awareness campaigns"], form: "csr" },
  { slug: "schools", kicker: "Schools & Colleges", title: "Teaching kindness early", summary: "Information about our schools and colleges programme is published here once approved by our team.", points: [], settingKey: "content_schools" },
  { slug: "paws-of-india", kicker: "Paws of India™", title: "Paws of India™", summary: "Information about the Paws of India™ initiative is published here once approved by our team.", points: [], settingKey: "content_paws_of_india" },
  { slug: "roadmap", kicker: "Our Roadmap", title: "Where we are headed", summary: "Our roadmap is published here once approved by our team.", points: [], settingKey: "content_roadmap" },
];

export const sponsorLevels = [
  [500, "Feed a rescued animal"],
  [2500, "Vaccinate and treat one rescued animal"],
  [5000, "Sponsor one month of rehabilitation"],
  [10000, "Sponsor sterilization and complete medical care"],
  [25000, "Sponsor a community feeding zone"],
  [50000, "Sponsor a GeoPet Rescue Vehicle for one day"],
  [100000, "Become a GeoPetCare City Welfare Partner"],
] as const;

export const statKeys = [
  ["stat_rescued", "Animals Rescued"], ["stat_treated", "Animals Treated"], ["stat_fed", "Animals Fed"],
  ["stat_vaccinated", "Animals Vaccinated"], ["stat_sterilized", "Animals Sterilized"], ["stat_adopted", "Animals Adopted"],
  ["stat_fostered", "Animals Fostered"], ["stat_volunteers", "Volunteers"], ["stat_feeding_locations", "Feeding Locations"],
  ["stat_cities", "Cities Covered"], ["stat_other", "Other statistics"],
] as const;

export const donationKeys = [
  ["donate_qr", "Payment QR image"], ["donate_account_name", "Account Name"], ["donate_bank_name", "Bank Name"],
  ["donate_address", "Address"], ["donate_account_number", "Account Number"], ["donate_ifsc", "IFSC"],
  ["donate_upi", "UPI / payment information"], ["donate_other", "Other payment information"],
] as const;

export const contentKeys = [
  ["emergency_number", "Official emergency number"], ["contact_email", "Official contact email"],
  ["content_paws_of_india", "Paws of India™ content"], ["content_schools", "Schools & Colleges content"], ["content_roadmap", "Our Roadmap content"],
] as const;

export const submissionTypes = ["General", "Contact", "Volunteer", "Foster", "Adoption", "CSR", "Sponsorship"] as const;
export const statuses = ["Pending", "In Review", "Approved", "Rejected", "Closed"] as const;
