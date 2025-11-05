// Gestion de la navigation fluide et des interactions globales
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.setupPageTransitions();
    }

    setupGlobalEventListeners() {
        // Gestion des clics sur les cartes de toutes les pages
        document.addEventListener('click', (e) => {
            this.handleCardClicks(e);
            this.handleButtonClicks(e);
            this.handleLinkClicks(e);
        });

        // Gestion des soumissions de formulaire
        document.addEventListener('submit', (e) => {
            this.handleFormSubmissions(e);
        });
    }

    handleCardClicks(e) {
        const card = e.target.closest('.card, .mission-card, .planet-card');
        if (card && !e.target.closest('button') && !e.target.closest('a')) {
            e.preventDefault();
            this.animateCardClick(card);
            
            // Action spécifique selon le type de carte
            if (card.classList.contains('mission-card')) {
                this.handleMissionCardClick(card);
            } else if (card.classList.contains('card')) {
                this.handleHomeCardClick(card);
            }
        }
    }

    handleButtonClicks(e) {
        const button = e.target.closest('button');
        if (button) {
            this.animateButtonClick(button);
            
            // Actions spécifiques selon la classe du bouton
            if (button.classList.contains('card-btn')) {
                this.handleLearnMoreClick(button);
            } else if (button.classList.contains('astro-btn')) {
                this.handleAstronomyClick(button);
            }
        }
    }

    handleLinkClicks(e) {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            this.navigateTo(link.getAttribute('href'));
        }
    }

    handleFormSubmissions(e) {
        const form = e.target;
        if (form.id === 'contactForm') {
            this.handleContactFormSubmit(form);
        }
    }

    animateCardClick(card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    animateButtonClick(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }

    handleMissionCardClick(card) {
        const missionName = card.querySelector('.mission-title')?.textContent;
        if (missionName) {
            this.showNotification(`Ouverture des détails: ${missionName}`, 'info');
        }
    }

    handleHomeCardClick(card) {
        const cardTitle = card.querySelector('h3')?.textContent;
        if (cardTitle) {
            this.showNotification(`Exploration: ${cardTitle}`, 'info');
        }
    }

    handleLearnMoreClick(button) {
        const card = button.closest('.card');
        const topic = card.querySelector('h3')?.textContent;
        this.showNotification(`En savoir plus sur: ${topic}`, 'success');
    }

    handleAstronomyClick(button) {
        this.showNotification('Navigation vers la section astronomie', 'info');
    }

    handleContactFormSubmit(form) {
        this.showNotification('Envoi du formulaire de contact...', 'success');
    }

    navigateTo(url) {
        // Animation de transition de page
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    showNotification(message, type = 'info') {
        // Créer une notification toast temporaire
        const toast = document.createElement('div');
        toast.className = `notification ${type}`;
        toast.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    setupPageTransitions() {
        // Restaurer l'opacité au chargement de la page
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});