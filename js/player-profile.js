/* ============================================================
   PLAYER PROFILE JS — Dynamic rendering
   ============================================================ */

(async function () {
  'use strict';

  const playerId = TTC.getParam('id');
  const container = document.getElementById('playerProfileContent');
  
  if (!playerId || !container) return;

  const players = await TTC.fetchJSON('data/players.json');
  if (!players) return;

  const player = players.find(p => p.id === playerId);
  
  if (!player) {
    container.innerHTML = '<div class="text-center py-xl"><h2 class="h2">Player not found.</h2><a href="talents.html" class="btn btn--primary mt-lg">View All Talents</a></div>';
    return;
  }

  document.title = `${player.name} — Tinsukia Tennis Club`;

  const avatar = player.photo && !player.photo.includes('default')
    ? `<img src="${player.photo}" alt="${player.name}">`
    : player.name.charAt(0);

  // Generate achievements list, linking to events if event_id exists
  let achievementsHTML = '';
  if (player.achievements && player.achievements.length > 0) {
    // Sort achievements by year descending
    const sortedAch = [...player.achievements].sort((a, b) => (b.year || 0) - (a.year || 0));
    
    achievementsHTML = sortedAch.map(a => {
      const titleHTML = a.event_id 
        ? `<a href="event.html?id=${a.event_id}" style="text-decoration:underline; text-underline-offset:4px;">${a.title}</a>` 
        : a.title;
        
      return `
      <div class="achievement-item">
        <div class="achievement-item__year">${a.year || ''}</div>
        <div class="body-lg" style="font-weight:500;">${titleHTML}</div>
      </div>`;
    }).join('');
  } else {
    achievementsHTML = '<p class="text-muted">No tournament records available.</p>';
  }

  container.innerHTML = `
    <div class="player-hero">
      <div class="player-hero__photo" data-reveal="scale">${avatar}</div>
      <div class="player-hero__info" data-reveal>
        <span class="tag tag--outline mb-xs">${player.role === 'coach' ? 'Coach' : 'Club Player'}</span>
        <h1 class="h1">${player.name}</h1>
        <div class="player-stats">
          <div class="player-stat">
            <span class="player-stat__label">Category</span>
            <span class="player-stat__val">${player.category || '-'}</span>
          </div>
          <div class="player-stat">
            <span class="player-stat__label">Division</span>
            <span class="player-stat__val">${player.age_group || '-'}</span>
          </div>
          <div class="player-stat">
            <span class="player-stat__label">Member Since</span>
            <span class="player-stat__val">${player.member_since || '-'}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid--2 gap-xl" style="padding: 64px 0;">
      <div data-reveal>
        <h3 class="h3 mb-md">Biography</h3>
        <p class="body-lg text-muted">${player.bio || 'Bio information coming soon.'}</p>
      </div>
      <div data-reveal data-delay="100">
        <h3 class="h3 mb-md">Tournament Records</h3>
        <div class="achievement-list">
          ${achievementsHTML}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    ScrollTrigger.refresh();
    document.querySelectorAll('#playerProfileContent [data-reveal]').forEach((el) => {
      const direction = el.getAttribute('data-reveal');
      let fromVars = { y: 30, opacity: 0 };
      if (direction === 'scale') fromVars = { scale: 0.95, opacity: 0 };
      gsap.fromTo(el, fromVars, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' });
    });
  }, 50);

})();
