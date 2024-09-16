document.addEventListener('DOMContentLoaded', async () => {
    const gamesContainer = document.querySelector('main');
    const sortSection = document.getElementById('sortSection');

    try {
        const apiGet = '/api/fetchData';
        const startTime = performance.now();

        const response = await fetch(apiGet);
        const data = await response.json();

        let games = Object.keys(data).map(gameId => {
            return {
                id: gameId,
                ...data[gameId],
                date: new Date(parseInt(gameId) * 1000)
            };
        });

        const maps = [...new Set(games.map(game => game.map))];
        createSortOptions(maps);

        const endTime = performance.now();
        const loadTime = (endTime - startTime).toFixed(2);

        const s = document.getElementById('section1');
        s.innerHTML = `
            <h2>Последние игры (${games.length})</h2>
            <p>Загрузка заняла ${loadTime} мс. Все объекты загружены.</p>
        `;

        renderGames(games);

        document.getElementById('sortButton').addEventListener('click', () => {
            const selectedMap = document.getElementById('mapFilter').value;
            const winFilter = document.querySelector('input[name="winFilter"]:checked').value;
            const timeSort = document.getElementById('timeSort').value;

            let filteredGames = games;

            if (selectedMap !== 'all') {
                filteredGames = filteredGames.filter(game => game.map === selectedMap);
            }

            if (winFilter !== 'all') {
                filteredGames = filteredGames.filter(game => {
                    if (winFilter === 'red') return game.winEmoji === 'red';
                    if (winFilter === 'blue') return game.winEmoji === 'blue';
                });
            }

            if (timeSort === 'asc') {
                filteredGames.sort((a, b) => a.date - b.date);
            } else if (timeSort === 'desc') {
                filteredGames.sort((a, b) => b.date - a.date);
            }

            gamesContainer.innerHTML = '';
            renderGames(filteredGames);
        });
    } catch (error) {
        console.error('Ошибка при загрузке данных об играх:', error);
    }

    function createSortOptions(maps) {
        sortSection.innerHTML = `
            <label for="mapFilter">Выберите карту:</label>
            <select id="mapFilter">
                <option value="all">Все карты</option>
                ${maps.map(map => `<option value="${map}">${map}</option>`).join('')}
            </select>

            <fieldset>
                <legend>Фильтр по победе:</legend>
                <label><input type="radio" name="winFilter" value="all" checked> Все</label>
                <label><input type="radio" name="winFilter" value="red"> Победа красных</label>
                <label><input type="radio" name="winFilter" value="blue"> Победа синих</label>
            </fieldset>

            <label for="timeSort">Сортировка по времени:</label>
            <select id="timeSort">
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
            </select>

            <button id="sortButton">Применить сортировку</button>
        `;
    }

    function renderGames(games) {
        games.forEach(game => {
            const section = document.createElement('div');
            section.id = `section${game.id}`;
            section.classList.add('section');
            
            const date = new Date(parseInt(game.id) * 1000);
            const formattedDate = date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU');

            const winnerColor = game.winEmoji === 'blue' ? '#2d8feb' : '#eb2d2d';
            const loserColor = game.winEmoji === 'blue' ? '#eb2d2d' : '#2d8feb';
            const getKDR = (kills, deaths) => deaths > 0 ? (kills / deaths).toFixed(2) : kills;

            section.innerHTML = `
                <h2>${getEmoji(game.winEmoji)} ${getEmoji("link")} #${game.id} – ${getEmoji("clock")} ${game.time} – ${getEmoji("photo")} ${game.map}</h2>
                <p>Оставшееся ХП машины: <strong>${game.machineHp}</strong> ❤</p>
                
                <p>– <strong>Победители</strong> ${game.winners.map(winner => `
                    <div class="player">
                        <img src="${winner.skinUrl}" alt="${winner.name}" class="player-avatar"/>
                        <span class="player-name" style="color: ${winnerColor};">${winner.name}</span>
                        <span class="player-class">${winner.classId}</span>
                        <span class="player-stats">${getEmoji("kills", 14)} ${winner.kills} ${getEmoji("deaths", 14)} ${winner.deaths} | ${getKDR(winner.kills, winner.deaths)}</span>
                    </div>
                `).join('')}</p>
                
                <p>– <strong>Проигравшие</strong> ${game.losers.map(loser => `
                    <div class="player">
                        <img src="${loser.skinUrl}" alt="${loser.name}" class="player-avatar"/>
                        <span class="player-name" style="color: ${loserColor};">${loser.name}</span>
                        <span class="player-class">${loser.classId}</span>
                        <span class="player-stats">${getEmoji("kills", 14)} ${loser.kills} ${getEmoji("deaths", 14)} ${loser.deaths} | ${getKDR(loser.kills, loser.deaths)}</span>
                    </div>
                `).join('')}</p>
                
                <img src="assets/maps/${game.mapId}.png" class="map-picture">
                <a href="game?gameId=${game.id}" class="game-date">${formattedDate}</a>
            `;

            gamesContainer.appendChild(section);
        });
    }

    function getEmoji(text, size = 20) {
        return `<img class="emoji" draggable="false" src="assets/twemoji/${text}.svg" style="width: ${size}px; height: ${size}px;">`;
    }

    function checkVisibility() {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + scrollY;
            const sectionHeight = section.offsetHeight;

            if (scrollY + windowHeight > sectionTop + sectionHeight / 4) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
});
