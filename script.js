// Données des missions avec favoris
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

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadMissions();
    setupEventListeners();
});

// Charger les missions
async function loadMissions() {
    try {
        const response = await fetch('missions.json');
        const data = await response.json();
        missions = data.missions;
        initializeFilters();
        displayMissions(missions);
    } catch (error) {
        console.error('Erreur lors du chargement des missions:', error);
        // Charger des données par défaut en cas d'erreur
        missions = getDefaultMissions();
        initializeFilters();
        displayMissions(missions);
    }
}

// Données par défaut basées sur votre JSON
function getDefaultMissions() {
    return [
        {
            "id": 1,
            "name": "Apollo 11",
            "agency": "NASA",
            "objective": "Premier alunissage habité",
            "launchDate": "1969-07-16",
            "type": "Alunissage",
            "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop"
        },
        {
            "id": 2,
            "name": "Voyager 1",
            "agency": "NASA",
            "objective": "Exploration du système solaire externe",
            "launchDate": "1977-09-05",
            "type": "Exploration",
            "image": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop"
        },
        {
            "id": 3,
            "name": "Rosetta",
            "agency": "ESA",
            "objective": "Étude de la comète 67P/Churyumov-Gerasimenko",
            "launchDate": "2004-03-02",
            "type": "Observation",
            "image": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop"
        },
        {
            "id": 4,
            "name": "Curiosity",
            "agency": "NASA",
            "objective": "Exploration du cratère Gale sur Mars",
            "launchDate": "2011-11-26",
            "type": "Exploration",
            "image": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop"
        },
        {
            "id": 5,
            "name": "Artemis I",
            "agency": "NASA",
            "objective": "Test du système de lancement SLS et d'Orion",
            "launchDate": "2022-11-16",
            "type": "Test",
            "image": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop"
        },
        {
            "id": 6,
            "name": "James Webb Space Telescope",
            "agency": "NASA/ESA/CSA",
            "objective": "Observation de l'univers primitif",
            "launchDate": "2021-12-25",
            "type": "Observation",
            "image": "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&h=300&fit=crop"
        },
        {
            "id": 7,
            "name": "BepiColombo",
            "agency": "ESA/JAXA",
            "objective": "Exploration de la planète Mercure",
            "launchDate": "2018-10-20",
            "type": "Exploration",
            "image": "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&h=300&fit=crop"
        }
    ];
}



// Initialiser les filtres
function initializeFilters() {
    // Agences
    const agencies = [...new Set(missions.map(mission => mission.agency))];
    agencies.forEach(agency => {
        const option = document.createElement('option');
        option.value = agency;
        option.textContent = agency;
        agencyFilter.appendChild(option);
    });

    // Années
    const years = [...new Set(missions.map(mission => new Date(mission.launchDate).getFullYear()))].sort((a, b) => b - a);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    // Types
    const types = [...new Set(missions.map(mission => mission.type))];
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
}

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
    
    const missionYear = new Date(mission.launchDate).getFullYear();
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

// Formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Basculer le favori
function toggleFavorite(missionId) {
    const index = favorites.indexOf(missionId);
    
    if (index > -1) {
        // Retirer des favoris
        favorites.splice(index, 1);
    } else {
        // Ajouter aux favoris
        favorites.push(missionId);
    }
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('missionFavorites', JSON.stringify(favorites));
    
    // Re-afficher les missions
    applyFilters();
}

// Filtrer par favoris
function showFavorites() {
    const favoriteMissions = missions.filter(mission => favorites.includes(mission.id));
    displayMissions(favoriteMissions);
}

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

// Ouvrir le formulaire d'ajout
function openMissionForm(missionId = null) {
    const popupTitle = document.getElementById('popupTitle');
    const form = document.getElementById('missionForm');
    
    if (missionId) {
        // Mode édition
        currentMissionId = missionId;
        const mission = missions.find(m => m.id === missionId);
        popupTitle.textContent = 'Modifier la Mission';
        populateForm(mission);
    } else {
        // Mode ajout
        currentMissionId = null;
        popupTitle.textContent = 'Ajouter une Mission';
        form.reset();
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
        // Édition
        const index = missions.findIndex(m => m.id === currentMissionId);
        missions[index] = formData;
    } else {
        // Ajout
        missions.push(formData);
    }
    
    displayMissions(missions);
    closePopup();
    updateFilters();
}

// Modifier une mission
function editMission(missionId) {
    openMissionForm(missionId);
}

// Supprimer une mission
function deleteMission(missionId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
        missions = missions.filter(mission => mission.id !== missionId);
        // Retirer aussi des favoris si présent
        const favIndex = favorites.indexOf(missionId);
        if (favIndex > -1) {
            favorites.splice(favIndex, 1);
            localStorage.setItem('missionFavorites', JSON.stringify(favorites));
        }
        displayMissions(missions);
        updateFilters();
    }
}

// Mettre à jour les filtres
function updateFilters() {
    // Réinitialiser les filtres
    agencyFilter.innerHTML = '<option value="">Toutes les agences</option>';
    yearFilter.innerHTML = '<option value="">Toutes les années</option>';
    typeFilter.innerHTML = '<option value="">Tous les types</option>';
    
    // Re-initialiser avec les nouvelles données
    initializeFilters();
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

// Exporter les fonctions globales
window.searchMissions = searchMissions;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.openMissionForm = openMissionForm;
window.closePopup = closePopup;
window.saveMission = saveMission;
window.editMission = editMission;
window.deleteMission = deleteMission;
window.toggleFavorite = toggleFavorite;
window.showFavorites = showFavorites;