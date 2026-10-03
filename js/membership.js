/* ============================================================
   TINSUKIA TENNIS CLUB — MEMBERSHIP PAGE JS
   Plan selection, form validation, submission handling
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // CONFIG
  // ============================================================

  // Change this to your actual form endpoint when a backend is ready
  // Supports: Formspree, Netlify Forms, custom API, etc.
  const FORM_ENDPOINT = '/api/membership-request';

  // ============================================================
  // DOM REFERENCES
  // ============================================================

  const form = document.getElementById('membershipForm');
  const submitBtn = document.getElementById('submitBtn');
  const successOverlay = document.getElementById('successOverlay');
  const errorOverlay = document.getElementById('errorOverlay');
  const backToMembershipBtn = document.getElementById('backToMembershipBtn');
  const retryBtn = document.getElementById('retryBtn');
  const categorySelect = document.getElementById('playerCategory');

  if (!form) return;

  // ============================================================
  // PLAN SELECTION INTERACTION
  // ============================================================

  function initPlanSelection() {
    const selectableRows = document.querySelectorAll('[data-category]');

    selectableRows.forEach((row) => {
      row.addEventListener('click', () => {
        const category = row.getAttribute('data-category');
        if (!category || !categorySelect) return;

        // Set the dropdown value
        categorySelect.value = category;

        // Trigger change event for validation
        categorySelect.dispatchEvent(new Event('change', { bubbles: true }));

        // Clear any validation error on the category field
        clearFieldError(categorySelect, 'playerCategoryError');

        // Briefly highlight the dropdown
        categorySelect.classList.add('is-valid');
        categorySelect.style.transition = 'all 0.3s ease';

        // Smooth scroll to the form
        const formEl = document.getElementById('membershipForm');
        if (formEl) {
          const offset = window.innerWidth <= 809 ? 80 : 100;
          const targetY = formEl.getBoundingClientRect().top + window.pageYOffset - offset;

          // Use Lenis if available, otherwise fallback
          const lenis = TTC.lenis && TTC.lenis();
          if (lenis) {
            lenis.scrollTo(targetY, { duration: 1.2 });
          } else {
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // ============================================================
  // FORM VALIDATION
  // ============================================================

  const validators = {
    fullName: {
      validate: (value) => value.trim().length >= 2,
      errorId: 'fullNameError',
      message: 'Please enter your full name',
    },
    dob: {
      validate: (value) => {
        if (!value) return false;
        const date = new Date(value);
        const now = new Date();
        // Must be a valid date in the past, and person must be at least 3 years old
        return !isNaN(date.getTime()) && date < now && (now.getFullYear() - date.getFullYear()) >= 3;
      },
      errorId: 'dobError',
      message: 'Please enter a valid date of birth',
    },
    playerCategory: {
      validate: (value) => value !== '' && value !== null,
      errorId: 'playerCategoryError',
      message: 'Please select a player category',
    },
    phone: {
      validate: (value) => {
        // Accept Indian phone numbers: 10 digits, optionally with +91 or 0 prefix
        const cleaned = value.replace(/[\s\-\(\)]/g, '');
        return /^(\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
      },
      errorId: 'phoneError',
      message: 'Please enter a valid phone number',
    },
    email: {
      validate: (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      },
      errorId: 'emailError',
      message: 'Please enter a valid email address',
    },
  };

  function showFieldError(field, errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (field) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      field.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) {
      if (message) {
        const span = errorEl.querySelector('span');
        if (span) span.textContent = message;
      }
      errorEl.classList.add('is-visible');
    }
  }

  function clearFieldError(field, errorId) {
    const errorEl = document.getElementById(errorId);
    if (field) {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
    }
    if (errorEl) {
      errorEl.classList.remove('is-visible');
    }
  }

  function validateField(fieldId) {
    const config = validators[fieldId];
    if (!config) return true;

    const field = document.getElementById(fieldId);
    if (!field) return true;

    const isValid = config.validate(field.value);

    if (isValid) {
      clearFieldError(field, config.errorId);
      field.classList.add('is-valid');
    } else {
      showFieldError(field, config.errorId, config.message);
    }

    return isValid;
  }

  function validateForm() {
    let isValid = true;

    Object.keys(validators).forEach((fieldId) => {
      if (!validateField(fieldId)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Real-time validation on blur
  function initRealtimeValidation() {
    Object.keys(validators).forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field) return;

      const eventType = field.tagName === 'SELECT' ? 'change' : 'blur';

      field.addEventListener(eventType, () => {
        // Only validate if user has interacted (field has a value or has been touched)
        if (field.value || field.classList.contains('is-invalid')) {
          validateField(fieldId);
        }
      });

      // Clear error on input
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          const config = validators[fieldId];
          if (config && config.validate(field.value)) {
            clearFieldError(field, config.errorId);
            field.classList.add('is-valid');
          }
        }
      });
    });
  }

  // ============================================================
  // FORM SUBMISSION
  // ============================================================

  function getFormData() {
    return {
      fullName: document.getElementById('fullName').value.trim(),
      dob: document.getElementById('dob').value,
      playerCategory: document.getElementById('playerCategory').value,
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      address: document.getElementById('address').value.trim(),
      message: document.getElementById('message').value.trim(),
    };
  }

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
    } else {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  }

  function showOverlay(overlayEl) {
    overlayEl.classList.add('is-visible');
  }

  function hideOverlay(overlayEl) {
    overlayEl.classList.remove('is-visible');
  }

  function resetForm() {
    form.reset();
    // Clear all validation states
    form.querySelectorAll('.is-invalid, .is-valid').forEach((el) => {
      el.classList.remove('is-invalid', 'is-valid');
      el.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.form-error').forEach((el) => {
      el.classList.remove('is-visible');
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      // Focus the first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        const offset = 120;
        const targetY = firstInvalid.getBoundingClientRect().top + window.pageYOffset - offset;
        const lenis = TTC.lenis && TTC.lenis();
        if (lenis) {
          lenis.scrollTo(targetY, { duration: 0.8 });
        }
      }
      return;
    }

    const data = getFormData();
    setLoadingState(true);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Success
      setLoadingState(false);
      showOverlay(successOverlay);

    } catch (err) {
      console.warn('Membership form submission failed:', err.message);
      setLoadingState(false);
      showOverlay(errorOverlay);
    }
  }

  // ============================================================
  // OVERLAY BUTTON HANDLERS
  // ============================================================

  function initOverlayButtons() {
    if (backToMembershipBtn) {
      backToMembershipBtn.addEventListener('click', () => {
        hideOverlay(successOverlay);
        resetForm();
        // Scroll to top of fee section
        const feeSection = document.querySelector('.section--cream');
        if (feeSection) {
          const lenis = TTC.lenis && TTC.lenis();
          if (lenis) {
            lenis.scrollTo(feeSection, { duration: 1 });
          } else {
            feeSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        hideOverlay(errorOverlay);
      });
    }
  }

  // ============================================================
  // INIT
  // ============================================================

  function init() {
    initPlanSelection();
    initRealtimeValidation();
    initOverlayButtons();

    form.addEventListener('submit', handleSubmit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
