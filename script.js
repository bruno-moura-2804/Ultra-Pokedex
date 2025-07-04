document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('pokemon-search');
    const searchBtn = document.getElementById('search-btn');
    const pokemonCard = document.getElementById('pokemon-card');
    const notFound = document.getElementById('not-found');
    const loading = document.getElementById('loading');
    const themeSwitcher = document.getElementById('theme-switcher');
    
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonId = document.getElementById('pokemon-id');
    const pokemonImage = document.getElementById('pokemon-image');
    const placeholderImage = document.getElementById('placeholder-image');
    const pokemonTypes = document.getElementById('pokemon-types');
    const pokemonHeight = document.getElementById('pokemon-height');
    const pokemonWeight = document.getElementById('pokemon-weight');
    const pokemonAbilities = document.getElementById('pokemon-abilities');
    const pokemonStats = document.getElementById('pokemon-stats');
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitcher.checked = true;
    }
    
    themeSwitcher.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
    
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitcher.checked = true;
    } else if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeSwitcher.checked = false;
    }
    
    searchBtn.addEventListener('click', searchPokemon);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchPokemon();
        }
    });
    
    function searchPokemon() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            showError('Digite um nome ou ID de Pokémon');
            return;
        }
        
        showLoading();
        clearPokemonData();
        
        fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokémon não encontrado');
                }
                return response.json();
            })
            .then(data => {
                displayPokemon(data);
                hideLoading();
            })
            .catch(error => {
                console.error('Erro ao buscar Pokémon:', error);
                hideLoading();
                showNotFound();
            });
    }
    
    function showLoading() {
        pokemonCard.style.display = 'none';
        notFound.style.display = 'none';
        loading.style.display = 'flex';
    }
    
    function hideLoading() {
        loading.style.display = 'none';
    }
    
    function showNotFound() {
        pokemonCard.style.display = 'none';
        notFound.style.display = 'flex';
        
        gsap.from(notFound, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            ease: 'power2.out'
        });
    }
    
    function clearPokemonData() {
        pokemonName.textContent = '------';
        pokemonId.textContent = '#---';
        pokemonImage.style.display = 'none';
        placeholderImage.style.display = 'block';
        pokemonTypes.innerHTML = '';
        pokemonHeight.textContent = '--';
        pokemonWeight.textContent = '--';
        pokemonAbilities.innerHTML = '';
        pokemonStats.innerHTML = '';
    }
    
    function displayPokemon(pokemon) {
        pokemonName.textContent = pokemon.name;
        pokemonId.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
        
        pokemonImage.src = pokemon.sprites.other['official-artwork'].front_default || 
                        pokemon.sprites.front_default;
        pokemonImage.onload = function() {
            placeholderImage.style.display = 'none';
            pokemonImage.style.display = 'block';
            
            gsap.from(pokemonImage, {
                duration: 0.5,
                opacity: 0,
                scale: 0.8,
                ease: 'back.out(1.7)'
            });
        };
        
        pokemon.types.forEach(type => {
            const typeElement = document.createElement('span');
            typeElement.className = `type-badge type-${type.type.name}`;
            typeElement.textContent = type.type.name;
            pokemonTypes.appendChild(typeElement);
        });
        
        pokemonHeight.textContent = `${(pokemon.height / 10).toFixed(1)} m`;
        pokemonWeight.textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;
        
        pokemon.abilities.forEach(ability => {
            const abilityElement = document.createElement('li');
            abilityElement.textContent = ability.ability.name.replace('-', ' ');
            pokemonAbilities.appendChild(abilityElement);
        });
        
        pokemon.stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'stat-item';
            
            const statHeader = document.createElement('div');
            statHeader.className = 'stat-header';
            
            const statName = document.createElement('span');
            statName.className = 'stat-name';
            statName.textContent = stat.stat.name.replace('-', ' ');
            
            const statValue = document.createElement('span');
            statValue.className = 'stat-value';
            statValue.textContent = stat.base_stat;
            
            statHeader.appendChild(statName);
            statHeader.appendChild(statValue);
            
            const statBar = document.createElement('div');
            statBar.className = 'stat-bar';
            
            const statProgress = document.createElement('div');
            statProgress.className = 'stat-progress';
            
            statBar.appendChild(statProgress);
            
            statElement.appendChild(statHeader);
            statElement.appendChild(statBar);
            
            pokemonStats.appendChild(statElement);
            
            gsap.to(statProgress, {
                duration: 1,
                width: `${(stat.base_stat / 255) * 100}%`,
                ease: 'power2.out'
            });
        });
        
        pokemonCard.style.display = 'grid';
        notFound.style.display = 'none';
        
        gsap.from(pokemonCard, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            ease: 'power2.out'
        });
    }
    
    function fetchRandomPokemon() {
        const randomId = Math.floor(Math.random() * 898) + 1;
        searchInput.value = randomId;
        searchPokemon();
    }
});