document.addEventListener('DOMContentLoaded', () => {
    const API_PROXY_URL = 'https://faceit-api-sand.vercel.app/api/faceit-stats?nickname=Westyasha-';

    const widgetContainer = document.getElementById('faceit-widget-container');
    widgetContainer.classList.add('loading');

    const renderError = (message) => {
        widgetContainer.innerHTML = `
            <div class="faceit-widget">
                <div class="faceit-error">
                    <p><strong>Ошибка загрузки</strong></p>
                    <p>${message}</p>
                </div>
            </div>
        `;
        widgetContainer.classList.remove('loading');
    };
    
    const renderWidget = (data) => {
        const player = data.playerDetails;
        const stats = data.playerStats;
        const recentMatches = data.matchHistory.items;
        
        const winStreak = parseInt(stats.lifetime['Current Win Streak'], 10) || 0;
        const streakType = 'W';

        const last5Results = recentMatches.slice(0, 5).map(match => {
            const playerFaction = match.teams.faction1.players.some(p => p.player_id === player.player_id) ? 'faction1' : 'faction2';
            return match.results.winner === playerFaction ? 'W' : 'L';
        });

        let countryFlagHtml = `<img src="https://community.cloudflare.steamstatic.com/public/images/countryflags/${player.country.toLowerCase()}.gif" alt="${player.country}" class="faceit-country">`;
        if (player.country.toLowerCase() === 'de') {
            countryFlagHtml = `<img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" class="faceit-country">`;
        }

        const formattedElo = player.games.cs2.faceit_elo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;");

        widgetContainer.innerHTML = `
            <div class="faceit-widget-toggle"></div>
            <div class="faceit-widget">
                <div class="faceit-banner"><img src="res/banner.png" alt="Faceit Banner"></div>
                <div class="faceit-content">
                    <div class="faceit-header">
                        <div class="faceit-avatar-wrapper">
                            <img src="${player.avatar || ''}" alt="Avatar" class="faceit-avatar">
                        </div>
                    </div>

                    <div class="faceit-info-container">
                        <h2 class="faceit-nickname">
                            ${player.nickname.replace(/-$/, '')}
                            ${countryFlagHtml}
                        </h2>
                    </div>

                    <div class="faceit-rank-container">
                        <div class="faceit-elo">
                            <div class="faceit-elo-value-container">
                                <div class="faceit-elo-icon">
                                    <svg viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 3c0 .463-.105.902-.292 1.293l1.998 2A2.97 2.97 0 0115 6a2.99 2.99 0 011.454.375l1.921-1.921a3 3 0 111.5 1.328l-2.093 2.093a3 3 0 11-5.49-.168l-1.999-2a2.992 2.992 0 01-2.418.074L5.782 7.876a3 3 0 11-1.328-1.5l1.921-1.921A3 3 0 1112 3z" fill="currentColor"></path>
                                    </svg>
                                </div>
                                <div class="faceit-elo-value">${formattedElo}</div>
                            </div>
                        </div>
                    </div>

                    <div class="faceit-main-stats">
                        <div class="faceit-stat">
                            <div class="faceit-stat-value">${stats.lifetime['Average K/D Ratio']}</div>
                            <div class="faceit-stat-label">Avg. K/D</div>
                        </div>
                         <div class="faceit-stat">
                            <div class="faceit-stat-value">${stats.lifetime['Win Rate %']}%</div>
                            <div class="faceit-stat-label">Win Rate</div>
                        </div>
                        <div class="faceit-stat">
                             <div class="faceit-stat-value">${stats.lifetime['ADR'] || 'N/A'}</div>
                             <div class="faceit-stat-label">ADR</div>
                        </div>
                        <div class="faceit-stat">
                            <div class="faceit-stat-value">${winStreak} ${streakType}</div>
                            <div class="faceit-stat-label">Win Streak</div>
                        </div>
                    </div>

                    <div class="faceit-recent-matches">
                        <div class="faceit-recent-matches-title">Последние 5 матчей</div>
                        <div class="matches-list">
                            ${last5Results.map(result => `
                                <div class="match-result ${result === 'W' ? 'win' : 'loss'}">${result}</div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const toggleButton = widgetContainer.querySelector('.faceit-widget-toggle');
        
        if (localStorage.getItem('faceitWidgetCollapsed') !== 'false') {
            widgetContainer.classList.add('collapsed');
        }

        toggleButton.addEventListener('click', () => {
            const isCollapsed = widgetContainer.classList.toggle('collapsed');
            localStorage.setItem('faceitWidgetCollapsed', isCollapsed);
        });
        
        widgetContainer.classList.remove('loading');
    };

    fetch(API_PROXY_URL)
        .then(response => {
            if (!response.ok) throw new Error(`Сервер ответил с ошибкой: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.error) {
                renderError(data.error);
            } else {
                renderWidget(data);
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных виджета:', error);
            renderError('Не удалось подключиться к API.');
        });
});