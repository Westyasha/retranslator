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

        const formattedElo = player.games.cs2.faceit_elo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;");

        widgetContainer.innerHTML = `
            <div class="faceit-widget-toggle"></div>
            <div class="faceit-widget">
<<<<<<< HEAD
                <div class="faceit-banner"><img src="${player.cover_image || 'res/banner.png'}" alt="Faceit Banner"></div>
=======
                <div class="faceit-banner"><img src="https://distribution.faceit-cdn.net/images/dad403ee-222e-466e-8403-7b364af7733c.jpg" alt="Faceit Banner"></div>
>>>>>>> parent of e48c84a (fix banner + avatar)
                <div class="faceit-content">
                    <div class="faceit-header">
                        <div class="faceit-avatar-wrapper">
                            <img src="${player.avatar || ''}" alt="Avatar" class="faceit-avatar">
                        </div>
                    </div>

                    <div class="faceit-info-container">
                        <h2 class="faceit-nickname">${player.nickname.replace(/-$/, '')}</h2>
                        <div class="faceit-elo-container">
                             <div class="faceit-elo-icon">
                                <svg viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c0 .463-.105.902-.292 1.293l1.998 2A2.97 2.97 0 0115 6a2.99 2.99 0 011.454.375l1.921-1.921a3 3 0 111.5 1.328l-2.093 2.093a3 3 0 11-5.49-.168l-1.999-2a2.992 2.992 0 01-2.418.074L5.782 7.876a3 3 0 11-1.328-1.5l1.921-1.921A3 3 0 1112 3z" fill="currentColor"></path></svg>
                            </div>
                            <span class="faceit-elo-value">${formattedElo}</span>
                        </div>
                    </div>

                    <div class="faceit-main-stats">
                        <div class="faceit-stat">
                            <div class="stat-header">
                                <div class="stat-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                                </div>
                                <div class="faceit-stat-label">AVG. K/D</div>
                            </div>
                            <div class="faceit-stat-value">${stats.lifetime['Average K/D Ratio']}</div>
                        </div>
                         <div class="faceit-stat">
                            <div class="stat-header">
                                 <div class="stat-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 001.056 4.223 1.5 1.5 0 002.588.663 1.5 1.5 0 00.662-2.587 9.753 9.753 0 00-4.223-1.057" /></svg>
                                </div>
                                <div class="faceit-stat-label">WIN RATE</div>
                            </div>
                            <div class="faceit-stat-value">${stats.lifetime['Win Rate %']}%</div>
                        </div>
                        <div class="faceit-stat">
                             <div class="stat-header">
                                 <div class="stat-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 </div>
                                 <div class="faceit-stat-label">ADR</div>
                            </div>
                             <div class="faceit-stat-value">${stats.lifetime['ADR'] || 'N/A'}</div>
                        </div>
                        <div class="faceit-stat">
                            <div class="stat-header">
                                <div class="stat-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" /></svg>
                                </div>
                                <div class="faceit-stat-label">WIN STREAK</div>
                            </div>
                            <div class="faceit-stat-value">${winStreak} ${streakType}</div>
                        </div>
                    </div>

                    <div class="faceit-recent-matches">
                        <div class="faceit-recent-matches-title">Последние 5 матчей</div>
                        <div class="matches-list">
                            ${last5Results.map(result => `
                                <div class="match-result ${result === 'W' ? 'win' : 'loss'}">
                                    <div class="match-result-inner">${result}</div>
                                </div>
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