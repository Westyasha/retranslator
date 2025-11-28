<div align="center">

  <img src="res/icon.png" alt="Logo" width="100" height="100" />

  # ✦ BIO Profile ✦

  <p align="center">
    <b>An interactive personal landing page with real-time API integrations.</b>
  </p>

  <p align="center">
    <a href="https://www.westyasha.online/"><strong>View Live Demo »</strong></a>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/Faceit-FF5500?style=for-the-badge&logo=faceit&logoColor=white" alt="Faceit API" />
    <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord API" />
  </p>
</div>

---

## ⚡ About The Project

**BIO Profile** is a fully customized personal website designed to showcase a portfolio, social presence, and real-time gaming statistics.

The project is built entirely with **Vanilla JavaScript**, avoiding heavy frameworks to ensure maximum performance and clean code. It demonstrates proficiency in working with the DOM, asynchronous API requests, and WebSocket connections.

### ✨ Key Features

*   **🎨 Immersive UI/UX**:
    *   Dark aesthetic with accent gradients (`#a85db9`).
    *   Custom magnetic cursor integration.
    *   Interactive background using **HTML5 Canvas** particle systems.
*   **🎮 Real-time Discord Widget**:
    *   Displays current status (Online, Idle, DND) and custom activities.
    *   **Spotify Integration**: Shows album art, song progress, and dominant color extraction for dynamic gradients.
    *   Powered by **WebSockets** via the [Lanyard API](https://github.com/Phineas/lanyard).
*   **🏆 Faceit Stats Integration**:
    *   Fetches and displays live CS2 statistics.
    *   Shows ELO, Win Streak, K/D Ratio, and recent match history (Win/Loss).
    *   Handles data fetching via a proxy to bypass CORS restrictions.
*   **📱 Responsive Design**: Fully optimized for desktop and mobile devices with touch-friendly interactions.

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3 | Semantic markup, Grid/Flexbox layouts, CSS Variables & Animations. |
| **Logic** | Vanilla JavaScript (ES6+) | Async/Await, WebSockets, Canvas API, DOM Manipulation. |
| **Discord API** | Lanyard API | Gateway for persistent Discord presence monitoring. |
| **CS2 Data** | Faceit Open API | Player statistics and match history data. |
| **Assets** | Font Awesome 6 | Vector icons for social links. |
| **Typography** | Google Fonts | 'Inter' (Body) and 'Unbounded' (Headers). |

---

## 📂 Project Structure

```text
root/
├── index.html          # Main entry point
├── res/                # Images, icons, and banners
├── css/
│   ├── style.css       # Core styling, variables, and animations
│   ├── discord.css     # Specific styles for the Discord widget
│   └── faceit.css      # Specific styles for the Faceit widget
└── js/
    ├── script.js       # Global logic (Cursor, Canvas Particles)
    ├── discord.js      # WebSocket logic for Discord presence
    └── faceit.js       # API fetching logic for Faceit stats
