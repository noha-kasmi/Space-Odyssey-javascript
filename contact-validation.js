// Validation du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    // Éléments du formulaire
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    
    // Messages d'erreur
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    // Expressions régulières pour la validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;

    // Fonctions de validation
    function validateFirstName() {
        const value = firstName.value.trim();
        if (!value) {
            showError(firstName, firstNameError, 'Le prénom est requis');
            return false;
        } else if (!nameRegex.test(value)) {
            showError(firstName, firstNameError, 'Le prénom doit contenir au moins 4 caractères , sans caractéres spécifiées');
            return false;
        } else {
            showSuccess(firstName, firstNameError);
            return true;
        }
    }

    function validateLastName() {
        const value = lastName.value.trim();
        if (!value) {
            showError(lastName, lastNameError, 'Le nom est requis');
            return false;
        } else if (!nameRegex.test(value)) {
            showError(lastName, lastNameError, 'Le nom doit contenir au moins 4 caractères , sans caractéres spécifiées');
            return false;
        } else {
            showSuccess(lastName, lastNameError);
            return true;
        }
    }

    function validateEmail() {
        const value = email.value.trim();
        if (!value) {
            showError(email, emailError, 'L\'email est requis');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(email, emailError, 'Format d\'email invalide , exemple@gmail.com');
            return false;
        } else {
            showSuccess(email, emailError);
            return true;
        }
    }

    function validatePhone() {
        const value = phone.value.trim();
        if (value && !phoneRegex.test(value)) {
            showError(phone, phoneError, 'Format de téléphone invalide , il doit etre en nombres ');
            return false;
        } else {
            showSuccess(phone, phoneError);
            return true;
        }
    }

    function validateMessage() {
        const value = message.value.trim();
        if (!value) {
            showError(message, messageError, 'Le message est requis');
            return false;
        } else if (value.length < 10) {
            showError(message, messageError, 'Le message doit contenir au moins 10 caractères');
            return false;
        } else {
            showSuccess(message, messageError);
            return true;
        }
    }

    // Fonctions d'affichage des erreurs/succès
    function showError(input, errorElement, message) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    // Validation en temps réel
    firstName.addEventListener('input', validateFirstName);
    lastName.addEventListener('input', validateLastName);
    email.addEventListener('input', validateEmail);
    phone.addEventListener('input', validatePhone);
    message.addEventListener('input', validateMessage);

    // Validation à la perte de focus
    firstName.addEventListener('blur', validateFirstName);
    lastName.addEventListener('blur', validateLastName);
    email.addEventListener('blur', validateEmail);
    phone.addEventListener('blur', validatePhone);
    message.addEventListener('blur', validateMessage);

    // Soumission du formulaire
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Valider tous les champs
        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isMessageValid = validateMessage();

        if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isMessageValid) {
            // Simulation d'envoi - remplacer par votre logique d'envoi
            simulateFormSubmission();
        } else {
            // Focus sur le premier champ invalide
            const firstInvalid = contactForm.querySelector('.invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });

    // Simulation d'envoi du formulaire
    function simulateFormSubmission() {
        const submitBtn = contactForm.querySelector('.send-btn');
        const originalText = submitBtn.textContent;
        
        // Désactiver le bouton et montrer le chargement
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        // Simuler un appel API
        setTimeout(() => {
            // Rediriger vers la page de succès
            window.location.href = 'contact-success.html';
        }, 2000);
    }

    // Réinitialiser les styles de validation
    function resetValidation() {
        const inputs = contactForm.querySelectorAll('input, textarea');
        const errorMessages = contactForm.querySelectorAll('.error-message');
        
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        
        errorMessages.forEach(error => {
            error.textContent = '';
            error.classList.remove('show');
        });
    }

    // Exposer les fonctions globalement si nécessaire
    window.resetContactForm = resetValidation;
});