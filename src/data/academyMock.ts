import type { AcademyVideo } from '../context/DataContext';

// Development-only mock dataset enabled when DEV && VITE_ACADEMY_MOCK === 'true'
// and the live academy_videos query returns no items.
export const ACADEMY_MOCK_VIDEOS: AcademyVideo[] = [
  {
    id: 'acad-mock-01',
    title: 'Getting started with Blockwork Quantity',
    description:
      'Learn how to configure multi-wall geometry, deduct door and window openings automatically, specify custom mortar bedding thickness, include bond-beam reinforcement schedules, and export audit-ready masonry bills of quantities directly to PDF and Excel for submittal review.',
    videoId: 'M7lc1UVf-VE',
    programId: 'con-01',
    categoryId: 'construction',
    sortOrder: 1,
    createdAt: '2026-11-15T10:00:00Z',
  },
  {
    id: 'acad-mock-02',
    title: 'Proportioning ACI Concrete Mixes in Batch Workflows',
    description:
      'Step through water-cement ratio selection, slump targets, aggregate moisture corrections, and trial batch yield checks in Concrete Mix.',
    videoId: 'M7lc1UVf-VE',
    programId: 'con-02',
    categoryId: 'construction',
    sortOrder: 2,
    createdAt: '2026-11-14T10:00:00Z',
  },
  {
    id: 'acad-mock-03',
    title: 'Isolated & Combined Footing Sizing Under ACI 318',
    description:
      'Verify soil bearing pressure envelopes, one-way beam shear, two-way punching shear perimeters, and flexural rebar spacing using Foundation Sizer.',
    videoId: 'M7lc1UVf-VE',
    programId: 'str-01',
    categoryId: 'structural',
    sortOrder: 3,
    createdAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'acad-mock-04',
    title: 'Checking Steel & RC Sections Against AISC 360 and EC2',
    description:
      'Compare biaxial bending interaction ratios, slender web limits, and deterministic clause-by-clause equation logs inside Section Checker.',
    videoId: 'M7lc1UVf-VE',
    programId: 'str-05',
    categoryId: 'structural',
    sortOrder: 4,
    createdAt: '2026-11-12T10:00:00Z',
  },
  {
    id: 'acad-mock-05',
    title: 'Terzaghi & Meyerhof Shallow Bearing Capacity Verification',
    description:
      'Enter multi-layer soil profiles, water table depths, and eccentric column loads to compute allowable bearing capacity and safety factors.',
    videoId: 'M7lc1UVf-VE',
    programId: 'geo-01',
    categoryId: 'geotechnical',
    sortOrder: 5,
    createdAt: '2026-11-11T10:00:00Z',
  },
  {
    id: 'acad-mock-06',
    title: 'Multi-Slice Slope Stability Modeling with Phreatic Surfaces',
    description:
      'Run Bishop Simplified and Morgenstern-Price limit equilibrium sweeps to locate critical slip circles and seismic pseudo-static factors.',
    videoId: 'M7lc1UVf-VE',
    programId: 'geo-04',
    categoryId: 'geotechnical',
    sortOrder: 6,
    createdAt: '2026-11-10T10:00:00Z',
  },
  {
    id: 'acad-mock-07',
    title: 'Open Channel Manning Hydraulics & Normal Depth Checks',
    description:
      'Analyze trapezoidal, rectangular, and circular conduits across partial-full depths, supercritical transitions, and Froude regime checks.',
    videoId: 'M7lc1UVf-VE',
    programId: 'wtr-01',
    categoryId: 'water-resources',
    sortOrder: 7,
    createdAt: '2026-11-09T10:00:00Z',
  },
  {
    id: 'acad-mock-08',
    title: 'Balancing Looped Municipal Pipe Networks with Hardy Cross',
    description:
      'Configure node demands, pump curves, Hazen-Williams roughness factors, and residual pressure checks across looped water mains.',
    videoId: 'M7lc1UVf-VE',
    programId: 'wtr-03',
    categoryId: 'water-resources',
    sortOrder: 8,
    createdAt: '2026-11-08T10:00:00Z',
  },
  {
    id: 'acad-mock-09',
    title: 'AASHTO Flexible & Rigid Pavement ESAL Layer Design',
    description:
      'Translate multi-axle traffic spectra into 18-kip ESALs, structural numbers, and minimum asphalt-concrete layer thicknesses.',
    videoId: 'M7lc1UVf-VE',
    programId: 'trn-03',
    categoryId: 'transportation',
    sortOrder: 9,
    createdAt: '2026-11-07T10:00:00Z',
  },
  {
    id: 'acad-mock-10',
    title: 'Bowditch & Least-Squares Traverse Closure Adjustments',
    description:
      'Import field total-station observations, distribute angular misclosures, balance coordinates, and export closed survey sheets.',
    videoId: 'M7lc1UVf-VE',
    programId: 'srv-05',
    categoryId: 'surveying',
    sortOrder: 10,
    createdAt: '2026-11-06T10:00:00Z',
  },
];
