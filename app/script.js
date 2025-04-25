 // State management
 const state = {
    currentPage: 1,
    totalPages: 0,
    filters: {
        name: '',
        status: '',
        species: '',
        gender: ''
    }
};

// DOM elements
const elements = {
    charactersContainer: document.getElementById('characters'),
    loading: document.getElementById('loading'),
    nameFilter: document.getElementById('nameFilter'),
    statusFilter: document.getElementById('statusFilter'),
    speciesFilter: document.getElementById('speciesFilter'),
    genderFilter: document.getElementById('genderFilter'),
    searchBtn: document.getElementById('searchBtn'),
    resetBtn: document.getElementById('resetBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    pageInfo: document.getElementById('pageInfo'),
    characterModal: document.getElementById('characterModal'),
    modalContent: document.getElementById('modalContent'),
    closeModal: document.querySelector('.close-modal')
};

// Event listeners
elements.searchBtn.addEventListener('click', applyFilters);
elements.resetBtn.addEventListener('click', resetFilters);
elements.prevBtn.addEventListener('click', goToPreviousPage);
elements.nextBtn.addEventListener('click', goToNextPage);
elements.closeModal.addEventListener('click', () => {
    elements.characterModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === elements.characterModal) {
        elements.characterModal.style.display = 'none';
    }
});

// Initialize the app
fetchCharacters();

// Main function to fetch characters
async function fetchCharacters() {
    try {
        elements.loading.style.display = 'block';
        elements.charactersContainer.innerHTML = '';
        
        const params = new URLSearchParams({
            page: state.currentPage,
            ...state.filters
        });
        
        const response = await fetch(`https://rickandmortyapi.com/api/character?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        state.totalPages = data.info.pages;
        updatePagination();
        
        if (data.results.length === 0) {
            elements.charactersContainer.innerHTML = '<p>No characters found with these filters.</p>';
        } else {
            displayCharacters(data.results);
        }
    } catch (error) {
        console.error('Error fetching characters:', error);
                elements.charactersContainer.innerHTML = `<p>Error loading characters: ${error.message}</p>`;
            } finally {
                elements.loading.style.display = 'none';
            }
        }
        
        // Display characters in the UI
        function displayCharacters(characters) {
            elements.charactersContainer.innerHTML = '';
            
            characters.forEach(character => {
                const card = document.createElement('div');
                card.className = 'character-card';
                card.innerHTML = `
                    <img src="${character.image}" alt="${character.name}" class="character-image">
                    <div class="character-info">
                        <div class="character-name">${character.name}</div>
                        <div class="character-species">${character.species} - ${character.status}</div>
                    </div>
                `;
                
                card.addEventListener('click', () => showCharacterDetails(character));
                elements.charactersContainer.appendChild(card);
            });
        }
        
        // Show character details in modal
        function showCharacterDetails(character) {
            elements.modalContent.innerHTML = `
                <h2>${character.name}</h2>
                <img src="${character.image}" alt="${character.name}" style="max-width: 100%; border-radius: 4px;">
                <p><strong>Status:</strong> ${character.status}</p>
                <p><strong>Species:</strong> ${character.species}</p>
                <p><strong>Gender:</strong> ${character.gender}</p>
                <p><strong>Origin:</strong> ${character.origin.name}</p>
                <p><strong>Location:</strong> ${character.location.name}</p>
                <p><strong>Episodes:</strong> ${character.episode.length}</p>
                <p><strong>Created:</strong> ${new Date(character.created).toLocaleDateString()}</p>
            `;
            
            elements.characterModal.style.display = 'flex';
        }
        
        // Update pagination controls
        function updatePagination() {
            elements.pageInfo.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
            elements.prevBtn.disabled = state.currentPage === 1;
            elements.nextBtn.disabled = state.currentPage === state.totalPages;
        }
        
        // Apply filters from UI
        function applyFilters() {
            state.currentPage = 1;
            state.filters = {
                name: elements.nameFilter.value,
                status: elements.statusFilter.value,
                species: elements.speciesFilter.value,
                gender: elements.genderFilter.value
            };
            
            fetchCharacters();
        }
        
        // Reset all filters
        function resetFilters() {
            elements.nameFilter.value = '';
            elements.statusFilter.value = '';
            elements.speciesFilter.value = '';
            elements.genderFilter.value = '';
            
            state.currentPage = 1;
            state.filters = {
                name: '',
                status: '',
                species: '',
                gender: ''
            };
            
            fetchCharacters();
        }
        
        // Navigation functions
        function goToPreviousPage() {
            if (state.currentPage > 1) {
                state.currentPage--;
                fetchCharacters();
            }
        }
        
        function goToNextPage() {
            if (state.currentPage < state.totalPages) {
                state.currentPage++;
                fetchCharacters();
            }
        }
