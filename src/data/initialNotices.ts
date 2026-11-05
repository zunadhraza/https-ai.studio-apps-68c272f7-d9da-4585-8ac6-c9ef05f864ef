import { Notice } from '../types/notice';

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: 'Final Semester Examination Schedule & Hall Ticket Release (May 2026)',
    department: 'GENERAL',
    description: 'The Controller of Examinations hereby informs all 4th year B.Tech and M.Tech students that the regular and supplementary examination timetables for May 2026 have been published on the student ERP portal. Hall tickets can be downloaded from 15th May onwards upon clearance of library dues and tuition fees. Students must report to examination halls 20 minutes prior with student ID cards and printed hall tickets. Mobile phones and electronic smartwatches are strictly prohibited.',
    author: 'Controller of Examinations',
    publishedDate: '2026-05-02',
    isBookmarked: true,
    priority: 'urgent',
    views: 1240,
    contactEmail: 'coe@college.edu',
    location: 'Examination Cell, Admin Block'
  },
  {
    id: 'notice-2',
    title: 'Microsoft & TCS On-Campus Placement Drive for 2026 Graduating Batch',
    department: 'CSE',
    description: 'The Training and Placement Cell is organizing the on-campus recruitment drive for Microsoft (Software Development Engineer - Cloud & AI) and Tata Consultancy Services (TCS Digital/Prime). Eligible branches: CSE, ECE, EEE with CGPA 7.5 and above with no active backlogs. The online coding assessment is scheduled for May 12th in Central Computing Lab 1 to 4. Interested candidates must register before May 8th 5:00 PM via the campus placement portal link.',
    author: 'Dr. V. Ramanathan (Head, Placement Cell)',
    publishedDate: '2026-05-01',
    isBookmarked: true,
    priority: 'high',
    views: 980,
    contactEmail: 'placements@college.edu',
    location: 'Central Seminar Hall & Lab 3'
  },
  {
    id: 'notice-3',
    title: 'Hands-on Workshop on Embedded Systems & Edge AI with RISC-V',
    department: 'ECE',
    description: 'The Department of Electronics and Communication Engineering in collaboration with IEEE Student Branch is hosting a two-day national workshop on "Edge AI inference on RISC-V Microcontrollers". Topics cover hardware architecture, FreeRTOS, TinyML deployment, and hardware-software co-design. Practical kits will be provided. Certificate of merit for top 3 project implementations. Registration fee: ₹300 for IEEE members, ₹500 for non-members.',
    author: 'Prof. Ananya Sen (ECE Dept)',
    publishedDate: '2026-04-28',
    isBookmarked: false,
    priority: 'normal',
    views: 450,
    contactEmail: 'ece.workshops@college.edu',
    location: 'VLSI & IoT Research Lab, ECE Block'
  },
  {
    id: 'notice-4',
    title: 'EV Battery Management Systems Seminar & Industrial Prototype Demo',
    department: 'EEE',
    description: 'Department of Electrical & Electronics Engineering invites students and faculty to an industrial expert lecture on "Next-Gen Battery Management Systems (BMS) for Electric Vehicles and Renewable Storage" by Mr. Rajesh Kulkarni, Chief Engineer at Ather Energy. Live demonstration of lithium-ion thermal balancing and regenerative braking test rigs. All 3rd and 4th year EEE/MECH students are requested to attend.',
    author: 'Dr. Suresh Kumar (HOD, EEE)',
    publishedDate: '2026-04-25',
    isBookmarked: false,
    priority: 'normal',
    views: 310,
    contactEmail: 'eee.events@college.edu',
    location: 'Auditorium 2, Tech Park'
  },
  {
    id: 'notice-5',
    title: 'SAE BAJA 2026 All-Terrain Vehicle Fabrication Team Selections',
    department: 'MECH',
    description: 'Team Veloce (SAE Collegiate Club - Mechanical Engineering) announces recruitment trials for BAJA SAE India 2026. Roles available: Roll Cage CAD/CAE Designers, Suspension & Steering Analysis, Powertrain & CVT tuning, and Sponsorship Leads. Open to 1st, 2nd, and 3rd year students passionate about automotive engineering. Screening test on SolidWorks and basic mechanics will take place on Saturday.',
    author: 'Mechanical Engineering Society',
    publishedDate: '2026-04-22',
    isBookmarked: false,
    priority: 'normal',
    views: 620,
    contactEmail: 'sae.mech@college.edu',
    location: 'Automotive Workshop, South Block'
  },
  {
    id: 'notice-6',
    title: 'Site Visit: Metro Rail Underground Tunneling & Soil Mechanics Field Study',
    department: 'CIVIL',
    description: 'A mandatory educational field site study has been scheduled for 3rd Year B.Tech Civil Engineering students to the underground Metro Phase-2 Tunnel Boring Machine (TBM) casting yard and ventilation shaft site. Transportation buses will depart from the main gate at 8:30 AM sharp. Students must wear safety boots and bring hard hats (provided by department). Submit site report within 7 days for internal assessment.',
    author: 'Prof. K. Venkatesh (Civil Dept Coordinator)',
    publishedDate: '2026-04-18',
    isBookmarked: false,
    priority: 'normal',
    views: 290,
    contactEmail: 'civil.fieldtrips@college.edu',
    location: 'Departs from Main College Arch'
  },
  {
    id: 'notice-7',
    title: 'Annual College Cultural & Technical Fest "SPARK 2026" Core Committee Call',
    department: 'GENERAL',
    description: 'The Student Affairs Council invites enthusiastic student volunteers for SPARK 2026 organizing committees including Stage & Logistics, Media & PR, Finance & Sponsorship, Hackathon Logistics, and Guest Hospitality. Interviews will be conducted by faculty advisors. Represent your department and contribute to making this the biggest inter-college festival of the year!',
    author: 'Dean of Student Affairs',
    publishedDate: '2026-04-15',
    isBookmarked: false,
    priority: 'normal',
    views: 1420,
    contactEmail: 'studentaffairs@college.edu',
    location: 'Student Activity Centre (SAC)'
  }
];
