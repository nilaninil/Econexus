import { User, DailyReport } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'inst-1',
    email: 'marriot@ecocity.ai',
    role: 'institution',
    name: 'Grand Plaza Resort',
    type: 'Resort',
    phone: '555-0101',
    address: '101 Horizon Blvd',
    zone: 'Zone A',
  },
  {
    id: 'inst-1b',
    email: 'sapphire@ecocity.ai',
    role: 'institution',
    name: 'Sapphire Regency Resort',
    type: 'Resort',
    phone: '555-0121',
    address: '202 Ocean Breeze Lane',
    zone: 'Zone C',
  },
  {
    id: 'inst-1c',
    email: 'crestview@ecocity.ai',
    role: 'institution',
    name: 'Crestview Elite Resort',
    type: 'Resort',
    phone: '555-0131',
    address: '77 Hillscrest Ave',
    zone: 'Zone B',
  },
  {
    id: 'inst-2',
    email: 'royal@ecocity.ai',
    role: 'institution',
    name: 'Royal Diner',
    type: 'Restaurant',
    phone: '555-0102',
    address: '404 Food Street',
    zone: 'Zone B',
  },
  {
    id: 'inst-2b',
    email: 'greensprout@ecocity.ai',
    role: 'institution',
    name: 'Green Sprout Cafe',
    type: 'Restaurant',
    phone: '555-0122',
    address: '15 Leafy Plaza',
    zone: 'Zone A',
  },
  {
    id: 'inst-2c',
    email: 'goldenwok@ecocity.ai',
    role: 'institution',
    name: 'Golden Wok Kitchen',
    type: 'Restaurant',
    phone: '555-0132',
    address: '89 Lantern Highway',
    zone: 'Zone D',
  },
  {
    id: 'inst-4',
    email: 'statecollege@ecocity.ai',
    role: 'institution',
    name: 'Metro State University',
    type: 'College',
    phone: '555-0104',
    address: '202 Campus Road',
    zone: 'Zone A',
  },
  {
    id: 'inst-4b',
    email: 'horizontech@ecocity.ai',
    role: 'institution',
    name: 'Horizon Tech Institute',
    type: 'College',
    phone: '555-0124',
    address: '35 Innovation Blvd',
    zone: 'Zone D',
  },
  {
    id: 'inst-4c',
    email: 'westbay@ecocity.ai',
    role: 'institution',
    name: 'West Bay College',
    type: 'College',
    phone: '555-0134',
    address: '400 Shoreline Drive',
    zone: 'Zone C',
  },
  {
    id: 'inst-5',
    email: 'hostelhub@ecocity.ai',
    role: 'institution',
    name: 'Greenfield Student Hostel',
    type: 'Hostel',
    phone: '555-0105',
    address: '210 Dorm Lane',
    zone: 'Zone D',
  },
  {
    id: 'inst-5b',
    email: 'oakridge@ecocity.ai',
    role: 'institution',
    name: 'Oakridge Dormitory Hub',
    type: 'Hostel',
    phone: '555-0125',
    address: '44 Timberland Road',
    zone: 'Zone A',
  },
  {
    id: 'inst-5c',
    email: 'coastalrooms@ecocity.ai',
    role: 'institution',
    name: 'Coastal Campus Dorms',
    type: 'Hostel',
    phone: '555-0135',
    address: '88 Lighthouse Pt',
    zone: 'Zone C',
  },
  {
    id: 'inst-6',
    email: 'grandvenue@ecocity.ai',
    role: 'institution',
    name: 'Apex Celebration Hall',
    type: 'Event Hall',
    phone: '555-0106',
    address: '808 Festive Plaza',
    zone: 'Zone C',
  },
  {
    id: 'inst-6b',
    email: 'regencyballroom@ecocity.ai',
    role: 'institution',
    name: 'Regency Imperial Ballroom',
    type: 'Event Hall',
    phone: '555-0126',
    address: '15 Goldcrest Pkwy',
    zone: 'Zone B',
  },
  {
    id: 'inst-6c',
    email: 'greenmeadow@ecocity.ai',
    role: 'institution',
    name: 'Green Meadow Events',
    type: 'Event Hall',
    phone: '555-0136',
    address: '500 Pastoral Road',
    zone: 'Zone A',
  },
  {
    id: 'admin-1',
    email: 'admin@ecocity.ai',
    role: 'city_admin',
    name: 'Dr. Sarah Carter',
    phone: '555-0001',
    zone: 'Zone A',
  },
  {
    id: 'officer-1',
    email: 'officer@ecocity.ai',
    role: 'municipality_officer',
    name: 'Officer John Martinez',
    phone: '555-0002',
    zone: 'Zone B',
  }
];

// Generate 30 days of consistent historical data for these institutions
export function generateMockReports(): DailyReport[] {
  const reports: DailyReport[] = [];
  const start = new Date('2026-05-17T08:00:00');
  const end = new Date('2026-06-16T08:00:00'); // Let's stop at current date June 16, 2026

  const institutions = MOCK_USERS.filter(u => u.role === 'institution');

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday

    institutions.forEach(inst => {
      let baseVisitors = 100;
      let foodPreparedPerVisitor = 0.5; // kg
      let wasteFactor = 0.2; // 20% waste by default
      let waterBase = 15; // liters per visitor
      let electricityBase = 2.5; // kWh per visitor

      // Adjust based on institution type and day of week
      switch (inst.type) {
        case 'Resort':
          baseVisitors = 150;
          if (dayOfWeek === 5 || dayOfWeek === 6) {
            baseVisitors *= 1.4; // 40% more visitors on weekends
            wasteFactor = 0.25; // More waste on high occupancy
          }
          break;
        case 'Restaurant':
          baseVisitors = 80;
          if (dayOfWeek === 0 || dayOfWeek === 6) { // weekend spikes
            baseVisitors *= 1.8;
            wasteFactor = 0.28;
          } else {
            baseVisitors *= 0.8;
          }
          break;
        case 'College':
          baseVisitors = 500;
          foodPreparedPerVisitor = 0.3;
          wasteFactor = 0.18;
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            baseVisitors = 20; // almost closed on weekends
            wasteFactor = 0.05;
          } else if (dateStr >= '2026-05-25' && dateStr <= '2026-06-03') {
            // Exam period, reduced attendance or higher stress
            baseVisitors *= 0.7; // Exam period reduction
          }
          break;
        case 'Hostel':
          baseVisitors = 120;
          foodPreparedPerVisitor = 0.45;
          wasteFactor = 0.16;
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            baseVisitors *= 0.85; // some students go home
          }
          break;
        case 'Event Hall':
          // Extreme weekend pattern
          if (dayOfWeek === 5 || dayOfWeek === 6) {
            baseVisitors = 300 + Math.floor(Math.random() * 150);
            wasteFactor = 0.32; // lots of waste at events
          } else {
            baseVisitors = 0; // mostly closed on weedays
            wasteFactor = 0;
          }
          break;
      }

      if (baseVisitors === 0) return; // No report if closed

      // Add small randomness (up to 15%)
      const noise = 0.85 + Math.random() * 0.3;
      const visitors = Math.round(baseVisitors * noise);
      const foodPrepared = parseFloat((visitors * foodPreparedPerVisitor * (0.9 + Math.random() * 0.2)).toFixed(1));
      
      // Consumption is prepared * (1 - wasteFactor) with some randomness
      const foodWastedValue = foodPrepared * wasteFactor * (0.8 + Math.random() * 0.4);
      const foodWasted = parseFloat(Math.min(foodWastedValue, foodPrepared * 0.8).toFixed(1));
      const foodConsumed = parseFloat((foodPrepared - foodWasted).toFixed(1));

      // Separate Waste categories
      const foodWaste = parseFloat((foodWasted * 0.85).toFixed(1)); // 85% of wasted food is organic kitchen waste
      const organicWaste = parseFloat((foodWasted * 0.1 + Math.random() * 5).toFixed(1)); // garden etc
      const plasticWaste = parseFloat((visitors * 0.05 * (inst.type === 'Resort' || inst.type === 'Restaurant' ? 1.5 : 1)).toFixed(1));
      const paperWaste = parseFloat((visitors * 0.04 * (inst.type === 'College' ? 2 : 1)).toFixed(1));
      const otherWaste = parseFloat((visitors * 0.02).toFixed(1));

      // Resources
      const waterUsage = Math.round(visitors * waterBase * (0.85 + Math.random() * 0.3));
      const electricityUsage = Math.round(visitors * electricityBase * (0.85 + Math.random() * 0.3));

      reports.push({
        id: `rep-${inst.id}-${dateStr}`,
        institutionId: inst.id,
        institutionName: inst.name,
        institutionType: inst.type as any,
        zone: inst.zone as any,
        date: dateStr,
        foodPrepared,
        foodConsumed,
        foodWasted,
        visitors,
        foodWaste,
        plasticWaste,
        paperWaste,
        organicWaste,
        otherWaste,
        waterUsage,
        electricityUsage
      });
    });
  }

  return reports;
}

export const CALENDAR_EVENTS = [
  { date: '2026-05-25', name: 'Memorial Day (Holiday)', type: 'holiday' },
  { date: '2026-05-30', name: 'Zonal Food Festival', type: 'festival' },
  { date: '2026-06-05', name: 'World Environment Day Prep', type: 'festival' },
  { date: '2026-06-14', name: 'Annual Sports Day Meet', type: 'festival' },
];

export const ZONE_COORDINATES = {
  'Zone A': { lat: 10, lng: 15, name: 'North District (Zone A)', desc: 'Residential & Academic Sector' },
  'Zone B': { lat: 14, lng: 35, name: 'East Central (Zone B)', desc: 'Commercial & Restaurant Hub' },
  'Zone C': { lat: 45, lng: 20, name: 'South Bay (Zone C)', desc: 'Entertainment, Hospitality & Events Area' },
  'Zone D': { lat: 30, lng: 48, name: 'West Industrial (Zone D)', desc: 'High Density Residential & Hostels' }
};
