const companies = [
  "Aster Health", "Quanta Labs", "Luma & Co.", "Northridge Group", "Sable Works",
  "Echelon Systems", "Altitude Studio", "Bright Path", "Keystone Digital", "Vanta Field",
  "Coda Finance", "Orbit Networks", "Harbor & Pine", "Lattice North", "Morrow Studio",
  "Delta Grove", "Cinder Health", "Atlas Ridge", "Pacific Grid", "Sierra Cloud",
];
const owners = ["Maya Chen", "Leo Martin", "Sofia Reyes", "Avery Brooks", "Jordan Lee"];
const segments = ["Enterprise", "Mid-market", "SMB"];
const sources = ["Inbound", "Outbound", "Partners", "Product-led"];

function initialsFor(company) {
  return company.split(/[\s&.]+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function stageFor(index) {
  const position = index % 12;
  if (position < 3) return "Discovery";
  if (position < 6) return "Proposal";
  if (position < 10) return "Negotiation";
  return "Closed won";
}

export function createSeedOpportunities() {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return Array.from({ length: 180 }, (_, index) => {
    const dayOffset = 89 - Math.floor(index / 2);
    const createdAt = new Date(today);
    createdAt.setDate(today.getDate() - dayOffset);
    createdAt.setHours(9 + index % 8, (index * 11) % 60, 0, 0);

    const updatedAt = new Date(createdAt);
    updatedAt.setHours(13 + index % 7, (index * 17) % 60, 0, 0);
    const company = companies[index % companies.length];
    const cycle = Math.floor(index / companies.length);

    return {
      seed: "nexusflow-v1",
      company: cycle === 0 ? company : `${company} ${cycle + 1}`,
      initials: initialsFor(company),
      owner: owners[(index * 3 + 1) % owners.length],
      segment: segments[(index * 5 + Math.floor(index / 9)) % segments.length],
      source: sources[(index * 7 + Math.floor(index / 6)) % sources.length],
      stage: stageFor(index),
      value: 28000 + (index * 7913 % 184000),
      previousValue: 25000 + (index * 7121 % 169000),
      createdAt,
      updatedAt,
    };
  });
}