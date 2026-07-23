/* ==========================================================================
   TCET Faculty Portfolio System - Core Application Engine (v2.6)
   - Compact 2-Column Faculty Directory Grid (Cards scaled vertically)
   - Official Top Banner Image (tcet_banner.png)
   - Official TCET Shield Crest Logo in Header Nav & Footer
   - IIT Bombay Inspired 6-Tab Portfolio Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof facultyData === 'undefined') {
    console.error('facultyData module not found!');
    return;
  }

  const appEl = document.getElementById('app');
  let currentFilter = 'ALL';
  let searchQuery = '';

  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  function handleRoute() {
    const hash = window.location.hash || '#directory';
    if (hash.startsWith('#portfolio/')) {
      const parts = hash.replace('#portfolio/', '').split('/');
      const facultyId = parts[0];
      const activeTab = parts[1] || 'home';
      renderPortfolioView(facultyId, activeTab);
    } else {
      renderDirectoryView();
    }
  }

  /* ==========================================================================
     1. MAIN DIRECTORY LANDING PAGE (COMPACT 2-COLUMN SIDE-BY-SIDE GRID)
     ========================================================================== */
  function renderDirectoryView() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const precedenceCategories = [
      {
        key: 'HOD',
        title: 'Head of Department',
        rankFilter: (f) => f.metadata.rankCategory.includes('Head of Department')
      },
      {
        key: 'PROFESSOR',
        title: 'Professors',
        rankFilter: (f) => f.metadata.rankCategory === 'Professor'
      },
      {
        key: 'ASST_PROF',
        title: 'Assistant Professors',
        rankFilter: (f) => f.metadata.rankCategory.includes('Assistant Professor')
      }
    ];

    const filteredFaculty = facultyData.filter(f => {
      const matchesSearch = searchQuery === '' || 
        f.basicInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        f.basicInfo.designation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = currentFilter === 'ALL' ||
        (currentFilter === 'HOD' && f.metadata.rankCategory.includes('Head of Department')) ||
        (currentFilter === 'PROFESSOR' && f.metadata.rankCategory === 'Professor') ||
        (currentFilter === 'ASST_PROF' && f.metadata.rankCategory.includes('Assistant Professor'));

      return matchesSearch && matchesFilter;
    });

    appEl.innerHTML = `
      <!-- Top Header Official Graphic Banner -->
      <div class="top-official-banner">
        <img src="assets/images/tcet_banner.png" alt="TCET Department of Computer Science & Engineering (IoT) Banner" class="top-banner-img">
      </div>

      <!-- Sticky Header Nav with Official TCET Shield Logo -->
      <header class="tcet-header">
        <div class="container header-inner">
          <div class="header-brand" onclick="window.location.hash='#directory'">
            <img src="assets/images/tcet_college_logo.png" alt="TCET Logo" class="brand-tcet-logo-img" onerror="this.onerror=null; this.src='assets/images/tcet_college-logo.png';">
            <span class="brand-title-small">Faculty Portfolio System</span>
          </div>
          <nav class="header-nav">
            <a href="#directory" class="nav-link active"><i class="fa-solid fa-users"></i> Faculty Directory</a>
            <a href="https://www.tcetmumbai.in/IOT-CSE/IOTFaculty_AssistantProfessor.html" target="_blank" class="nav-link"><i class="fa-solid fa-building-columns"></i> TCET Portal</a>
          </nav>
        </div>
      </header>

      <!-- Department Hero Section -->
      <section class="hero-banner">
        <div class="container hero-content">
          <span class="hero-badge"><i class="fa-solid fa-microchip"></i> Academic Faculty Profiles</span>
          <h1 class="hero-title">CSE-IoT Department Faculty Directory</h1>
          <p class="hero-desc">
            Explore academic qualifications, research publications, teaching subjects, patents, funding grants, and instructional resources of the Department of Computer Science & Engineering (IoT) faculty members.
          </p>
          <div class="dept-stats">
            <div class="stat-item">
              <h4>${facultyData.length}</h4>
              <p>Department Faculty</p>
            </div>
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
          </div>
        </div>
      </section>

      <!-- Toolbar with Compact Search Box & Precedence Filters -->
      <div class="container directory-toolbar">
        <div class="toolbar-card">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="searchInput" placeholder="Search faculty..." value="${searchQuery}">
          </div>
          <div class="filter-group">
            <button class="filter-btn ${currentFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">All Precedence</button>
            <button class="filter-btn ${currentFilter === 'HOD' ? 'active' : ''}" data-filter="HOD">HOD</button>
            <button class="filter-btn ${currentFilter === 'PROFESSOR' ? 'active' : ''}" data-filter="PROFESSOR">Professors</button>
            <button class="filter-btn ${currentFilter === 'ASST_PROF' ? 'active' : ''}" data-filter="ASST_PROF">Assistant Professors</button>
          </div>
        </div>
      </div>

      <!-- Main Directory Section Grouped by Precedence -->
      <section class="container directory-section" style="padding-bottom: 3.5rem;">
        ${precedenceCategories.map(cat => {
          const categoryFaculty = filteredFaculty.filter(cat.rankFilter);
          if (categoryFaculty.length === 0) return '';

          return `
            <div class="hierarchy-category-block">
              <h2 class="hierarchy-section-title">
                <i class="fa-solid fa-layer-group"></i> ${cat.title}
              </h2>
              <div class="faculty-modern-grid">
                ${categoryFaculty.map(f => createModernFacultyCardHtml(f)).join('')}
              </div>
            </div>
          `;
        }).join('')}

        ${filteredFaculty.length === 0 ? `
          <div class="info-card" style="text-align:center; padding: 3rem;">
            <i class="fa-solid fa-user-slash" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h3>No faculty profiles match your search query.</h3>
            <p style="color: var(--text-light); margin-top: 0.5rem;">Try adjusting your query or resetting filters.</p>
          </div>
        ` : ''}
      </section>

      <!-- Institutional Footer with ONLY TCET Crest Logo -->
      ${createInstitutionalFooterHtml()}

      <!-- Quick View Modal Container -->
      <div id="quickViewModal" class="modal-backdrop">
        <div class="modal-card">
          <button class="modal-close" id="closeModalBtn"><i class="fa-solid fa-xmark"></i></button>
          <div id="modalBody"></div>
        </div>
      </div>
    `;

    // Event listeners
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderDirectoryView();
        const newSearch = document.getElementById('searchInput');
        if (newSearch) {
          newSearch.focus();
          newSearch.selectionStart = newSearch.selectionEnd = newSearch.value.length;
        }
      });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter');
        renderDirectoryView();
      });
    });

    document.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openQuickViewModal(id);
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

  function createModernFacultyCardHtml(f) {
    const isHod = f.metadata.rankCategory.includes('Head of Department');
    const qualSummary = f.education.map(e => `${e.degree}${e.fieldOfStudy ? ` (${e.fieldOfStudy.split(' ')[0]})` : ''}`).join(' • ');

    return `
      <div class="faculty-card-modern ${isHod ? 'rank-hod' : ''}">
        <div class="card-accent-bar"></div>
        <div class="card-inner-body">
          <div class="card-header-flex">
            <img src="${f.basicInfo.profilePhotoUrl}" alt="${f.basicInfo.fullName}" class="card-avatar">
            <div class="card-title-group">
              <h3>${f.basicInfo.displayTitle}</h3>
              <p class="designation">${f.basicInfo.designation}</p>
              <p class="vidwan-tag"><i class="fa-solid fa-id-card"></i> Vidwan ID: <strong>${f.contact.vidwanId}</strong></p>
            </div>
          </div>

          <div class="qualifications-box">
            <strong>QUALIFICATIONS:</strong>
            <p class="qual-inline">${qualSummary}</p>
          </div>

          <div class="specs-flex">
            ${f.specializations.slice(0, 3).map(s => `<span class="spec-badge">${s}</span>`).join('')}
          </div>

          <div class="card-actions-grid">
            <button class="btn btn-outline btn-quick-view" data-id="${f.metadata.id}">
              <i class="fa-regular fa-eye"></i> Quick View
            </button>
            <a href="#portfolio/${f.metadata.id}/home" class="btn btn-primary">
              View Portfolio <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     2. PERSONAL FACULTY PORTFOLIO VIEW (IIT BOMBAY STYLE, 6 TABS)
     ========================================================================== */
  function renderPortfolioView(facultyId, activeTab) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const f = facultyData.find(item => item.metadata.id === facultyId);
    if (!f) {
      appEl.innerHTML = `
        <div class="container" style="padding: 5rem 0; text-align: center;">
          <h2>Faculty Profile Not Found</h2>
          <p style="margin-top: 1rem;"><a href="#directory" class="btn btn-primary">Return to Faculty Directory</a></p>
        </div>
      `;
      return;
    }

    const tabs = [
      { id: 'home', label: 'Home', icon: 'fa-house' },
      { id: 'academic', label: 'Academic Profile', icon: 'fa-graduation-cap' },
      { id: 'research', label: 'Research & Publications', icon: 'fa-book-bookmark' },
      { id: 'teaching', label: 'Teaching & Leadership', icon: 'fa-chalkboard-user' },
      { id: 'resources', label: 'Resources', icon: 'fa-folder-open' },
      { id: 'contact', label: 'Contact', icon: 'fa-address-book' }
    ];

    appEl.innerHTML = `
      <!-- Top Official Graphic Banner -->
      <div class="top-official-banner">
        <img src="assets/images/tcet_banner.png" alt="TCET Department Header Banner" class="top-banner-img">
      </div>

      <!-- Sticky Header Nav with Official TCET Shield Logo -->
      <header class="tcet-header">
        <div class="container header-inner">
          <div class="header-brand" onclick="window.location.hash='#directory'">
            <img src="assets/images/tcet_college_logo.png" alt="TCET Logo" class="brand-tcet-logo-img" onerror="this.onerror=null; this.src='assets/images/tcet_college-logo.png';">
            <span class="brand-title-small">Faculty Portfolio System</span>
          </div>
          <nav class="header-nav">
            <a href="#directory" class="nav-link nav-btn-back"><i class="fa-solid fa-arrow-left"></i> Back to Faculty Directory</a>
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
            <p class="p-dept"><i class="fa-solid fa-building-columns"></i> ${f.basicInfo.department} | ${f.basicInfo.institution}</p>
            
            <!-- Hero Link: CLEAN SINGLE VIDWAN BUTTON -->
            <div class="portfolio-hero-actions">
              ${f.contact.vidwanUrl ? `
                <a href="${f.contact.vidwanUrl}" target="_blank" class="p-vidwan-button">
                  <i class="fa-solid fa-id-card"></i> Vidwan ID: ${f.contact.vidwanId} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem;"></i>
                </a>
              ` : `
                <span class="p-vidwan-button"><i class="fa-solid fa-id-card"></i> Vidwan ID: ${f.contact.vidwanId}</span>
              `}
            </div>
          </div>
        </div>
      </section>

      <!-- Exactly 6 Navigation Tabs -->
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

      <!-- Institutional Footer with ONLY TCET Crest Logo -->
      ${createInstitutionalFooterHtml()}
    `;
  }

  /* Render Sub-Page Content Based on Selected Tab */
  function renderPortfolioTabContent(f, tab) {
    switch (tab) {
      case 'home':
        return `
          <h2 class="subpage-title"><i class="fa-solid fa-house"></i> Profile Overview & At A Glance</h2>
          
          <div class="info-card">
            <h3 style="font-size:1.1rem; color:var(--primary-navy); margin-bottom:0.5rem;"><i class="fa-solid fa-user-tie"></i> Biography</h3>
            <p style="font-size:1rem; line-height:1.7; color:var(--text-main);">${f.basicInfo.shortBio}</p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
            <div class="info-card" style="text-align:center; padding:1.25rem; margin-bottom:0;">
              <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-light);">Teaching Experience</span>
              <p style="font-size:1.4rem; font-weight:800; color:var(--primary-navy); margin-top:0.2rem;">${f.highlights.teachingExperience}</p>
            </div>
            <div class="info-card" style="text-align:center; padding:1.25rem; margin-bottom:0;">
              <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-light);">Highest Qualification</span>
              <p style="font-size:1.1rem; font-weight:800; color:var(--primary-navy); margin-top:0.2rem;">${f.highlights.highestQualification}</p>
            </div>
            <div class="info-card" style="text-align:center; padding:1.25rem; margin-bottom:0;">
              <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-light);">Total Publications</span>
              <p style="font-size:1.4rem; font-weight:800; color:var(--primary-navy); margin-top:0.2rem;">${f.highlights.totalPublications} Papers</p>
            </div>
          </div>

          <div class="info-card">
            <h3 style="font-size:1.05rem; color:var(--primary-navy); margin-bottom:0.75rem;"><i class="fa-solid fa-microchip"></i> Areas of Specialization</h3>
            <div class="specs-flex">
              ${f.specializations.map(s => `<span class="spec-badge" style="font-size:0.85rem; padding:0.4rem 0.8rem;">${s}</span>`).join('')}
            </div>
          </div>

          <div class="info-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 style="font-size:1.1rem; color:var(--primary-navy);"><i class="fa-solid fa-book"></i> Recent Publications Preview</h3>
              <a href="#portfolio/${f.metadata.id}/research" class="btn btn-outline" style="width:auto; font-size:0.8rem;">
                View All Publications <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
            ${f.publications.items.slice(0, 2).map(p => `
              <div class="pub-card" style="margin-bottom:0.75rem;">
                <div class="pub-header">
                  <div class="pub-title">${p.title}</div>
                  <span class="badge badge-journal">${p.type}</span>
                </div>
                <div class="pub-authors">Authors: <strong>${p.authors}</strong></div>
                <div class="pub-venue">${p.venue} • ${p.year}</div>
              </div>
            `).join('')}
          </div>

          <div class="info-card" style="margin-bottom:0;">
            <h3 style="font-size:1.05rem; color:var(--primary-navy); margin-bottom:0.75rem;"><i class="fa-solid fa-envelope"></i> Contact Information Glance</h3>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.4rem;"><i class="fa-solid fa-envelope" style="color:var(--primary-blue); width:20px;"></i> <strong>Official Email:</strong> <a href="mailto:${f.contact.officialEmail}">${f.contact.officialEmail}</a></p>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.8rem;"><i class="fa-solid fa-building" style="color:var(--primary-blue); width:20px;"></i> <strong>Office:</strong> ${f.contact.officeLocation}</p>
            <a href="#portfolio/${f.metadata.id}/contact" class="btn btn-primary" style="width:auto; font-size:0.825rem;">
              Full Contact Details <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        `;

      case 'academic':
        return `
          <h2 class="subpage-title"><i class="fa-solid fa-graduation-cap"></i> Academic Profile & Work Experience</h2>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
            <div class="info-card">
              <h3 style="font-size:1.15rem; color:var(--primary-navy); margin-bottom:1.25rem;"><i class="fa-solid fa-user-graduate"></i> Educational Qualifications</h3>
              <div class="timeline">
                ${f.education.map(e => `
                  <div class="timeline-item">
                    <div class="timeline-title">${e.degree} ${e.fieldOfStudy ? `in ${e.fieldOfStudy}` : ''}</div>
                    <div class="timeline-subtitle">${e.institution}</div>
                    <div class="timeline-meta">Status: <strong>${e.status}</strong> ${e.year ? `(${e.year})` : ''}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="info-card">
              <h3 style="font-size:1.15rem; color:var(--primary-navy); margin-bottom:1.25rem;"><i class="fa-solid fa-briefcase"></i> Professional Experience</h3>
              <div class="timeline">
                ${f.experience.map(ex => `
                  <div class="timeline-item">
                    <div class="timeline-title">${ex.role}</div>
                    <div class="timeline-subtitle">${ex.organization}</div>
                    <div class="timeline-meta">${ex.period} (${ex.durationYears}) • ${ex.type}</div>
                    ${ex.description ? `<p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.4rem;">${ex.description}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;

      case 'research':
        return `
          <h2 class="subpage-title"><i class="fa-solid fa-book-bookmark"></i> Research & Publications</h2>
          <div class="info-card" style="margin-bottom:1.5rem;">
            <div style="display:flex; gap:2rem; flex-wrap:wrap;">
              <div><strong style="font-size:1.2rem; color:var(--primary-navy);">${f.publications.summary.journals}</strong> <span style="color:var(--text-light); font-size:0.9rem;">Journals</span></div>
              <div><strong style="font-size:1.2rem; color:var(--primary-navy);">${f.publications.summary.conferences}</strong> <span style="color:var(--text-light); font-size:0.9rem;">Conferences</span></div>
              <div><strong style="font-size:1.2rem; color:var(--primary-navy);">${f.publications.summary.bookChapters || 0}</strong> <span style="color:var(--text-light); font-size:0.9rem;">Book Chapters</span></div>
              <div><strong style="font-size:1.2rem; color:var(--primary-navy);">${f.publications.summary.patents || 0}</strong> <span style="color:var(--text-light); font-size:0.9rem;">Patents</span></div>
            </div>
          </div>

          <div>
            ${f.publications.items.map(p => `
              <div class="pub-card">
                <div class="pub-header">
                  <div class="pub-title">${p.title}</div>
                  <div style="display:flex; gap:0.4rem;">
                    ${p.indexing ? p.indexing.map(idx => `<span class="badge badge-scopus">${idx}</span>`).join('') : ''}
                    <span class="badge ${p.type === 'Journal' ? 'badge-journal' : 'badge-conference'}">${p.type}</span>
                  </div>
                </div>
                <div class="pub-authors">Authors: <strong>${p.authors}</strong></div>
                <div class="pub-venue">${p.venue} ${p.volume ? `(${p.volume})` : ''} • ${p.year}</div>
                ${p.url ? `<a href="${p.url}" target="_blank" style="display:inline-block; font-size:0.8rem; font-weight:600; margin-top:0.5rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Publication Source</a>` : ''}
              </div>
            `).join('')}
          </div>

          ${f.grantsAndFunding && f.grantsAndFunding.length > 0 ? `
            <div class="info-card" style="margin-top:1.5rem;">
              <h3 style="font-size:1.1rem; color:var(--primary-navy); margin-bottom:1rem;"><i class="fa-solid fa-hand-holding-dollar"></i> Research Grants & Funding</h3>
              ${f.grantsAndFunding.map(g => `
                <div style="background:var(--bg-slate); padding:1.25rem; border-radius:8px; border-left:4px solid var(--accent-gold); margin-bottom:0.75rem;">
                  <div style="display:flex; justify-content:space-between;">
                    <h4 style="font-size:1rem; color:var(--primary-navy);">${g.title}</h4>
                    <span style="font-weight:700; color:var(--primary-blue);">${g.amount}</span>
                  </div>
                  <p style="font-size:0.85rem; color:var(--text-light); margin-top:0.2rem;">Agency: <strong>${g.fundingAgency}</strong> (${g.year})</p>
                  <p style="font-size:0.875rem; color:var(--text-muted); margin-top:0.4rem;">${g.description}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        `;

      case 'teaching':
        return `
          <h2 class="subpage-title"><i class="fa-solid fa-chalkboard-user"></i> Teaching & Leadership</h2>
          <div class="info-card">
            <h3 style="color:var(--primary-navy); margin-bottom:1rem; font-size:1.1rem;">Subjects Taught</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
              ${f.subjectsTaught.map(sub => `
                <div style="background:var(--bg-slate); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                  <span class="badge badge-ieee" style="margin-bottom:0.4rem;">${sub.level}</span>
                  <div style="font-weight:700; color:var(--primary-navy); font-size:0.95rem;">${sub.subject}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="info-card">
            <h3 style="font-size:1.1rem; color:var(--primary-navy); margin-bottom:1rem;">Administrative Roles & Institutional Leadership</h3>
            <ul style="display:flex; flex-direction:column; gap:0.8rem;">
              ${f.administrativeRoles.map(r => `
                <li style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed var(--border-color); padding-bottom:0.6rem;">
                  <div>
                    <strong style="color:var(--primary-navy); font-size:0.95rem;">${r.position}</strong>
                    <p style="font-size:0.85rem; color:var(--text-light);">${r.committee} (${r.scope})</p>
                  </div>
                  <span class="badge badge-conference">${r.period}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        `;

      case 'resources':
        return `
          <h2 class="subpage-title"><i class="fa-solid fa-folder-open"></i> Subject Resources & Learning Materials</h2>
          ${f.resources && f.resources.length > 0 ? `
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.25rem;">
              ${f.resources.map(res => `
                <div class="info-card" style="margin-bottom:0; display:flex; flex-direction:column; justify-space-between;">
                  <div>
                    <span class="badge badge-scopus" style="margin-bottom:0.5rem;"><i class="fa-solid fa-file-pdf"></i> ${res.category}</span>
                    <h3 style="font-size:1.05rem; color:var(--primary-navy); font-weight:700; margin-bottom:0.4rem; line-height:1.3;">${res.title}</h3>
                    <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.5; margin-bottom:1rem;">${res.description}</p>
                  </div>
                  <a href="${res.url}" target="_blank" class="btn btn-outline" style="margin-top:auto;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Access Resource Material
                  </a>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="info-card">
              <p>No subject resources uploaded for this faculty profile yet.</p>
            </div>
          `}
        `;

      case 'contact':
        return `
          <h2 class="subpage-title"><i class="fa-solid fa-address-book"></i> Contact Information</h2>
          <div class="info-card">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
              <div>
                <h4 style="color:var(--primary-navy); font-size:1.05rem; margin-bottom:0.85rem;">Direct Contact Details</h4>
                <p style="margin-bottom:0.6rem;"><i class="fa-solid fa-envelope" style="color:var(--primary-blue); width:20px;"></i> <strong>Official Email:</strong> <a href="mailto:${f.contact.officialEmail}">${f.contact.officialEmail}</a></p>
                <p style="margin-bottom:0.6rem;"><i class="fa-solid fa-building" style="color:var(--primary-blue); width:20px;"></i> <strong>Office Location:</strong> ${f.contact.officeLocation}</p>
                <p style="margin-bottom:0.6rem;"><i class="fa-solid fa-id-badge" style="color:var(--primary-blue); width:20px;"></i> <strong>Vidwan IRINS ID:</strong> ${f.contact.vidwanId}</p>
              </div>

              <div>
                <h4 style="color:var(--primary-navy); font-size:1.05rem; margin-bottom:0.85rem;">Campus Address</h4>
                <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">${f.contact.address}</p>
              </div>
            </div>
          </div>
        `;

      default:
        return `<p>Select a tab above to view details.</p>`;
    }
  }

  /* Shared Institutional Footer Generator with ONLY TCET Crest Logo */
  function createInstitutionalFooterHtml() {
    return `
      <footer class="tcet-footer">
        <div class="container">
          <div class="footer-grid-layout">
            <div>
              <div class="footer-logos-header">
                <img src="assets/images/tcet_college_logo.png" alt="TCET College Crest" class="footer-logo-img" onerror="this.onerror=null; this.src='assets/images/tcet_college-logo.png';">
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
              <p style="font-size:0.825rem; color:#94A3B8;">Standardized Portfolio Architecture v2.6</p>
              <p style="font-size:0.825rem; color:#94A3B8; margin-top:0.3rem;">Integrated 6-Tab Multi-Page System.</p>
            </div>
          </div>

          <div class="footer-bottom-bar">
            <p>© ${new Date().getFullYear()} Thakur College of Engineering & Technology (Autonomous). All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }

  function openQuickViewModal(id) {
    const f = facultyData.find(item => item.metadata.id === id);
    if (!f) return;

    const modalBody = document.getElementById('modalBody');
    const modalBackdrop = document.getElementById('quickViewModal');

    modalBody.innerHTML = `
      <div style="display:flex; gap:1.25rem; align-items:center; margin-bottom:1.25rem;">
        <img src="${f.basicInfo.profilePhotoUrl}" alt="${f.basicInfo.fullName}" style="width:85px; height:105px; border-radius:8px; object-fit:cover; border:2px solid var(--border-color);">
        <div>
          <span class="badge badge-scopus">${f.metadata.rankCategory}</span>
          <h3 style="font-family:var(--font-heading); font-size:1.25rem; margin-top:0.2rem; color:var(--primary-navy);">${f.basicInfo.displayTitle}</h3>
          <p style="font-size:0.875rem; font-weight:600; color:var(--primary-blue);">${f.basicInfo.designation}</p>
          <p style="font-size:0.8rem; color:var(--text-light); margin-top:0.15rem;">Vidwan ID: ${f.contact.vidwanId}</p>
        </div>
      </div>

      <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.25rem; background:var(--accent-gold-light); padding:0.8rem 1rem; border-radius:8px; border:1px solid #FDE68A;">
        "${f.basicInfo.shortBio}"
      </p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
        <div style="background:var(--bg-slate); border:1px solid var(--border-color); padding:0.75rem; border-radius:8px;">
          <span style="font-size:0.7rem; color:var(--text-light); text-transform:uppercase; font-weight:700;">Highest Qualification</span>
          <p style="font-weight:700; font-size:0.875rem; color:var(--primary-navy);">${f.highlights.highestQualification}</p>
        </div>
        <div style="background:var(--bg-slate); border:1px solid var(--border-color); padding:0.75rem; border-radius:8px;">
          <span style="font-size:0.7rem; color:var(--text-light); text-transform:uppercase; font-weight:700;">Teaching Experience</span>
          <p style="font-weight:700; font-size:0.875rem; color:var(--primary-navy);">${f.highlights.teachingExperience}</p>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:1rem;">
        <span style="font-size:0.825rem; color:var(--text-light);"><i class="fa-solid fa-envelope"></i> ${f.contact.officialEmail}</span>
        <a href="#portfolio/${f.metadata.id}/home" class="btn btn-primary" style="width:auto;" onclick="closeModal()">Full Portfolio <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    `;

    modalBackdrop.classList.add('active');
  }

  function closeModal() {
    const modalBackdrop = document.getElementById('quickViewModal');
    if (modalBackdrop) modalBackdrop.classList.remove('active');
  }
});
