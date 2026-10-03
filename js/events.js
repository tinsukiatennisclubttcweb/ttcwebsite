/* ============================================================
   EVENTS PAGE — Dynamic list
   ============================================================ */

(async function () {
  'use strict';

  const events = await TTC.fetchJSON('data/events.json');
  if (!events) return;

  const grid = document.getElementById('eventsGrid');
  const filters = document.querySelectorAll('.event-filter');
  
  function renderEvents(filterType = 'all') {
    if (!grid) return;
    
    // Filter and sort events (newest first, but upcoming at the top)
    let filtered = events;
    if (filterType !== 'all') {
      filtered = events.filter(e => e.type === filterType);
    }
    
    // Sort: upcoming first, then by date descending
    filtered.sort((a, b) => {
      if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
      if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
      return new Date(b.date) - new Date(a.date);
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="text-muted col-span-2 py-8">No events found in this category.</p>';
      return;
    }

    grid.innerHTML = filtered.map(event => {
      const statusTag = event.status === 'upcoming' 
        ? `<span class="tag tag--status-upcoming">Upcoming</span>`
        : `<span class="tag tag--status-completed">Completed</span>`;
        
      const dateStr = event.end_date && event.end_date !== event.date
        ? `${TTC.formatDateShort(event.date)} — ${TTC.formatDateShort(event.end_date)}`
        : TTC.formatDateShort(event.date);

      return `
      <a href="event.html?id=${event.id}" class="event-card" data-reveal>
        <div class="event-card__image">
          <img src="${event.image || 'images/hero-court.jpg'}" alt="${event.title}" loading="lazy">
        </div>
        <div class="event-card__body">
          <div class="flex flex--between flex--center">
            <span class="event-card__date">${dateStr}</span>
            ${statusTag}
          </div>
          <h3 class="event-card__title">${event.title}</h3>
          <p class="event-card__desc">${event.description}</p>
          <div class="event-card__footer">
            <span class="tag tag--outline">${event.type}</span>
            <span class="body-xs text-muted-light">${event.categories?.length || 0} Categories</span>
          </div>
        </div>
      </a>`;
    }).join('');
    
    // Re-trigger animations for new content
    setTimeout(() => {
      ScrollTrigger.refresh();
      const newCards = grid.querySelectorAll('.event-card');
      gsap.fromTo(newCards, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }, 50);
  }

  // Initial render
  renderEvents();

  // Handle filters
  filters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filters.forEach(b => b.classList.remove('is-active'));
      const target = e.currentTarget;
      target.classList.add('is-active');
      renderEvents(target.getAttribute('data-filter'));
    });
  });

})();
