const url = "https://dragonball-api.com/api/characters";
const cardsContainer = document.getElementById('cardsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

let currentPage = 1;
let isLoading = false;
let hasMoreData = true;

function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.innerHTML = `
        <img src="${character.image}" alt="${character.name}" loading="lazy">
        <h3>${character.name}</h3>
        <p class="race">${character.race || 'Unknown'}</p>
    `;
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.innerHTML = `
        <h3>${character.name}</h3>
        <div class="stats">
            <p><strong>KI:</strong> ${character.ki || 'Unknown'}</p>
            <p><strong>Max KI:</strong> ${character.maxKi || 'Unknown'}</p>
            <p><strong>Gender:</strong> ${character.gender || 'Unknown'}</p>
            <p><strong>Affiliation:</strong> ${character.affiliation || 'Unknown'}</p>
        </div>
    `;
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
    
    return card;
}

function showLoading() {
    isLoading = true;
    loadingIndicator.classList.add('active');
}

function hideLoading() {
    isLoading = false;
    loadingIndicator.classList.remove('active');
}

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    cardsContainer.appendChild(errorDiv);
}

async function fetchCharacters() {
    if (isLoading || !hasMoreData) return;
    
    showLoading();
    
    try {
        const response = await fetch(`${url}?page=${currentPage}&limit=10`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            data.items.forEach(character => {
                const card = createCharacterCard(character);
                cardsContainer.appendChild(card);
            });
            
            currentPage++;
            
            if (!data.meta || currentPage > data.meta.totalPages) {
                hasMoreData = false;
            }
        } else {
            hasMoreData = false;
        }
        
    } catch (error) {
        console.error('Error fetching characters:', error);
        displayError('Failed to load characters. Please try again.');
    } finally {
        hideLoading();
    }
}

function setupInfiniteScroll() {
    const observerOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && hasMoreData) {
                fetchCharacters();
            }
        });
    }, observerOptions);
    
    observer.observe(loadingIndicator);
}

fetchCharacters();
setupInfiniteScroll();
