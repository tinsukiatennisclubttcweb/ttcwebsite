/* ============================================================
   HOME PAGE JS — Dynamic content for preview sections
   ============================================================ */

(async function () {
  'use strict';

  // Load necessary data
  const [players, events, galleryData] = await Promise.all([
    TTC.fetchJSON('data/players.json'),
    TTC.fetchJSON('data/events.json'),
    TTC.fetchJSON('data/gallery.json'),
  ]);

  // 03 - MEMBERS PREVIEW (4-6 members)
  const membersContainer = document.getElementById('previewMembers');
  if (membersContainer && players) {
    // Let's grab 5 members for the asymmetric grid
    // Preferably a mix of coaches and active players
    const previewMembers = players.slice(0, 5);

    membersContainer.innerHTML = previewMembers.map(member => {
      const avatar = member.photo && !member.photo.includes('default')
        ? `<img src="${member.photo}" alt="${member.name}" loading="lazy">`
        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-weight:900; font-size:2rem; color:var(--color-border);">${member.name.charAt(0)}</div>`;

      return `
      <a href="player.html?id=${member.id}" class="member-preview-card">
        <div class="member-preview-photo">${avatar}</div>
        <div class="member-preview-info">
          <div class="member-preview-name">${member.name}</div>
          <div class="member-preview-role">${member.category || member.role}</div>
        </div>
      </a>`;
    }).join('');
  }

  // 04 - CLUB TALENTS PREVIEW (3-4 talents)
  const talentsContainer = document.getElementById('previewTalents');
  if (talentsContainer && players) {
    // Get players with achievements, sort by wins, take top 3
    const topTalents = players
      .filter(p => p.achievements && p.achievements.length > 0)
      .sort((a, b) => b.achievements.length - a.achievements.length)
      .slice(0, 3);

    talentsContainer.innerHTML = topTalents.map(player => {
      const avatar = player.photo && !player.photo.includes('default')
        ? `<img src="${player.photo}" alt="${player.name}" loading="lazy">`
        : player.name.charAt(0);
        
      const topAchievement = player.achievements[0];
      const achievementText = topAchievement 
        ? `🏆 ${topAchievement.title} ${topAchievement.year ? `(${topAchievement.year})` : ''}` 
        : '';

      return `
      <a href="player.html?id=${player.id}" class="talent-preview-card">
        <div class="talent-preview-header">
          <div class="talent-preview-avatar">${avatar}</div>
          <div>
            <div class="talent-preview-name">${player.name}</div>
            <div class="talent-preview-category">${player.category}</div>
          </div>
        </div>
        ${achievementText ? `<div class="talent-preview-achievement">${achievementText}</div>` : ''}
      </a>`;
    }).join('');
  }

  // 05 - EVENTS PREVIEW (2-3 events)
  const eventsContainer = document.getElementById('previewEvents');
  if (eventsContainer && events) {
    // Get 3 events, prioritizing upcoming
    let displayEvents = events.filter(e => e.status === 'upcoming');
    if (displayEvents.length < 3) {
      const completed = events
        .filter(e => e.status === 'completed')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      displayEvents = [...displayEvents, ...completed].slice(0, 3);
    }

    eventsContainer.innerHTML = displayEvents.map(event => {
      const statusTag = event.status === 'upcoming' 
        ? `<span class="tag tag--status-upcoming">Upcoming</span>`
        : `<span class="tag tag--status-completed">Completed</span>`;
        
      const dateStr = TTC.formatDateShort(event.date);

      return `
      <a href="event.html?id=${event.id}" class="event-preview-card">
        <div class="flex flex--between flex--center">
          <span class="event-preview-date">${dateStr}</span>
          ${statusTag}
        </div>
        <h4 class="event-preview-title">${event.title}</h4>
        <p class="event-preview-desc">${event.description}</p>
      </a>`;
    }).join('');
  }

  // 07 - GALLERY PREVIEW (4 images for the mosaic)
  const galleryContainer = document.getElementById('previewGallery');
  if (galleryContainer && galleryData) {
    const previewImages = galleryData.images.slice(0, 4);

    galleryContainer.innerHTML = previewImages.map(img => {
      return `
      <div class="gallery-preview-item" data-img-hover>
        <img src="${img.url}" alt="Gallery Preview" loading="lazy">
      </div>`;
    }).join('');
  }

  // Re-initialize GSAP ScrollTrigger for injected elements
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

})();
