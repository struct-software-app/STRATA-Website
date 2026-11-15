export interface AppItem {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  standards: string[];
  features: string[];
  specs: { label: string; value: string }[];
  price: number;
  monthlyPrice: number;
  iconName: string;
  version: string;
  isPopular?: boolean;
}

export interface CategoryItem {
  name: string;
  slug: string;
  code: string;
  shortDescription: string;
  detailedDescription: string;
  iconName: string;
  appsCount: number;
}

export const CATEGORIES: CategoryItem[] = [
  {
    name: 'Construction',
    slug: 'construction',
    code: 'CON',
    shortDescription: 'Quantity takeoff, material scheduling, batch mix verification, and earthwork calculations.',
    detailedDescription: 'Engineering tools built for project managers, estimators, and site engineers. Automate quantity takeoff calculations, concrete batch proportioning, formwork area tracking, and rebar tonnage estimation with direct CAD and Excel integration.',
    iconName: 'Hammer',
    appsCount: 5,
  },
  {
    name: 'Environmental',
    slug: 'environmental',
    code: 'ENV',
    shortDescription: 'Dispersion modeling, effluent discharge limits, treatment unit sizing, and environmental monitoring.',
    detailedDescription: 'Rigorous calculation engines for environmental engineers and compliance officers. Model Gaussian plume atmospheric dispersion, compute biological and chemical wastewater treatment units, verify BOD/COD compliance, and generate EPA-compliant regulatory logs.',
    iconName: 'Leaf',
    appsCount: 5,
  },
  {
    name: 'Geotechnical',
    slug: 'geotechnical',
    code: 'GEO',
    shortDescription: 'Shallow & deep bearing capacity, borehole stratification, slope stability, and consolidation settlement.',
    detailedDescription: 'Soil mechanics computational workspace conforming to Eurocode 7, US Army Corps, and ASTM standards. Perform multi-layer limit equilibrium slope stability (Bishop/Morgenstern-Price), Terzaghi & Hansen bearing capacity, and automated borehole boring log drafting.',
    iconName: 'Mountain',
    appsCount: 5,
  },
  {
    name: 'Structural',
    slug: 'structural',
    code: 'STR',
    shortDescription: 'Section capacity checking, load combinations (ASCE 7 / EN 1990), automated model generation, and rebar scheduling.',
    detailedDescription: 'Precision structural analysis and element verification software. Verify steel and reinforced concrete sections against ACI 318, AISC 360, and Eurocode 2/3. Automate FEA load combination generation and extract schedules from BIM models.',
    iconName: 'Building2',
    appsCount: 5,
  },
  {
    name: 'Surveying',
    slug: 'surveying',
    code: 'SRV',
    shortDescription: 'Traverse adjustment, grid-to-ground transformations, 3D point clouds, and cut/fill DTM volume estimation.',
    detailedDescription: 'Geodetic survey processing and field engineering tools. Perform Bowditch & Least-Squares traverse balancing, transformation between WGS84 and local engineering coordinates, TIN surface cut/fill comparisons, and LiDAR point cloud subsampling.',
    iconName: 'Compass',
    appsCount: 5,
  },
  {
    name: 'Transportation',
    slug: 'transportation',
    code: 'TRN',
    shortDescription: 'HCM-based Level of Service, Webster signal timing, AASHTO pavement thickness, and geometric road alignment.',
    detailedDescription: 'Transportation and traffic engineering tools adhering to Highway Capacity Manual (HCM 6th Edition) and AASHTO Green Book. Compute intersection Level of Service, design flexible and rigid pavement structures, and coordinate multi-phase traffic signals.',
    iconName: 'Navigation',
    appsCount: 5,
  },
  {
    name: 'Water Resources',
    slug: 'water-resources',
    code: 'WTR',
    shortDescription: 'Open channel hydraulic capacity, Hardy Cross pipe networks, SCS runoff hydrographs, and peak water demand.',
    detailedDescription: 'Hydrology and hydraulics solvers for municipal infrastructure and flood protection. Calculate Manning open-channel profiles, looped pressurized water distribution networks via Hardy Cross / EPANET core, rational and SCS unit hydrographs, and peak municipal water demand.',
    iconName: 'Droplet',
    appsCount: 5,
  },
];

export const APPS: AppItem[] = [
  // 1. CONSTRUCTION
  {
    id: 'con-01',
    name: 'Blockwork Quantity',
    slug: 'blockwork-quantity',
    categorySlug: 'construction',
    categoryName: 'Construction',
    shortDescription: 'Automated CMU block counts, mortar volume calculations, and structural lintel deduction.',
    fullDescription: 'Comprehensive masonry takeoff engine supporting CMU, clay bricks, and ACC lightweight blocks. Calculates exact net wall areas with door/window opening deductions, mortar bedding volume, joint reinforcement, and structural bond-beam requirements with waste margin presets.',
    standards: ['ASTM C90', 'BS EN 771', 'ACI 530/TMS 402'],
    features: [
      'Multi-wall batch entry with custom opening deduction geometry',
      'Dynamic mortar volume calculator with customizable joint thickness (8mm - 15mm)',
      'Bond beam and lintel reinforcement inclusion logic',
      'Export detailed schedule to Excel, CSV, and formatted PDF reports',
      'Preset library for standard metric and imperial block sizes'
    ],
    specs: [
      { label: 'Calculation Engine', value: 'Geometric Takeoff Solver v3.2' },
      { label: 'Unit Systems', value: 'Metric (SI) & US Customary' },
      { label: 'Output Formats', value: 'PDF, XLSX, CSV, DXF Table' },
      { label: 'Offline Execution', value: '100% Standalone (No Cloud Required)' }
    ],
    price: 189,
    monthlyPrice: 19,
    iconName: 'Grid',
    version: '2.4.1',
    isPopular: true
  },
  {
    id: 'con-02',
    name: 'Concrete Mix',
    slug: 'concrete-mix',
    categorySlug: 'construction',
    categoryName: 'Construction',
    shortDescription: 'ACI 211.1 & BS 5328 volumetric concrete mix design, aggregate moisture compensation, and batching logs.',
    fullDescription: 'Professional batching mix design workbench. Determines target mean compressive strength, water-cementitious materials ratio (w/cm), absolute volume aggregate proportions, and dynamic batch adjustments based on real-time aggregate stockpile moisture measurements.',
    standards: ['ACI 211.1-91', 'BS 5328', 'IS 10262:2019', 'ASTM C143 / C39'],
    features: [
      'Target mean strength calculation based on standard deviation logs',
      'Slump-to-water demand correlation with chemical water reducer inputs',
      'Coarse and fine aggregate sieve curve blend optimization (Coarseness Factor Chart)',
      'Instant stockpile moisture compensation for batch plant dispatch ticketing',
      'Yield and air void content volumetric verification'
    ],
    specs: [
      { label: 'Methodologies', value: 'ACI Absolute Volume, British DOE, IS Method' },
      { label: 'Compressive Target', value: '10 MPa to 100 MPa (1500 to 14,500 psi)' },
      { label: 'Admixture Modeling', value: 'Superplasticizers, Retarders, Silica Fume' },
      { label: 'Export Options', value: 'Batch Sheets, Lab Certification PDF, CSV' }
    ],
    price: 249,
    monthlyPrice: 25,
    iconName: 'Box',
    version: '3.1.0'
  },
  {
    id: 'con-03',
    name: 'Earthwork Volume',
    slug: 'earthwork-volume',
    categorySlug: 'construction',
    categoryName: 'Construction',
    shortDescription: 'Cross-section end area and prismatic grid-cell volume calculator with cut/fill shrink/swell factors.',
    fullDescription: 'High-speed volumetric computation tool for site excavation, foundation trenches, and road embankments. Imports survey station elevations, applies configurable soil bulking/shrinkage factors, and generates mass-haul balancing tables.',
    standards: ['AASHTO Cut & Fill Guide', 'USACE Earthwork EM 1110-2-1911'],
    features: [
      'Average End Area and Prismoidal volume algorithms',
      'Mass-haul diagram plotting with haul distance balance points',
      'Soil cut shrink and fill swell factor application matrix',
      'Direct import from CSV XYZ station coordinates',
      'Detailed station-by-station tabular report generation'
    ],
    specs: [
      { label: 'Algorithms', value: 'Average End Area, Prismoidal Formula' },
      { label: 'Max Data Points', value: '500,000 Station Nodes per Project' },
      { label: 'Diagrams', value: 'Mass-Haul Curve & Volume Summary Profiles' },
      { label: 'Platform Run', value: 'Native Windows Desktop x64' }
    ],
    price: 289,
    monthlyPrice: 29,
    iconName: 'Layers',
    version: '2.8.4',
    isPopular: true
  },
  {
    id: 'con-04',
    name: 'Formwork Area',
    slug: 'formwork-area',
    categorySlug: 'construction',
    categoryName: 'Construction',
    shortDescription: 'Surface contact area takeoff for slabs, columns, beams, and shear walls with stripping schedule.',
    fullDescription: 'Streamlined formwork estimation suite. Automatically determines exact concrete contact surface areas for suspended slabs, rectangular/circular columns, drop panels, spandrel beams, and retaining walls with vertical height staging breakdowns.',
    standards: ['ACI 347R-14 (Guide to Formwork)', 'DIN 18218 Concrete Pressure'],
    features: [
      'Parametric input for structural elements (isolated columns, continuous beams, slab soffits)',
      'Automated joint and beam-column intersection deductions',
      'Plywood sheet utilization and timber stud spacing recommendations',
      'Lateral fresh concrete pressure calculations per ACI 347R',
      'Full material bill of quantities (plywood, walers, props, tie rods)'
    ],
    specs: [
      { label: 'Pressure Standard', value: 'ACI 347 / CIRIA Report 108' },
      { label: 'Geometry Types', value: 'Prismatic, Cylindrical, T-Beams, Flanged' },
      { label: 'Report Styles', value: 'Subcontractor BOQ & Formwork Schedule' },
      { label: 'Execution Mode', value: 'Local Desktop Engine' }
    ],
    price: 199,
    monthlyPrice: 20,
    iconName: 'Square',
    version: '2.0.2'
  },
  {
    id: 'con-05',
    name: 'Steel Weight',
    slug: 'steel-weight',
    categorySlug: 'construction',
    categoryName: 'Construction',
    shortDescription: 'Standard rebar BBS schedule generator, structural shape unit weights, and scrap optimization.',
    fullDescription: 'Complete Bar Bending Schedule (BBS) and structural steel tonnage engine. Supports international rebar shape codes (BS 8666, ACI 315), calculates standard lap lengths, hook allowances, cut-loss optimization, and structural profile tonnage (W, UB, UC, HSS, Channels).',
    standards: ['BS 8666:2020', 'ACI 315 / CRSI', 'ASTM A615 / A706', 'ISO 4066'],
    features: [
      'Comprehensive library of standard shape codes with visual bending diagrams',
      'Automated lap length calculation based on concrete grade and bar diameter',
      'Linear stock length bar cutting optimization (1D Bin Packing to minimize scrap)',
      'Complete section database for hot-rolled beams, angles, and hollow sections',
      'BBS output with bar mark tags ready for fabrication tags'
    ],
    specs: [
      { label: 'Rebar Standards', value: 'Metric (8-40mm) & Imperial (#3-#18)' },
      { label: 'Stock Lengths', value: 'Configurable (6m, 12m, 40ft, 60ft)' },
      { label: 'Optimization Engine', value: 'Greedy Heuristic + Branch & Bound' },
      { label: 'Export Formats', value: 'Excel BBS, PDF Bar Cut Sheet, CSV' }
    ],
    price: 299,
    monthlyPrice: 30,
    iconName: 'FileSpreadsheet',
    version: '4.0.1',
    isPopular: true
  },

  // 2. ENVIRONMENTAL
  {
    id: 'env-01',
    name: 'Air Dispersion',
    slug: 'air-dispersion',
    categorySlug: 'environmental',
    categoryName: 'Environmental',
    shortDescription: 'Industrial stack Gaussian plume dispersion modeling with Pasquill-Gifford stability classes.',
    fullDescription: 'Desktop atmospheric dispersion calculation engine for industrial stacks, flare systems, and combustion vents. Computes ground-level pollutant concentrations (SO2, NOx, PM10) downwind across Pasquill-Gifford atmospheric stability classes (A through F) with terrain and building downwash checks.',
    standards: ['US EPA Industrial Source Complex (ISC3)', 'EPA 454/R-92-019'],
    features: [
      'Steady-state Gaussian plume equation solver for point and flare emission sources',
      'Pasquill-Gifford-Turner horizontal and vertical dispersion coefficient calculations',
      'Plume rise estimation via Briggs (1975) momentum and buoyancy formulations',
      'Downwind isopleth concentration mapping with regulatory threshold comparison',
      'Meteorological matrix sensitivity evaluation'
    ],
    specs: [
      { label: 'Stability Classes', value: 'A (Very Unstable) to F (Moderately Stable)' },
      { label: 'Downwind Extent', value: 'Up to 50 km Computational Domain' },
      { label: 'Averaging Periods', value: '1-hr, 8-hr, 24-hr, and Annual Equivalent' },
      { label: 'Compliance Checking', value: 'WHO Air Quality Guidelines & EPA NAAQS' }
    ],
    price: 349,
    monthlyPrice: 35,
    iconName: 'Wind',
    version: '2.2.0'
  },
  {
    id: 'env-02',
    name: 'Effluent Checker',
    slug: 'effluent-checker',
    categorySlug: 'environmental',
    categoryName: 'Environmental',
    shortDescription: 'Industrial & municipal wastewater discharge limits validator against EPA, WHO, and local standards.',
    fullDescription: 'Comprehensive compliance analysis workbench for environmental engineers. Compares lab sample wastewater analysis against regulatory threshold standards (BOD5, COD, TSS, TN, TP, heavy metals, pH, temperature). Generates non-conformance flags and discharge tax assessments.',
    standards: ['US EPA NPDES Limits', 'EU Urban Waste Water Directive 91/271/EEC', 'WHO Guidelines'],
    features: [
      'Preloaded international discharge standard database + customizable regional templates',
      'Statistical distribution analysis (95th percentile compliance, moving average)',
      'Exceedance alert generator with penalty risk estimation',
      'Multi-sampling point comparison dashboard',
      'Official regulatory environmental monitoring report generation'
    ],
    specs: [
      { label: 'Parameters Tracked', value: '45+ Chemical, Biological & Physical Metrics' },
      { label: 'Batch Processing', value: 'Multi-Station CSV / Lab Excel Import' },
      { label: 'Reporting', value: 'Formal Compliance PDF with Digital Sign-off' },
      { label: 'Data Security', value: 'Air-gapped Local Storage' }
    ],
    price: 219,
    monthlyPrice: 22,
    iconName: 'ShieldCheck',
    version: '1.9.5'
  },
  {
    id: 'env-03',
    name: 'Monitoring Reports',
    slug: 'monitoring-reports',
    categorySlug: 'environmental',
    categoryName: 'Environmental',
    shortDescription: 'Automated environmental compliance report compiler for air, noise, ground, and water quality.',
    fullDescription: 'Streamlined environmental reporting system. Combines sensor logs, field inspection notes, and laboratory test results into audit-ready Environmental Impact Assessment (EIA) compliance documents and monthly regulatory submittals.',
    standards: ['ISO 14001:2015', 'ASTM D5792 / E1527-21'],
    features: [
      'Unified data aggregation from multi-disciplinary field logs',
      'Automated time-series trend charts and exceedance event summaries',
      'Configurable executive summary and technical appendix generators',
      'Built-in template library for quarterly and annual EPA/EIA submissions',
      'Single-click PDF/A archival document export'
    ],
    specs: [
      { label: 'Document Standards', value: 'PDF/A Compliant for Official Archiving' },
      { label: 'Sensor Integration', value: 'CSV, TSV, XLSX Log File Import' },
      { label: 'Chart Engine', value: 'High-Resolution Vector Graphics' },
      { label: 'Audit Trail', value: 'Built-in Revision Tracking' }
    ],
    price: 189,
    monthlyPrice: 19,
    iconName: 'FileText',
    version: '2.1.3'
  },
  {
    id: 'env-04',
    name: 'Treatment Unit',
    slug: 'treatment-unit',
    categorySlug: 'environmental',
    categoryName: 'Environmental',
    shortDescription: 'Primary clarifier, activated sludge aeration tank, and secondary sedimentation sizing.',
    fullDescription: 'Process engineering calculator for wastewater treatment plants (WWTP). Sizes bar screens, grit chambers, primary sedimentation tanks, activated sludge aeration basins (F/M ratio, SRT, MCRT, oxygen requirements), and secondary clarifier surface overflow rates.',
    standards: ['Metcalf & Eddy 5th Edition', 'WEF Manual of Practice No. 8', 'ATV-DVWK-A 131'],
    features: [
      'Complete activated sludge mass balance and oxygen transfer kinetics',
      'Clarifier hydraulic surface loading rate and solids loading calculations',
      'Sludge production and waste activated sludge (WAS) volume prediction',
      'Blower air flow rate and diffuser layout requirement estimations',
      'Interactive hydraulic profile and tank volume summaries'
    ],
    specs: [
      { label: 'Process Types', value: 'Conventional Activated Sludge, SBR, MBBR, MBR' },
      { label: 'Kinetic Models', value: 'Monod Kinetics & Metcalf & Eddy Formulations' },
      { label: 'Output Tables', value: 'Tank Dimensions, Retention Times, Blower HP' },
      { label: 'Calculation Core', value: 'Deterministic Process Engine' }
    ],
    price: 389,
    monthlyPrice: 39,
    iconName: 'Activity',
    version: '3.0.0',
    isPopular: true
  },
  {
    id: 'env-05',
    name: 'Wastewater Flow',
    slug: 'wastewater-flow',
    categorySlug: 'environmental',
    categoryName: 'Environmental',
    shortDescription: 'Peak dry-weather & wet-weather hydraulic flow estimation with Babbitt and Harmon peaking factors.',
    fullDescription: 'Municipal wastewater hydraulic flow projection software. Calculates Average Daily Flow (ADF), Peak Dry Weather Flow (PDWF), and Peak Wet Weather Flow (PWWF) utilizing population projections, per-capita discharge rates, commercial fixtures, and inflow/infiltration (I&I) allowances.',
    standards: ['Ten State Standards (GLUMRB)', 'ASCE Manual 60 (Gravity Sanitary Sewer Design)'],
    features: [
      'Peaking factor models: Harmon, Babbitt, Babbit-Fair, and Ten-State formulas',
      'Infiltration and Inflow (I&I) allowance based on pipe length and diameter',
      'Zoning-based catchment area dry weather wastewater load summation',
      'Discharge hydrograph simulation for pump station wet well sizing',
      'Exportable design flow summary sheets'
    ],
    specs: [
      { label: 'Formulas', value: 'Harmon, Babbitt, Federal Guideline, ASCE' },
      { label: 'Flow Ranges', value: '0.1 L/s to 10,000 L/s (0.002 to 228 MGD)' },
      { label: 'Pump Integration', value: 'Wet Well Cycle Time Optimization' },
      { label: 'Format Output', value: 'Engineering Calculation PDF & Excel Sheet' }
    ],
    price: 229,
    monthlyPrice: 23,
    iconName: 'Waves',
    version: '2.5.1'
  },

  // 3. GEOTECHNICAL
  {
    id: 'geo-01',
    name: 'Bearing Capacity',
    slug: 'bearing-capacity',
    categorySlug: 'geotechnical',
    categoryName: 'Geotechnical',
    shortDescription: 'Terzaghi, Meyerhof, Hansen, and Vesic ultimate and allowable shallow foundation bearing capacity.',
    fullDescription: 'Comprehensive foundation bearing capacity computation engine for strip, square, rectangular, and circular footings. Computes ultimate bearing capacity, applying shape, depth, inclination, and ground slope correction factors with groundwater table depth adjustments and allowable settlement limits.',
    standards: ['Eurocode 7 (EN 1997-1)', 'DIN 4017', 'AASHTO LRFD Bridge Design', 'ASTM D1194'],
    features: [
      'Comparative evaluation across 4 classical theories (Terzaghi, Meyerhof, Hansen, Vesic)',
      'Water table elevation correction matrix for dry, submerged, and intermediate cases',
      'Eccentric and inclined load capacity reduction analysis',
      'Layered soil shear parameter homogenization',
      'Detailed step-by-step formula breakdown with factor references'
    ],
    specs: [
      { label: 'Theories', value: 'Terzaghi (1943), Meyerhof (1963), Hansen (1970), Vesic (1973)' },
      { label: 'Design Codes', value: 'Allowable Stress Design (ASD) & Eurocode 7 (DA1/DA2/DA3)' },
      { label: 'Footing Geometries', value: 'Strip, Isolated Rectangular, Square, Circular, Mat' },
      { label: 'Export Options', value: 'Geotechnical Calculation Sheet (PDF), LaTeX Summary' }
    ],
    price: 329,
    monthlyPrice: 33,
    iconName: 'Anchor',
    version: '3.4.0',
    isPopular: true
  },
  {
    id: 'geo-02',
    name: 'Borehole Log',
    slug: 'borehole-log',
    categorySlug: 'geotechnical',
    categoryName: 'Geotechnical',
    shortDescription: 'Subsurface soil stratigraphy boring log drafting tool with SPT N-values and USCS classification.',
    fullDescription: 'Professional soil boring log drafting software. Generates standardized engineering soil profiles from SPT blow counts, RQD core recovery logs, moisture contents, Atterberg limits, and USCS soil classification symbols.',
    standards: ['ASTM D1586 / D2487 (USCS)', 'BS 5930', 'ISO 14688-1'],
    features: [
      'Standardized USCS (Unified Soil Classification System) hatching patterns',
      'SPT N60 and (N1)60 overburden stress and hammer energy correction calculations',
      'Groundwater strike elevation and piezometer installation tracking',
      'Core sample photo embedder with depth registration',
      'Automated fence diagram generation across multiple boreholes'
    ],
    specs: [
      { label: 'Classifications', value: 'USCS, AASHTO, British Standard (BS 5930)' },
      { label: 'Drafting Output', value: 'Vector PDF Boring Log Sheets (A4 / Letter / A3)' },
      { label: 'Data Import', value: 'CSV Field Log, Excel Template, gINT Compatible' },
      { label: 'Graphics Engine', value: 'High-Res Vector CAD Hatch Pattern Renderer' }
    ],
    price: 369,
    monthlyPrice: 37,
    iconName: 'FileText',
    version: '4.1.2',
    isPopular: true
  },
  {
    id: 'geo-03',
    name: 'Settlement Reports',
    slug: 'settlement-reports',
    categorySlug: 'geotechnical',
    categoryName: 'Geotechnical',
    shortDescription: '1D Terzaghi consolidation, elastic immediate settlement, and time-rate settlement curves.',
    fullDescription: 'Advanced settlement prediction suite for shallow footings and embankment fills. Calculates immediate elastic settlement (Schmertmann, Janbu), primary 1D consolidation settlement for normally consolidated and overconsolidated clays (Cc, Cr, e0), and time-rate consolidation dissipation curves.',
    standards: ['ASTM D2435', 'Eurocode 7', 'US Navy DM-7.1'],
    features: [
      'Immediate settlement via Theory of Elasticity and Schmertmann CPT method',
      '1D primary consolidation with pre-consolidation pressure (Pc) verification',
      'Multi-layer stress distribution integration (Boussinesq and Westergaard solutions)',
      'Time-rate consolidation settlement plotting with vertical drain (PVD) acceleration',
      'Comprehensive foundation design recommendation report'
    ],
    specs: [
      { label: 'Stress Distribution', value: 'Boussinesq Point & 2:1 Dispersion Methods' },
      { label: 'Soil Models', value: 'Elastic Isotropic, Oedometer Primary & Secondary Creep' },
      { label: 'Output Charts', value: 'Settlement vs. Time Curve, Depth vs. Stress Bulb' },
      { label: 'Report Format', value: 'Formal Geotechnical Verification Report' }
    ],
    price: 299,
    monthlyPrice: 30,
    iconName: 'TrendingDown',
    version: '2.6.0'
  },
  {
    id: 'geo-04',
    name: 'Slope Stability',
    slug: 'slope-stability',
    categorySlug: 'geotechnical',
    categoryName: 'Geotechnical',
    shortDescription: 'Limit equilibrium slope stability analysis using Bishop, Fellenius, and Spencer slice methods.',
    fullDescription: 'Robust 2D limit equilibrium slope stability engine. Calculates Factor of Safety (FoS) for natural slopes, engineered cuts, and reinforced earth embankments under circular and non-circular slip surfaces with pore water pressure and pseudo-static seismic coefficients.',
    standards: ['USACE EM 1110-2-1902', 'Eurocode 7', 'FHWA-NHI-05-123'],
    features: [
      'Methods of Slices: Ordinary (Fellenius), Simplified Bishop, Janbu, Spencer',
      'Automated critical slip circle grid search algorithm',
      'Phreatic water surface and piezometric pore pressure line integration',
      'Pseudo-static seismic acceleration loading (Kh, Kv)',
      'Soil nail and geotextile reinforcement tensile capacity modeling'
    ],
    specs: [
      { label: 'Slice Methods', value: 'Bishop Simplified, Ordinary / Fellenius, Spencer' },
      { label: 'Failure Modes', value: 'Circular Arc, Composite, Polygonal Non-Circular' },
      { label: 'Safety Factor Precision', value: 'Iterative Convergence to 0.001 FoS' },
      { label: 'Export', value: 'High-Res Cross Section Diagram + Full Math Log' }
    ],
    price: 449,
    monthlyPrice: 45,
    iconName: 'TrendingDown',
    version: '3.5.0',
    isPopular: true
  },
  {
    id: 'geo-05',
    name: 'Soil Parameters',
    slug: 'soil-parameters',
    categorySlug: 'geotechnical',
    categoryName: 'Geotechnical',
    shortDescription: 'Empirical correlation converter for SPT N, CPT qc, shear strength, and friction angle.',
    fullDescription: 'Geotechnical engineering parameter synthesis tool. Converts in-situ field test data (SPT N60, CPT qc, Vane Shear, Dilatometer) into design engineering parameters (internal friction angle φ, undrained cohesion cu, modulus of elasticity Es, Poisson’s ratio) using verified peer-reviewed empirical correlations.',
    standards: ['ASTM D1586', 'ASTM D5778', 'Robertson CPT (2010)', 'Kulhawy & Mayne (1990)'],
    features: [
      'Empirical correlation library: Peck, Meyerhof, Schmertmann, Robertson',
      'Soil classification filtering (cohesive vs. cohesionless matrices)',
      'Statistical confidence interval scoring for estimated parameters',
      'Sensitivity comparison charts across differing empirical formulations',
      'Exportable parameter summary tables for numerical modeling inputs'
    ],
    specs: [
      { label: 'Correlations Library', value: '30+ Peer-Reviewed Geotechnical Formulations' },
      { label: 'Test Types Supported', value: 'SPT, CPT, CPTu, DMT, PMT, Vane Shear' },
      { label: 'Output Metrics', value: 'Phi, Cu, Es, Gmax, OCR, Ko, Poisson Ratio' },
      { label: 'Desktop Suite', value: 'Integrated Tool in STRATA Workspace' }
    ],
    price: 199,
    monthlyPrice: 20,
    iconName: 'Sliders',
    version: '2.3.1'
  },

  // 4. STRUCTURAL
  {
    id: 'str-01',
    name: 'Foundation Sizer',
    slug: 'foundation-sizer',
    categorySlug: 'structural',
    categoryName: 'Structural',
    shortDescription: 'Reinforced concrete isolated, combined, and strip footing design to ACI 318 & Eurocode 2.',
    fullDescription: 'Structural foundation design and dimensioning workbench. Optimizes footing plan dimensions for allowable soil pressures, verifies two-way punching shear and one-way beam shear, and designs bottom/top flexural reinforcement detailing with crack control checks.',
    standards: ['ACI 318-19', 'Eurocode 2 (EN 1992-1-1)', 'BS 8110', 'IS 456:2000'],
    features: [
      'Biaxial and uniaxial moment footing equilibrium solver with zero tension uplift checks',
      'Two-way critical perimeter punching shear stress calculations (d/2 perimeter)',
      'One-way wide beam shear verification at distance d from column face',
      'Flexural rebar sizing with minimum reinforcement and crack width control checks',
      'Auto-generated structural section drawing with rebar callouts'
    ],
    specs: [
      { label: 'Codes Supported', value: 'ACI 318-19, Eurocode 2, IS 456' },
      { label: 'Element Types', value: 'Isolated Pad, Strip, Combined Two-Column Footing' },
      { label: 'Shear Verification', value: 'Punching & One-Way Beam Shear with Overburden' },
      { label: 'Output Formats', value: 'Calculation Report (PDF), DXF Detail Cross-Section' }
    ],
    price: 349,
    monthlyPrice: 35,
    iconName: 'Square',
    version: '3.2.0',
    isPopular: true
  },
  {
    id: 'str-02',
    name: 'Load Combination',
    slug: 'load-combination',
    categorySlug: 'structural',
    categoryName: 'Structural',
    shortDescription: 'ASCE 7, IBC, and EN 1990 automated LRFD, ASD, and SLS load combination generator.',
    fullDescription: 'Structural load combination generator for civil and structural engineers. Automatically builds complete Ultimate Limit State (ULS), Serviceability Limit State (SLS), and Seismic/Wind directional load combination matrices conforming to ASCE 7-16/22 and Eurocode 0 with direct export to SAP2000, ETABS, and STAAD.Pro.',
    standards: ['ASCE/SEI 7-16 / 7-22', 'EN 1990:2002', 'IBC 2021', 'NBCC 2020'],
    features: [
      'Pre-configured rule sets for ASCE 7 LRFD/ASD, Eurocode 0 (Eq 6.10a/b), and Canadian NBCC',
      'Automatic directional orthogonal wind (Wx, Wy, Wx+0.75Wy) and seismic (1.0E + 0.3E) combinations',
      'Live load reduction and pattern loading permutations',
      'Direct copy-paste and text script generator for ETABS/SAP2000 load combination tables',
      'Summary matrix of governing envelope load cases'
    ],
    specs: [
      { label: 'Code Libraries', value: 'ASCE 7-22, ASCE 7-16, EN 1990, NBCC, IS 875' },
      { label: 'FEA Export', value: 'ETABS e2k text, SAP2000 s2k, STAAD.Pro std text' },
      { label: 'Max Combinations', value: '1,000+ Permutations in < 0.1s' },
      { label: 'Offline Ready', value: 'Fully Standalone Local Utility' }
    ],
    price: 219,
    monthlyPrice: 22,
    iconName: 'ListFilter',
    version: '2.9.1'
  },
  {
    id: 'str-03',
    name: 'Model Automator',
    slug: 'model-automator',
    categorySlug: 'structural',
    categoryName: 'Structural',
    shortDescription: 'Parametric 3D structural frame & truss generator with instant API scripting for ETABS/SAP2000.',
    fullDescription: 'Structural geometry automation tool. Rapidly generates multi-story 3D building grid systems, industrial portal frames, space trusses, and diagrid structures with assigned section properties, support fixities, and diaphragm constraints.',
    standards: ['Open BIM Standards', 'CSI API (ETABS / SAP2000 / SAFE)'],
    features: [
      'Parametric building generator (bay spacing, story heights, core walls, cantilever overhangs)',
      'Truss typology generator (Pratt, Howe, Warren, K-Truss, Bowstring)',
      'Automated rigid floor diaphragm assignments and mass source definitions',
      'One-click export to CSI OAPI Python scripts or DXF 3D wireframe models',
      'Real-time 3D OpenGL wireframe visualizer'
    ],
    specs: [
      { label: 'Supported BIM / FEA', value: 'ETABS (v18-v22), SAP2000, SAFE, DXF 3D' },
      { label: 'Typologies', value: 'Building Grids, Industrial Sheds, Transmission Towers' },
      { label: 'Visual Engine', value: '3D Vector Isometric Viewport' },
      { label: 'Script Engine', value: 'Python CSI API & Text Macro Output' }
    ],
    price: 399,
    monthlyPrice: 40,
    iconName: 'Cpu',
    version: '3.0.4',
    isPopular: true
  },
  {
    id: 'str-04',
    name: 'Rebar Extractor',
    slug: 'rebar-extractor',
    categorySlug: 'structural',
    categoryName: 'Structural',
    shortDescription: 'IFC & DXF reinforced concrete structural detailing reader and bar schedule extractor.',
    fullDescription: 'Intelligent structural drawing and BIM model analyzer. Reads reinforcement annotations, polyline rebar schedules, and IFC structural concrete entities, validating rebar congestion, development lengths, and extracting clean fabrication schedules.',
    standards: ['IFC 4x3', 'ACI 318 Section 25', 'Eurocode 2 Annex J'],
    features: [
      'Direct parsing of DXF structural drawings for rebar callout text blocks',
      'Congestion density checker (minimum clear spacing between bars vs. max aggregate size)',
      'Tension and compression development length verification',
      'Cross-check between structural design sheets and site bar bending schedules',
      'Instant Bill of Quantities export'
    ],
    specs: [
      { label: 'File Inputs', value: 'DXF (R12 to 2024), IFC 2x3 / 4, CSV' },
      { label: 'Rebar Check', value: 'Clear Spacing, Lap Splices, Bend Radii' },
      { label: 'Performance', value: 'Parse 100 Structural Sheets in < 5 Seconds' },
      { label: 'Platform Run', value: 'Native Windows x64 Desktop Application' }
    ],
    price: 329,
    monthlyPrice: 33,
    iconName: 'FileCheck',
    version: '2.4.0'
  },
  {
    id: 'str-05',
    name: 'Section Checker',
    slug: 'section-checker',
    categorySlug: 'structural',
    categoryName: 'Structural',
    shortDescription: 'AISC 360 & EN 1993 steel section capacity, local buckling classification, and interaction curves.',
    fullDescription: 'Comprehensive structural steel cross-section capacity engine. Computes cross-sectional geometric properties (Ix, Iy, J, Cw, Zx, Zy), classifies flange and web slenderness (compact, non-compact, slender), and evaluates axial, shear, flexural, and combined interaction ratios.',
    standards: ['AISC 360-16 / 360-22', 'Eurocode 3 (EN 1993-1-1)', 'CSA S16-19', 'AS 4100'],
    features: [
      'Comprehensive profile database: AISC (W, S, M, HP, C, MC, HSS, L), European (IPE, HEA, HEB, HEM, UPN), British (UB, UC)',
      'Local buckling classification for axial compression and flexural stress distributions',
      'P-M-M interaction equation evaluation (AISC Chapter H equations H1-1a/b)',
      'Torsional-flexural buckling and lateral torsional buckling (LTB) moment capacities',
      'Custom user-defined welded plate girder and built-up box section evaluation'
    ],
    specs: [
      { label: 'Profile Database', value: 'Over 5,000 Standard Global Steel Profiles' },
      { label: 'Analysis Standards', value: 'AISC 360 LRFD/ASD, Eurocode 3 Part 1-1' },
      { label: 'Elastic / Plastic Analysis', value: 'Plastic Modulus & Yield Surface Verification' },
      { label: 'Report Styles', value: 'Formal Engineering Sign-Off PDF' }
    ],
    price: 279,
    monthlyPrice: 28,
    iconName: 'Maximize2',
    version: '3.3.2',
    isPopular: true
  },

  // 5. SURVEYING
  {
    id: 'srv-01',
    name: 'Coordinate Data',
    slug: 'coordinate-data',
    categorySlug: 'surveying',
    categoryName: 'Surveying',
    shortDescription: 'Geodetic datum transformations (WGS84, UTM, State Plane) and grid-to-ground scale factor corrections.',
    fullDescription: 'High-precision geodetic and surveying coordinate transformation engine. Converts between geographic (Lat/Lon/Ellipsoidal Height), UTM, State Plane Coordinates (NAD83 / SPCS), and local ground project grids with combined grid scale factor (CGSF) corrections.',
    standards: ['EPSG Geodetic Parameter Dataset', 'NGA WGS84', 'NOAA NGS State Plane 2022'],
    features: [
      'Support for 6,000+ EPSG coordinate reference systems and projections',
      'Grid-to-ground combined factor (elevation factor x grid scale factor) application',
      '7-Parameter Helmert transformation for custom local geodetic datums',
      'Batch conversion of massive CSV / ASCII point coordinate survey files',
      'Map projection distortion and convergence angle computation'
    ],
    specs: [
      { label: 'Datum Database', value: 'EPSG Geodetic Registry v10.0+' },
      { label: 'Transformations', value: 'Helmert 7-Parameter, Molodensky, Transverse Mercator' },
      { label: 'Batch Capacity', value: '1,000,000+ Points per Batch' },
      { label: 'Accuracy', value: 'Sub-millimeter Numerical Geodetic Precision' }
    ],
    price: 249,
    monthlyPrice: 25,
    iconName: 'Globe',
    version: '3.1.0'
  },
  {
    id: 'srv-02',
    name: 'CutFill Volume',
    slug: 'cutfill-volume',
    categorySlug: 'surveying',
    categoryName: 'Surveying',
    shortDescription: 'Triangulated Irregular Network (TIN) surface comparison and isopach elevation difference mapping.',
    fullDescription: 'High-speed Digital Terrain Model (DTM) surface comparison engine. Computes precise cut and fill excavation volumes by intersecting before-and-after Triangulated Irregular Network (TIN) surfaces with color-coded elevation change isopach maps.',
    standards: ['LandXML 1.2 / 2.0', 'USACE Hydrographic & Topographic Surveying Manual'],
    features: [
      'Delaunay triangulation surface generation from raw XYZ survey points',
      'TIN surface-to-surface boolean prism volume calculation',
      'Daylight boundary intersection and boundary clipping polygon support',
      'Color-coded cut/fill isopach map rendering with customizable contour intervals',
      'Direct LandXML and DXF 3D Face import and export'
    ],
    specs: [
      { label: 'Triangulation', value: 'Fast Bowyer-Watson Delaunay TIN Engine' },
      { label: 'Max Points', value: 'Up to 2,000,000 Survey Nodes' },
      { label: 'Volume Method', value: 'Exact Triangular Prism Integration' },
      { label: 'Export', value: 'LandXML Surface, 3D DXF Meshes, Summary PDF' }
    ],
    price: 349,
    monthlyPrice: 35,
    iconName: 'Layers',
    version: '3.8.1',
    isPopular: true
  },
  {
    id: 'srv-03',
    name: 'Point Cloud',
    slug: 'point-cloud',
    categorySlug: 'surveying',
    categoryName: 'Surveying',
    shortDescription: 'LiDAR & drone LAS/LAZ point cloud filtering, ground classification, and spatial decimation.',
    fullDescription: 'Lightweight desktop point cloud processing utility. Opens massive LAS/LAZ files from terrestrial LiDAR and drone photogrammetry, performs statistical outlier removal, spatial voxel decimation, and ground plane separation for engineering CAD workflows.',
    standards: ['ASPRS LAS 1.4 Specification', 'ASTM E57 Standard for 3D Imaging'],
    features: [
      'Ultra-fast reading and streaming of ASPRS LAS and compressed LAZ point cloud files',
      'Voxel grid subsampling to reduce file sizes for downstream CAD import',
      'Statistical Outlier Removal (SOR) to eliminate dust and atmospheric noise',
      'Cloth Simulation Filter (CSF) ground point extraction',
      'Export cleaned ground points as XYZ ASCII or LandXML surface'
    ],
    specs: [
      { label: 'Formats', value: 'LAS 1.0-1.4, LAZ, E57, XYZ, PTS, PLY' },
      { label: 'Processing Speed', value: '50 Million Points Decimated in < 15 Seconds' },
      { label: 'Classification Codes', value: 'ASPRS Standard (Ground, Vegetation, Building)' },
      { label: 'Memory Handling', value: 'Out-of-Core Memory Streaming' }
    ],
    price: 389,
    monthlyPrice: 39,
    iconName: 'Cloud',
    version: '2.7.0'
  },
  {
    id: 'srv-04',
    name: 'Survey Generator',
    slug: 'survey-generator',
    categorySlug: 'surveying',
    categoryName: 'Surveying',
    shortDescription: 'Topographic field note processing, point code description key mapping, and DXF drafting.',
    fullDescription: 'Survey field-to-finish automated drafting tool. Translates raw total station point codes (e.g., EP, CL, TREE, MH, BLDG) into 2D/3D DXF layers, automatic line connect strings, and surveyor field note validation sheets.',
    standards: ['Civil 3D Description Key Format', 'LandXML Standard'],
    features: [
      'Customizable description key library linking field codes to CAD layers, symbols, and linetypes',
      'Automated stringing of linework (2D/3D polylines) via prefix/suffix field codes',
      'Instrument setup station and backsight validation log generator',
      'Direct output to DXF CAD drawing files ready for drafting',
      'Total station raw data file parser (SDR, RAW, Leica GSI, Trimble JOB)'
    ],
    specs: [
      { label: 'Total Station Formats', value: 'Leica GSI/DBX, Trimble RAW/JOB, Topcon GTS, Sokkia SDR' },
      { label: 'CAD Output', value: 'AutoCAD DXF R12 through 2024' },
      { label: 'Feature Coding', value: '2-Point Line, 3-Point Arc, Point Symbols' },
      { label: 'Platform', value: 'Local Offline Desktop Utility' }
    ],
    price: 269,
    monthlyPrice: 27,
    iconName: 'MapPin',
    version: '2.2.4'
  },
  {
    id: 'srv-05',
    name: 'Traverse Calculator',
    slug: 'traverse-calculator',
    categorySlug: 'surveying',
    categoryName: 'Surveying',
    shortDescription: 'Closed and open loop traverse balancing via Compass (Bowditch), Transit, and Least Squares.',
    fullDescription: 'Geodetic survey traverse adjustment suite. Balances angular misclosure, computes linear error of closure, precision ratio (e.g. 1:25,000), and distributes coordinate adjustments across traverse stations using Compass Rule (Bowditch), Transit Rule, and rigorous 2D Least Squares adjustment.',
    standards: ['FGDC Geospatial Positioning Standards', 'USGS Survey Manual'],
    features: [
      'Supports closed loop and link (fixed-to-fixed) boundary traverse geometries',
      'Angular misclosure check with allowable tolerance limits based on survey order (1st, 2nd, 3rd Order)',
      'Bowditch, Transit, and Least-Squares coordinate adjustment algorithms',
      'Side shot and radial observation calculation from adjusted traverse stations',
      'Formal traverse closure certificate PDF report generator'
    ],
    specs: [
      { label: 'Adjustment Methods', value: 'Compass (Bowditch), Transit, Crandall, 2D Least Squares' },
      { label: 'Precision Tracking', value: 'Linear Precision Ratio, Angular Tolerance Check' },
      { label: 'Report Styles', value: 'Official Boundary Survey Certificate (PDF)' },
      { label: 'Data Compatibility', value: 'CSV, Tabular Entry, DXF Overlay' }
    ],
    price: 299,
    monthlyPrice: 30,
    iconName: 'Compass',
    version: '3.2.1',
    isPopular: true
  },

  // 6. TRANSPORTATION
  {
    id: 'trn-01',
    name: 'Horizontal Vertical',
    slug: 'horizontal-vertical',
    categorySlug: 'transportation',
    categoryName: 'Transportation',
    shortDescription: 'Highway geometric alignment: horizontal circular curves, spirals, and parabolic vertical crest/sag curves.',
    fullDescription: 'Highway geometric design and alignment computation workbench. Solves circular curves with spiral transition easements (Euler clothoids), computes superelevation runoff rates, and designs symmetric parabolic vertical crest and sag curves conforming to AASHTO Green Book stopping sight distance (SSD) criteria.',
    standards: ['AASHTO A Policy on Geometric Design of Highways and Streets (Green Book 2018)', 'Austroads Guide to Road Design'],
    features: [
      'Horizontal curve solver with spiral transition parameter (A) and clothoid coordinates',
      'AASHTO Superelevation (e_max 4%, 6%, 8%, 10%) calculation and runoff transition lengths',
      'Crest and Sag vertical curve K-value design for Stopping Sight Distance (SSD) and headlight reach',
      'Station elevation interpolation along alignment at user-defined increments (e.g. 10m / 50ft)',
      'Export alignment profile data directly to CSV and LandXML Alignment format'
    ],
    specs: [
      { label: 'Design Speed Range', value: '20 km/h to 140 km/h (15 mph to 85 mph)' },
      { label: 'Sight Distances', value: 'Stopping (SSD), Passing (PSD), Decision (DSD)' },
      { label: 'Output Standards', value: 'LandXML 1.2 Alignment, CSV Stations Table, DXF' },
      { label: 'Calculation Core', value: 'High-Precision Analytical Clothoid Solver' }
    ],
    price: 319,
    monthlyPrice: 32,
    iconName: 'Route',
    version: '3.1.0',
    isPopular: true
  },
  {
    id: 'trn-02',
    name: 'LOS Batch',
    slug: 'los-batch',
    categorySlug: 'transportation',
    categoryName: 'Transportation',
    shortDescription: 'Highway Capacity Manual (HCM 6th Ed) multi-intersection Level of Service batch calculator.',
    fullDescription: 'High-throughput traffic capacity analyzer. Processes hundreds of signalized and unsignalized (TWSC / AWSC) intersections in batch mode, computing control delay (sec/veh), volume-to-capacity (v/c) ratios, and Level of Service (LOS A through F) adhering strictly to Highway Capacity Manual (HCM) formulations.',
    standards: ['TRB Highway Capacity Manual (HCM 6th Edition)', 'FHWA Traffic Analysis Tools'],
    features: [
      'Batch calculation of signalized intersections, stop-controlled (TWSC/AWSC), and roundabouts',
      'Automated Level of Service (LOS A to F) grading based on control delay thresholds',
      'Heavy vehicle percentage and peak hour factor (PHF) flow adjustments',
      'Multi-scenario comparison (Existing vs. Opening Year vs. Horizon Year 20-yr Forecast)',
      'Export comprehensive Traffic Impact Assessment (TIA) summary tables'
    ],
    specs: [
      { label: 'Standards Supported', value: 'HCM 6th Edition, HCM 2010, HCM 2000' },
      { label: 'Node Capacity', value: 'Up to 500 Intersections in a Single Batch Run' },
      { label: 'Delay Models', value: 'Webster Uniform Delay, Incremental Delay, Initial Queue' },
      { label: 'Export Options', value: 'TIA Report PDF, Master Excel Summary, GeoJSON' }
    ],
    price: 369,
    monthlyPrice: 37,
    iconName: 'BarChart3',
    version: '2.5.0'
  },
  {
    id: 'trn-03',
    name: 'Pavement Designer',
    slug: 'pavement-designer',
    categorySlug: 'transportation',
    categoryName: 'Transportation',
    shortDescription: 'AASHTO 1993 flexible & rigid pavement thickness design and cumulative ESAL traffic loading.',
    fullDescription: 'Structural highway pavement thickness design tool. Calculates cumulative 18-kip Equivalent Single Axle Loads (ESALs), determines required Structural Number (SN) for flexible asphalt pavements, and computes slab thickness for Jointed Plain Concrete Pavements (JPCP) based on subgrade resilient modulus (Mr).',
    standards: ['AASHTO Guide for Design of Pavement Structures (1993)', 'AASHTO MEPDG', 'PCA Rigid Design'],
    features: [
      'Traffic ESAL projection from AADT, truck distribution, growth rate, and lane distribution factors',
      'AASHTO 1993 Flexible Pavement equation iterative solver for Structural Number (SN)',
      'Layer thickness optimizer (Asphalt Surface, Crushed Aggregate Base, Subbase)',
      'Rigid concrete pavement thickness design using Westergaard / PCA stress formulations',
      'Life-cycle cost analysis (LCCA) comparison between flexible and rigid alternatives'
    ],
    specs: [
      { label: 'Pavement Types', value: 'Flexible Asphalt, Rigid JPCP/JRCP, Composite' },
      { label: 'Reliability Levels', value: '50% to 99.9% (Standard Deviations ZR)' },
      { label: 'Environmental Factors', value: 'Drainage Coefficients (m2, m3), Serviceability Loss' },
      { label: 'Report Styles', value: 'Department of Transportation (DOT) Submittal Report' }
    ],
    price: 339,
    monthlyPrice: 34,
    iconName: 'Columns',
    version: '3.0.2',
    isPopular: true
  },
  {
    id: 'trn-04',
    name: 'Signal Timing',
    slug: 'signal-timing',
    categorySlug: 'transportation',
    categoryName: 'Transportation',
    shortDescription: 'Webster optimum cycle length, yellow change & red clearance intervals, and phase splits.',
    fullDescription: 'Traffic signal phase split and timing optimization workbench. Calculates Webster optimum cycle length (C_opt), minimum cycle lengths, yellow change and all-red clearance intervals per ITE guidelines, and allocates green time splits proportional to critical lane group volume-to-saturation ratios.',
    standards: ['ITE Guidelines for Determining Traffic Signal Change Intervals', 'FHWA Signal Timing Manual (STM-2)'],
    features: [
      'Webster optimum cycle length calculation minimizing overall vehicular delay',
      'ITE kinematic yellow change interval and all-red clearance interval calculator',
      'Pedestrian minimum walk and flashing don’t walk (FDW) timing checks',
      'Dual-ring NEMA 8-phase diagram layout and phase split table',
      'Time-space diagram visualization for two-way arterial signal coordination'
    ],
    specs: [
      { label: 'Methodology', value: 'Webster Delay Minimization, ITE Kinematic Equations' },
      { label: 'Phase Framework', value: 'NEMA TS2 Standard 8-Phase Dual Ring' },
      { label: 'Timing Outputs', value: 'Controller Timing Cards, Ring-and-Barrier Diagrams' },
      { label: 'Coordination', value: 'Bandwidth Efficiency & Offset Optimization' }
    ],
    price: 289,
    monthlyPrice: 29,
    iconName: 'Clock',
    version: '2.4.3'
  },
  {
    id: 'trn-05',
    name: 'Traffic Volume',
    slug: 'traffic-volume',
    categorySlug: 'transportation',
    categoryName: 'Transportation',
    shortDescription: 'Turning Movement Count (TMC) data reduction, Peak Hour Factor (PHF), and AADT projection.',
    fullDescription: 'Traffic survey volume reduction and expansion suite. Ingests raw 15-minute turning movement counts from intersection counts, determines peak hour volume (AM/PM/Midday), computes Peak Hour Factor (PHF), and applies seasonal and day-of-week expansion factors to estimate Annual Average Daily Traffic (AADT).',
    standards: ['FHWA Traffic Monitoring Guide (TMG)', 'ITE Trip Generation Manual'],
    features: [
      '15-minute count aggregation and automated peak hour window detection (rolling 60-minute sum)',
      'Directional distribution (D-factor) and heavy vehicle percentage calculations',
      'Seasonal variation and daily factor expansion to forecast annual AADT',
      'Visual intersection turning movement volume summary diagrams',
      'Direct CSV, Excel, and automated traffic report document generator'
    ],
    specs: [
      { label: 'Survey Types', value: '15-min TMC, 24-hr Tube Counts, Pedestrian/Bicycle Counts' },
      { label: 'Analysis Intervals', value: '15-min, 30-min, 60-min Peak Hours' },
      { label: 'Graphics Output', value: 'Vector Intersection Turning Diagram (PDF / PNG)' },
      { label: 'Integration', value: 'Seamless link into LOS Batch and Signal Timing' }
    ],
    price: 219,
    monthlyPrice: 22,
    iconName: 'TrendingUp',
    version: '2.1.0'
  },

  // 7. WATER RESOURCES
  {
    id: 'wtr-01',
    name: 'Channel Capacity',
    slug: 'channel-capacity',
    categorySlug: 'water-resources',
    categoryName: 'Water Resources',
    shortDescription: 'Manning equation solver for open channel flow: trapezoidal, rectangular, circular, and natural channels.',
    fullDescription: 'Open channel hydraulic capacity workbench for civil and drainage engineers. Solves the Manning equation for uniform and gradually varied steady flow in trapezoidal, rectangular, triangular, circular, and irregular cross sections. Computes normal depth, critical depth, Froude number, and water surface profiles.',
    standards: ['FHWA HEC-22 (Urban Drainage Design Manual)', 'USGS Open-Channel Hydraulics'],
    features: [
      'Direct Manning equation solver for discharge (Q), normal depth (yn), slope (S), or roughness (n)',
      'Critical depth (yc) and specific energy curve calculation with Froude number classification (sub/supercritical)',
      'Direct step method for gradually varied flow water surface profile calculation (M1, M2, S1, S2 profiles)',
      'Composite roughness calculator for channels with variable bank and bed materials (Horton/Einstein formulas)',
      'Exportable hydraulic design verification calculation sheet'
    ],
    specs: [
      { label: 'Cross Sections', value: 'Trapezoidal, Rectangular, Circular, V-Shaped, Natural' },
      { label: 'Flow Regimes', value: 'Subcritical (Fr < 1), Critical (Fr = 1), Supercritical (Fr > 1)' },
      { label: 'Roughness Library', value: '50+ Preloaded Manning n-values (Concrete, Riprap, Earth)' },
      { label: 'Report Styles', value: 'Full Step-by-Step Hydraulic Calculation Log' }
    ],
    price: 249,
    monthlyPrice: 25,
    iconName: 'Waves',
    version: '3.1.2',
    isPopular: true
  },
  {
    id: 'wtr-02',
    name: 'Flood Reports',
    slug: 'flood-reports',
    categorySlug: 'water-resources',
    categoryName: 'Water Resources',
    shortDescription: '100-year floodplain delineation report compiler, base flood elevation (BFE) documentation.',
    fullDescription: 'Hydrologic and hydraulic flood risk reporting suite. Aggregates watershed peak flow outputs, cross-sectional water surface elevations, and freeboard requirements into formal 10-yr, 50-yr, 100-yr, and 500-yr floodplain assessment and FEMA-style engineering compliance documents.',
    standards: ['FEMA Guidelines and Standards for Flood Risk Analysis', 'USACE HEC-RAS Guidelines'],
    features: [
      'Multi-return period flood level summary matrix (10, 25, 50, 100, 500-year events)',
      'Base Flood Elevation (BFE) and regulatory freeboard compliance checks',
      'Bridge and culvert backwater encroachment analysis summaries',
      'Automated executive summary generation for municipal drainage permits',
      'High-resolution floodplain cross-section plotting and report export'
    ],
    specs: [
      { label: 'Regulatory Framework', value: 'FEMA NFIP Guidelines, Eurocode Flood Management' },
      { label: 'Return Periods', value: '2-yr, 5-yr, 10-yr, 25-yr, 50-yr, 100-yr, 500-yr' },
      { label: 'Report Quality', value: 'Audit-grade PDF/A Engineering Reports' },
      { label: 'Offline Desktop', value: '100% Client-Side Engine' }
    ],
    price: 299,
    monthlyPrice: 30,
    iconName: 'FileText',
    version: '2.3.0'
  },
  {
    id: 'wtr-03',
    name: 'Pipe Network',
    slug: 'pipe-network',
    categorySlug: 'water-resources',
    categoryName: 'Water Resources',
    shortDescription: 'Pressurized looped water distribution network analysis using the Hardy Cross iterative method.',
    fullDescription: 'Hydraulic network solver for municipal and industrial pressurized pipe distribution systems. Utilizes the iterative Hardy Cross method and Darcy-Weisbach / Hazen-Williams head loss equations to calculate flow rates, velocities, head losses, and nodal junction pressure heads.',
    standards: ['AWWA Manual M31 (Distribution System Requirements)', 'EN 805 Water Supply Systems'],
    features: [
      'Multi-loop iterative Hardy Cross hydraulic balancing engine with rapid convergence',
      'Friction formulas: Hazen-Williams (C-factor) and Darcy-Weisbach (Colebrook-White friction factor f)',
      'Minor head loss inclusion (valves, bends, tees, reducers) via equivalent length or K-factors',
      'High and low pressure alert flags for fire flow and peak hour demand scenarios',
      'Schematic loop visualization with node pressure and line flow direction arrows'
    ],
    specs: [
      { label: 'Solvers', value: 'Hardy Cross Iterative Method, Gradient Matrix Algorithm' },
      { label: 'Head Loss Models', value: 'Hazen-Williams, Darcy-Weisbach, Manning' },
      { label: 'Capacity', value: 'Up to 250 Interconnected Loops per Project' },
      { label: 'Output Formats', value: 'Tabular Hydraulic Schedule, Pressure Gradient Curves' }
    ],
    price: 369,
    monthlyPrice: 37,
    iconName: 'Network',
    version: '3.4.0',
    isPopular: true
  },
  {
    id: 'wtr-04',
    name: 'Rainfall Runoff',
    slug: 'rainfall-runoff',
    categorySlug: 'water-resources',
    categoryName: 'Water Resources',
    shortDescription: 'Rational Method peak discharge & NRCS (SCS) Curve Number synthetic unit hydrograph generation.',
    fullDescription: 'Watershed hydrology computational suite. Computes peak storm runoff discharges using the Rational Method (Q = CiA) and develops complete dimensionless synthetic unit hydrographs using the NRCS (SCS) Curve Number (TR-55) methodology with Kirpich/FAA Time of Concentration (Tc) solvers.',
    standards: ['USDA NRCS TR-55 (Urban Hydrology for Small Watersheds)', 'FHWA HEC-19'],
    features: [
      'Time of Concentration (Tc) calculator incorporating sheet flow, shallow concentrated flow, and channel flow',
      'NRCS Curve Number (CN) weighted composite determination for multi-soil/land-use catchments',
      'Synthetic storm distribution hyetographs (SCS Type I, IA, II, III and custom IDF curves)',
      'Dimensionless Unit Hydrograph convolution to determine flood hydrograph volume and peak discharge',
      'Detention basin storage volume estimation using Modified Rational and Wycoff-Singh methods'
    ],
    specs: [
      { label: 'Hydrologic Models', value: 'Rational Method, NRCS (SCS) TR-55, Snyder Unit Hydrograph' },
      { label: 'Storm Distributions', value: 'SCS 24-hr Type I, IA, II, III & Intensity-Duration-Frequency (IDF)' },
      { label: 'Output Charts', value: 'Runoff Hydrograph, Hyetograph, Infiltration Mass Curves' },
      { label: 'Export', value: 'Calculation Documentation PDF & Hydrograph CSV' }
    ],
    price: 299,
    monthlyPrice: 30,
    iconName: 'CloudRain',
    version: '3.2.0',
    isPopular: true
  },
  {
    id: 'wtr-05',
    name: 'Water Demand',
    slug: 'water-demand',
    categorySlug: 'water-resources',
    categoryName: 'Water Resources',
    shortDescription: 'Municipal population projection, per capita daily consumption, and fire flow requirement sizing.',
    fullDescription: 'Municipal water supply demand estimation software. Projects municipal population growth across arithmetic, geometric, and logistic models, applies zoned per-capita daily consumption factors, computes peak hour/maximum day peaking ratios, and determines fire flow duration requirements.',
    standards: ['AWWA Manual M32', 'ISO Fire Flow Formula', 'NFPA 1142'],
    features: [
      'Population projection models: Arithmetic, Geometric, Decreasing Rate, Logistic S-Curve',
      'Zoned domestic, commercial, industrial, and unaccounted-for water (UFW) demand summation',
      'Fire flow demand estimation using Insurance Services Office (ISO) and AWWA formulas',
      'Peak Day Factor (PDF) and Peak Hour Factor (PHF) diurnal curve multiplier application',
      'Water storage reservoir equalizing volume and emergency reserve sizing calculator'
    ],
    specs: [
      { label: 'Demand Models', value: 'Per-Capita Average Daily Demand, Fixture Unit Method' },
      { label: 'Fire Flow Standards', value: 'ISO Guide for Determination of Needed Fire Flow, NFPA' },
      { label: 'Reservoir Sizing', value: 'Equalizing Storage, Fire Reserve, Emergency Backup' },
      { label: 'Reporting', value: 'Formal Municipal Water Infrastructure Master Plan Summary' }
    ],
    price: 229,
    monthlyPrice: 23,
    iconName: 'Droplets',
    version: '2.0.0'
  }
];

export const PRICING_PLANS = [
  {
    id: 'single-app',
    name: 'Single App',
    slug: 'single-app',
    price: 49,
    period: 'per month',
    description: 'Ideal for specialized engineers requiring a dedicated, standalone calculation engine.',
    features: [
      'Choice of any 1 of the 35 STRATA tools',
      '100% Offline desktop capability',
      'Unlimited local project files & calculations',
      'Full PDF & Excel report exporting',
      'Standard email technical support',
      'Free minor version updates'
    ],
    ctaText: 'Choose Tool',
    popular: false,
    highlight: false
  },
  {
    id: 'category-bundle',
    name: 'Category Bundle',
    slug: 'category-bundle',
    price: 149,
    period: 'per month',
    description: 'Complete 5-tool discipline suite for specialized engineering departments.',
    features: [
      'All 5 applications in your chosen discipline',
      '100% Offline desktop capability on 3 workstations',
      'Inter-tool data exchange & shared templates',
      'Advanced batch calculations & LandXML/CAD exports',
      'Priority engineer-to-engineer technical support',
      'All version updates & standard code revisions included'
    ],
    ctaText: 'Select Discipline',
    popular: false,
    highlight: false
  },
  {
    id: 'full-suite',
    name: 'Full Suite (All 35 Apps)',
    slug: 'full-suite',
    price: 399,
    period: 'per month',
    description: 'The definitive engineering software workspace for multidisciplinary consultancies.',
    features: [
      'Unrestricted access to all 35 tools across all 7 disciplines',
      'Desktop installation on up to 10 team workstations',
      'Unified launcher & centralized offline project manager',
      'Custom company letterhead on all PDF reports',
      '24/7 Priority SLA support & dedicated engineering onboarding',
      'Lifetime compliance updates to global design codes'
    ],
    ctaText: 'Get Full Suite',
    popular: true,
    highlight: true
  }
];

export const FAQS = [
  {
    question: 'How do STRATA desktop licenses work?',
    answer: 'STRATA licenses are node-locked or floating seats that operate 100% offline. Once activated using your license key, the software requires zero internet connection to run full-speed engineering calculations, ensuring maximum data privacy on sensitive infrastructure projects.'
  },
  {
    question: 'Can I switch between single apps or upgrade to the Full Suite?',
    answer: 'Yes. You can upgrade your plan or switch active tools at any time via your account portal. Any remaining credit on your single app or category bundle is automatically prorated toward your upgraded suite.'
  },
  {
    question: 'Are calculations verified against international engineering codes?',
    answer: 'Every STRATA engine is benchmarked against exact standards including ACI, AISC, ASCE 7, Eurocodes (EN 1990-1997), AASHTO, ASTM, EPA, and AWWA. Detailed step-by-step mathematical logs with explicit code references are generated with each export.'
  },
  {
    question: 'Does STRATA support exporting to CAD and BIM workflows?',
    answer: 'Yes. Depending on the discipline, STRATA tools export to industry-standard DXF CAD drawings, LandXML terrain/alignments, IFC 4x3 structural schedules, CSI OAPI (ETABS/SAP2000), Excel workbooks, and archival PDF/A reports.'
  },
  {
    question: 'What are the desktop system requirements?',
    answer: 'STRATA is engineered for performance. It runs natively on Windows 10/11 (64-bit), macOS (Intel & Apple Silicon), and Linux (x86_64). A minimum of 4 GB RAM and 500 MB disk space is required.'
  }
];
