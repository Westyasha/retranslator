document.addEventListener('DOMContentLoaded', () => {
    const DISCORD_ID = '375737212186132490';
    const widgetContainer = document.getElementById('discord-widget-container');
    let socket;
    let activityTimerInterval;

if (localStorage.getItem('discordWidgetCollapsed') !== 'false') {
    widgetContainer.classList.add('collapsed');
}

    const lightenRgb = (rgb, percent) => {
        const [r, g, b] = rgb.match(/\d+/g).map(Number);
        const p = percent / 100;
        const newR = Math.min(255, Math.round(r + (255 - r) * p));
        const newG = Math.min(255, Math.round(g + (255 - g) * p));
        const newB = Math.min(255, Math.round(b + (255 - b) * p));
        return `rgb(${newR}, ${newG}, ${newB})`;
    };

    const getAlbumColors = (imageUrl) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imageUrl.replace('?size=128', '?size=40');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                canvas.width = img.width; canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const data = ctx.getImageData(0, 0, img.width, img.height).data;
                const colors = {};
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i+3] < 200) continue;
                    const rgb = `rgb(${data[i]}, ${data[i+1]}, ${data[i+2]})`;
                    colors[rgb] = (colors[rgb] || 0) + 1;
                }
                const sortedColors = Object.keys(colors).sort((a, b) => colors[b] - colors[a]);
                const dominantColor1 = lightenRgb(sortedColors[0] || 'rgb(30, 215, 96)', 30);
                const dominantColor2 = lightenRgb(sortedColors[1] || 'rgb(29, 185, 84)', 30);
                resolve(`linear-gradient(65deg, ${dominantColor1}, ${dominantColor2})`);
            };
            img.onerror = () => resolve('linear-gradient(65deg, rgb(30, 215, 96), rgb(29, 185, 84))');
        });
    };
    
    const formatTime = (ms) => {
        const totalSeconds = Math.floor((Date.now() - ms) / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m elapsed`;
        return `${minutes}m ${totalSeconds % 60}s elapsed`;
    };
    
    const updateTimers = () => {
        const timers = widgetContainer.querySelectorAll('.game-time[data-start-time]');
        if (timers.length === 0) {
            clearInterval(activityTimerInterval);
            activityTimerInterval = null;
            return;
        }
        timers.forEach(timer => {
            const startTime = parseInt(timer.dataset.startTime, 10);
            timer.textContent = formatTime(startTime);
        });
    };

    const createActivityElement = (activity) => {
        const activityEl = document.createElement('div');
        activityEl.className = 'discord-activity';
        let activityContent = '';
        
        if (activity.type === 'spotify') {
            activityEl.classList.add('spotify');
            activityEl.dataset.songId = activity.song;
            getAlbumColors(activity.album_art_url).then(gradient => {
                activityEl.querySelectorAll('.spotify-bar').forEach(bar => bar.style.background = gradient);
            });
            activityContent = `
                <img src="${activity.album_art_url}" alt="Album Art" class="spotify-album-art">
                <div class="spotify-info">
                    <p class="spotify-song">${activity.song}</p>
                    <p class="spotify-artist">by ${activity.artist.replace(/;/g, ', ')}</p>
                </div>
                <div class="spotify-bars">
                    <div class="spotify-bar"></div><div class="spotify-bar"></div><div class="spotify-bar"></div>
                </div>`;
        } else {
            activityEl.classList.add('game');
            const largeImg = activity.assets?.large_image ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png` : `https://dcdn.dstn.to/app-icons/${activity.application_id}.png`;
            const timeInfo = activity.timestamps?.start ? `<p class="game-time" data-start-time="${activity.timestamps.start}"></p>` : '';
            activityContent = `
                <img src="${largeImg}" alt="${activity.name}" class="game-icon">
                <div class="game-info">
                    <p class="game-name">${activity.name}</p>
                    ${activity.details ? `<p class="game-details">${activity.details}</p>` : ''}
                    ${activity.state ? `<p class="game-state">${activity.state}</p>` : ''}
                    ${timeInfo}
                </div>`;
        }
        activityEl.innerHTML = activityContent;
        return activityEl;
    };

    const updateActivities = (activities, spotify) => {
        const activityWrapper = widgetContainer.querySelector('.discord-activity-wrapper');
        const activitiesToShow = [];

        if (spotify) activitiesToShow.push({ type: 'spotify', ...spotify });
        activitiesToShow.push(...activities.filter(act => act.type === 0 && act.id !== 'spotify:1'));

        const newActivitiesKey = activitiesToShow.map(a => a.name || a.song).join(',');
        if (activityWrapper.dataset.activitiesKey === newActivitiesKey) return;
        activityWrapper.dataset.activitiesKey = newActivitiesKey;
        
        if (activityTimerInterval) clearInterval(activityTimerInterval);
        activityTimerInterval = null;
        
        activityWrapper.innerHTML = '';
        if (activitiesToShow.length === 0) return;

        const stack = document.createElement('div');
        stack.className = 'discord-activity-stack';
        
        const primaryActivity = createActivityElement(activitiesToShow[0]);
        stack.appendChild(primaryActivity);

        if (activitiesToShow.length > 1) {
            const expander = document.createElement('div');
            expander.className = 'activity-expander';
            expander.textContent = `+${activitiesToShow.length - 1} More`;
            stack.appendChild(expander);

            const secondaryContainer = document.createElement('div');
            secondaryContainer.className = 'secondary-activities';
            
            const innerSecondary = document.createElement('div');
            activitiesToShow.slice(1).forEach(act => {
                innerSecondary.appendChild(createActivityElement(act));
            });
            secondaryContainer.appendChild(innerSecondary);
            stack.appendChild(secondaryContainer);
        }
        
        activityWrapper.appendChild(stack);

        if (widgetContainer.querySelector('.game-time[data-start-time]')) {
            updateTimers();
            activityTimerInterval = setInterval(updateTimers, 1000);
        }

        setTimeout(() => {
            stack.querySelectorAll('.discord-activity').forEach(el => el.classList.add('visible'));
        }, 50);
    };

    const createWidget = (data) => {
        const { discord_user: user, activities, discord_status: status, spotify } = data;
        
        if (status === 'offline') {
            widgetContainer.classList.add('hidden');
            return;
        }
        widgetContainer.classList.remove('hidden');

        if (!widgetContainer.querySelector('.discord-widget')) {
            widgetContainer.innerHTML = `
                <div class="discord-widget-toggle"></div>
                <div class="discord-widget">
                    <div class="discord-banner"><img src="https://cdn.discordapp.com/guilds/691725745499668510/users/375737212186132490/banners/a_0235205998fc9c5e36a6ad344af1d5ac.gif?size=480" alt="Discord Banner"></div>
                    <div class="discord-content">
                        <div class="discord-header">
                            <div class="discord-avatar-wrapper">
                                <img src="" alt="Avatar" class="discord-avatar"><img src="" alt="Decoration" class="discord-avatar-decoration" style="display: none;"><span class="discord-status"></span>
                            </div>
                            <div class="discord-main-content">
                                <div class="discord-info">
                                    <div class="discord-username-row"><p class="discord-username"></p></div>
                                    <div class="discord-badges"></div>
                                    <div class="discord-custom-status-wrapper"></div>
                                </div>
                                <div class="discord-clan-badge"><img src="https://cdn.discordapp.com/clan-badges/691725745499668510/0b535a3d5af1f3c8f099b0aac2f66cee.png?size=44&quality=lossless" alt="Clan Badge"><span>&gt;_&lt;</span></div>
                            </div>
                        </div>
                        <div class="discord-activity-wrapper"></div>
                    </div>
                </div>`;

            widgetContainer.querySelector('.discord-widget-toggle').addEventListener('click', () => {
                const isCollapsed = widgetContainer.classList.toggle('collapsed');
                localStorage.setItem('discordWidgetCollapsed', isCollapsed);
            });
        }
        
        const updateElement = (selector, action) => {
            const element = widgetContainer.querySelector(selector);
            if (element) action(element);
        };
        
        const avatarUrl = 'res/avatar.jpg';
        const avatarDecorationURL = 'https://cdn.discordapp.com/avatar-decoration-presets/a_6d99f670de3fcee669660fe262e896ea.png?size=160&passthrough=false';

        updateElement('.discord-avatar', el => { if(el.src !== avatarUrl) el.src = avatarUrl; });
        updateElement('.discord-avatar-decoration', el => {
            if (avatarDecorationURL) {
                if (el.src !== avatarDecorationURL) el.src = avatarDecorationURL;
                el.style.display = 'block';
            } else { el.style.display = 'none'; }
        });
        
        updateElement('.discord-status', el => el.className = `discord-status ${status}`);
        updateElement('.discord-username', el => el.textContent = user.global_name || user.username);
        
        const userBadgesHTML = `<img src="https://cdn.discordapp.com/badge-icons/11e2d339068b55d3a506cff34d3780f3.png" alt="Nitro" class="discord-badge" title="Nitro"><img src="https://cdn.discordapp.com/badge-icons/8a88d63823d8a71cd5e390baa45efa02.png" alt="HypeSquad Bravery" class="discord-badge" title="HypeSquad Bravery"><img src="https://cdn.discordapp.com/badge-icons/6bdc42827a38498929a4920da12695d9.png" alt="Active Developer" class="discord-badge" title="Active Developer"><img src="https://cdn.discordapp.com/badge-icons/ec92202290b48d0879b7413d2dde3bab.png" alt="Server Booster" class="discord-badge" title="Server Booster"><img src="https://cdn.discordapp.com/badge-icons/6de6d34650760ba5551a79732e98ed60.png" alt="Legacy Username" class="discord-badge" title="Legacy Username"><img src="https://cdn.discordapp.com/badge-icons/7d9ae358c8c5e118768335dbe68b4fb8.png" alt="Quest Completed" class="discord-badge" title="Quest Completed"><img src="https://cdn.discordapp.com/badge-icons/83d8a1eb09a8d64e59233eec5d4d5c2d.png" alt="Orbs" class="discord-badge" title="Orbs">`;
        updateElement('.discord-badges', el => { if (el.innerHTML !== userBadgesHTML) el.innerHTML = userBadgesHTML; });

        const customStatus = activities.find(act => act.type === 4);
        updateElement('.discord-custom-status-wrapper', wrapper => {
            let customStatusEl = wrapper.querySelector('.discord-custom-status');
            if (customStatus) {
                if (!customStatusEl) {
                    wrapper.innerHTML = `<div class="discord-custom-status"></div>`;
                    customStatusEl = wrapper.querySelector('.discord-custom-status');
                    setTimeout(() => customStatusEl.classList.add('visible'), 50);
                }
                const emojiURL = customStatus.emoji?.id ? `https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}` : '';
                const newStatusHTML = `${emojiURL ? `<img src="${emojiURL}" alt="status-emoji">` : ''}<p>${customStatus.state || ''}</p>`;
                if (customStatusEl.innerHTML !== newStatusHTML) customStatusEl.innerHTML = newStatusHTML;
            } else if (customStatusEl) {
                 customStatusEl.classList.remove('visible');
                 customStatusEl.addEventListener('transitionend', () => customStatusEl.remove(), { once: true });
            }
        });
        
        updateActivities(activities, spotify);
    };

    const connect = () => {
        socket = new WebSocket('wss://api.lanyard.rest/socket');
        socket.onopen = () => {
            socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
            setInterval(() => socket.send(JSON.stringify({ op: 3 })), 30000);
        };
        socket.onmessage = (event) => {
            const { op, d } = JSON.parse(event.data);
            if (op === 0) createWidget(d);
        };
        socket.onclose = () => setTimeout(connect, 5000);
        socket.onerror = () => socket.close();
    };

    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
        .then(response => response.json())
        .then(result => { if (result.success) createWidget(result.data); });

    connect();
});