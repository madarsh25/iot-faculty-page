/* ==========================================================================
   TCET Faculty Portfolio System - Core Application Engine (v4.0)
   - Separated Teaching & Non-Teaching Faculty Directories
   - Dynamic Experience Statistics Insights
   - Modern Responsive Layout & Fast Hash Routing
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof facultyData === 'undefined') {
    console.error('facultyData module not found!');
    return;
  }

  const appEl = document.getElementById('app');
  let currentFilter = 'ALL';
  let searchQuery = '';
  let currentPageType = 'teaching';

  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  function handleRoute() {
    const hash = window.location.hash || '#teaching';
    if (hash.startsWith('#portfolio/')) {
      const parts = hash.replace('#portfolio/', '').split('/');
      const facultyId = parts[0];
      const activeTab = parts[1] || 'profile';
      renderPortfolioView(facultyId, activeTab);
    } else if (hash === '#non-teaching') {
      currentPageType = 'non-teaching';
      currentFilter = 'ALL';
      searchQuery = '';
      renderDirectoryView('non-teaching');
    } else {
      currentPageType = 'teaching';
      if (currentFilter === 'SUPPORT_STAFF') currentFilter = 'ALL';
      renderDirectoryView('teaching');
    }
  }

  /* ==========================================================================
     UTILITY FUNCTIONS FOR EXPERIENCE STATS CALCULATIONS
     ========================================================================== */
  function parseExperienceYears(str) {
    if (!str || str === '-' || str.toLowerCase() === 'nil' || str.toLowerCase() === 'none') return 0;
    const strClean = str.toString().trim();
    const yearsMatch = strClean.match(/(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/i);
    const monthsMatch = strClean.match(/(\d+)\s*(?:months?|mos?)/i);
    let years = 0;
    if (yearsMatch) {
      years = parseFloat(yearsMatch[1]);
    } else {
      const numMatch = strClean.match(/^(\d+(?:\.\d+)?)$/);
      if (numMatch) years = parseFloat(numMatch[1]);
    }
    if (monthsMatch) {
      years += parseInt(monthsMatch[1]) / 12;
    }
    return years;
  }

  function parseDate(dateStr) {
    if (!dateStr || dateStr === '-' || dateStr.toLowerCase() === 'nil') return null;
    const clean = dateStr.replace(/(\d+)(?:st|nd|rd|th)/gi, '$1').trim();
    
    if (clean.includes('/')) {
      const parts = clean.split('/');
      let day = parseInt(parts[0]);
      let month = parseInt(parts[1]) - 1;
      let year = parseInt(parts[2]);
      if (year < 100) year += 2000;
      if (year < 1990) year += 100;
      return new Date(year, month, day);
    } else if (clean.includes('-')) {
      const parts = clean.split('-');
      let day = parseInt(parts[0]);
      let month = parseInt(parts[1]) - 1;
      let year = parseInt(parts[2]);
      if (year < 100) year += 2000;
      if (year < 1990) year += 100;
      return new Date(year, month, day);
    }
    const d = new Date(clean);
    if (!isNaN(d.getTime())) {
      if (d.getFullYear() < 1990 && d.getFullYear() > 1900) {
        d.setFullYear(d.getFullYear() + 100);
      }
      return d;
    }
    return null;
  }

  function getTeachingExperience(f) {
    if (f.metadata.rankCategory === "Support Staff") return 0;
    return parseExperienceYears(f.experience.teaching);
  }

  function getIndustryExperience(f) {
    return parseExperienceYears(f.experience.industry);
  }

  function getTCETExperience(f) {
    let dateStr = f.experience.dateOfJoiningTCET;
    if (!dateStr || dateStr === '-') {
      if (f.metadata.rankCategory === "Support Staff") {
        return parseExperienceYears(f.experience.total);
      }
      return 0;
    }
    
    const joinDate = parseDate(dateStr);
    if (!joinDate || isNaN(joinDate.getTime())) {
      if (f.metadata.rankCategory === "Support Staff") {
        return parseExperienceYears(f.experience.total);
      }
      return 0;
    }

    const currentDate = new Date(2026, 7, 25); // August 25, 2026
    const diffMs = currentDate - joinDate;
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, parseFloat(diffYears.toFixed(2)));
  }

  function getIoTExperience(f) {
    let dateStr = f.experience.dojIoT;
    if (!dateStr || dateStr === '-') return 0;
    
    const joinDate = parseDate(dateStr);
    if (!joinDate || isNaN(joinDate.getTime())) return 0;

    const currentDate = new Date(2026, 7, 25); // August 25, 2026
    const diffMs = currentDate - joinDate;
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, parseFloat(diffYears.toFixed(2)));
  }

  function getMedian(arr) {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 !== 0) {
      return sorted[mid];
    }
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /* ==========================================================================
     1. MAIN DIRECTORY LANDING PAGE (RESTYLED WITH STICKY LEFT SIDEBAR)
     ========================================================================== */
    function renderDirectoryView(pageType = 'teaching') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentPageType = pageType;

    const teachingFaculty = facultyData.filter(f => f.metadata.rankCategory !== "Support Staff");
    const nonTeachingFaculty = facultyData.filter(f => f.metadata.rankCategory === "Support Staff");
    const currentList = pageType === 'non-teaching' ? nonTeachingFaculty : teachingFaculty;

    // Dynamic Experience Stats Calculation
    const teachingList = currentList.map(f => getTeachingExperience(f)).filter(exp => exp > 0);
    const industryList = currentList.map(f => getIndustryExperience(f)).filter(exp => exp > 0);
    const tcetList = currentList.map(f => getTCETExperience(f)).filter(exp => exp > 0);
    const iotList = currentList.map(f => getIoTExperience(f)).filter(exp => exp > 0);

    const stats = {
      teaching: {
        max: teachingList.length ? Math.max(...teachingList) : 0,
        min: teachingList.length ? Math.min(...teachingList) : 0
      },
      industry: {
        max: industryList.length ? Math.max(...industryList) : 0,
        min: industryList.length ? Math.min(...industryList) : 0
      },
      tcet: {
        max: tcetList.length ? Math.max(...tcetList) : 0,
        min: tcetList.length ? Math.min(...tcetList) : 0
      },
      iot: {
        max: iotList.length ? Math.max(...iotList) : 0,
        min: iotList.length ? Math.min(...iotList) : 0
      }
    };

    const isTeaching = pageType === 'teaching';

    appEl.innerHTML = `
      <!-- Top Header Official Graphic Banner -->
      <div class="top-official-banner">
        <a href="https://www.tcetmumbai.in/IOT/" target="_blank" rel="noopener noreferrer">
          <img src="assets/images/tcet_banner.png" alt="TCET Department of Computer Science & Engineering (IoT) Banner" class="top-banner-img">
        </a>
      </div>

      <!-- Sticky Header Nav with Official TCET Shield Logo -->
      <header class="tcet-header">
        <div class="container header-inner">
          <a href="https://www.tcetmumbai.in/IOT/" target="_blank" rel="noopener noreferrer" class="header-brand">
            <img src="assets/images/tcet_college_logo.png" alt="TCET Logo" class="brand-tcet-logo-img" onerror="this.onerror=null; this.src='assets/images/tcet_college-logo.png';">
            <span class="brand-title-small">Faculty Portfolio System</span>
          </a>
          <nav class="header-nav">
            <a href="#teaching" class="nav-link ${isTeaching ? 'active' : ''}"><i class="fa-solid fa-chalkboard-user"></i> Teaching Faculty</a>
            <a href="#non-teaching" class="nav-link ${!isTeaching ? 'active' : ''}"><i class="fa-solid fa-user-gear"></i> Non-Teaching Staff</a>
          </nav>
        </div>
      </header>

      <!-- Department Hero Section -->
      <section class="hero-banner">
        <div class="container hero-content">
          <span class="hero-badge">
            <i class="fa-solid ${isTeaching ? 'fa-microchip' : 'fa-flask'}"></i> 
            ${isTeaching ? 'Academic Faculty Profiles' : 'Technical Support Staff'}
          </span>
          <h1 class="hero-title">${isTeaching ? 'CSE-IoT Department Teaching Faculty' : 'CSE-IoT Department Non-Teaching Staff'}</h1>
          <p class="hero-desc">
            ${isTeaching 
              ? 'Explore academic qualifications, research publications, teaching subjects, patents, funding grants, and instructional resources of the Department of Computer Science & Engineering (IoT) teaching faculty.' 
              : 'Explore technical expertise, laboratory maintenance responsibilities, project support, and administrative infrastructure of the CSE-IoT Department support personnel.'}
          </p>
          <div class="dept-stats">
            <div class="stat-item">
              <h4>${currentList.length}</h4>
              <p>${isTeaching ? 'Teaching Faculty' : 'Support Staff'}</p>
            </div>
            ${isTeaching ? `
              <div class="stat-item">
                <h4>100+</h4>
                <p>Research Publications</p>
              </div>
              <div class="stat-item">
                <h4>₹ 1.9L+</h4>
                <p>Research Grants</p>
              </div>
              <div class="stat-item">
                <h4>CBCGS-HME</h4>
                <p>2025 Autonomous</p>
              </div>
            ` : `
              <div class="stat-item">
                <h4>4 Labs</h4>
                <p>IoT Laboratories</p>
              </div>
              <div class="stat-item">
                <h4>100%</h4>
                <p>Technical Support</p>
              </div>
              <div class="stat-item">
                <h4>CSE-IoT</h4>
                <p>Lab Operations</p>
              </div>
            `}
          </div>
        </div>
      </section>

      <!-- Main Directory Layout with Left Sidebar and Right Cards Panel -->
      <div class="container landing-split-layout">
        
        <!-- Left Sidebar Panel containing Search, Filters, and Stats -->
        <aside class="sidebar-panel">
          
          <!-- Sticky Search Box -->
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="searchInput" placeholder="Search ${isTeaching ? 'faculty' : 'staff'}..." value="${searchQuery}">
          </div>

          <!-- Sticky Precedence Filters -->
          <div class="filter-group">
            <button class="filter-btn ${currentFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">All ${isTeaching ? 'Precedence' : 'Staff'}</button>
            ${isTeaching ? `
              <button class="filter-btn ${currentFilter === 'HOD' ? 'active' : ''}" data-filter="HOD">HOD</button>
              <button class="filter-btn ${currentFilter === 'PROFESSOR' ? 'active' : ''}" data-filter="PROFESSOR">Professors</button>
              <button class="filter-btn ${currentFilter === 'ASST_PROF' ? 'active' : ''}" data-filter="ASST_PROF">Assistant Professors</button>
            ` : ''}
          </div>

          <!-- Redesigned Experience Statistics Insights Dashboard -->
          <div class="sidebar-experience-stats">
            <h3><i class="fa-solid fa-chart-line"></i> Experience Insights</h3>
                       ${isTeaching ? `
              <!-- 1. Teaching Experience -->
              <div class="stat-category-card">
                <h4><i class="fa-solid fa-graduation-cap"></i> Teaching Exp.</h4>
                <div class="stat-row">
                  <span>Maximum:</span>
                  <strong>${stats.teaching.max.toFixed(1)} Yrs</strong>
                </div>
                <div class="stat-row">
                  <span>Minimum:</span>
                  <strong>${stats.teaching.min.toFixed(1)} Yrs</strong>
                </div>
              </div>

              <!-- 2. Industry Experience -->
              <div class="stat-category-card">
                <h4><i class="fa-solid fa-industry"></i> Industry Exp.</h4>
                <div class="stat-row">
                  <span>Maximum:</span>
                  <strong>${stats.industry.max.toFixed(1)} Yrs</strong>
                </div>
                <div class="stat-row">
                  <span>Minimum:</span>
                  <strong>${stats.industry.min.toFixed(1)} Yrs</strong>
                </div>
              </div>
            ` : ''}

            <!-- 3. TCET Experience -->
            <div class="stat-category-card highlight-card">
              <h4><i class="fa-solid fa-building-columns"></i> Years in TCET</h4>
              <div class="stat-row">
                <span>Maximum:</span>
                <strong>${stats.tcet.max.toFixed(1)} Yrs</strong>
              </div>
              <div class="stat-row">
                <span>Minimum:</span>
                <strong>${stats.tcet.min.toFixed(1)} Yrs</strong>
              </div>
            </div>

            <!-- 4. IoT Dept Experience -->
            ${isTeaching ? `
            <div class="stat-category-card">
              <h4><i class="fa-solid fa-microchip"></i> Years in TCET (IoT Dept)</h4>
              <div class="stat-row">
                <span>Maximum:</span>
                <strong>${stats.iot.max.toFixed(1)} Yrs</strong>
              </div>
              <div class="stat-row">
                <span>Minimum:</span>
                <strong>${stats.iot.min.toFixed(1)} Yrs</strong>
              </div>
            </div>
            ` : ''}

          </div>
        </aside>

        <!-- Right Content Cards Panel -->
        <main class="cards-panel">
          <!-- Page Switch Callout Banner -->
          <div class="info-card page-switch-callout" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; background: ${isTeaching ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'}; border-color: ${isTeaching ? '#FDE68A' : '#BFDBFE'};">
            <div>
              <strong style="color: var(--primary-navy); font-size: 0.95rem;">
                <i class="fa-solid ${isTeaching ? 'fa-user-gear' : 'fa-chalkboard-user'}" style="color: ${isTeaching ? 'var(--accent-gold)' : 'var(--primary-blue)'}; margin-right: 0.4rem;"></i>
                ${isTeaching ? 'Looking for Non-Teaching Support Staff?' : 'Looking for Teaching Faculty?'}
              </strong>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.15rem;">
                ${isTeaching ? 'View lab assistants, workshop instructors, and technical administrative staff.' : 'Explore professors, associate professors, and assistant professors directory.'}
              </p>
            </div>
            <a href="${isTeaching ? '#non-teaching' : '#teaching'}" class="btn ${isTeaching ? 'btn-outline' : 'btn-primary'}" style="${isTeaching ? 'border-color: var(--accent-gold); background: #FFFFFF;' : ''} font-weight: 700; white-space: nowrap;">
              ${isTeaching ? 'Go to Non-Teaching Staff' : 'Go to Teaching Faculty'} <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div class="faculty-modern-grid" id="facultyGridContainer" style="margin-bottom: 2rem;">
            <!-- Filled dynamically by updateFilteredGrid -->
          </div>
        </main>

      </div>

      <!-- Institutional Footer -->
      ${createInstitutionalFooterHtml()}

      <!-- Quick View Modal Container -->
      <div id="quickViewModal" class="modal-backdrop">
        <div class="modal-card">
          <button class="modal-close" id="closeModalBtn"><i class="fa-solid fa-xmark"></i></button>
          <div id="modalBody"></div>
        </div>
      </div>
    `;

    // Render grid contents initially
    updateFilteredGrid();

    // Event listener for live search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        updateFilteredGrid();
      });
    }

    // Event listener for precedence filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        updateFilteredGrid();
      });
    });

    const modalBackdrop = document.getElementById('quickViewModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }
  }

    /* Live-updates the grid dynamically when search query or filter changes */
  function updateFilteredGrid() {
    const filteredFaculty = facultyData.filter(f => {
      const isSupportStaff = f.metadata.rankCategory === 'Support Staff';
      if (currentPageType === 'teaching' && isSupportStaff) return false;
      if (currentPageType === 'non-teaching' && !isSupportStaff) return false;

      const matchesSearch = searchQuery === '' || 
        f.basicInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.specializations && f.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (f.technicalSkills && f.technicalSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        f.basicInfo.designation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = currentFilter === 'ALL' ||
        (currentFilter === 'HOD' && f.metadata.rankCategory.includes('Head of Department')) ||
        (currentFilter === 'PROFESSOR' && f.metadata.rankCategory === 'Professor') ||
        (currentFilter === 'ASST_PROF' && f.metadata.rankCategory.includes('Assistant Professor')) ||
        (currentFilter === 'SUPPORT_STAFF' && f.metadata.rankCategory === 'Support Staff');

      return matchesSearch && matchesFilter;
    });

    const gridEl = document.getElementById('facultyGridContainer');
    if (!gridEl) return;

    gridEl.innerHTML = `
      ${filteredFaculty.map(f => createModernFacultyCardHtml(f)).join('')}

      ${filteredFaculty.length === 0 ? `
        <div class="info-card" style="text-align:center; padding: 3rem; grid-column: 1 / -1;">
          <i class="fa-solid fa-user-slash" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
          <h3>No ${currentPageType === 'teaching' ? 'teaching faculty' : 'non-teaching staff'} profiles match your search query.</h3>
          <p style="color: var(--text-light); margin-top: 0.5rem;">Try adjusting your query or resetting filters.</p>
        </div>
      ` : ''}
    `;

    // Rebind quick view buttons
    document.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openQuickViewModal(id);
      });
    });
  }

  function createModernFacultyCardHtml(f) {
    const isHod = f.metadata.rankCategory.includes('Head of Department');
    const qualSummary = f.education && f.education.length > 0 
      ? f.education.map(e => {
          const deg = (e.degree || '').replace(/,$/, '').trim();
          let spec = (e.specialization && e.specialization !== '-' && e.specialization.toLowerCase() !== 'engineering') ? ` (${e.specialization})` : '';
          return `${deg}${spec}`.trim();
        }).filter(q => q.length > 0).join(' • ') 
      : '-';
    const specTags = f.specializations ? f.specializations.slice(0, 3) : (f.technicalSkills ? f.technicalSkills.slice(0, 3) : []);

    return `
      <div class="faculty-card-modern ${isHod ? 'rank-hod' : ''}">
        <div class="card-accent-bar"></div>
        <div class="card-inner-body">
          <div class="card-header-flex">
            <img src="${f.basicInfo.profilePhotoUrl}" alt="${f.basicInfo.fullName}" class="card-avatar">
            <div class="card-title-group">
              <h3>${f.basicInfo.displayTitle}</h3>
              <p class="designation">${f.basicInfo.designation}</p>
              ${f.contact.vidwanId && f.contact.vidwanId !== '-' ? `<p class="vidwan-tag"><i class="fa-solid fa-id-card"></i> Vidwan ID: <strong>${f.contact.vidwanId}</strong></p>` : ''}
            </div>
          </div>

          <div class="qualifications-box">
            <strong>QUALIFICATIONS:</strong>
            <p class="qual-inline">${qualSummary}</p>
          </div>

          <div class="specs-flex">
            ${specTags.map(s => `<span class="spec-badge">${s}</span>`).join('')}
          </div>

          <div class="card-actions-grid">
            <button class="btn btn-outline btn-quick-view" data-id="${f.metadata.id}">
              <i class="fa-regular fa-eye"></i> Quick View
            </button>
            <a href="#portfolio/${f.metadata.id}/profile" class="btn btn-primary">
              View Portfolio <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     2. PERSONAL FACULTY & STAFF PORTFOLIO VIEW
     ========================================================================== */
  function renderPortfolioView(facultyId, activeTab) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const f = facultyData.find(item => item.metadata.id === facultyId);
    if (!f) {
      appEl.innerHTML = `
        <div class="container" style="padding: 5rem 0; text-align: center;">
          <h2>Profile Not Found</h2>
          <p style="margin-top: 1rem;"><a href="#teaching" class="btn btn-primary">Return to Faculty Directory</a></p>
        </div>
      `;
      return;
    }

    const isSupportStaff = f.metadata.rankCategory === "Support Staff";

    const tabs = isSupportStaff ? [
      { id: 'profile', label: 'Profile', icon: 'fa-user' },
      { id: 'expertise', label: 'Technical Expertise', icon: 'fa-screwdriver-wrench' },
      { id: 'lab', label: 'Lab & Responsibilities', icon: 'fa-flask' },
      { id: 'achievements', label: 'Training & Achievements', icon: 'fa-certificate' }
    ] : [
      { id: 'profile', label: 'Profile', icon: 'fa-user' },
      { id: 'teaching', label: 'Teaching', icon: 'fa-chalkboard-user' },
      { id: 'research', label: 'Research & Development', icon: 'fa-flask' },
      { id: 'projects', label: 'Projects & Mentoring', icon: 'fa-list-check' },
      { id: 'achievements', label: 'Achievements & Development', icon: 'fa-trophy' },
      { id: 'activities', label: 'Professional Activities', icon: 'fa-briefcase' }
    ];

    appEl.innerHTML = `
      <!-- Top Official Graphic Banner -->
      <div class="top-official-banner">
        <a href="https://www.tcetmumbai.in/IOT/" target="_blank" rel="noopener noreferrer">
          <img src="assets/images/tcet_banner.png" alt="TCET Department Header Banner" class="top-banner-img">
        </a>
      </div>

      <!-- Sticky Header Nav with Official TCET Shield Logo -->
      <header class="tcet-header">
        <div class="container header-inner">
          <a href="https://www.tcetmumbai.in/IOT/" target="_blank" rel="noopener noreferrer" class="header-brand">
            <img src="assets/images/tcet_college_logo.png" alt="TCET Logo" class="brand-tcet-logo-img" onerror="this.onerror=null; this.src='assets/images/tcet_college-logo.png';">
            <span class="brand-title-small">Faculty Portfolio System</span>
          </a>
          <nav class="header-nav">
            <a href="${isSupportStaff ? '#non-teaching' : '#teaching'}" class="nav-link nav-btn-back"><i class="fa-solid fa-arrow-left"></i> ${isSupportStaff ? 'Back to Non-Teaching Staff' : 'Back to Teaching Faculty'}</a>
          </nav>
        </div>
      </header>

      <!-- Portfolio Hero Banner -->
      <section class="portfolio-header-banner">
        <div class="container portfolio-hero-grid">
          <img src="${f.basicInfo.profilePhotoUrl}" alt="${f.basicInfo.fullName}" class="portfolio-avatar-large">
          <div class="portfolio-hero-info">
            <span class="hero-badge"><i class="fa-solid fa-certificate"></i> ${f.metadata.rankCategory}</span>
            <h1>${f.basicInfo.displayTitle}</h1>
            <p class="p-designation">${f.basicInfo.designation}</p>
            <p class="p-dept"><i class="fa-solid fa-building-columns"></i> Department of Computer Science & Engineering (Internet of Things) | Thakur College of Engineering & Technology (TCET)</p>
            
            <!-- Hero Links: Separate and individually labeled -->
            <div class="portfolio-hero-actions" style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${f.contact.orcidUrl && f.contact.orcidUrl !== '-' ? `
                <a href="${f.contact.orcidUrl}" target="_blank" class="p-vidwan-button" style="background:#A3E635; color:#0F2042;">
                  <i class="fa-brands fa-orcid"></i> ORCID
                </a>
              ` : ''}
              ${f.contact.scopusUrl && f.contact.scopusUrl !== '-' ? `
                <a href="${f.contact.scopusUrl}" target="_blank" class="p-vidwan-button" style="background:#38BDF8; color:#0F2042;">
                  <i class="fa-solid fa-graduation-cap"></i> Scopus
                </a>
              ` : ''}
              ${f.contact.googleScholarUrl && f.contact.googleScholarUrl !== '-' ? `
                <a href="${f.contact.googleScholarUrl}" target="_blank" class="p-vidwan-button" style="background:#FBBF24; color:#0F2042;">
                  <i class="fa-brands fa-google"></i> Google Scholar
                </a>
              ` : ''}
              ${f.contact.researchGateUrl && f.contact.researchGateUrl !== '-' ? `
                <a href="${f.contact.researchGateUrl}" target="_blank" class="p-vidwan-button" style="background:#F472B6; color:#0F2042;">
                  <i class="fa-brands fa-researchgate"></i> ResearchGate
                </a>
              ` : ''}
              ${f.contact.vidwanUrl && f.contact.vidwanUrl !== '-' ? `
                <a href="${f.contact.vidwanUrl}" target="_blank" class="p-vidwan-button" style="background:#FB7185; color:#0F2042;">
                  <i class="fa-solid fa-id-card"></i> Vidwan ID: ${f.contact.vidwanId}
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation Tabs -->
      <nav class="portfolio-tab-nav">
        <div class="container">
          <div class="portfolio-tab-list">
            ${tabs.map(t => `
              <button class="tab-btn ${activeTab === t.id ? 'active' : ''}" onclick="window.location.hash='#portfolio/${f.metadata.id}/${t.id}'">
                <i class="fa-solid ${t.icon}"></i> ${t.label}
              </button>
            `).join('')}
          </div>
        </div>
      </nav>

      <!-- Portfolio Sub-Page Content Container -->
      <main class="container portfolio-subpage-container">
        ${renderPortfolioTabContent(f, activeTab)}
      </main>

      <!-- Redesigned Faculty-First Footer (70% Faculty / 30% College) -->
      ${createFacultyFooterHtml(f)}
    `;
  }

  /* Render Sub-Page Content Based on Selected Tab */
  function renderPortfolioTabContent(f, tab) {
    const hasData = (val) => val && (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0 && val !== '-');
    const isSupportStaff = f.metadata.rankCategory === "Support Staff";

    if (isSupportStaff) {
      switch (tab) {
        /* TAB 1: PROFILE */
        case 'profile': {
          const showBio = hasData(f.basicInfo.shortBio);
          const showEducation = hasData(f.education);
          const showExperience = hasData(f.experience);

          if (!showBio && !showEducation && !showExperience) {
            return `<div class="info-card"><p>No profile data available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-user"></i> Profile & Overview</h2>
            
            ${showBio ? `
              <div class="info-card">
                <h3 style="font-size:1.1rem; color:var(--primary-navy); margin-bottom:0.5rem;"><i class="fa-solid fa-user-tie"></i> Biography</h3>
                <p style="font-size:1rem; line-height:1.7; color:var(--text-main);">${f.basicInfo.shortBio}</p>
              </div>
            ` : ''}

            <div class="responsive-grid-2col">
              ${showEducation ? `
                <div class="info-card">
                  <h3 style="font-size:1.15rem; color:var(--primary-navy); margin-bottom:1.25rem;"><i class="fa-solid fa-user-graduate"></i> Educational Qualifications</h3>
                  <div class="timeline">
                    ${f.education.map(e => `
                      <div class="timeline-item">
                        <div class="timeline-title">${e.degree}</div>
                        ${e.specialization && e.specialization !== '-' ? `<div class="timeline-subtitle">${e.specialization}</div>` : ''}
                        <div class="timeline-meta">${e.institution || ''} ${e.year ? `• ${e.year}` : ''}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${showExperience ? `
                <div class="info-card">
                  <h3 style="font-size:1.15rem; color:var(--primary-navy); margin-bottom:1.25rem;"><i class="fa-solid fa-briefcase"></i> Experience</h3>
                  <div style="display:flex; flex-direction:column; gap:0.75rem;">
                    ${f.experience.total && f.experience.total !== '-' ? `<p><strong>Total Experience:</strong> ${f.experience.total}</p>` : ''}
                    ${f.experience.teaching && f.experience.teaching !== '-' ? `<p><strong>Teaching Experience:</strong> ${f.experience.teaching}</p>` : ''}
                    ${f.experience.industry && f.experience.industry !== '-' ? `<p><strong>Industry Experience:</strong> ${f.experience.industry}</p>` : ''}
                    ${f.experience.research && f.experience.research !== '-' ? `<p><strong>Research Experience:</strong> ${f.experience.research}</p>` : ''}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }

        /* TAB 2: TECHNICAL EXPERTISE */
        case 'expertise': {
          const showSkills = hasData(f.technicalSkills);
          const showOther = hasData(f.otherDetails);

          if (!showSkills && !showOther) {
            return `<div class="info-card"><p>No expertise details available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-screwdriver-wrench"></i> Technical Expertise</h2>
            
            ${showSkills ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-gears"></i> Technical Skills & Tools</h3>
                <div class="specs-flex" style="margin-top: 0.5rem;">
                  ${f.technicalSkills.map(s => `<span class="spec-badge" style="font-size:0.9rem; padding:0.4rem 0.8rem;">${s}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${showOther ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-circle-info"></i> Other Details</h3>
                <ul style="display:flex; flex-direction:column; gap:0.75rem;">
                  ${f.otherDetails.map(d => `<li style="line-height:1.6; color:var(--text-main);"><i class="fa-solid fa-circle-chevron-right" style="color:var(--primary-blue); margin-right:0.5rem;"></i> ${d}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          `;
        }

        /* TAB 3: LAB & RESPONSIBILITIES */
        case 'lab': {
          const showLabs = hasData(f.laboratoriesHandled);
          const showResp = hasData(f.labResponsibilities);
          const showProj = hasData(f.projectsSupported);

          if (!showLabs && !showResp && !showProj) {
            return `<div class="info-card"><p>No laboratory details available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-flask"></i> Lab & Responsibilities</h2>

            ${showLabs ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-network-wired"></i> Laboratories Handled / Supported</h3>
                <ul style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${f.laboratoriesHandled.map(l => `<li style="line-height:1.6;"><i class="fa-solid fa-chevron-right" style="color:var(--accent-gold); font-size:0.8rem;"></i> ${l}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${showResp ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-list-check"></i> Laboratory Responsibilities</h3>
                <ul style="display:flex; flex-direction:column; gap:0.75rem;">
                  ${f.labResponsibilities.map(r => `<li style="line-height:1.6;"><i class="fa-solid fa-circle-check" style="color:var(--primary-blue); margin-right:0.5rem;"></i> ${r}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${showProj ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-diagram-project"></i> Projects & Prototypes Supported</h3>
                <ul style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${f.projectsSupported.map(p => `<li style="line-height:1.6;"><i class="fa-solid fa-circle-chevron-right" style="color:#10B981; margin-right:0.5rem;"></i> ${p}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          `;
        }

        /* TAB 4: TRAINING & ACHIEVEMENTS */
        case 'achievements': {
          const showCert = hasData(f.achievements.certifications);
          const showFdp = hasData(f.achievements.fdpAttended);
          const showResp = hasData(f.achievements.responsibilities);

          if (!showCert && !showFdp && !showResp) {
            return `<div class="info-card"><p>No training or achievements available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-certificate"></i> Training & Achievements</h2>

            ${showCert ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-award"></i> Certifications / Technical Training</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.achievements.certifications.map((c, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #10B981; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${c}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showFdp ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-chalkboard-user"></i> FDP / STTP / Workshops Attended</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.achievements.fdpAttended.map((w, idx) => `
                    <li style="line-height:1.6; border-left:3px solid var(--primary-blue); padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${w}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showResp ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-sitemap"></i> Institutional & Department Responsibilities</h3>
                <ul style="display:flex; flex-direction:column; gap:0.75rem;">
                  ${f.achievements.responsibilities.map(r => `<li style="line-height:1.6;"><i class="fa-solid fa-circle-info" style="color:var(--accent-gold); margin-right:0.5rem;"></i> ${r}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          `;
        }

        default:
          return `<p>Select a tab above to view details.</p>`;
      }
    } else {
      switch (tab) {
        /* TAB 1: PROFILE */
        case 'profile': {
          const showBio = hasData(f.basicInfo.shortBio);
          const showEducation = hasData(f.education);
          const showExperience = hasData(f.experience);
          const showSpecializations = hasData(f.specializations);

          if (!showBio && !showEducation && !showExperience && !showSpecializations) {
            return `<div class="info-card"><p>No profile data available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-user"></i> Profile & Overview</h2>
            
            ${showBio ? `
              <div class="info-card">
                <h3 style="font-size:1.1rem; color:var(--primary-navy); margin-bottom:0.5rem;"><i class="fa-solid fa-user-tie"></i> Biography</h3>
                <p style="font-size:1rem; line-height:1.7; color:var(--text-main);">${f.basicInfo.shortBio}</p>
              </div>
            ` : ''}

            ${showSpecializations ? `
              <div class="info-card">
                <h3 style="font-size:1.05rem; color:var(--primary-navy); margin-bottom:0.75rem;"><i class="fa-solid fa-microchip"></i> Areas of Specialization</h3>
                <div class="specs-flex">
                  ${f.specializations.map(s => `<span class="spec-badge" style="font-size:0.85rem; padding:0.4rem 0.8rem;">${s}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            <div class="responsive-grid-2col">
              ${showEducation ? `
                <div class="info-card">
                  <h3 style="font-size:1.15rem; color:var(--primary-navy); margin-bottom:1.25rem;"><i class="fa-solid fa-user-graduate"></i> Educational Qualifications</h3>
                  <div class="timeline">
                    ${f.education.map(e => `
                      <div class="timeline-item">
                        <div class="timeline-title">${e.degree}</div>
                        ${e.specialization && e.specialization !== '-' ? `<div class="timeline-subtitle">${e.specialization}</div>` : ''}
                        <div class="timeline-meta">${e.institution || ''} ${e.year ? `• ${e.year}` : ''}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${showExperience ? `
                <div class="info-card">
                  <h3 style="font-size:1.15rem; color:var(--primary-navy); margin-bottom:1.25rem;"><i class="fa-solid fa-briefcase"></i> Experience</h3>
                  <div style="display:flex; flex-direction:column; gap:0.75rem;">
                    ${f.experience.teaching && f.experience.teaching !== '-' ? `<p><strong>Total Teaching Experience:</strong> ${f.experience.teaching}</p>` : ''}
                    ${f.experience.industry && f.experience.industry !== '-' ? `<p><strong>Industry Experience:</strong> ${f.experience.industry}</p>` : ''}
                    ${f.experience.research && f.experience.research !== '-' ? `<p><strong>Research Experience:</strong> ${f.experience.research}</p>` : ''}
                    ${f.experience.dateOfJoiningTCET && f.experience.dateOfJoiningTCET !== '' ? `<p><strong>Date of Joining TCET:</strong> ${f.experience.dateOfJoiningTCET}</p>` : ''}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }

        /* TAB 2: TEACHING */
        case 'teaching': {
          const showCurrent = hasData(f.teaching.currentCourses);
          const showPast = hasData(f.teaching.coursesTaught);
          const showInnovative = hasData(f.teaching.innovativePractices);

          if (!showCurrent && !showPast && !showInnovative) {
            return `<div class="info-card"><p>No teaching data available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-chalkboard-user"></i> Teaching & Learning</h2>
            
            ${showCurrent ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-clock"></i> Current Courses</h3>
                <ul style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${f.teaching.currentCourses.map(c => `<li><i class="fa-solid fa-chevron-right" style="color:var(--accent-gold); font-size:0.8rem;"></i> ${c}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${showPast ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-history"></i> Courses Taught</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1rem;">
                  ${f.teaching.coursesTaught.map(c => `
                    <div style="background:var(--bg-slate); padding:0.8rem 1rem; border-radius:8px; border:1px solid var(--border-color); font-weight:600; font-size:0.9rem; color:var(--primary-navy);">
                      ${c}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${showInnovative ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-lightbulb"></i> Innovative Teaching Practices</h3>
                <ul style="display:flex; flex-direction:column; gap:0.75rem;">
                  ${f.teaching.innovativePractices.map(p => `<li style="line-height:1.6;"><i class="fa-solid fa-circle-check" style="color:var(--primary-blue); margin-right:0.5rem;"></i> ${p}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Student Resources Card -->
            <div class="info-card" style="border-left: 4px solid var(--accent-gold);">
              <h3 style="color:var(--primary-navy); margin-bottom:0.75rem; font-size:1.1rem;"><i class="fa-solid fa-folder-open"></i> Student Resources</h3>
              <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1rem;">
                Access study reference materials, lecture notes, syllabus blueprints, and laboratory instruction manuals for courses taught by this faculty member.
              </p>
              <a href="https://drive.google.com/drive/folders/1KvSx6YD2ifKtAySA5Ysv2eI0ZpyPYqp0?usp=drive_link" target="_blank" class="btn btn-primary" style="width:auto; display:inline-flex;">
                <i class="fa-solid fa-up-right-from-square"></i> Open Google Drive Folder
              </a>
            </div>
          `;
        }

        /* TAB 3: RESEARCH & DEVELOPMENT */
        case 'research': {
          const showInterests = hasData(f.research.interests);
          const showJournals = hasData(f.research.journals);
          const showConferences = hasData(f.research.conferences);
          const showBooks = hasData(f.research.books);
          const showPatents = hasData(f.research.patents);
          const showCopyrights = hasData(f.research.copyrights);
          const showGrants = hasData(f.research.fundedProjects);
          const showConsultancy = hasData(f.research.consultancy);

          if (!showInterests && !showJournals && !showConferences && !showBooks && !showPatents && !showCopyrights && !showGrants && !showConsultancy) {
            return `<div class="info-card"><p>No research and development data available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-flask"></i> Research & Development</h2>
            
            ${showInterests ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:0.75rem; font-size:1.1rem;"><i class="fa-solid fa-magnifying-glass-chart"></i> Research Interests</h3>
                <div class="specs-flex">
                  ${f.research.interests.map(i => `<span class="spec-badge" style="background:#EFF6FF; color:var(--primary-blue); font-size:0.85rem; padding:0.4rem 0.8rem;">${i}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${showJournals ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-book"></i> Journal Publications</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.research.journals.map((j, idx) => `
                    <li style="line-height:1.6; border-left:3px solid var(--primary-blue); padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${j}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showConferences ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-users-rectangle"></i> Conference Publications</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.research.conferences.map((c, idx) => `
                    <li style="line-height:1.6; border-left:3px solid var(--accent-gold); padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${c}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showBooks ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-atlas"></i> Books & Book Chapters</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.research.books.map((b, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #10B981; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${b}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showPatents ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-lightbulb"></i> Patents</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.research.patents.map((p, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #F59E0B; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${p}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showCopyrights ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-copyright"></i> Copyrights</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.research.copyrights.map((c, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #8B5CF6; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${c}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showGrants ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-hand-holding-dollar"></i> Funded Projects</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.research.fundedProjects.map((p, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #EC4899; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${p}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showConsultancy ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-comments-dollar"></i> Consultancy</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.research.consultancy.map((c, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #64748B; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${c}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}
          `;
        }

        /* TAB 4: PROJECTS & MENTORING */
        case 'projects': {
          const showProjects = hasData(f.studentMentoring.projectsGuided);
          const showTeams = hasData(f.studentMentoring.teamsMentored);

          if (!showProjects && !showTeams) {
            return `<div class="info-card"><p>No projects or mentoring data available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-list-check"></i> Projects & Mentoring</h2>
            
            ${showProjects ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-diagram-project"></i> B.E. Projects Guided</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.studentMentoring.projectsGuided.map((p, idx) => `
                    <li style="line-height:1.6; border-left:3px solid var(--primary-blue); padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${p}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showTeams ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-people-group"></i> Competition & Hackathon Teams Mentored</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.studentMentoring.teamsMentored.map((t, idx) => `
                    <li style="line-height:1.6; border-left:3px solid var(--accent-gold); padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${t}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}
          `;
        }

        /* TAB 5: ACHIEVEMENTS & DEVELOPMENT */
        case 'achievements': {
          const showAwards = hasData(f.achievements.awards);
          const showCertifications = hasData(f.achievements.certifications);
          const showFdp = hasData(f.achievements.fdpAttended);
          const showConducted = hasData(f.achievements.workshopsConducted);

          if (!showAwards && !showCertifications && !showFdp && !showConducted) {
            return `<div class="info-card"><p>No achievements or training data available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-trophy"></i> Achievements & Faculty Development</h2>
            
            ${showAwards ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-award"></i> Awards & Recognitions</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.achievements.awards.map((a, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #10B981; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${a}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showCertifications ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-certificate"></i> Certifications</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.achievements.certifications.map((c, idx) => `
                    <li style="line-height:1.6; border-left:3px solid var(--primary-blue); padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${c}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showFdp ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-school"></i> Faculty Development & Professional Training (FDPT)</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.achievements.fdpAttended.map((f, idx) => `
                    <li style="line-height:1.6; border-left:3px solid var(--accent-gold); padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${f}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showConducted ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-chalkboard"></i> Workshops & FDPs Conducted</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.achievements.workshopsConducted.map((w, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #8B5CF6; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${w}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}
          `;
        }

        /* TAB 6: PROFESSIONAL ACTIVITIES */
        case 'activities': {
          const showMemberships = hasData(f.professionalActivities.memberships);
          const showReviewer = hasData(f.professionalActivities.reviewerRoles);
          const showResponsibilities = hasData(f.professionalActivities.responsibilities);
          const showInteraction = hasData(f.professionalActivities.industryInteraction);

          if (!showMemberships && !showReviewer && !showResponsibilities && !showInteraction) {
            return `<div class="info-card"><p>No professional activities data available.</p></div>`;
          }

          return `
            <h2 class="subpage-title"><i class="fa-solid fa-briefcase"></i> Professional Activities</h2>
            
            ${showMemberships ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-address-card"></i> Professional Memberships</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.professionalActivities.memberships.map((m, idx) => `
                    <li style="line-height:1.6; border-left:3px solid var(--primary-blue); padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${m}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showReviewer ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-pen-nib"></i> Reviewer / Editor / Session Chair Roles</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.professionalActivities.reviewerRoles.map((r, idx) => `
                    <li style="line-height:1.6; border-left:3px solid var(--accent-gold); padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${r}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showResponsibilities ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-sitemap"></i> Institutional & Department Responsibilities</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.professionalActivities.responsibilities.map((r, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #10B981; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${r}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}

            ${showInteraction ? `
              <div class="info-card">
                <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;"><i class="fa-solid fa-handshake"></i> Industry Interaction</h3>
                <ol style="display:flex; flex-direction:column; gap:0.85rem;">
                  ${f.professionalActivities.industryInteraction.map((i, idx) => `
                    <li style="line-height:1.6; border-left:3px solid #EC4899; padding-left:1rem;">
                      <strong>${idx + 1}.</strong> ${i}
                    </li>
                  `).join('')}
                </ol>
              </div>
            ` : ''}
          `;
        }

        default:
          return `<p>Select a tab above to view details.</p>`;
      }
    }
  }

  /* Shared Institutional Footer Generator with Attribution Link */
  function createInstitutionalFooterHtml() {
    return `
      <footer class="tcet-footer">
        <div class="container">
          <div class="footer-grid-layout">
            <div>
              <div class="footer-logos-header">
                <a href="https://www.tcetmumbai.in/IOT/" target="_blank" rel="noopener noreferrer">
                  <img src="assets/images/tcet_college_logo.png" alt="TCET College Crest" class="footer-logo-img" onerror="this.onerror=null; this.src='assets/images/tcet_college-logo.png';">
                </a>
              </div>
              <div class="footer-brand-info">
                <h3>TCET Faculty Portfolio System</h3>
                <p>Department of Computer Science & Engineering (Internet of Things)</p>
                <p style="margin-top:0.4rem; font-size:0.825rem; color:#94A3B8;">
                  A-Block, Thakur Educational Campus, Shyamnarayan Thakur Marg, Thakur Village, Kandivali-East, Mumbai-400101.
                </p>
              </div>
            </div>

            <div class="footer-links-column">
              <h4>Institutional Links</h4>
              <ul>
                <li><a href="https://www.tcetmumbai.in/" target="_blank">TCET Official Website</a></li>
                <li><a href="https://www.tcetmumbai.in/IOT-CSE/IOTFaculty_AssistantProfessor.html" target="_blank">CSE-IoT Department Portal</a></li>
                <li><a href="https://tcetmumbai.irins.org/" target="_blank">IRINS Vidwan Database</a></li>
              </ul>
            </div>

            <div class="footer-links-column">
              <h4>System Details</h4>
              <p style="font-size:0.825rem; color:#94A3B8;">Standardized Portfolio Architecture v4.0</p>
              <p style="font-size:0.825rem; color:#94A3B8; margin-top:0.3rem;">Integrated 11 Profiles Sidebar System.</p>
            </div>
          </div>

          <div class="footer-bottom-bar">
            <p>© ${new Date().getFullYear()} Thakur College of Engineering & Technology (Autonomous). All Rights Reserved. · built by <a href="https://adarsh-builds.vercel.app/" class="footer-attribution-link" target="_blank">&lt;AdarshYadav /&gt;</a></p>
          </div>
        </div>
      </footer>
    `;
  }

  /* Redesigned 70% Faculty / 30% College Footer with Attribution Link */
  function createFacultyFooterHtml(f) {
    const emailsHtml = f.contact.officialEmails && f.contact.officialEmails.length > 0 
      ? f.contact.officialEmails.map(e => `<a href="mailto:${e}" style="color:#FFFFFF; text-decoration:underline;">${e}</a>`).join(' / ') 
      : (f.contact.officialEmail ? `<a href="mailto:${f.contact.officialEmail}" style="color:#FFFFFF; text-decoration:underline;">${f.contact.officialEmail}</a>` : '-');
    
    return `
      <footer class="tcet-footer" style="padding: 2.5rem 0 1.5rem 0;">
        <div class="container" style="display: grid; grid-template-columns: 2.3fr 1fr; gap: 2rem; @media (max-width: 900px) { grid-template-columns: 1fr; }">
          <!-- 70% Faculty-Related Content Area -->
          <div style="border-right: 1px solid rgba(255,255,255,0.1); padding-right: 2rem; @media (max-width: 900px) { border-right: none; padding-right: 0; }">
            <h3 style="color:#FFFFFF; font-family:var(--font-heading); font-size:1.2rem; margin-bottom:0.5rem;">${f.basicInfo.displayTitle}</h3>
            <p style="color:#94A3B8; font-size:0.875rem; margin-bottom:1rem;">${f.basicInfo.designation}</p>
            
            <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.85rem; color:#CBD5E1;">
              <p><i class="fa-solid fa-envelope" style="color:var(--accent-gold); width:20px;"></i> <strong>Emails:</strong> ${emailsHtml}</p>
              ${f.contact.officeLocation ? `<p><i class="fa-solid fa-building" style="color:var(--accent-gold); width:20px;"></i> <strong>Office:</strong> ${f.contact.officeLocation}</p>` : ''}
              ${f.contact.address ? `<p><i class="fa-solid fa-map-location-dot" style="color:var(--accent-gold); width:20px;"></i> <strong>Address:</strong> ${f.contact.address}</p>` : ''}
              
              <!-- Leftover profile links placed here -->
              <div style="margin-top:1rem; display:flex; gap:1rem; align-items:center;">
                ${f.contact.linkedinUrl && f.contact.linkedinUrl !== '-' ? `<a href="${f.contact.linkedinUrl}" target="_blank" style="color:#CBD5E1;"><i class="fa-brands fa-linkedin" style="font-size:1.25rem;"></i> LinkedIn Profile</a>` : ''}
              </div>
            </div>
          </div>

          <!-- 30% College-Related Content Area -->
          <div>
            <a href="https://www.tcetmumbai.in/IOT/" target="_blank" rel="noopener noreferrer">
              <img src="assets/images/tcet_college_logo.png" alt="TCET College Crest" class="footer-logo-img" style="margin-bottom:0.75rem;" onerror="this.onerror=null; this.src='assets/images/tcet_college-logo.png';">
            </a>
            <h4 style="color:#FFFFFF; font-size:0.9rem; margin-bottom:0.35rem;">TCET Mumbai</h4>
            <p style="font-size:0.8rem; color:#94A3B8; line-height:1.4; margin-bottom:0.75rem;">
              Department of Computer Science & Engineering (Internet of Things)
            </p>
            <ul style="font-size:0.8rem; display:flex; flex-direction:column; gap:0.35rem;">
              <li><a href="https://www.tcetmumbai.in/" target="_blank" style="color:#94A3B8;">TCET Website</a></li>
              <li><a href="https://www.tcetmumbai.in/IOT-CSE/IOTFaculty_AssistantProfessor.html" target="_blank" style="color:#94A3B8;">CSE-IoT Portal</a></li>
            </ul>
          </div>
        </div>
        <div class="container footer-bottom-bar" style="margin-top:1.5rem; padding-top:1rem;">
          <p>© ${new Date().getFullYear()} Thakur College of Engineering & Technology (Autonomous). All Rights Reserved. · built by <a href="https://adarsh-builds.vercel.app/" class="footer-attribution-link" target="_blank">&lt;AdarshYadav /&gt;</a></p>
        </div>
      </footer>
    `;
  }

  function openQuickViewModal(id) {
    const f = facultyData.find(item => item.metadata.id === id);
    if (!f) return;

    const modalBody = document.getElementById('modalBody');
    const modalBackdrop = document.getElementById('quickViewModal');

    const highestQual = f.highlights ? f.highlights.highestQualification : (f.education && f.education.length > 0 ? f.education[0].degree : '-');
    const teachingExp = f.experience.teaching && f.experience.teaching !== '-' ? f.experience.teaching : (f.experience.total || '-');
    const contactEmail = f.contact.officialEmails && f.contact.officialEmails.length > 0 ? f.contact.officialEmails[0] : (f.contact.officialEmail || '');

    modalBody.innerHTML = `
      <div style="display:flex; gap:1.25rem; align-items:center; margin-bottom:1.25rem;">
        <img src="${f.basicInfo.profilePhotoUrl}" alt="${f.basicInfo.fullName}" style="width:85px; height:105px; border-radius:8px; object-fit:cover; border:2px solid var(--border-color);">
        <div>
          <span class="badge badge-scopus">${f.metadata.rankCategory}</span>
          <h3 style="font-family:var(--font-heading); font-size:1.25rem; margin-top:0.2rem; color:var(--primary-navy);">${f.basicInfo.displayTitle}</h3>
          <p style="font-size:0.875rem; font-weight:600; color:var(--primary-blue);">${f.basicInfo.designation}</p>
          ${f.contact.vidwanId && f.contact.vidwanId !== '-' ? `<p style="font-size:0.8rem; color:var(--text-light); margin-top:0.15rem;">Vidwan ID: ${f.contact.vidwanId}</p>` : ''}
        </div>
      </div>

      <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.25rem; background:var(--accent-gold-light); padding:0.8rem 1rem; border-radius:8px; border:1px solid #FDE68A;">
        "${f.basicInfo.shortBio}"
      </p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
        <div style="background:var(--bg-slate); border:1px solid var(--border-color); padding:0.75rem; border-radius:8px;">
          <span style="font-size:0.7rem; color:var(--text-light); text-transform:uppercase; font-weight:700;">Highest Qualification</span>
          <p style="font-weight:700; font-size:0.875rem; color:var(--primary-navy);">${highestQual}</p>
        </div>
        <div style="background:var(--bg-slate); border:1px solid var(--border-color); padding:0.75rem; border-radius:8px;">
          <span style="font-size:0.7rem; color:var(--text-light); text-transform:uppercase; font-weight:700;">Experience</span>
          <p style="font-weight:700; font-size:0.875rem; color:var(--primary-navy);">${teachingExp}</p>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:1rem;">
        <span style="font-size:0.825rem; color:var(--text-light);"><i class="fa-solid fa-envelope"></i> ${contactEmail}</span>
        <a href="#portfolio/${f.metadata.id}/profile" class="btn btn-primary" style="width:auto;" onclick="closeModal()">Full Portfolio <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    `;

    modalBackdrop.classList.add('active');
  }

  function closeModal() {
    const modalBackdrop = document.getElementById('quickViewModal');
    if (modalBackdrop) modalBackdrop.classList.remove('active');
  }
});
