document.addEventListener('DOMContentLoaded', async () => {
    const gamesContainer = document.querySelector('main');

    try {
        const apiGet = '/api/fetchData';
        const response = await fetch(apiGet);
        const data = await response.json();

        const games = Object.keys(data).map(gameId => {
            return {
                id: gameId,
                ...data[gameId],
                date: new Date(parseInt(gameId) * 1000)
            };
        });

        games.sort((a, b) => b.date - a.date);

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
                <a href="game.html?gameId=${game.id}" class="game-date">${formattedDate}</a>
            `;


            gamesContainer.appendChild(section);
        });
        updateSections();
    } catch (error) {
        console.error('Ошибка при загрузке данных об играх:', error);
    }

    function getEmoji(text, size = 20) {
        return `<img class="emoji" draggable="false" src="assets/twemoji/${text}.svg" style="width: ${size}px; height: ${size}px;">`;
    }

    function updateSections() {
        const sections = document.querySelectorAll('.section');

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
    }
});
