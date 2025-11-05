// ===== VARIABLES GLOBALES =====
let missions = [];
let favorites = JSON.parse(localStorage.getItem('missionFavorites')) || [];
let currentMissionId = null;

// Éléments DOM
const missionsContainer = document.getElementById('missionsContainer');
const popupOverlay = document.getElementById('popupOverlay');
const missionForm = document.getElementById('missionForm');
const globalSearch = document.getElementById('globalSearch');
const agencyFilter = document.getElementById('agencyFilter');
const yearFilter = document.getElementById('yearFilter');
const typeFilter = document.getElementById('typeFilter');
const favoriteCount = document.getElementById('favoriteCount');

// Images par défaut pour les missions
const defaultImages = {
    'NASA': 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&h=500&fit=crop',
    'ESA': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=500&fit=crop',
    'CNSA': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=500&fit=crop',
    'Roscosmos': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=500&fit=crop',
    'ISRO': 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800&h=500&fit=crop',
    'JAXA': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=500&fit=crop',
    'MBRSC': 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=500&fit=crop',
    'NASA/ESA/CSA': 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&h=500&fit=crop',
    'ESA/JAXA': 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&h=500&fit=crop'
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadMissions();
    setupEventListeners();
    updateFavoriteCount();
});

// ===== FONCTIONS D'INITIALISATION =====

// Charger les missions depuis le fichier JSON
async function loadMissions() {
    try {
        const response = await fetch('missions.json');
        
        if (!response.ok) {
            throw new Error('Fichier missions.json non trouvé');
        }
        
        const data = await response.json();
        missions = data.missions;
        initializeFilters();
        displayMissions(missions);
    } catch (error) {
        console.error('Erreur lors du chargement des missions:', error);
        // Si le fichier n'existe pas, créer un tableau vide
        missions = [];
        initializeFilters();
        displayMissions(missions);
        
        // Afficher un message d'erreur
        missionsContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3em; color: #ff9800; margin-bottom: 20px;"></i>
                <h3 style="color: #666;">Erreur de chargement</h3>
                <p style="color: #999;">Impossible de charger les missions. Vérifiez que le fichier missions.json existe.</p>
                <button class="btn btn-primary" onclick="openMissionForm()" style="margin-top: 20px;">
                     Ajouter votre première mission
                </button>
            </div>
        `;
    }
}

// Initialiser les filtres
function initializeFilters() {
    // Agences
    const agencies = [...new Set(missions.map(mission => mission.agency))];
    agencyFilter.innerHTML = '<option value="">Toutes les agences</option>';
    agencies.forEach(agency => {
        const option = document.createElement('option');
        option.value = agency;
        option.textContent = agency;
        agencyFilter.appendChild(option);
    });

    // Années
    const years = [...new Set(missions.map(mission => new Date(mission.launchDate).getFullYear()))].sort((a, b) => b - a);
    yearFilter.innerHTML = '<option value="">Toutes les années</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    // Types
    const types = [...new Set(missions.map(mission => mission.type))];
    typeFilter.innerHTML = '<option value="">Tous les types</option>';
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Recherche en temps réel
    globalSearch.addEventListener('input', debounce(applyFilters, 300));
    
    // Fermer le popup en cliquant à l'extérieur
    popupOverlay.addEventListener('click', function(event) {
        if (event.target === popupOverlay) {
            closePopup();
        }
    });
    
    // Empêcher la fermeture en cliquant à l'intérieur du formulaire
    document.querySelector('.popup-form').addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Fermer le popup favoris en cliquant à l'extérieur
    document.getElementById('favoritesPopup').addEventListener('click', function(event) {
        if (event.target === this) {
            closeFavoritesPopup();
        }
    });
}

// ===== FONCTIONS D'AFFICHAGE =====

// Afficher les missions
function displayMissions(missionsToDisplay) {
    missionsContainer.innerHTML = '';

    if (missionsToDisplay.length === 0) {
        missionsContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 3em; color: #666; margin-bottom: 20px;"></i>
                <h3 style="color: #666;">Aucune mission trouvée</h3>
                <p style="color: #999;">Essayez de modifier vos critères de recherche</p>
            </div>
        `;
        return;
    }

    missionsToDisplay.forEach(mission => {
        const missionCard = createMissionCard(mission);
        missionsContainer.appendChild(missionCard);
    });
}

// Créer une carte de mission
function createMissionCard(mission) {
    const card = document.createElement('div');
    card.className = 'mission-card';
    
    const imageUrl = mission.image || defaultImages[mission.agency] || defaultImages['NASA'];
    const isFavorite = favorites.includes(mission.id);
    
    card.innerHTML = `
        <div class="mission-image">
            <img src="${imageUrl}" alt="${mission.name}">
            <button class="favorite-star ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${mission.id})">
                <i class="fas fa-star"></i>
            </button>
        </div>
        <div class="mission-content">
            <div class="mission-header">
                <h3 class="mission-title">${mission.name}</h3>
                <span class="mission-agency">${mission.agency}</span>
            </div>
            <div class="mission-details">
                <div class="mission-detail">
                    <i class="fas fa-bullseye"></i>
                    <span><strong>Objectif:</strong> ${mission.objective}</span>
                </div>
                <div class="mission-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span><strong>Lancement:</strong> ${formatDate(mission.launchDate)}</span>
                </div>
                <div class="mission-detail">
                    <i class="fas fa-tag"></i>
                    <span><strong>Type:</strong> ${mission.type}</span>
                </div>
            </div>
            <div class="mission-actions">
                <button class="btn-action btn-edit" onclick="editMission(${mission.id})">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn-action btn-delete" onclick="deleteMission(${mission.id})">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ===== FONCTIONS DE GESTION DES FAVORIS =====

// Mettre à jour le compteur de favoris
function updateFavoriteCount() {
    favoriteCount.textContent = favorites.length;
}

// Basculer le favori
function toggleFavorite(missionId) {
    const index = favorites.indexOf(missionId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(missionId);
    }
    
    localStorage.setItem('missionFavorites', JSON.stringify(favorites));
    updateFavoriteCount();
    applyFilters();
}

// Afficher le popup des favoris
function showFavoritesPopup() {
    const favoritesPopup = document.getElementById('favoritesPopup');
    const favoritesList = document.getElementById('favoritesList');
    const noFavorites = document.getElementById('noFavorites');
    
    // Afficher ou masquer le message "Aucun favori"
    if (favorites.length === 0) {
        noFavorites.style.display = 'block';
        favoritesList.style.display = 'none';
    } else {
        noFavorites.style.display = 'none';
        favoritesList.style.display = 'block';
        displayFavoritesList();
    }
    
    favoritesPopup.style.display = 'flex';
}

// Fermer le popup des favoris
function closeFavoritesPopup() {
    const favoritesPopup = document.getElementById('favoritesPopup');
    favoritesPopup.style.display = 'none';
}

// Afficher la liste des favoris dans le popup
function displayFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    const favoriteMissions = missions.filter(mission => favorites.includes(mission.id));
    
    favoritesList.innerHTML = '';
    
    favoriteMissions.forEach(mission => {
        const favoriteItem = createFavoriteItem(mission);
        favoritesList.appendChild(favoriteItem);
    });
}

// Créer un élément favori pour le popup
function createFavoriteItem(mission) {
    const item = document.createElement('div');
    item.className = 'favorite-item';
    
    const imageUrl = mission.image || defaultImages[mission.agency] || defaultImages['NASA'];
    const launchYear = new Date(mission.launchDate).getFullYear();
    
    item.innerHTML = `
        <div class="favorite-item-image">
            <img src="${imageUrl}" alt="${mission.name}">
        </div>
        <div class="favorite-item-content">
            <div class="favorite-item-header">
                <h4 class="favorite-item-name">${mission.name}</h4>
                <span class="favorite-item-agency">${mission.agency}</span>
            </div>
            <div class="favorite-item-details">
                <div class="favorite-item-objective">${mission.objective}</div>
                <div class="favorite-item-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${launchYear}</span>
                    <span><i class="fas fa-tag"></i> ${mission.type}</span>
                </div>
            </div>
        </div>
        <div class="favorite-item-actions">
            <button class="favorite-remove-btn" onclick="removeFromFavorites(${mission.id})">
                <i class="fas fa-times"></i> Retirer
            </button>
        </div>
    `;
    
    return item;
}

// Retirer une mission des favoris depuis le popup
function removeFromFavorites(missionId) {
    const index = favorites.indexOf(missionId);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('missionFavorites', JSON.stringify(favorites));
        updateFavoriteCount();
        displayFavoritesList();
        
        // Si plus de favoris, afficher le message
        if (favorites.length === 0) {
            document.getElementById('noFavorites').style.display = 'block';
            document.getElementById('favoritesList').style.display = 'none';
        }
        
        // Mettre à jour aussi l'affichage principal
        applyFilters();
    }
}

// ===== FONCTIONS DE FILTRAGE ET RECHERCHE =====

// Rechercher les missions
function searchMissions() {
    applyFilters();
}

// Appliquer les filtres
function applyFilters() {
    const searchTerm = globalSearch.value.toLowerCase();
    const agency = agencyFilter.value;
    const year = yearFilter.value;
    const type = typeFilter.value;

    const filteredMissions = missions.filter(mission => {
        const matchesSearch = !searchTerm || 
            mission.name.toLowerCase().includes(searchTerm) ||
            mission.objective.toLowerCase().includes(searchTerm) ||
            mission.agency.toLowerCase().includes(searchTerm) ||
            mission.type.toLowerCase().includes(searchTerm);
        
        const matchesAgency = !agency || mission.agency === agency;
        const matchesYear = !year || new Date(mission.launchDate).getFullYear().toString() === year;
        const matchesType = !type || mission.type === type;

        return matchesSearch && matchesAgency && matchesYear && matchesType;
    });

    displayMissions(filteredMissions);
}

// Réinitialiser les filtres
function resetFilters() {
    globalSearch.value = '';
    agencyFilter.value = '';
    yearFilter.value = '';
    typeFilter.value = '';
    displayMissions(missions);
}

// ===== FONCTIONS DE GESTION DES MISSIONS =====

// Ouvrir le formulaire d'ajout
function openMissionForm(missionId = null) {
    const popupTitle = document.getElementById('popupTitle');
    
    if (missionId) {
        currentMissionId = missionId;
        const mission = missions.find(m => m.id === missionId);
        popupTitle.textContent = 'Modifier la Mission';
        populateForm(mission);
    } else {
        currentMissionId = null;
        popupTitle.textContent = 'Ajouter une Mission';
        missionForm.reset();
        document.getElementById('missionId').value = '';
    }
    
    popupOverlay.style.display = 'flex';
}

// Remplir le formulaire
function populateForm(mission) {
    document.getElementById('missionId').value = mission.id;
    document.getElementById('name').value = mission.name;
    document.getElementById('agency').value = mission.agency;
    document.getElementById('objective').value = mission.objective;
    document.getElementById('launchDate').value = mission.launchDate;
    document.getElementById('type').value = mission.type;
    document.getElementById('image').value = mission.image || '';
}

// Fermer le popup
function closePopup() {
    popupOverlay.style.display = 'none';
    missionForm.reset();
    currentMissionId = null;
}

// Sauvegarder la mission
function saveMission(event) {
    event.preventDefault();
    
    const formData = {
        id: currentMissionId || Math.max(...missions.map(m => m.id)) + 1,
        name: document.getElementById('name').value,
        agency: document.getElementById('agency').value,
        objective: document.getElementById('objective').value,
        launchDate: document.getElementById('launchDate').value,
        type: document.getElementById('type').value,
        image: document.getElementById('image').value
    };
    
    if (currentMissionId) {
        const index = missions.findIndex(m => m.id === currentMissionId);
        missions[index] = formData;
    } else {
        missions.push(formData);
    }
    
    displayMissions(missions);
    closePopup();
    updateFilters();
    updateFavoriteCount();
}

// Modifier une mission
function editMission(missionId) {
    openMissionForm(missionId);
}

// Supprimer une mission
function deleteMission(missionId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
        missions = missions.filter(mission => mission.id !== missionId);
        const favIndex = favorites.indexOf(missionId);
        if (favIndex > -1) {
            favorites.splice(favIndex, 1);
            localStorage.setItem('missionFavorites', JSON.stringify(favorites));
            updateFavoriteCount();
        }
        displayMissions(missions);
        updateFilters();
    }
}

// Mettre à jour les filtres
function updateFilters() {
    agencyFilter.innerHTML = '<option value="">Toutes les agences</option>';
    yearFilter.innerHTML = '<option value="">Toutes les années</option>';
    typeFilter.innerHTML = '<option value="">Tous les types</option>';
    initializeFilters();
}

// ===== FONCTIONS UTILITAIRES =====

// Formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Fonction debounce pour optimiser la recherche
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== EXPORTATION DES FONCTIONS GLOBALES =====
window.searchMissions = searchMissions;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.openMissionForm = openMissionForm;
window.closePopup = closePopup;
window.saveMission = saveMission;
window.editMission = editMission;
window.deleteMission = deleteMission;
window.toggleFavorite = toggleFavorite;
window.showFavoritesPopup = showFavoritesPopup;
window.closeFavoritesPopup = closeFavoritesPopup;
window.removeFromFavorites = removeFromFavorites;

// ===== GESTION DES ÉVÉNEMENTS AVANCÉE =====

// Gestion des onglets
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Animation de transition
            missionsContainer.classList.add('loading');
            
            setTimeout(() => {
                // Retirer la classe active de tous les boutons
                tabButtons.forEach(b => b.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');
                
                const tabType = this.dataset.tab;
                filterMissionsByTab(tabType);
                
                // Retirer l'état de chargement
                missionsContainer.classList.remove('loading');
            }, 300);
        });
    });
}

function filterMissionsByTab(tabType) {
    let missionsToShow = [];
    
    switch(tabType) {
        case 'all':
            missionsToShow = missions;
            break;
        case 'favorites':
            missionsToShow = missions.filter(mission => favorites.includes(mission.id));
            break;
        case 'my-missions':
            // Simuler des missions utilisateur (basé sur l'agence NASA et ESA)
            missionsToShow = missions.filter(mission => 
                mission.agency === 'NASA' || mission.agency === 'ESA'
            );
            break;
    }
    
    displayMissions(missionsToShow);
}

// Gestion des clics sur les cartes
function setupCardInteractions() {
    document.addEventListener('click', function(e) {
        const missionCard = e.target.closest('.mission-card');
        
        if (missionCard && !e.target.closest('.mission-actions') && !e.target.closest('.favorite-star')) {
            const missionId = missionCard.querySelector('.mission-title').textContent;
            showMissionDetails(missionId);
        }
    });
}

// Affichage des détails d'une mission (simulé)
function showMissionDetails(missionName) {
    const mission = missions.find(m => m.name === missionName);
    if (mission) {
        showToast(`Détails de la mission: ${mission.name}`, 'success');
        // Dans un vrai projet, on pourrait ouvrir un modal avec les détails complets
        console.log('Mission details:', mission);
    }
}

// Gestion de la navigation fluide
function setupSmoothNavigation() {
    // Intercepter les clics sur les liens de navigation
    document.addEventListener('click', function(e) {
        if (e.target.matches('.menu .links a') || 
            e.target.matches('.hero-btn') || 
            e.target.matches('.contact-btn a')) {
            
            if (e.target.getAttribute('href') && !e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                navigateToPage(href);
            }
        }
    });
}

function navigateToPage(url) {
    // Animation de transition
    document.body.style.opacity = '0.8';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Gestion avancée du formulaire
function setupFormAdvancedHandling() {
    const missionForm = document.getElementById('missionForm');
    
    // Réinitialisation avancée du formulaire
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = 'Réinitialiser';
    resetBtn.className = 'btn btn-cancel';
    resetBtn.style.marginRight = '10px';
    resetBtn.addEventListener('click', resetMissionForm);
    
    // Ajouter le bouton réinitialiser avant le bouton sauvegarder
    missionForm.querySelector('.btn-save').parentNode.insertBefore(resetBtn, missionForm.querySelector('.btn-save'));
    
    // Validation en temps réel améliorée
    missionForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    switch(field.id) {
        case 'name':
            if (value.length < 2) {
                showFieldError(field, 'Le nom doit contenir au moins 2 caractères');
            } else {
                showFieldSuccess(field);
            }
            break;
        case 'objective':
            if (value.length < 10) {
                showFieldError(field, 'L\'objectif doit contenir au moins 10 caractères');
            } else {
                showFieldSuccess(field);
            }
            break;
        case 'image':
            if (value && !isValidUrl(value)) {
                showFieldError(field, 'URL invalide');
            } else {
                showFieldSuccess(field);
            }
            break;
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showFieldError(field, message) {
    field.classList.remove('valid');
    field.classList.add('invalid');
    // Vous pourriez ajouter des messages d'erreur spécifiques si besoin
}

function showFieldSuccess(field) {
    field.classList.remove('invalid');
    field.classList.add('valid');
}

function resetMissionForm() {
    const form = document.getElementById('missionForm');
    form.reset();
    
    // Réinitialiser les styles de validation
    form.querySelectorAll('input, select').forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    
    showToast('Formulaire réinitialisé', 'success');
}

// Système de notifications amélioré
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    
    // Changer l'icône selon le type
    switch(type) {
        case 'success':
            toastIcon.className = 'fas fa-check-circle toast-icon';
            break;
        case 'error':
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
            break;
        case 'warning':
            toastIcon.className = 'fas fa-exclamation-triangle toast-icon';
            break;
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialisation complète des événements
function initializeEventHandlers() {
    setupTabs();
    setupCardInteractions();
    setupSmoothNavigation();
    setupFormAdvancedHandling();
}

// Mettre à jour l'initialisation existante
document.addEventListener('DOMContentLoaded', function() {
    loadMissions();
    setupEventListeners();
    updateFavoriteCount();
    initializeEventHandlers(); // Nouvelle ligne
});