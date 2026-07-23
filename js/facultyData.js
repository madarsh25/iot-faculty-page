const facultyData = [
  {
    metadata: {
      id: "sujata-alegavi",
      hierarchyOrder: 1, // Head of Department
      rankCategory: "Head of Department"
    },
    basicInfo: {
      prefix: "Dr.",
      fullName: "Sujata Alegavi",
      displayTitle: "Dr. Sujata Alegavi",
      designation: "Associate Professor & Head of Department (HOD)",
      department: "Computer Science & Engineering (Internet of Things)",
      institution: "Thakur College of Engineering & Technology (TCET)",
      campus: "Kandivali (East), Mumbai",
      profilePhotoUrl: "assets/images/sujata_alegavi.jpg",
      shortBio: "Head of Department (IoT) with over 18.6 years of academic & research leadership. Specializes in Satellite Remote Sensing, Deep Learning, and AI applications."
    },
    contact: {
      officialEmail: "sujata.alegavi@thakureducation.org",
      officeLocation: "Department of CSE-IoT, A-Block, TCET Campus, Mumbai",
      address: "A-Block, Thakur Educational Campus, Shyamnarayan Thakur Marg, Thakur Village, Kandivali-East, Mumbai-400101, Maharashtra",
      vidwanId: "399359",
      vidwanUrl: "https://tcetmumbai.irins.org/profile/399359",
      orcidId: "0000-0002-1234-5678",
      scopusId: "57211229900",
      googleScholarUrl: "https://scholar.google.com"
    },
    socialLinks: [
      { platform: "Google Site", url: "https://sites.google.com/view/sujata-alegavi/home", icon: "globe" },
      { platform: "IRINS Vidwan", url: "https://tcetmumbai.irins.org/profile/399359", icon: "id-card" }
    ],
    highlights: {
      teachingExperience: "18.6 Years",
      industryExperience: "N/A",
      highestQualification: "Ph.D. (Tech) - Mumbai University",
      totalPublications: 36,
      patentsCount: 1,
      grantsReceived: "₹ 1,25,000/- (NVIDIA GPU Grant)",
      projectsGuidedUG: 21,
      projectsGuidedPG: 4
    },
    education: [
      {
        degree: "Ph.D. (Technology)",
        fieldOfStudy: "Electronics & Telecommunication Engineering",
        institution: "University of Mumbai",
        year: 2021,
        status: "Awarded"
      },
      {
        degree: "PGDBA",
        fieldOfStudy: "Finance",
        institution: "Symbiosis Institute of Business Management (SIBM), Pune",
        year: 2012,
        status: "Awarded"
      },
      {
        degree: "M.E.",
        fieldOfStudy: "Electronics & Telecommunication Engineering",
        institution: "University of Mumbai",
        year: 2010,
        status: "Awarded"
      },
      {
        degree: "B.E.",
        fieldOfStudy: "Electronics & Telecommunication Engineering",
        institution: "University of Mumbai",
        year: null,
        status: "Awarded"
      }
    ],
    experience: [
      {
        role: "Associate Professor & Head of Department (HOD)",
        organization: "Department of CSE-IoT, TCET Mumbai",
        type: "Teaching & Departmental Leadership",
        durationYears: "18.6 Years",
        period: "2005 - Present",
        description: "Leading academic governance, research initiatives, COE collaborations, and departmental operations for CSE-IoT."
      }
    ],
    specializations: [
      "Remote Sensing & Satellite Imagery",
      "Artificial Intelligence & Deep Learning",
      "Video & Image Processing",
      "Communication Engineering"
    ],
    publications: {
      summary: { journals: 22, conferences: 14, bookChapters: 2, patents: 1 },
      items: [
        {
          title: "Transfer Learning for Classification of Hyperspectral Images using VGG & VGG-VDD Pretrained Networks",
          authors: "S. S. Alegavi, R.R. Sedamkar",
          venue: "International Journal of Advanced Science and Technology (IJAST)",
          volume: "Vol. 28, No. 20, pp. 1290-1303",
          year: 2019,
          type: "Journal",
          indexing: ["Scopus", "Elsevier"],
          url: "https://sites.google.com/view/sujata-alegavi/research-publications-patents-grants"
        },
        {
          title: "Classification of Hybrid Multiscaled Remote Sensing Scene using Pretrained Convolutional Neural Networks",
          authors: "S. S. Alegavi, R.R. Sedamkar",
          venue: "Proc. Springer Advances in Intelligent Systems and Computing Series (AISC 1108)",
          volume: "ICCVBIC 2019, pp. 1-10",
          year: 2020,
          type: "Conference",
          indexing: ["Scopus", "Springer Nature"],
          url: "https://sites.google.com/view/sujata-alegavi/research-publications-patents-grants"
        },
        {
          title: "Hyper Spectral Image Classification using Multi Labelled, Multi-Scale and Multi-Angle CNN with MS-MA BT Algorithm",
          authors: "Sujata Alegavi, R.R. Sedamkar",
          venue: "International Journal of Innovative Technology and Exploring Engineering (IJITEE)",
          volume: "Vol. 8, Issue 9S3, pp. 1229-1235",
          year: 2019,
          type: "Journal",
          indexing: ["Scopus"],
          url: null
        },
        {
          title: "Improving Classification Error for Mixed Pixels in Satellite Images using Soft Thresholding Technique",
          authors: "S. S. Alegavi, R.R. Sedamkar",
          venue: "2nd IEEE International Conference on Intelligent Computing and Control Systems (ICICCS)",
          volume: "IEEE Digital Library, DOI: 10.1109/ICCONS.2018.8663002",
          year: 2018,
          type: "Conference",
          indexing: ["IEEE Xplore", "INSPEC"],
          url: "https://doi.org/10.1109/ICCONS.2018.8663002"
        },
        {
          title: "Multi-Scale Rotation Invariant Local Features Extraction for Hyperspectral Image Classification using CNN",
          authors: "Sujata Alegavi, R.R. Sedamkar",
          venue: "Computing and Communication Engineering in Real-Time Application Development",
          volume: "Apple Academic Press Book Chapter",
          year: 2021,
          type: "Book Chapter",
          indexing: ["Scopus"],
          url: null
        }
      ]
    },
    patents: [
      {
        title: "A Hybrid Method for Deep ENN with MultiScale Rotation Invariance Features For Hyperspectral Image Classification and Retrieval",
        status: "Published",
        year: 2020,
        patentOffice: "Indian Patent Office"
      }
    ],
    grantsAndFunding: [
      {
        title: "NVIDIA Titan XP GPU Research Grant",
        fundingAgency: "NVIDIA Corporation",
        amount: "₹ 1,25,000/-",
        role: "Principal Investigator",
        year: "2019",
        description: "Awarded high-performance Titan XP GPU hardware to accelerate Ph.D. deep learning research on satellite image classification."
      }
    ],
    administrativeRoles: [
      { position: "Head of Department (HOD)", committee: "Department of CSE-IoT, TCET", scope: "Department Leadership", period: "Present" },
      { position: "Founder & Faculty Convener", committee: "TEDxTCET", scope: "Institutional / Global", period: "2018 - Present" },
      { position: "Founder", committee: "Astronomy Club of TCET", scope: "Institutional / Outreach", period: "2022 - Present" },
      { position: "ISRO Space Tutor SPOC", committee: "ISRO Educational Outreach Program", scope: "National Level", period: "Nov 2022 - Present" },
      { position: "Secretary & Core Committee Member", committee: "Multicon-W International Conference", scope: "Institute Level", period: "2010 - Present" },
      { position: "Associate Coordinator", committee: "NationWide RoadShow on Digital India RISC-V Vega Processors (MeITy)", scope: "National Level", period: "2022" },
      { position: "Initiator", committee: "Center of Excellence (COE) with CDAC", scope: "Institute Level", period: "2023" }
    ],
    initiatives: [
      { name: "TEDxTCET", description: "Proposed and launched TEDxTCET in 2018; successfully organized 7 international-level talks featuring eminent global speakers." },
      { name: "TCET Astronomy Club", description: "Founded in June 2022 to provide hands-on astronomy and space science educational outreach for school and college students." },
      { name: "ISRO Space Tutor Recognition", description: "Secured official ISRO Space Tutor status for TCET to conduct satellite technology awareness activities." }
    ],
    workshopsAndFDPs: [
      { title: "LTspice XVII Hands-on Workshop for Students", role: "Resource Person / Trainer", venue: "TCET Mumbai", type: "Conducted" },
      { title: "Faculty Development Session on Management Skills", role: "Resource Person", venue: "TCET Mumbai", type: "Conducted" },
      { title: "IRQS ISO 9001:2015 Quality Management System Lead Auditor", role: "Participant & Certified Lead Auditor", venue: "IRQS", type: "Attended" },
      { title: "IIT Bombay e-Yantra Robotics & Embedded Workshop", role: "Coordinator & Participant", venue: "IIT Bombay", type: "Attended" }
    ],
    subjectsTaught: [
      { subject: "Remote Sensing & Satellite Image Processing", level: "Undergraduate (UG)" },
      { subject: "Deep Learning & Neural Networks", level: "Undergraduate (UG)" },
      { subject: "Artificial Intelligence", level: "Undergraduate (UG)" },
      { subject: "Communication Engineering", level: "Undergraduate (UG)" },
      { subject: "Advanced Signal & Video Processing", level: "Postgraduate (PG)" }
    ],
    resources: [
      {
        title: "LTspice XVII Circuit Simulation Workshop Manual",
        category: "Lab Manual & Code",
        description: "Hands-on laboratory simulation guide and schematic files for electronic circuit analysis using LTspice XVII.",
        url: "https://sites.google.com/view/sujata-alegavi/subject-resources?authuser=0"
      },
      {
        title: "Remote Sensing & Satellite Image Processing Notes",
        category: "Lecture Notes",
        description: "Comprehensive lecture slides covering Hyperspectral Data Analysis, Soft Thresholding, and CNN Scene Classification.",
        url: "https://sites.google.com/view/sujata-alegavi/subject-resources?authuser=0"
      },
      {
        title: "Deep Learning & Artificial Intelligence Syllabus Reference",
        category: "Course Material",
        description: "Curriculum mapping, assignment problems, and tutorial references for UG/PG students.",
        url: "https://sites.google.com/view/sujata-alegavi/subject-resources?authuser=0"
      }
    ]
  },
  {
    metadata: {
      id: "sanjeev-ghosh",
      hierarchyOrder: 2, // Professor
      rankCategory: "Professor"
    },
    basicInfo: {
      prefix: "Dr.",
      fullName: "Sanjeev Ghosh",
      displayTitle: "Dr. Sanjeev Ghosh",
      designation: "Professor and Associate Dean (Quality Assurance & Accreditation)",
      department: "Computer Science & Engineering (Internet of Things)",
      institution: "Thakur College of Engineering & Technology (TCET)",
      campus: "Kandivali (East), Mumbai",
      profilePhotoUrl: "assets/images/sanjeev_ghosh.png",
      shortBio: "Professor and Associate Dean with over 22.5 years of academic expertise. Recognized Ph.D. guide at University of Mumbai, author, and researcher in Signal & Image Processing."
    },
    contact: {
      officialEmail: "sanjeev.ghosh@thakureducation.org",
      officeLocation: "Deanery Office / Dept of CSE-IoT, TCET Campus, Mumbai",
      address: "Thakur Educational Campus, Shyamnarayan Thakur Marg, Thakur Village, Kandivali-East, Mumbai-400101, Maharashtra",
      vidwanId: "398323",
      vidwanUrl: "https://tcetmumbai.irins.org/profile/398323",
      orcidId: null,
      scopusId: null,
      googleScholarUrl: null
    },
    socialLinks: [
      { platform: "Google Site", url: "https://sites.google.com/view/sanjeevnghosh/home", icon: "globe" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/sanjeev-ghosh-25171692", icon: "linkedin" },
      { platform: "IRINS Vidwan", url: "https://tcetmumbai.irins.org/profile/398323", icon: "id-card" }
    ],
    highlights: {
      teachingExperience: "22.5 Years",
      industryExperience: "N/A",
      highestQualification: "Ph.D. (Tech) - University of Mumbai",
      totalPublications: 33,
      booksPublished: 1,
      phdGuide: "Recognized Ph.D. Guide (MU)",
      projectsGuidedUG: 40,
      projectsGuidedPG: 11
    },
    education: [
      {
        degree: "Ph.D. (Technology)",
        fieldOfStudy: "Electronics & Telecommunication Engineering",
        institution: "University of Mumbai",
        year: null,
        status: "Awarded"
      },
      {
        degree: "M.E.",
        fieldOfStudy: "Electronics Engineering (ETRX)",
        institution: "University of Mumbai",
        year: null,
        status: "Awarded"
      },
      {
        degree: "B.E.",
        fieldOfStudy: "Electronics & Telecommunication Engineering (EXTC)",
        institution: "University of Mumbai",
        year: null,
        status: "Awarded"
      }
    ],
    experience: [
      {
        role: "Professor & Associate Dean (QA & Accreditation)",
        organization: "TCET Mumbai",
        type: "Teaching & Institutional Governance",
        durationYears: "22.5 Years",
        period: "2003 - Present",
        description: "Overseeing institutional quality assurance, NAAC/NBA accreditation, Ph.D. research guidance, and departmental teaching."
      }
    ],
    specializations: [
      "Wireless Communication",
      "Digital Image Processing",
      "Audio & Speech Processing",
      "Machine Learning"
    ],
    publications: {
      summary: { journals: 14, conferences: 19, books: 1, patents: 0 },
      items: [
        {
          title: "Textbook: Digital Image Processing & Machine Vision",
          authors: "Dr. Sanjeev Ghosh",
          venue: "Tech-Neo Publications",
          volume: "ISBN Academic Edition",
          year: 2022,
          type: "Book",
          indexing: ["Textbook Publication"],
          url: null
        },
        {
          title: "Image Processing based Book Reader with Facial Recognition & GPS Tracker for Visually Impaired",
          authors: "Dr. Sanjeev Ghosh et al.",
          venue: "Minor Research Project & IEEE Conference Publication",
          volume: "ICAC3-2019 Best Paper Award Winner",
          year: 2019,
          type: "Conference",
          indexing: ["IEEE", "Best Paper Award"],
          url: null
        }
      ]
    },
    grantsAndFunding: [
      {
        title: "Minor Research Grant for Visually Impaired Assistive System",
        fundingAgency: "University of Mumbai",
        amount: "₹ 35,000/-",
        role: "Principal Investigator",
        year: "AY 2015-16",
        description: "Development of image processing based book reader, facial recognition, and GPS tracker for visually impaired individuals."
      }
    ],
    administrativeRoles: [
      { position: "Associate Dean", committee: "Quality Assurance and Accreditation", scope: "Institute Level", period: "Present" },
      { position: "Recognized Ph.D. Guide", committee: "University of Mumbai (EXTC Board)", scope: "University Level", period: "Present" },
      { position: "Coordinator", committee: "ISTE Sponsored STTP on Analog Electronics", scope: "Institute Level", period: "Past" },
      { position: "Co-Convener", committee: "Multicon-W International Conferences", scope: "Institute Level", period: "2012 - Present" }
    ],
    initiatives: [
      { name: "Quality Assurance & Accreditation", description: "Directing NBA, NAAC, and Autonomous quality benchmarks for engineering programs across the institute." }
    ],
    workshopsAndFDPs: [
      { title: "ISTE Sponsored STTP on Analog Electronics", role: "Coordinator", venue: "TCET Mumbai", type: "Conducted" }
    ],
    subjectsTaught: [
      { subject: "Digital Image Processing", level: "Undergraduate (UG)" },
      { subject: "Wireless Communication", level: "Undergraduate (UG)" },
      { subject: "Audio & Speech Processing", level: "Postgraduate (PG)" },
      { subject: "Machine Learning Applications", level: "Postgraduate (PG)" }
    ],
    resources: [
      {
        title: "Digital Image Processing Course Outlines & Modules",
        category: "Course Material",
        description: "Complete module-wise notes, image transform algorithms, and MATLAB/Python code notebooks.",
        url: "https://sites.google.com/view/sanjeevnghosh/course-contents?authuser=0"
      },
      {
        title: "Wireless Communication Question Bank & Numerical Sets",
        category: "Study Material",
        description: "Curated question bank, previous year paper solutions, and link budget calculation references.",
        url: "https://sites.google.com/view/sanjeevnghosh/course-contents?authuser=0"
      },
      {
        title: "Analog Electronics STTP Workshop Presentations",
        category: "FDP & STTP Resource",
        description: "STTP training slides, circuit design hand-outs, and op-amp application references.",
        url: "https://sites.google.com/view/sanjeevnghosh/course-contents?authuser=0"
      }
    ]
  },
  {
    metadata: {
      id: "sunil-khatri",
      hierarchyOrder: 3, // Assistant Professor & Dy. HoD
      rankCategory: "Assistant Professor"
    },
    basicInfo: {
      prefix: "Mr.",
      fullName: "Sunil Kamlesh Khatri",
      displayTitle: "Mr. Sunil K. Khatri",
      designation: "Assistant Professor & I/c. Dy. HoD",
      department: "Computer Science & Engineering (Internet of Things)",
      institution: "Thakur College of Engineering & Technology (TCET)",
      campus: "Kandivali (East), Mumbai",
      profilePhotoUrl: "assets/images/sunil_khatri.jpg",
      shortBio: "Assistant Professor & In-charge Deputy Head of Department (CSE-IoT). 3-time GATE qualifier, IIC Convener, and researcher pursuing Ph.D. in IoT and Remote Sensing."
    },
    contact: {
      officialEmail: "sunil.khatri@thakureducation.org",
      officeLocation: "Department of CSE-IoT, TCET Campus, Mumbai",
      address: "Thakur Educational Campus, Shyamnarayan Thakur Marg, Thakur Village, Kandivali-East, Mumbai-400101, Maharashtra",
      vidwanId: "399151",
      vidwanUrl: "https://tcetmumbai.irins.org/profile/399151",
      orcidId: null,
      scopusId: null,
      googleScholarUrl: null
    },
    socialLinks: [
      { platform: "Google Site", url: "https://sites.google.com/view/skhatri/", icon: "globe" },
      { platform: "IRINS Vidwan", url: "https://tcetmumbai.irins.org/profile/399151", icon: "id-card" }
    ],
    highlights: {
      teachingExperience: "7.5 - 8 Years",
      industryExperience: "1 Year",
      highestQualification: "Ph.D.* (Pursuing) - SPPU",
      gateQualified: "3 Times (2021, 2017, 2013)",
      totalPublications: 6,
      researchGrant: "₹ 30,000/- (MU Minor Grant)",
      iicRole: "Convener, TCET IIC"
    },
    education: [
      {
        degree: "Ph.D.* (Technology)",
        fieldOfStudy: "Electronics & Telecommunication Engineering",
        institution: "Savitribai Phule Pune University (SPPU)",
        year: null,
        status: "Pursuing"
      },
      {
        degree: "M.E.",
        fieldOfStudy: "Electronics & Telecommunication Engineering",
        institution: "University of Mumbai",
        year: 2015,
        status: "Awarded"
      },
      {
        degree: "B.E.",
        fieldOfStudy: "Electronics & Telecommunication Engineering",
        institution: "University of Mumbai",
        year: 2013,
        status: "Awarded"
      }
    ],
    experience: [
      {
        role: "Assistant Professor & I/c. Dy. HoD",
        organization: "Department of CSE-IoT, TCET Mumbai",
        type: "Teaching & Administration",
        durationYears: "7.5 - 8 Years",
        period: "2017 - Present",
        description: "Handling academic coordination, Dy. HOD administrative responsibilities, and teaching core IoT and AI subjects."
      },
      {
        role: "Project Engineer",
        organization: "Industry",
        type: "Industry",
        durationYears: "1 Year",
        period: "2015 - 2016",
        description: "Embedded system development and industrial electronics integration."
      }
    ],
    specializations: [
      "Internet of Things (IoT)",
      "Remote Sensing and GIS",
      "Artificial Intelligence & Machine Learning",
      "Signal Processing"
    ],
    publications: {
      summary: { journals: 2, conferences: 2, bookChapters: 2, patents: 0 },
      items: [
        {
          title: "Scopus Indexed Research Article on Remote Sensing & IoT Applications",
          authors: "Sunil Khatri et al.",
          venue: "Scopus Journal of Engineering Research",
          volume: "Vol. 12, Issue 4",
          year: 2021,
          type: "Journal",
          indexing: ["Scopus"],
          url: null
        },
        {
          title: "IEEE Conference Paper on Intelligent IoT Sensor Networks",
          authors: "Sunil Khatri",
          venue: "IEEE International Conference Proceedings",
          volume: "IEEE Xplore Digital Library",
          year: 2020,
          type: "Conference",
          indexing: ["IEEE"],
          url: null
        },
        {
          title: "Springer Nature Book Chapter on AI in Remote Sensing",
          authors: "Sunil Khatri",
          venue: "Springer Nature Reference Series",
          volume: "Book Chapter Collection",
          year: 2022,
          type: "Book Chapter",
          indexing: ["Springer Nature"],
          url: null
        }
      ]
    },
    grantsAndFunding: [
      {
        title: "University Minor Research Project Grant",
        fundingAgency: "University of Mumbai",
        amount: "₹ 30,000/-",
        role: "Principal Investigator",
        year: "2021",
        description: "Funding awarded for academic research in IoT sensor network design and remote sensing."
      }
    ],
    administrativeRoles: [
      { position: "In-charge Deputy Head of Department (Dy. HoD)", committee: "Department of CSE-IoT, TCET", scope: "Department Level", period: "Present" },
      { position: "Convener", committee: "TCET Institution's Innovation Council (IIC)", scope: "Institute Level", period: "2022 - Present" },
      { position: "Advanced Innovation Ambassador", committee: "TCET IIC / MoE Innovation Cell", scope: "National Level", period: "2023 - Present" },
      { position: "Co-Convener", committee: "ICCCDS Conference, Multicon-W 2025", scope: "Institute Level", period: "2025" },
      { position: "Faculty SPOC", committee: "TEDxTCET Facilitation", scope: "Institute Level", period: "2019 - Present" },
      { position: "Faculty Advisor", committee: "IEI TCET Professional Body", scope: "Department Level", period: "2020 - Present" }
    ],
    initiatives: [
      { name: "Institution's Innovation Council (IIC)", description: "Directing campus innovation, startup mentoring, and hackathon participation under Ministry of Education guidelines." }
    ],
    workshopsAndFDPs: [
      { title: "2-Month NNRMS-ISRO Sponsored Training in Remote Sensing & GIS", role: "Participant", venue: "Indian Institute of Remote Sensing (IIRS), Dehradun", type: "Attended" },
      { title: "Faculty Development Program (FDP)", role: "Participant", venue: "IIT Kanpur", type: "Attended" },
      { title: "Advanced Faculty Training Program", role: "Participant", venue: "IIM / IMD Ahmedabad", type: "Attended" }
    ],
    subjectsTaught: [
      { subject: "Internet of Things (IoT)", level: "Undergraduate (UG)" },
      { subject: "Remote Sensing & GIS", level: "Undergraduate (UG)" },
      { subject: "Artificial Intelligence & ML", level: "Undergraduate (UG)" },
      { subject: "Signal Processing", level: "Undergraduate (UG)" }
    ],
    resources: [
      {
        title: "Video Tutorial: Phasor Diagram of Transformer",
        category: "Video Lecture",
        description: "Step-by-step video lecture explaining transformer phasor diagram under resistive and inductive loads.",
        url: "https://www.youtube.com/watch?v=4S-XKOAv2co"
      },
      {
        title: "Zoom Meeting Scheduling & Conduct Guidelines (Part 1 - 3)",
        category: "Video Series",
        description: "3-part video guide on Zoom meeting creation, screen sharing, conduct, and termination for online teaching.",
        url: "https://www.youtube.com/watch?v=30n7i5Wkz4w"
      },
      {
        title: "Internet of Things & Remote Sensing Lab Experiments",
        category: "Lab Manual",
        description: "Hands-on sensor interfacing guides, GIS mapping exercises, and IoT protocol practical notes.",
        url: "https://sites.google.com/view/skhatri/subject-resources?authuser=0"
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = facultyData;
}
