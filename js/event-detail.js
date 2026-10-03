/* ============================================================
   EVENT DETAIL PAGE — Dynamic loading and rendering
   ============================================================ */

(async function () {
  'use strict';

  const eventId = TTC.getParam('id');
  const container = document.getElementById('eventDetailContent');
  
  if (!eventId || !container) {
    if (container) container.innerHTML = '<p class="text-muted text-center py-8">Event not found.</p>';
    return;
  }

  const events = await TTC.fetchJSON('data/events.json');
  if (!events) return;

  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    container.innerHTML = '<p class="text-muted text-center py-8">Event not found.</p>';
    return;
  }

  // Update page title
  document.title = `${event.title} — Tinsukia Tennis Club`;

  const dateStr = event.end_date && event.end_date !== event.date
    ? `${TTC.formatDate(event.date)} — ${TTC.formatDate(event.end_date)}`
    : TTC.formatDate(event.date);

  const statusTag = event.status === 'upcoming' 
    ? `<span class="tag tag--status-upcoming">Upcoming</span>`
    : `<span class="tag tag--status-completed">Completed</span>`;

  // Generate results HTML if completed
  let resultsHTML = '';
  if (event.status === 'completed' && event.results && Object.keys(event.results).length > 0) {
    
    let categoriesHTML = '';
    for (const [category, winners] of Object.entries(event.results)) {
      
      const rowsHTML = winners.map(winner => {
        let medal = '';
        let posClass = 'result-row__position--other';
        if (winner.position === 1) { medal = '🥇'; posClass = 'result-row__position--1'; }
        else if (winner.position === 2) { medal = '🥈'; posClass = 'result-row__position--2'; }
        else if (winner.position === 3) { medal = '🥉'; posClass = 'result-row__position--3'; }

        // Link to player profile if player_id exists
        const nameDisplay = winner.player_id 
          ? `<a href="player.html?id=${winner.player_id}">${winner.player_name}</a>`
          : winner.player_name;

        return `
        <div class="result-row">
          <div class="result-row__position ${posClass}">${winner.position}</div>
          <div class="result-row__name">${nameDisplay}</div>
          <div class="result-row__medal">${medal}</div>
        </div>`;
      }).join('');

      categoriesHTML += `
      <div class="results-category" data-reveal>
        <h4 class="results-category__title">${category}</h4>
        <div class="flex flex--column gap-xs">
          ${rowsHTML}
        </div>
      </div>`;
    }

    resultsHTML = `
    <div class="results-section mt-xl">
      <h3 class="h3 text-white mb-lg" data-reveal>Tournament Results</h3>
      ${categoriesHTML}
    </div>`;
  }

  // Generate HTML
  container.innerHTML = `
    <div class="event-detail-header" data-reveal>
      ${statusTag}
      <h1 class="h1 text-white mt-md">${event.title}</h1>
      
      <div class="event-detail-meta">
        <div class="event-detail-meta__item">
          <span>📅</span> ${dateStr}
        </div>
        <div class="event-detail-meta__item">
          <span>📍</span> ${event.location}
        </div>
        ${event.categories && event.categories.length > 0 ? `
        <div class="event-detail-meta__item">
          <span>🎾</span> ${event.categories.join(' · ')}
        </div>` : ''}
      </div>
      
      <p class="body-lg text-muted-light mt-lg" style="max-width: 700px;">
        ${event.description}
      </p>
    </div>

    ${event.image ? `
    <div class="mt-xl" data-reveal="scale">
      <div class="img-rounded" style="height: 450px;">
        <img src="${event.image}" alt="${event.title}" class="img-cover">
      </div>
    </div>` : ''}

    ${resultsHTML}
    
    ${event.status === 'upcoming' ? `
    <div class="mt-xl" data-reveal>
      <div class="card card--dark" style="padding: 40px; text-align: center;">
        <h3 class="text-white mb-xs">Registration Open</h3>
        <p class="text-muted-light mb-lg">Contact the club for entry forms and category details.</p>
        <a href="https://wa.me/919435037032?text=Hi%2C%20I%20would%20like%20to%20register%20for%20${encodeURIComponent(event.title)}" class="btn btn--primary" target="_blank">Register Now <span class="btn__arrow">→</span></a>
      </div>
    </div>` : ''}
  `;
  
  // Re-trigger scroll animations
  setTimeout(() => {
    ScrollTrigger.refresh();
    
    // We manually initialized the newly injected data-reveal elements
    document.querySelectorAll('#eventDetailContent [data-reveal]').forEach((el) => {
      const direction = el.getAttribute('data-reveal');
      let fromVars = { y: 30, opacity: 0 };
      if (direction === 'scale') fromVars = { scale: 0.95, opacity: 0 };
      
      gsap.fromTo(el, fromVars, {
        y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
  }, 100);

})();
