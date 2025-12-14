(function () {
    'use strict';

    const TSBiroForms = {
        init: function () {
            this.initializeContactForms();
        },

        initializeContactForms: function () {
            const contactForms = document.querySelectorAll('form');
            if (contactForms.length === 0) return;

            contactForms.forEach(form => {
                // Add real-time validation
                const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => this.validateFormField(input));
                    input.addEventListener('input', () => {
                        if (input.validity.valid) this.clearFieldError(input);
                    });
                });

                // Handle checkbox interactions
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', function () {
                        const checkboxItem = this.closest('.checkbox-item');
                        if (checkboxItem) {
                            checkboxItem.classList.toggle('checked', this.checked);
                        }
                    });

                    // Set initial state
                    const checkboxItem = checkbox.closest('.checkbox-item');
                    if (checkboxItem) {
                        checkboxItem.classList.toggle('checked', checkbox.checked);
                    }
                });

                // Form submission
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmit(form, checkboxes);
                });
            });
        },

        // Handle form submission with checkboxes
        handleFormSubmit: function (form, checkboxes) {
            // Validate all required fields
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            inputs.forEach(input => {
                if (!this.validateFormField(input)) isValid = false;
            });

            if (!isValid) {
                this.showNotification('Molimo ispunite sva obavezna polja ispravno.', 'error');
                return;
            }

            // Email validation
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    this.showNotification('Molimo unesite ispravnu email adresu.', 'error');
                    this.showFieldError(emailInput, 'Molimo unesite ispravnu email adresu.');
                    return;
                }
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
                submitBtn.disabled = true;

                // Simulate form submission
                setTimeout(() => {
                    // Success
                    this.showNotification('Hvala vam na upitu! Kontaktirat ćemo vas u najkraćem mogućem roku.', 'success');
                    form.reset();

                    // Reset checkbox styling
                    checkboxes.forEach(checkbox => {
                        const checkboxItem = checkbox.closest('.checkbox-item');
                        if (checkboxItem) {
                            checkboxItem.classList.remove('checked');
                        }
                    });

                    // Clear all errors
                    inputs.forEach(input => this.clearFieldError(input));

                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        },

        // Get checkbox values
        getCheckboxValues: function (name) {
            const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
            return Array.from(checkboxes).map(cb => cb.value);
        },

        validateFormField: function (field) {
            this.clearFieldError(field);

            if (!field.validity.valid) {
                this.showFieldError(field, this.getValidationMessage(field));
                return false;
            }

            // Additional email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    this.showFieldError(field, 'Molimo unesite ispravnu email adresu.');
                    return false;
                }
            }

            return true;
        },

        showFieldError: function (field, message) {
            field.classList.add('error');

            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
        },

        clearFieldError: function (field) {
            field.classList.remove('error');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) errorElement.remove();
        },

        getValidationMessage: function (field) {
            if (field.validity.valueMissing) return 'Ovo polje je obavezno.';
            if (field.validity.typeMismatch) {
                if (field.type === 'email') return 'Molimo unesite ispravnu email adresu.';
                if (field.type === 'tel') return 'Molimo unesite ispravan broj telefona.';
            }
            if (field.validity.tooShort) return `Unos je prekratak. Minimalno ${field.minLength} znakova.`;
            if (field.validity.tooLong) return `Unos je predug. Maksimalno ${field.maxLength} znakova.`;
            if (field.validity.patternMismatch) return 'Format unosa nije ispravan.';
            return 'Unos nije ispravan.';
        },

        showNotification: function (message, type = 'info', duration = 5000) {
            // Remove any existing notifications
            document.querySelectorAll('.notification').forEach(notification => notification.remove());

            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.setAttribute('role', 'alert');
            notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close" aria-label="Zatvori">×</button>
            `;

            document.body.appendChild(notification);

            // Close button
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 300);
            });

            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateY(-20px)';
                    setTimeout(() => notification.remove(), 300);
                }, duration);
            }
        }
    };

    // Initialize forms module when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        TSBiroForms.init();
    });

    // Export to global scope
    window.TSBiroForms = TSBiroForms;
})();