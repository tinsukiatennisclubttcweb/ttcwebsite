/* ============================================================
   GALLERY PAGE JS — Dynamic rendering
   ============================================================ */

(async function () {
  'use strict';

  let galleryData;
  try {
    galleryData = await TTC.fetchJSON('data/gallery.json');
  } catch (e) {
    document.getElementById('galleryGrid').innerHTML = `<p class="text-red-500 col-span-full py-8">Error fetching JSON: ${e.message}</p>`;
    return;
  }
  
  if (!galleryData) {
    document.getElementById('galleryGrid').innerHTML = `<p class="text-red-500 col-span-full py-8">Could not load gallery.json data. It might be invalid JSON or blocked.</p>`;
    return;
  }

  const grid = document.getElementById('galleryGrid');
  
  function renderGallery() {
    if (!grid) return;
    
    let images = [];
    if (galleryData.images && Array.isArray(galleryData.images)) {
      images = galleryData.images;
    } else if (galleryData.collections && Array.isArray(galleryData.collections)) {
      galleryData.collections.forEach(col => {
        if (col.images && Array.isArray(col.images)) {
          images.push(...col.images);
        }
      });
    }

    if (images.length === 0) {
      grid.innerHTML = '<p class="text-muted col-span-full py-8">No images in gallery.</p>';
      return;
    }

    grid.innerHTML = images.map(img => {
      const imgSrc = img.src || img.url;
      const imgAlt = img.alt || img.caption || 'TTC Gallery Image';
      return `
      <div class="gallery-item" data-reveal="scale" data-lightbox>
        <img src="${imgSrc}" data-full="${imgSrc}" alt="${imgAlt}" loading="lazy">
        <div class="gallery-item__overlay">
          <div class="gallery-item__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/></svg>
          </div>
        </div>
      </div>`;
    }).join('');
    
    setTimeout(() => {
      ScrollTrigger.refresh();
      gsap.fromTo(grid.children, 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out' }
      );
    }, 50);
  }

  renderGallery();

})();

