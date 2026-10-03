/* ============================================================
   TALENTS PAGE JS — Dynamic rendering
   ============================================================ */

(async function () {
  'use strict';

  const players = await TTC.fetchJSON('data/players.json');
  if (!players) return;

  const grid = document.getElementById('talentsGrid');
  const filters = document.querySelectorAll('.member-filter');
  
  function renderTalents(filterCat = 'all') {
    if (!grid) return;
    
    // Only show players who have achievements (competitive players)
    let competitive = players.filter(p => p.achievements && p.achievements.length > 0);
    
    if (filterCat !== 'all') {
      competitive = competitive.filter(p => {
        if (filterCat === 'mens') return p.category.includes("Men's");
        if (filterCat === 'womens') return p.category.includes("Women's");
        if (filterCat === 'juniors') return p.age_group === "Junior";
        return true;
      });
    }
    
    // Sort by number of achievements descending
    competitive.sort((a, b) => b.achievements.length - a.achievements.length);

    if (competitive.length === 0) {
      grid.innerHTML = '<p class="text-muted col-span-full text-center py-8">No talents found in this category.</p>';
      return;
    }

    grid.innerHTML = competitive.map(player => {
      const avatar = player.photo && !player.photo.includes('default')
        ? `<img src="${player.photo}" alt="${player.name}">`
        : player.name.charAt(0);

      // Only show top 2 achievements
      const topAchievements = player.achievements.slice(0, 2).map(a => 
        `<div class="talent-card__achievement">${a.title}</div>`
      ).join('');

      return `
      <a href="player.html?id=${player.id}" class="talent-card">
        <div class="talent-card__header">
          <div class="talent-card__avatar">${avatar}</div>
          <div class="talent-card__info">
            <h3 class="talent-card__name">${player.name}</h3>
            <span class="talent-card__category">${player.category}</span>
          </div>
        </div>
        <div class="talent-card__achievements">
          ${topAchievements}
          ${player.achievements.length > 2 ? `<div class="talent-card__achievement" style="color:var(--color-accent);">+${player.achievements.length - 2} more</div>` : ''}
        </div>
      </a>`;
    }).join('');
    
    setTimeout(() => {
      ScrollTrigger.refresh();
      gsap.fromTo(grid.children, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }, 50);
  }

  // Initial render if on talents page
  if (grid) {
    renderTalents();
    filters.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filters.forEach(b => b.classList.remove('is-active'));
        const target = e.currentTarget;
        target.classList.add('is-active');
        renderTalents(target.getAttribute('data-filter'));
      });
    });
  }

})();
