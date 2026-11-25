let allCoursesCache = [];

    async function loadSyllabus() {
      const { data } = await supabaseClient.from('courses').select('*').order('course_code');
      allCoursesCache = data || [];
      renderSyllabusList();
      if (allCoursesCache.length) viewCourseSyllabus(allCoursesCache[0].course_code);
    }

    function renderSyllabusList() {
      const dept = document.getElementById('syl-dept-filter').value;
      const filtered = dept === 'ALL' ? allCoursesCache : allCoursesCache.filter(c => c.dept_code === dept);

      document.getElementById('syllabus-table-body').innerHTML = filtered.map(c => `
        <tr>
          <td><strong>${c.course_code}</strong></td>
          <td>${c.course_name}</td>
          <td>${c.dept_code || 'CSE'}</td>
          <td>${c.course_type || 'Core'}</td>
          <td>${c.ltp || '3-0-0'}</td>
          <td>${c.credits}</td>
          <td class="no-print"><button class="btn-primary" style="padding:0.35rem 0.65rem; font-size:0.8rem;" onclick="viewCourseSyllabus('${c.course_code}')">View Units</button></td>
        </tr>
      `).join('');
    }

    function viewCourseSyllabus(code) {
      const c = allCoursesCache.find(item => item.course_code === code);
      if (!c) return;

      const cos = Array.isArray(c.course_outcomes) ? c.course_outcomes : [];
      const units = Array.isArray(c.syllabus_units) ? c.syllabus_units : [];

      document.getElementById('syllabus-detail-box').innerHTML = `
        <div class="hall-ticket-box">
          <div style="border-bottom:2px solid #1e3a8a; padding-bottom:0.75rem; margin-bottom:1rem;">
            <span style="background:#dbeafe; color:#1e3a8a; padding:0.2rem 0.6rem; border-radius:4px; font-size:0.8rem; font-weight:700;">REGULATION ${c.reg_code || 'R26'} | SEMESTER ${c.semester || 3}</span>
            <h2 style="margin:0.5rem 0 0.25rem;">${c.course_code}: ${c.course_name}</h2>
            <p style="margin:0; font-size:0.9rem; color:#334155;"><strong>Department:</strong> ${c.dept_code} &nbsp;|&nbsp; <strong>Category:</strong> ${c.course_type} &nbsp;|&nbsp; <strong>L-T-P:</strong> ${c.ltp || '3-0-0'} &nbsp;|&nbsp; <strong>Credits:</strong> ${c.credits}</p>
          </div>

          <p><strong>Course Objectives:</strong> ${c.course_objectives || 'Standard autonomous curriculum objectives.'}</p>

          <h4>Course Outcomes (COs)</h4>
          <ul style="margin-top:0.25rem; line-height:1.6;">
            ${cos.length ? cos.map(co => `<li>${co}</li>`).join('') : '<li>Course outcomes defined by Board of Studies (BoS).</li>'}
          </ul>

          <h4>Detailed 5-Unit Syllabus</h4>
          <table>
            <thead><tr><th style="width:12%;">Unit</th><th style="width:26%;">Module Title</th><th style="width:10%;">Hours</th><th>Topics Covered</th></tr></thead>
            <tbody>
              ${units.length ? units.map(u => `
                <tr>
                  <td><strong>${u.unit}</strong></td>
                  <td><strong>${u.title}</strong></td>
                  <td>${u.hours} Hrs</td>
                  <td>${u.topics}</td>
                </tr>
              `).join('') : '<tr><td colspan="4">Detailed unit breakdown pending Board of Studies upload.</td></tr>'}
            </tbody>
          </table>

          <p style="margin-top:1rem; font-size:0.9rem;"><strong>Prescribed Textbooks:</strong> ${c.textbooks || 'Standard reference texts as approved by Academic Council.'}</p>
        </div>
      `;
    }
