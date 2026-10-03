/* ============================================================
   MEMBERS PAGE JS — Dynamic rendering
   ============================================================ */

(async function () {
  'use strict';

  const players = await TTC.fetchJSON('data/players.json');
  if (!players) {
    const grid = document.getElementById('membersGrid');
    if (grid) grid.innerHTML = '<p class="text-muted col-span-full text-center py-8" style="color: red;">Failed to load data. If you are opening this file directly in the browser (file://), try using a local development server like VS Code Live Server.</p>';
    return;
  }

  const grid = document.getElementById('membersGrid');
  const filters = document.querySelectorAll('.member-filter');
  
  function renderMembers(filterRole = 'all') {
    if (!grid) return;
    
    let filtered = players;
    if (filterRole !== 'all') {
      filtered = players.filter(p => p.role === filterRole);
    }
    
    // Sort by order if available, otherwise alphabetically
    filtered.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return a.name.localeCompare(b.name);
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="text-muted col-span-full text-center py-8">No members found.</p>';
      return;
    }

    grid.innerHTML = filtered.map(member => {
      // Use initials if no photo
      const photoContent = member.photo && !member.photo.includes('default') 
        ? `<img src="${member.photo}" alt="${member.name}" loading="lazy">`
        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-weight:900; font-size:3rem; color:var(--color-border);">${member.name.charAt(0)}</div>`;

      return `
      <a href="player.html?id=${member.id}" class="member-card">
        <div class="member-card__photo">
          ${photoContent}
        </div>
        <div class="member-card__body">
          <h3 class="member-card__name">${member.name}</h3>
          <div class="member-card__role">${member.category || member.role}</div>
          ${member.member_since ? `<div class="member-card__since">Member since ${member.member_since}</div>` : ''}
        </div>
      </a>`;
    }).join('');
    
    setTimeout(() => {
      ScrollTrigger.refresh();
      gsap.fromTo(grid.children, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out' }
      );
    }, 50);
  }

  // Initial render
  renderMembers();

  // Handle filters
  filters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filters.forEach(b => b.classList.remove('is-active'));
      const target = e.currentTarget;
      target.classList.add('is-active');
      renderMembers(target.getAttribute('data-filter'));
    });
  });

})();
