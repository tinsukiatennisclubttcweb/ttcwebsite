(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successOverlay = document.getElementById('successOverlay');
  const resetBtn = document.getElementById('resetBtn');

  if (!form) return;

  const validators = {
    name: {
      validate: (value) => value.trim().length >= 2,
      errorId: 'nameError'
    },
    email: {
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      errorId: 'emailError'
    },
    message: {
      validate: (value) => value.trim().length >= 5,
      errorId: 'messageError'
    }
  };

  function showFieldError(field, errorId) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    document.getElementById(errorId).classList.add('is-visible');
  }

  function clearFieldError(field, errorId) {
    field.classList.remove('is-invalid');
    document.getElementById(errorId).classList.remove('is-visible');
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
      showFieldError(field, config.errorId);
    }
    return isValid;
  }

  function validateForm() {
    let isValid = true;
    Object.keys(validators).forEach((fieldId) => {
      if (!validateField(fieldId)) isValid = false;
    });
    return isValid;
  }

  Object.keys(validators).forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.addEventListener('blur', () => {
      if (field.value || field.classList.contains('is-invalid')) validateField(fieldId);
    });
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid') && validators[fieldId].validate(field.value)) {
        clearFieldError(field, validators[fieldId].errorId);
        field.classList.add('is-valid');
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      successOverlay.classList.add('is-visible');
    } catch (err) {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      successOverlay.classList.remove('is-visible');
      form.reset();
      form.querySelectorAll('.is-invalid, .is-valid').forEach(el => el.classList.remove('is-invalid', 'is-valid'));
    });
  }
})();
