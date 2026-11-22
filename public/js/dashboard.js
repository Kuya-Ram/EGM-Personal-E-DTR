import { initializeDashboardResponsive } from "./dashboard-responsive.js";

/* =========================================================
   EGM DTR SYSTEM
   DASHBOARD PAGE
   ========================================================= */

export function renderDashboard(container, user, onLogout) {

    // Add Dashboard Styles
    if (!document.getElementById("dashboard-styles")) {

        const style = document.createElement("style");
        style.id = "dashboard-styles";

        
        style.textContent = `

            /* ========================================
               GLOBAL APPLICATION LAYOUT
               ======================================== */

            html,
            body {
                width: 100%;
                min-height: 100%;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
                overflow-y: auto;

            }

            #app {
                position: relative;
                width: 100%;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }

            #page-content {
                padding-top: 80px;
                position: relative;
                z-index: auto;
            }

            /* ========================================
               GLOBAL HEADER
               ======================================== */

            #main-header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                width: 100%;
                min-height: 80px;
                z-index: 99999;

                background: #071b1d;
                border-bottom: 1px solid rgba(0, 255, 255, 0.25);
            }

            .main-header-content {
                min-height: 76px;
                padding: 10px 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
            }

            .main-header-brand,
            .main-header-account {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .main-header-logo {
                width: 45px;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #00ffff;
                font-size: 23px;
                border: 1px solid rgba(0, 255, 255, 0.4);
                border-radius: 50%;
            }

            .main-header-title h2 {
                margin: 0;
                color: #00ffff;
                font-size: 17px;
            }

            .main-header-title span {
                color: #9bb8ba;
                font-size: 12px;
            }

            .main-header-user-info {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 5px;
            }

            .main-header-user-info strong {
                color: #ffffff;
                font-size: 14px;
            }

            .main-header-status {
                display: flex;
                align-items: center;
                gap: 6px;
                color: #22c55e;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 1px;
            }

            .status-indicator {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #22c55e;
                box-shadow: 0 0 8px #22c55e;
            }

            .main-header-avatar {
                width: 42px;
                height: 42px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #00ffff;
                border-radius: 50%;
                background: #10383b;
                color: #00ffff;
                font-size: 17px;
                font-weight: 700;
            }

            .main-header-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            /* ========================================
               FUTURISTIC CYBER TECH LOGOUT BUTTON
               ======================================== */

            .header-logout-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 9px;

                padding: 10px 20px;
                min-height: 40px;

                background: linear-gradient(
                    135deg,
                    rgba(0, 255, 255, 0.12),
                    rgba(0, 120, 180, 0.20)
                );

                color: #00ffff;
                border: 1px solid rgba(0, 255, 255, 0.65);
                border-radius: 6px;

                font-family: inherit;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 1.2px;
                text-transform: uppercase;

                cursor: pointer;

                box-shadow:
                    0 0 8px rgba(0, 255, 255, 0.15),
                    inset 0 0 8px rgba(0, 255, 255, 0.05);

                transition: all 0.25s ease;
            }

            .header-logout-button i {
                font-size: 14px;
                color: #00ffff;
                transition: transform 0.25s ease;
            }

            /* HOVER EFFECT */
            .header-logout-button:hover {
                color: #001b20;
                background: #00ffff;
                border-color: #00ffff;

                box-shadow:
                    0 0 10px rgba(0, 255, 255, 0.65),
                    0 0 22px rgba(0, 255, 255, 0.35),
                    inset 0 0 8px rgba(255, 255, 255, 0.2);
            }

            .header-logout-button:hover i {
                color: #001b20;
                transform: translateX(3px);
            }

            /* CLICK EFFECT */
            .header-logout-button:active {
                transform: scale(0.96);
                box-shadow: 0 0 6px rgba(0, 255, 255, 0.5);
            }

            /* KEYBOARD ACCESSIBILITY */
            .header-logout-button:focus-visible {
                outline: 2px solid #00ffff;
                outline-offset: 4px;
            }

            #main-footer {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                z-index: 5;
                text-align: center;
                flex-shrink: 0;
                box-sizing: border-box;
                background: #071b1d;
                border-top: 1px solid rgba(0, 255, 255, 0.25);
            }

            .footer-developer-link {
                color: #00ffff;
                font-weight: 700;
                text-decoration: none;
                text-shadow: 0 0 8px rgba(0, 255, 255, 0.55);
                transition: all 0.3s ease;
            }

            .footer-developer-link:hover {
                color: #ffffff;
                text-shadow:
                    0 0 5px #00ffff,
                    0 0 12px #00ffff,
                    0 0 20px #00ffff;
            }

            /* MY DTR TABLE - INDEPENDENT VERTICAL SCROLL */
            .dtr-table-scroll {
                width: 100%;
                max-height: 65vh;
                overflow-y: auto;
                overflow-x: auto;
                position: relative;
            }

            /* Keep table header visible while scrolling */
            .dtr-table-scroll thead th {
                position: sticky;
                top: 0;
                z-index: 2;
            }

            /* ===========================
            GLOBAL DASHBOARD LAYOUT
            =========================== */

            .dashboard-wrapper {
                min-height: 100vh;
                display: flex;
                background: #07131d;
                color: #e8fbff;
                font-family: Arial, sans-serif;
            }

            

            .dashboard-brand {
                margin-bottom: 40px;
                color: #00e5ef;
                font-size: 19px;
                font-weight: 800;
                letter-spacing: 1px;
            }

            .dashboard-menu {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .dashboard-menu-item {
                width: 100%;
                padding: 13px 15px;
                color: #8baab5;
                background: transparent;
                border: 1px solid transparent;
                border-radius: 8px;
                font-size: 14px;
                text-align: left;
                cursor: pointer;
                transition: .2s ease;
            }

            .dashboard-menu-item:hover {
                color: #00e5ef;
                background: rgba(0, 229, 239, .06);
            }

            .dashboard-menu-item.active {
                color: #00e5ef;
                background: rgba(0, 229, 239, .10);
                border-color: rgba(0, 229, 239, .25);
            }

            .dashboard-topbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
                margin-bottom: 40px;
            }

            .dashboard-topbar h2 {
                margin: 0;
                font-size: 21px;
            }

            .dashboard-status {
                color: #00e5a8;
                font-size: 11px;
                letter-spacing: 1px;
            }

            .dashboard-welcome {
                margin-bottom: 30px;
            }

            .dashboard-welcome h1 {
                margin: 8px 0;
                font-size: clamp(25px, 4vw, 34px);
            }

            .dashboard-muted {
                color: #8baab5;
                font-size: 14px;
            }

            .dashboard-label {
                color: #00e5ef;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1.5px;
            }

            /* ===========================
            DASHBOARD SUMMARY CARDS
            =========================== */

            .dashboard-grid {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 16px;
                box-sizzing: border-box;
            }

            .dashboard-card {
                width: 100%;
                min-width: 0;
                box-sizing: border-box;
            }

            /*
            .dashboard-card {
                width: 100%;
                min-height: 85px;
                box-sizing: border-box;
                padding: 23px;
                background: #102531;
                border: 1px solid rgba(0, 229, 239, .16);
                border-radius: 13px;
            }*/

            .dashboard-card strong {
                color: #e8fbff;
                font-size: 20px;
            }

            .dashboard-card p {
                margin: 8px 0 0;
                color: #77939e;
                font-size: 10px;
            }

            /* ===========================
            DASHBOARD DATE FILTERS
            =========================== */

            .dashboard-filters {
                display: flex;
                align-items: flex-end;
                flex-wrap: wrap;
                gap: 16px;
                margin-bottom: 25px;
                padding: 20px;
                background: #0c202b;
                border: 1px solid rgba(0, 229, 239, .18);
                border-radius: 12px;
                box-shadow: 0 5px 18px rgba(0, 0, 0, .15);
            }

            .dashboard-filter-group {
                display: flex;
                flex: 1;
                flex-direction: column;
                gap: 8px;
                min-width: 180px;
            }

            .dashboard-filter-group label {
                color: #00e5ef;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1.5px;
            }

            .dashboard-filter-group input {
                width: 100%;
                min-height: 43px;
                box-sizing: border-box;
                padding: 12px 14px;
                color: #e8fbff;
                background: #071722;
                border: 1px solid rgba(0, 229, 239, .3);
                border-radius: 8px;
                outline: none;
                font-family: inherit;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: .5px;
                transition: .25s ease;
            }

            .dashboard-filter-group input::placeholder {
                color: #7896a3;
                opacity: .85;
            }

            .dashboard-filter-group input:hover {
                border-color: #00e5ef;
                background: #0b202c;
            }

            .dashboard-filter-group input:focus {
                border-color: #00e5ef;
                box-shadow:
                    0 0 0 3px rgba(0, 229, 239, .12),
                    0 0 12px rgba(0, 229, 239, .1);
            }

            .dashboard-filter-button {
                min-height: 43px;
                padding: 12px 22px;
                color: #071722;
                background: linear-gradient(135deg, #00e5ef, #00bfae);
                border: 1px solid #00e5ef;
                border-radius: 8px;
                font-family: inherit;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: .5px;
                cursor: pointer;
                transition: .25s ease;
            }

            .dashboard-filter-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 15px rgba(0, 229, 239, .3);
            }

            .dashboard-filter-button:active {
                transform: translateY(0);
            }

            /* ===========================
            ATTENDANCE ANALYTICS
            =========================== */

            .attendance-analytics {
                margin-top: 25px;
                padding: 24px;
                background: #102531;
                border: 1px solid rgba(0, 229, 239, .16);
                border-radius: 13px;
            }

            .attendance-analytics-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 22px;
            }

            .attendance-analytics-header h3 {
                margin: 0 0 6px;
                color: #e8fbff;
                font-size: 16px;
            }

            .attendance-chart-container {
                position: relative;
                width: 100%;
                max-width: 300px;
                height: 260px;
                margin: 0 auto 20px;
            }

            .attendance-counts {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 15px;
            }

            .attendance-count-card {
                padding: 17px;
                background: #0c202b;
                border: 1px solid rgba(0, 229, 239, .12);
                border-radius: 9px;
            }

            .attendance-count-card span {
                color: #8baab5;
                font-size: 12px;
            }

            .attendance-count-card strong {
                display: block;
                margin-top: 8px;
                font-size: 25px;
            }

            .attendance-present {
                color: #00e5a8;
            }

            .attendance-absent {
                color: #ff7185;
            }

            .attendance-late {
                color: #f5b942;
            }

            .attendance-analytics-message {
                margin-top: 15px;
                color: #8baab5;
                font-size: 12px;
            }

            /* ===========================
            DASHBOARD ACCOUNT & PANELS
            =========================== */

            .dashboard-account {
                margin-top: 25px;
                padding: 20px;
                background: #0c202b;
                border: 1px solid rgba(0, 229, 239, .16);
                border-radius: 12px;
            }

            .dashboard-account h3 {
                margin-top: 0;
                color: #00e5ef;
                font-size: 14px;
            }

            .dashboard-account p {
                margin: 10px 0;
                color: #a8c0c9;
                font-size: 13px;
            }

            .dashboard-panel {
                margin-bottom: 20px;
                padding: 24px;
                background: #102531;
                border: 1px solid rgba(0, 229, 239, .16);
                border-radius: 13px;
            }

            .dashboard-logout {
                margin-top: auto;
                padding: 12px;
                color: #ff7d89;
                background: transparent;
                border: 1px solid rgba(255, 125, 137, .3);
                border-radius: 8px;
                cursor: pointer;
            }

            .dashboard-logout:hover {
                background: rgba(255, 125, 137, .1);
            }

            /* ===========================
            DTR TIME GRID
            =========================== */

            .dtr-time-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 18px;
                margin: 20px 0;
            }

            .dtr-time-card {
                padding: 22px;
                background: #0c202b;
                border: 1px solid rgba(0, 229, 239, .16);
                border-radius: 10px;
            }

            .dtr-time-card span {
                display: block;
                margin-bottom: 12px;
                color: #8baab5;
                font-size: 12px;
            }

            .dtr-time-card strong {
                color: #e8fbff;
                font-size: 25px;
            }

            /* ===========================
            DTR BUTTONS & MESSAGES
            =========================== */

            .dtr-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-top: 22px;
            }

            .dtr-button {
                min-width: 150px;
                padding: 12px 20px;
                color: #00ffff;
                background: rgba(0, 229, 239, .08);
                border: 1px solid #00cfd8;
                border-radius: 8px;
                font-weight: 700;
                cursor: pointer;
                transition: .2s ease;
            }

            .dtr-button:hover {
                background: rgba(0, 229, 239, .10);
                box-shadow: 0 0 12px rgba(0, 255, 255, .15);
            }

            .dtr-button.timeout {
                color: #ff7185;
                background: rgba(255, 125, 137, .08);
                border-color: #ff7185;
            }

            .dtr-button:disabled {
                opacity: .4;
                cursor: not-allowed;
            }

            .dtr-message {
                margin-top: 16px;
                color: #00ffff;
                font-size: 12px;
            }

            .dtr-row-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .dtr-edit-btn,
            .dtr-delete-btn {
                padding: 8px 13px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: .2s ease;
            }

            .dtr-edit-btn {
                color: #00ffff;
                background: rgba(0, 255, 255, .08);
                border: 1px solid rgba(0, 255, 255, .45);
            }

            .dtr-edit-btn:hover {
                background: rgba(0, 255, 255, .2);
            }

            .dtr-delete-btn {
                color: #ff7185;
                background: rgba(255, 80, 110, .08);
                border: 1px solid rgba(255, 80, 110, .45);
            }

            .dtr-delete-btn:hover {
                background: rgba(255, 80, 110, .2);
            }

            /* ===========================
            DTR FORM DESIGN
            =========================== */

            .dtr-form-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 18px;
                margin-top: 22px;
            }

            .dtr-form-grid label,
            .dtr-remarks {
                display: flex;
                flex-direction: column;
                gap: 8px;
                color: #a8c4d0;
                font-size: 13px;
            }

            .dtr-form-grid input,
            .dtr-form-grid select,
            .dtr-remarks input {
                width: 100%;
                min-height: 42px;
                box-sizing: border-box;
                padding: 10px 13px;
                color: #e8fbff;
                background: #071722;
                border: 1px solid rgba(0, 229, 239, .16);
                border-radius: 8px;
                outline: none;
            }

            .dtr-form-grid input:focus,
            .dtr-form-grid select:focus,
            .dtr-remarks input:focus {
                border-color: #00ffff;
                box-shadow: 0 0 8px rgba(0, 255, 255, .15);
            }

            .dtr-form-grid select option {
                background: #071722;
                color: #e8fbff;
            }

            /* ===========================
            ATTENDANCE RECORDS TABLE
            =========================== */

            .dtr-table-wrapper {
                width: 100%;
                overflow-x: auto;
                margin-top: 18px;
                border: 1px solid rgba(0, 229, 239, .15);
                border-radius: 10px;
            }

            .dtr-table {
                width: 100%;
                min-width: 1250px;
                border-collapse: collapse;
                color: #d9edf5;
                font-size: 13px;
            }

            .dtr-table th {
                padding: 15px 16px;
                color: #00ffff;
                background: rgb(1 15 15);
                border-bottom: 1px solid rgba(0, 229, 239, .2);
                font-size: 12px;
                font-weight: 700;
                text-align: left;
                white-space: nowrap;
            }

            .dtr-table td {
                padding: 14px 16px;
                border-bottom: 1px solid rgba(255, 255, 255, .06);
                text-align: left;
                white-space: nowrap;
            }

            .dtr-table tbody tr:hover {
                background: rgba(0, 229, 239, .045);
            }

            .dtr-table tbody tr:last-child td {
                border-bottom: none;
            }

            /* ===========================
            OVERTIME PAGE
            =========================== */

            .overtime-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-bottom: 25px;
            }

            .overtime-filters select {
                min-width: 160px;
                padding: 12px 42px 12px 15px;
                color: #e8fbff;
                background: #0b202c;
                border: 1px solid rgba(0, 229, 239, .25);
                border-radius: 10px;
                font-family: inherit;
                font-size: 13px;
                font-weight: 600;
                outline: none;
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2300e5ef' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 14px center;
                transition: .25s ease;
            }

            .overtime-filters select:hover {
                border-color: #00e5ef;
                background-color: #102b38;
                box-shadow: 0 0 10px rgba(0, 229, 239, .12);
            }

            .overtime-filters select:focus {
                border-color: #00e5ef;
                box-shadow: 0 0 0 3px rgba(0, 229, 239, .12);
            }

            .overtime-filters select option {
                padding: 10px;
                color: #e8fbff;
                background: #0b202c;
            }

            .overtime-filters select option:checked {
                color: #00e5ef;
                background: #163746;
            }

            .overtime-summary-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 18px;
                margin-bottom: 25px;
            }

            .overtime-summary-card {
                padding: 23px;
                background: #102531;
                border: 1px solid rgba(0, 229, 239, .16);
                border-radius: 13px;
            }

            .overtime-summary-card h3 {
                margin: 0 0 18px;
                color: #8baab5;
                font-size: 13px;
                font-weight: normal;
            }

            .overtime-summary-card strong {
                color: #00e5a8;
                font-size: 27px;
            }

            .overtime-summary-card p {
                margin: 8px 0 0;
                color: #77939e;
                font-size: 12px;
            }

            .overtime-table-title {
                margin-bottom: 15px;
            }

            .overtime-table-title h3 {
                margin: 0 0 7px;
                font-size: 16px;
            }

            .overtime-table-title p {
                margin: 0;
                color: #8baab5;
                font-size: 12px;
            }

            .overtime-message {
                margin-top: 15px;
                color: #8baab5;
                font-size: 12px;
            }

            /* OVERTIME SELECT THEME */

            #overtime-month-filter,
            #overtime-year-filter {
                color-scheme: dark;
                color: #00e5ef;
                background: #0b202c;
                border: 1px solid #00e5ef;
            }

            #overtime-month-filter option,
            #overtime-year-filter option {
                color: #e8fbff;
                background: #0b202c;
            }

            /* ===========================
            SALARY OVERVIEW PAGE
            =========================== */

            .salary-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-bottom: 25px;
            }

            .salary-filters select {
                min-width: 160px;
                padding: 12px 42px 12px 15px;
                color: #e8fbff;
                background: #0b202c;
                border: 1px solid rgba(0, 229, 239, .35);
                border-radius: 10px;
                font-family: inherit;
                font-size: 13px;
                font-weight: 600;
                outline: none;
                cursor: pointer;
                color-scheme: dark;
            }

            .salary-filters select:focus {
                border-color: #00e5ef;
                box-shadow: 0 0 0 3px rgba(0, 229, 239, .12);
            }

            .salary-rate-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .salary-rate-grid h3 {
                font-size: 13px;
            }
            
            .salary-rate-grid p {
                font-size: 12px
            }

            .salary-summary-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                font-size: 10px;
            }

            .salary-summary-grid h3 {
                font-size: 10px;
            }

            .salary-summary-grid p {
                font-size: 10px;
            }

            .salary-rate-grid,
            .salary-summary-grid {
                display: grid;
                gap: 18px;
                width: 100%;
                margin: 20px 0;
            }

            .salary-rate-card,
            .salary-summary-card {
                display: block;
                width: 100%;
                min-width: 0;
                box-sizing: border-box;
                padding: 24px;
                background: #102531;
                border: 1px solid rgba(0, 229, 239, .3);
                border-radius: 14px;
                box-shadow: 0 5px 18px rgba(0, 0, 0, .2);
            }

            .salary-rate-card h3,
            .salary-summary-card h3 {
                margin: 0 0 16px;
                color: #8baab5;
            }

            .salary-rate-card strong {
                display: block;
                color: #00e5ef;
                font-size: 26px;
            }

            .salary-summary-card strong {
                display: block;
                color: #00e5a8;
                font-size: 15px;
            }

            .salary-summary-card.overall {
                background: linear-gradient(145deg, #102f35, #102531);
                border-color: rgba(0, 229, 168, .5);
            }

            .salary-rate-card p,
            .salary-summary-card p {
                margin-top: 10px;
                color: #8baab5;
            }

            .salary-section-title {
                margin: 25px 0 15px;
            }

            .salary-section-title h3 {
                margin: 0 0 7px;
                font-size: 16px;
            }

            .salary-section-title p {
                margin: 0;
                color: #8baab5;
                font-size: 12px;
            }

            .salary-message {
                margin-top: 15px;
                color: #8baab5;
                font-size: 12px;
            }

            /* =====================================================
                    ACCOUNT SETTINGS - FORM DESIGN
               ===================================================== */

            .settings-form-card {
                margin-top: 22px;
                padding: 25px;
            }

            .settings-form-card h3 {
                color: #00FFFF;
                font-size: 13px;
                font-weight: 800;
                letter-spacing: 1.5px;
                margin-bottom: 20px;
            }

            .settings-form-card label {
                display: block;
                margin: 15px 0 8px;
                color: #9BC8D5;
                font-size: 12px;
                font-weight: 700;
            }

            .settings-form-card input {
                width: 100%;
                min-height: 46px;
                padding: 12px 15px;
                border: 1px solid rgba(0, 255, 255, 0.20);
                border-radius: 8px;
                outline: none;
                background: #06131F;
                color: #EAFBFF;
                font-family: inherit;
                font-size: 13px;
                transition: 0.25s ease;
                box-sizing: border-box;
            }

            .settings-form-card input::placeholder {
                color: #587181;
            }

            .settings-form-card input:focus {
                border-color: #00FFFF;
                box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.10);
            }

            .settings-form-card button {
                min-height: 43px;
                margin-top: 18px;
                padding: 11px 22px;
                border: none;
                border-radius: 8px;
                background: linear-gradient(100deg, #008CFF, #00FFFF);
                color: #06131F;
                font-family: inherit;
                font-size: 12px;
                font-weight: 900;
                letter-spacing: 0.7px;
                cursor: pointer;
                transition: 0.25s ease;
            }

            .settings-form-card button:hover {
                transform: translateY(-2px);
                box-shadow: 0 7px 20px rgba(0, 255, 255, 0.20);
            }

            .settings-form-card button:active {
                transform: translateY(0);
            }

            .settings-form-card button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            /* ========================================
               GLOBAL FUTURISTIC CYBER TECH FOOTER
               ======================================== */

            #main-footer {
                width: 100%;
                box-sizing: border-box;
                padding: 16px 24px;

                background: linear-gradient(
                    90deg,
                    #031a24,
                    #062b38,
                    #031a24
                );

                border-top: 1px solid rgba(0, 255, 255, 0.35);

                box-shadow:
                    0 -3px 15px rgba(0, 255, 255, 0.08),
                    inset 0 1px 8px rgba(0, 255, 255, 0.04);

                text-align: center;
                position: fixed;
                z-index: 5;
            }

            .main-footer-content {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                gap: 6px 18px;
            }

            .main-footer-content p {
                margin: 0;
                color: #a9cbd4;
                font-size: 12px;
                letter-spacing: 0.5px;
                line-height: 1.6;
            }

            .main-footer-content span {
                color: #00ffff;
                font-weight: 700;
                text-shadow: 0 0 8px rgba(0, 255, 255, 0.55);
            }
        `;


        document.head.appendChild(style);
    }

    const fullName = user?.fullName || "Employee";
    const username = user?.username || "—";
    const role = user?.role || "user";

    
    container.innerHTML = `
        <div class="dashboard-wrapper">

            <aside class="dashboard-sidebar" id="dashboard-sidebar">

                <nav class="dashboard-menu">

                    <button type="button" class="dashboard-menu-item active" data-page="dashboard">
                        ▦ &nbsp; DASHBOARD
                    </button>

                    <button type="button" class="dashboard-menu-item" data-page="dtr">
                        ◷ &nbsp; MY DTR
                    </button>

                    <button type="button" class="dashboard-menu-item" data-page="overtime">
                        ◴ &nbsp; OVERTIME MANAGEMENT
                    </button>

                    <button type="button" class="dashboard-menu-item" data-page="salary">
                        ₱ &nbsp; SALARY MANAGEMENT
                    </button>

                    <button type="button" class="dashboard-menu-item" data-page="settings">
                        ⚙ &nbsp; ACCOUNT SETTINGS
                    </button>

                    <button type="button" class="dashboard-menu-item" data-page="developer">
                        👨‍💻 &nbsp; THE DEVELOPER
                    </button>

                </nav>

            </aside>

            <div class="sidebar-overlay" id="sidebar-overlay"></div>

            <!-- MOBILE SIDEBAR HAMBURGER MENU -->
            <button
                type="button"
                class="mobile-menu-toggle"
                id="mobile-menu-toggle"
                aria-label="Open navigation menu"
                aria-expanded="false"
                aria-controls="dashboard-sidebar"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <main class="dashboard-main">

                <header class="dashboard-topbar">
                    <h2>Dashboard Overview</h2>
                    <span class="dashboard-status">
                        ● SYSTEM ONLINE
                    </span>
                </header>

                <!-- DASHBOARD FILTERS -->
                <section class="dashboard-filters">

                    <div class="dashboard-filter-group">
                        <label for="dashboard-from-date">FROM</label>
                        <input
                            type="text"
                            id="dashboard-from-date"
                            placeholder="MM-DD-YYYY"
                            maxlength="10"
                            autocomplete="off"
                        >
                    </div>

                    <div class="dashboard-filter-group">
                        <label for="dashboard-to-date">TO</label>
                        <input
                            type="text"
                            id="dashboard-to-date"
                            placeholder="MM-DD-YYYY"
                            maxlength="10"
                            autocomplete="off"
                        >
                    </div>

                    <button
                        type="button"
                        id="dashboard-apply-filter"
                        class="dashboard-filter-button">
                        Apply Filter
                    </button>

                </section>

                <!-- DASHBOARD SUMMARY CARDS -->
                <section class="dashboard-grid">

                    <div class="dashboard-card">
                        <h3>Days Present</h3>
                        <strong id="dashboard-days-present">--</strong>
                        <p>Friday to Thursday · Excluding Sunday</p>
                    </div>

                    <div class="dashboard-card">
                        <h3>No. of Overtime/s</h3>
                        <strong id="dashboard-overtime-hours">--</strong>
                        <p>Number of Attendance Records with OT</p>
                    </div>

                    <div class="dashboard-card">
                        <h3>Total Duty Hours</h3>
                        <strong id="dashboard-total-hours">--</strong>
                        <p>Regular Duty Hours</p>
                    </div>

                    <div class="dashboard-card">
                        <h3>Total of Overtime</h3>
                        <strong id="dashboard-weekly-overtime">--</strong>
                        <p>Weekly OT Counting Period</p>
                    </div>

                </section>

                <!-- ATTENDANCE STATUS -->
                <section class="attendance-analytics">

                    <div class="attendance-analytics-header">
                        <div>
                            <h3>Attendance Status</h3>
                            <p class="dashboard-muted">
                                Present vs. Late vs. Absent Overview
                            </p>
                        </div>
                    </div>

                    <div class="attendance-chart-container">
                        <canvas id="attendance-status-chart"></canvas>
                    </div>

                    <div class="attendance-counts">

                        <div class="attendance-count-card">
                            <span>Present</span>
                            <strong class="attendance-present"
                                id="analytics-present-count">0</strong>
                        </div>

                        <div class="attendance-count-card">
                            <span>Late</span>
                            <strong class="attendance-late"
                                id="analytics-late-count">0</strong>
                        </div>

                        <div class="attendance-count-card">
                            <span>Absent</span>
                            <strong class="attendance-absent"
                                id="analytics-absent-count">0</strong>
                        </div>

                    </div>

                    <p class="attendance-analytics-message"
                        id="attendance-analytics-message">
                        Loading attendance analytics...
                    </p>

                </section>

            </main>

        </div>
    `;

    initializeDashboardResponsive();


        // Save the original Dashboard content
        const mainContent = container.querySelector(".dashboard-main");
        const dashboardHome = mainContent.innerHTML;

        const pageTitles = {
            dashboard: "Dashboard Overview",
            dtr: "My Daily Time Record",
            overtime: "Overtime Management",
            salary: "Salary Overview",
            records: "Employee Records",
            settings: "Account Settings",
            developer: "The Developer"
        };

        // Load local Chart.js library
        async function loadChartJS() {
            if (window.Chart) return;

            if (window.chartJSLoading) {
                return window.chartJSLoading;
            }

            window.chartJSLoading = new Promise((resolve, reject) => {
                const script = document.createElement("script");

                script.src = "/js/chart.umd.js";

                script.onload = () => {
                    if (window.Chart) {
                        resolve();
                    } else {
                        window.chartJSLoading = null;
                        reject(new Error("Chart.js loaded but unavailable."));
                    }
                };

                script.onerror = () => {
                    window.chartJSLoading = null;
                    reject(new Error("Unable to load local Chart.js."));
                };

                document.head.appendChild(script);
            });

            return window.chartJSLoading;
        }

        // DASHBOARD DATA AND ATTENDANCE ANALYTICS
        let attendanceChart = null;
        
        async function loadDashboardData() {
            const fromDateInput = mainContent.querySelector("#dashboard-from-date");
            const toDateInput = mainContent.querySelector("#dashboard-to-date");
            const applyFilterButton = mainContent.querySelector("#dashboard-apply-filter");

            const daysElement = mainContent.querySelector("#dashboard-days-present");
            const overtimeCountElement = mainContent.querySelector("#dashboard-overtime-hours");
            const totalHoursElement = mainContent.querySelector("#dashboard-total-hours");
            const weeklyOvertimeElement = mainContent.querySelector("#dashboard-weekly-overtime");

            const canvas = mainContent.querySelector("#attendance-status-chart");
            const presentElement = mainContent.querySelector("#analytics-present-count");
            const lateElement = mainContent.querySelector("#analytics-late-count");
            const absentElement = mainContent.querySelector("#analytics-absent-count");
            const message = mainContent.querySelector("#attendance-analytics-message");

            if (
                !fromDateInput || !toDateInput || !applyFilterButton ||
                !daysElement || !overtimeCountElement ||
                !totalHoursElement || !weeklyOvertimeElement ||
                !canvas || !presentElement || !lateElement ||
                !absentElement || !message
            ) return;

            try {
                message.textContent = "Loading dashboard data...";

                const response = await fetch("/api/attendance/dashboard");
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Unable to load dashboard data."
                    );
                }

                const records = Array.isArray(result.attendance)
                    ? result.attendance
                    : [];

                await loadChartJS();

                // Parse database date without timezone conversion
                function parseWorkDate(value) {
                    const dateString = String(value).slice(0, 10);
                    const [year, month, day] = dateString.split("-").map(Number);

                    return new Date(year, month - 1, day);
                }

                // Convert MM-DD-YYYY to YYYY-MM-DD
                function convertInputDate(value) {
                    const match = String(value).trim().match(
                        /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-(\d{4})$/
                    );

                    if (!match) return null;

                    const month = Number(match[1]);
                    const day = Number(match[2]);
                    const year = Number(match[3]);

                    const date = new Date(year, month - 1, day);

                    if (
                        date.getFullYear() !== year ||
                        date.getMonth() !== month - 1 ||
                        date.getDate() !== day
                    ) {
                        return null;
                    }

                    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                }

                function addDays(date, days) {
                    const result = new Date(date);
                    result.setDate(result.getDate() + days);
                    return result;
                }

                function getTimeMinutes(value) {
                    if (!value) return null;

                    const match = String(value).match(/(\d{2}):(\d{2})/);

                    if (!match) return null;

                    return Number(match[1]) * 60 + Number(match[2]);
                }

                function getStatus(record) {
                    return String(record.attendance_status || "").toLowerCase();
                }

                function isPresent(record) {
                    const status = getStatus(record);
                    return status === "present" || status === "late";
                }

                function getRecordedOT(record) {
                    if (!isPresent(record)) return 0;

                    return Number(record.overtime_hours) || 0;
                }

                function updateDashboard() {
                    const fromValue = fromDateInput.value.trim();
                    const toValue = toDateInput.value.trim();

                    let filteredRecords = records;
                    let filterLabel = "Overall Attendance Records";

                    // Apply filter only when both fields are filled
                    if (fromValue || toValue) {
                        if (!fromValue || !toValue) {
                            message.textContent = "Please provide both From and To dates.";
                            return;
                        }

                        const from = convertInputDate(fromValue);
                        const to = convertInputDate(toValue);

                        if (!from || !to) {
                            message.textContent = "Invalid date. Use MM-DD-YYYY.";
                            return;
                        }

                        if (from > to) {
                            message.textContent = "From date cannot be later than To date.";
                            return;
                        }

                        filteredRecords = records.filter(record => {
                            const date = String(record.attendance_date).slice(0, 10);

                            return date >= from && date <= to;
                        });

                        filterLabel = `Showing ${fromValue} to ${toValue}`;
                    }

                    let daysPresent = 0;
                    let totalDutyHours = 0;
                    let weeklyOvertimeHours = 0;
                    let overtimeOccurrences = 0;

                    let present = 0;
                    let late = 0;
                    let absent = 0;

                    filteredRecords.forEach(record => {
                        const date = parseWorkDate(record.attendance_date);
                        const dayOfWeek = date.getDay();
                        const status = getStatus(record);

                        const category = String(
                            record.attendance_type || ""
                        ).toLowerCase();

                        if (status === "absent") {
                            absent++;
                            return;
                        }

                        if (status === "late") {
                            late++;
                        } else if (status === "present") {
                            present++;
                        }

                        // Days Present: exclude Sunday
                        if (dayOfWeek !== 0 && isPresent(record)) {
                            daysPresent++;
                        }

                        // Regular duty hours: exclude Sunday and holidays
                        if (
                            dayOfWeek !== 0 &&
                            category !== "holiday" &&
                            isPresent(record)
                        ) {
                            totalDutyHours += Number(record.duty_hours) || 0;
                        }

                        // Overtime within selected date range
                        const recordedOT = getRecordedOT(record);

                        if (recordedOT > 0) {
                            weeklyOvertimeHours += recordedOT;
                            overtimeOccurrences++;
                        }
                    });

                    // Update summary cards
                    daysElement.textContent = daysPresent;
                    overtimeCountElement.textContent = overtimeOccurrences;

                    totalHoursElement.textContent =
                        totalDutyHours.toFixed(2) + " hrs";

                    weeklyOvertimeElement.textContent =
                        weeklyOvertimeHours.toFixed(2) + " hrs";

                    // Update attendance status counts
                    presentElement.textContent = present;
                    lateElement.textContent = late;
                    absentElement.textContent = absent;

                    // Re-render Doughnut Chart
                    const totalRecords = present + late + absent;
                    const hasRecords = totalRecords > 0;

                    if (attendanceChart) {
                        attendanceChart.destroy();
                        attendanceChart = null;
                    }

                    attendanceChart = new Chart(canvas, {
                        type: "doughnut",

                        data: {
                            labels: hasRecords
                                ? ["Present", "Late", "Absent"]
                                : ["No Records"],

                            datasets: [{
                                data: hasRecords
                                    ? [present, late, absent]
                                    : [1],

                                backgroundColor: hasRecords
                                    ? ["#00e5a8", "#f5b942", "#ff7185"]
                                    : ["#526570"],

                                borderColor: "#102531",
                                borderWidth: 4,
                                hoverOffset: 8
                            }]
                        },

                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: "68%",

                            plugins: {
                                legend: {
                                    position: "bottom",
                                    labels: {
                                        color: "#e8fbff",
                                        padding: 20
                                    }
                                }
                            }
                        }
                    });

                    message.textContent =
                        `${filterLabel}. Total records: ${totalRecords}.`;
                }

                // Apply Filter button
                applyFilterButton.addEventListener("click", updateDashboard);

                // Initial load: show overall attendance records
                updateDashboard();

            } catch (error) {
                console.error("Dashboard data error:", error);

                message.textContent = error.message;

                daysElement.textContent = "—";
                overtimeCountElement.textContent = "—";
                totalHoursElement.textContent = "—";
                weeklyOvertimeElement.textContent = "—";
            }
        }

        // Load Dashboard data
        loadDashboardData();


        
        /* ========================================
        RENDER OVERTIME MANAGEMENT PAGE
        ======================================== */

        async function renderOvertime() {

            mainContent.innerHTML = `
                <section class="dashboard-welcome">
                    <span class="dashboard-label">EMPLOYEE PORTAL</span>
                    <h1>Overtime Summary</h1>
                    <p class="dashboard-muted">
                        Weekly overtime hours and earnings overview.
                    </p>
                </section>

                <!-- OVERTIME DATE FILTER -->
                <section class="overtime-filters">

                    <div class="dashboard-filter-group">
                        <label for="overtime-from-date">FROM</label>
                        <input
                            type="text"
                            id="overtime-from-date"
                            placeholder="MM-DD-YYYY"
                            maxlength="10"
                            autocomplete="off"
                        >
                    </div>

                    <div class="dashboard-filter-group">
                        <label for="overtime-to-date">TO</label>
                        <input
                            type="text"
                            id="overtime-to-date"
                            placeholder="MM-DD-YYYY"
                            maxlength="10"
                            autocomplete="off"
                        >
                    </div>

                    <button
                        type="button"
                        id="overtime-apply-filter"
                        class="dashboard-filter-button"
                    >
                        Apply Filter
                    </button>

                </section>

                <!-- OVERTIME SUMMARY -->
                <section class="overtime-summary-grid">

                    <div class="overtime-summary-card">
                        <h3>Overtime Only</h3>
                        <strong id="overtime-total-hours">0.00 hrs</strong>
                        <p>Total Weekly Overtime Hours</p>
                    </div>

                    <div class="overtime-summary-card">
                        <h3>Overtime Calculations</h3>
                        <strong id="overtime-total-earnings">₱0.00</strong>
                        <p>Total Weekly Overtime Earnings</p>
                    </div>

                </section>

                <!-- OVERTIME TABLE -->
                <section class="dashboard-panel">

                    <div class="overtime-table-title">
                        <h3>Overtime Records</h3>
                        <p id="overtime-period-label">
                            Overall Overtime Records
                        </p>
                    </div>

                    <div class="dtr-table-wrapper">
                        <table class="dtr-table">

                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Overtime Hours</th>
                                    <th>Overtime Earnings</th>
                                </tr>
                            </thead>

                            <tbody id="overtime-weekly-list">
                                <tr>
                                    <td colspan="3">
                                        Loading overtime records...
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>

                    <p class="overtime-message" id="overtime-message">
                        Loading overtime summary...
                    </p>

                </section>
            `;

            /* ========================================
            ELEMENT REFERENCES
            ======================================== */

            const fromDateInput = mainContent.querySelector(
                "#overtime-from-date"
            );

            const toDateInput = mainContent.querySelector(
                "#overtime-to-date"
            );

            const applyFilterButton = mainContent.querySelector(
                "#overtime-apply-filter"
            );

            const hoursElement = mainContent.querySelector(
                "#overtime-total-hours"
            );

            const earningsElement = mainContent.querySelector(
                "#overtime-total-earnings"
            );

            const weeklyList = mainContent.querySelector(
                "#overtime-weekly-list"
            );

            const periodLabel = mainContent.querySelector(
                "#overtime-period-label"
            );

            const message = mainContent.querySelector(
                "#overtime-message"
            );

            const OT_RATE = 68.75;

            let allRecords = [];

            /* ========================================
            DATE FUNCTIONS
            ======================================== */

            // Parse database date without timezone conversion
            function parseWorkDate(value) {

                if (!value) return null;

                const dateString = String(value).slice(0, 10);

                const match = dateString.match(
                    /^(\d{4})-(\d{2})-(\d{2})$/
                );

                if (!match) return null;

                const year = Number(match[1]);
                const month = Number(match[2]);
                const day = Number(match[3]);

                const date = new Date(year, month - 1, day);

                if (
                    date.getFullYear() !== year ||
                    date.getMonth() !== month - 1 ||
                    date.getDate() !== day
                ) {
                    return null;
                }

                return date;
            }

            // Parse MM-DD-YYYY input
            function parseFilterDate(value) {

                const match = String(value).trim().match(
                    /^(\d{2})-(\d{2})-(\d{4})$/
                );

                if (!match) return null;

                const month = Number(match[1]);
                const day = Number(match[2]);
                const year = Number(match[3]);

                const date = new Date(year, month - 1, day);

                if (
                    date.getFullYear() !== year ||
                    date.getMonth() !== month - 1 ||
                    date.getDate() !== day
                ) {
                    return null;
                }

                return date;
            }

            // Format date as MM-DD-YYYY
            function formatDate(date) {

                const month = String(
                    date.getMonth() + 1
                ).padStart(2, "0");

                const day = String(
                    date.getDate()
                ).padStart(2, "0");

                const year = date.getFullYear();

                return `${month}-${day}-${year}`;
            }

            // Format Philippine Peso
            function formatMoney(amount) {

                return "₱" + Number(amount).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }

            /* ========================================
            OVERTIME CALCULATION
            ======================================== */

            function calculateOvertime(record) {

                const status = String(
                    record.attendance_status || ""
                ).toLowerCase().trim();

                if (
                    status !== "present" &&
                    status !== "late"
                ) {
                    return 0;
                }

                const hours = Number(record.overtime_hours);

                if (!Number.isFinite(hours) || hours <= 0) {
                    return 0;
                }

                return hours;
            }

            /* ========================================
            DISPLAY OVERTIME RECORDS
            ======================================== */

            function displayOvertimeRecords(records, label) {

                let totalHours = 0;

                const overtimeRecords = records
                    .map(record => {

                        const workDate = parseWorkDate(
                            record.attendance_date
                        );

                        const overtimeHours = calculateOvertime(record);

                        return {
                            date: workDate,
                            hours: overtimeHours,
                            earnings: overtimeHours * OT_RATE
                        };

                    })
                    .filter(record => {
                        return record.date && record.hours > 0;
                    })
                    .sort((a, b) => a.date - b.date);

                overtimeRecords.forEach(record => {
                    totalHours += record.hours;
                });

                totalHours = Number(totalHours.toFixed(2));

                const totalEarnings = Number(
                    (totalHours * OT_RATE).toFixed(2)
                );

                /* UPDATE SUMMARY CARDS */

                hoursElement.textContent =
                    totalHours.toFixed(2) + " hrs";

                earningsElement.textContent =
                    formatMoney(totalEarnings);

                periodLabel.textContent = label;

                /* UPDATE TABLE */

                if (overtimeRecords.length === 0) {

                    weeklyList.innerHTML = `
                        <tr>
                            <td colspan="3">
                                No overtime records found.
                            </td>
                        </tr>
                    `;

                    message.textContent =
                        "No overtime records found for the selected period.";

                    return;
                }

                weeklyList.innerHTML = overtimeRecords.map(record => `

                    <tr>
                        <td>${formatDate(record.date)}</td>

                        <td>
                            ${record.hours.toFixed(2)} hrs
                        </td>

                        <td>
                            ${formatMoney(record.earnings)}
                        </td>
                    </tr>

                `).join("");

                message.textContent =
                    `Showing ${overtimeRecords.length} overtime record(s). OT Rate: ${formatMoney(OT_RATE)} per hour.`;
            }

            /* ========================================
            APPLY DATE FILTER
            ======================================== */

            function applyOvertimeFilter() {

                const fromValue = fromDateInput.value.trim();
                const toValue = toDateInput.value.trim();

                // Both fields must be filled or both must be empty
                if (
                    Boolean(fromValue) !== Boolean(toValue)
                ) {
                    message.textContent =
                        "Please enter both From and To dates.";

                    return;
                }

                // Empty dates = Overall Overtime
                if (!fromValue && !toValue) {

                    displayOvertimeRecords(
                        allRecords,
                        "Overall Overtime Records"
                    );

                    return;
                }

                const fromDate = parseFilterDate(fromValue);
                const toDate = parseFilterDate(toValue);

                if (!fromDate || !toDate) {

                    message.textContent =
                        "Invalid date format. Please use MM-DD-YYYY.";

                    return;
                }

                if (fromDate > toDate) {

                    message.textContent =
                        "The From Date must not be later than the To Date.";

                    return;
                }

                const filteredRecords = allRecords.filter(record => {

                    const workDate = parseWorkDate(
                        record.attendance_date
                    );

                    if (!workDate) return false;

                    return (
                        workDate >= fromDate &&
                        workDate <= toDate
                    );
                });

                displayOvertimeRecords(
                    filteredRecords,
                    `${formatDate(fromDate)} to ${formatDate(toDate)}`
                );
            }

            /* ========================================
            LOAD ATTENDANCE RECORDS
            ======================================== */

            async function loadOvertimeSummary() {

                weeklyList.innerHTML = `
                    <tr>
                        <td colspan="3">
                            Loading overtime records...
                        </td>
                    </tr>
                `;

                message.textContent =
                    "Loading overtime summary...";

                try {

                    const response = await fetch(
                        "/api/attendance/history"
                    );

                    const result = await response.json();

                    if (!response.ok || !result.success) {

                        throw new Error(
                            result.message ||
                            "Unable to load overtime records."
                        );
                    }

                    allRecords = result.attendance || [];

                    // First page load: display ALL overtime records
                    displayOvertimeRecords(
                        allRecords,
                        "Overall Overtime Records"
                    );

                } catch (error) {

                    console.error(
                        "Overtime summary error:",
                        error
                    );

                    weeklyList.innerHTML = `
                        <tr>
                            <td colspan="3">
                                ${escapeHTML(error.message)}
                            </td>
                        </tr>
                    `;

                    hoursElement.textContent = "0.00 hrs";
                    earningsElement.textContent = "₱0.00";

                    message.textContent = error.message;
                }
            }

            /* ========================================
            EVENT LISTENERS
            ======================================== */

            applyFilterButton.addEventListener(
                "click",
                applyOvertimeFilter
            );

            // Initial display
            await loadOvertimeSummary();

        }



        // Render the Salary Overview page
        async function renderSalary() {
            mainContent.innerHTML = `
                <section class="dashboard-welcome">
                    <span class="dashboard-label">EMPLOYEE PORTAL</span>
                    <h1>Salary Computation</h1>
                    <p class="dashboard-muted">
                        Overall salary summary and earnings breakdown.
                    </p>
                </section>

                <section class="salary-filters">

                    <div class="dashboard-filter-group">
                        <label for="salary-from-date">FROM</label>
                        <input
                            type="text"
                            id="salary-from-date"
                            placeholder="MM-DD-YYYY"
                            maxlength="10"
                            autocomplete="off"
                        >
                    </div>

                    <div class="dashboard-filter-group">
                        <label for="salary-to-date">TO</label>
                        <input
                            type="text"
                            id="salary-to-date"
                            placeholder="MM-DD-YYYY"
                            maxlength="10"
                            autocomplete="off"
                        >
                    </div>

                    <button
                        type="button"
                        id="salary-apply-filter"
                        class="dashboard-filter-button"
                    >
                        Apply Filter
                    </button>

                </section>

                <section class="salary-rate-grid">
                    <div class="salary-rate-card">
                        <h3>BASIC SALARY RATE</h3>
                        <strong>₱550.00</strong>
                        <p>Per qualifying regular workday</p>
                    </div>

                    <div class="salary-rate-card">
                        <h3>OVERTIME RATE</h3>
                        <strong>₱68.75</strong>
                        <p>Per overtime hour</p>
                    </div>
                </section>

                <div class="salary-section-title">
                    <h3>Salary Computation</h3>
                    <p id="salary-period-label">
                        Overall Salary Computation
                    </p>
                </div>

                <section class="salary-summary-grid">
                    <div class="salary-summary-card">
                        <h3>1. BASIC SALARY</h3>
                        <strong id="salary-basic-total">₱ --.--</strong>
                        <p>Friday to Thursday · Excluding Sunday and OT</p>
                    </div>

                    <div class="salary-summary-card">
                        <h3>2. OVERTIME PAY</h3>
                        <strong id="salary-ot-total">₱ --.--</strong>
                        <p>Thursday night to following Thursday morning</p>
                    </div>

                    <div class="salary-summary-card overall">
                        <h3>3. OVERALL SALARY</h3>
                        <strong id="salary-overall-total">₱ --.--</strong>
                        <p>Basic Salary + Overtime Pay</p>
                    </div>
                </section>

                <section class="dashboard-panel">
                    <div class="salary-section-title">
                        <h3>Salary Records</h3>
                        <p>Basic Salary and Overtime Earnings Breakdown</p>
                    </div>

                    <div class="dtr-table-wrapper">
                        <table class="dtr-table">
                            <thead>
                                <tr>
                                    <th>Payroll Period</th>
                                    <th>Regular Days</th>
                                    <th>Basic Salary</th>
                                    <th>OT Hours</th>
                                    <th>OT Pay</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody id="salary-weekly-list">
                                <tr>
                                    <td colspan="6">Select a month and year first.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p class="salary-message" id="salary-message">
                        No payroll period selected.
                    </p>
                </section>
            `;

            const fromDateInput = mainContent.querySelector("#salary-from-date");
            const toDateInput = mainContent.querySelector("#salary-to-date");

            const applyFilterButton = mainContent.querySelector("#salary-apply-filter");

            const basicElement = mainContent.querySelector("#salary-basic-total");
            const otElement = mainContent.querySelector("#salary-ot-total");
            const overallElement = mainContent.querySelector("#salary-overall-total");
            const weeklyList = mainContent.querySelector("#salary-weekly-list");
            const periodLabel = mainContent.querySelector("#salary-period-label");
            const message = mainContent.querySelector("#salary-message");

            const BASIC_RATE = 550;
            const OT_RATE = 68.75;

            function parseWorkDate(value) {
                const [year, month, day] = String(value).slice(0, 10)
                    .split("-").map(Number);

                return new Date(year, month - 1, day);
            }

            function dateKey(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            }

            function addDays(date, days) {
                const result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }

            function formatDate(date) {
                return date.toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                });
            }

            function formatMoney(amount) {
                return "₱" + amount.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }

            function getMinutes(value) {
                if (!value) return null;

                // ISO timestamp from API: convert to Philippine local time.
                if (String(value).includes("T")) {
                    const date = new Date(value);

                    if (Number.isNaN(date.getTime())) return null;

                    const parts = new Intl.DateTimeFormat("en-PH", {
                        timeZone: "Asia/Manila",
                        hour: "2-digit",
                        minute: "2-digit",
                        hourCycle: "h23"
                    }).formatToParts(date);

                    const hour = Number(parts.find(part => part.type === "hour").value);
                    const minute = Number(parts.find(part => part.type === "minute").value);

                    return hour * 60 + minute;
                }

                // MySQL TIME format: HH:mm:ss
                const match = String(value).match(/^(\d{2}):(\d{2})/);
                if (!match) return null;

                return Number(match[1]) * 60 + Number(match[2]);
            }

            function getDutyHours(record, periods) {
                if (String(record.attendance_status).toLowerCase() !== "present") {
                    return 0;
                }

                const start = getMinutes(record.time_in);
                let end = getMinutes(record.time_out);

                if (start === null || end === null) return 0;
                if (end <= start) end += 1440;

                let minutes = 0;

                periods.forEach(([periodStart, periodEnd]) => {
                    const overlapStart = Math.max(start, periodStart);
                    const overlapEnd = Math.min(end, periodEnd);

                    if (overlapEnd > overlapStart) {
                        minutes += overlapEnd - overlapStart;
                    }
                });

                return minutes / 60;
            }

            function getRegularHours(record) {
                // Regular working hours: 8:30 AM–12:00 PM
                // and 1:00 PM–5:30 PM.
                return getDutyHours(record, [
                    [510, 720],
                    [780, 1050]
                ]);
            }

            function getOvertimeHours(record) {
                if (String(record.attendance_status).toLowerCase() !== "present") {
                    return 0;
                }

                const workDate = parseWorkDate(record.attendance_date);
                const category = String(record.attendance_type || "").toLowerCase();

                // All recorded hours are OT on Sundays and holidays.
                if (workDate.getDay() === 0 || category === "holiday") {
                    return Number(record.total_hours) || 0;
                }

                // Regular weekdays: morning and evening OT windows.
                return getDutyHours(record, [
                    [360, 480],
                    [1080, 1440]
                ]);
            }

            function getFriday(date) {
                const result = new Date(date);
                const daysSinceFriday = (result.getDay() - 5 + 7) % 7;
                result.setDate(result.getDate() - daysSinceFriday);
                return result;
            }

            function getThursdayNightPeriod(date) {
                const result = new Date(date);
                const daysSinceThursday = (result.getDay() - 4 + 7) % 7;
                result.setDate(result.getDate() - daysSinceThursday);
                return result;
            }

            function getRecordsBetween(records, start, end) {
                return records.filter(record => {
                    const date = parseWorkDate(record.attendance_date);
                    return date >= start && date <= end;
                });
            }

            function parseFilterDate(value) {
                if (!value) return null;

                const match = value.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);

                if (!match) return null;

                const month = Number(match[1]);
                const day = Number(match[2]);
                const year = Number(match[3]);

                const date = new Date(year, month - 1, day);

                // Validate kung totoong calendar date
                if (
                    date.getFullYear() !== year ||
                    date.getMonth() !== month - 1 ||
                    date.getDate() !== day
                ) {
                    return null;
                }

                date.setHours(0, 0, 0, 0);

                return date;
            }

            async function loadSalarySummary() {

                weeklyList.innerHTML = `
                    <tr>
                        <td colspan="6">Loading salary records...</td>
                    </tr>
                `;

                try {

                    const response = await fetch("/api/attendance/history");
                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(
                            result.message || "Unable to load attendance records."
                        );
                    }

                    const allRecords = result.attendance || [];

                    const fromValue = fromDateInput.value.trim();
                    const toValue = toDateInput.value.trim();

                    let records = allRecords;
                    let displayLabel = "Overall Salary Computation";

                    // Require both dates when filtering
                    if (Boolean(fromValue) !== Boolean(toValue)) {

                        throw new Error(
                            "Please enter both From and To dates."
                        );
                    }

                    // Apply date filter only when both fields are filled
                    if (fromValue && toValue) {

                        const fromDate = parseFilterDate(fromValue);
                        const toDate = parseFilterDate(toValue);

                        if (!fromDate || !toDate) {
                            throw new Error(
                                "Invalid date format. Please use MM-DD-YYYY."
                            );
                        }

                        if (fromDate > toDate) {
                            throw new Error(
                                "From Date must not be later than To Date."
                            );
                        }

                        records = allRecords.filter(record => {

                            const date = parseWorkDate(record.attendance_date);

                            return date >= fromDate && date <= toDate;
                        });

                        displayLabel =
                            `${formatDate(fromDate)} to ${formatDate(toDate)}`;
                    }

                    // Ignore invalid attendance dates
                    records = records.filter(record =>
                        parseWorkDate(record.attendance_date) instanceof Date &&
                        !Number.isNaN(
                            parseWorkDate(record.attendance_date).getTime()
                        )
                    );

                    if (records.length === 0) {

                        basicElement.textContent = formatMoney(0);
                        otElement.textContent = formatMoney(0);
                        overallElement.textContent = formatMoney(0);

                        weeklyList.innerHTML = `
                            <tr>
                                <td colspan="6">No salary records found.</td>
                            </tr>
                        `;

                        periodLabel.textContent = displayLabel;
                        message.textContent = "No attendance records found.";

                        return;
                    }

                    // Determine date range from available records
                    const workDates = records.map(record =>
                        parseWorkDate(record.attendance_date)
                    );

                    const earliestDate = new Date(
                        Math.min(...workDates.map(date => date.getTime()))
                    );

                    const latestDate = new Date(
                        Math.max(...workDates.map(date => date.getTime()))
                    );

                    // Basic payroll starts Friday
                    let basicWeekStart = getFriday(earliestDate);

                    // OT payroll starts Thursday
                    let otWeekStart = getThursdayNightPeriod(earliestDate);

                    const payrollPeriods = [];

                    while (basicWeekStart <= latestDate) {

                        const basicWeekEnd = addDays(basicWeekStart, 6);

                        const otStart = new Date(otWeekStart);
                        const otEnd = addDays(otStart, 7);

                        payrollPeriods.push({
                            basicStart: new Date(basicWeekStart),
                            basicEnd: new Date(basicWeekEnd),
                            otStart,
                            otEnd
                        });

                        basicWeekStart = addDays(basicWeekStart, 7);
                        otWeekStart = addDays(otWeekStart, 7);
                    }

                    let totalBasic = 0;
                    let totalOT = 0;

                    const rows = [];

                    for (const period of payrollPeriods) {

                        const basicRecords = getRecordsBetween(
                            records,
                            period.basicStart,
                            period.basicEnd
                        );

                        const otRecords = records.filter(record => {

                            const date = parseWorkDate(record.attendance_date);

                            const startDate = period.otStart;
                            const endDate = period.otEnd;

                            if (date < startDate || date > endDate) {
                                return false;
                            }

                            // Ending Thursday: include morning OT only
                            if (date.getTime() === endDate.getTime()) {

                                const start = getMinutes(record.time_in);

                                return start !== null && start < 480;
                            }

                            return true;
                        });

                        const regularDays = basicRecords.filter(record => {

                            const date = parseWorkDate(record.attendance_date);

                            if (date.getDay() === 0) return false;

                            const status = String(
                                record.attendance_status || ""
                            ).toLowerCase();

                            if (
                                status !== "present" &&
                                status !== "late"
                            ) {
                                return false;
                            }

                            if (
                                String(record.attendance_type || "").toLowerCase()
                                === "holiday"
                            ) {
                                return false;
                            }

                            return getRegularHours(record) >= 8;

                        }).length;

                        const basicPay = regularDays * BASIC_RATE;

                        const otHours = otRecords.reduce((sum, record) => {
                            return sum + getOvertimeHours(record);
                        }, 0);

                        const roundedOTHours = Number(otHours.toFixed(2));

                        const otPay = roundedOTHours * OT_RATE;
                        const combined = basicPay + otPay;

                        totalBasic += basicPay;
                        totalOT += otPay;

                        rows.push({
                            basicStart: period.basicStart,
                            basicEnd: period.basicEnd,
                            regularDays,
                            basicPay,
                            otHours: roundedOTHours,
                            otPay,
                            combined
                        });
                    }

                    // Update salary cards
                    totalBasic = Number(totalBasic.toFixed(2));
                    totalOT = Number(totalOT.toFixed(2));

                    basicElement.textContent = formatMoney(totalBasic);
                    otElement.textContent = formatMoney(totalOT);

                    overallElement.textContent = formatMoney(
                        totalBasic + totalOT
                    );

                    // Update salary table
                    weeklyList.innerHTML = rows.map(row => `

                        <tr>
                            <td>
                                ${formatDate(row.basicStart)}
                                – ${formatDate(row.basicEnd)}
                                <br>
                                <small>
                                    OT: ${formatDate(row.basicStart)}
                                    night – ${formatDate(row.basicEnd)}
                                    morning
                                </small>
                            </td>

                            <td>${row.regularDays}</td>

                            <td>${formatMoney(row.basicPay)}</td>

                            <td>${row.otHours.toFixed(2)} hrs</td>

                            <td>${formatMoney(row.otPay)}</td>

                            <td>${formatMoney(row.combined)}</td>
                        </tr>

                    `).join("");

                    periodLabel.textContent = displayLabel;

                    message.textContent =
                        `Basic rate: ${formatMoney(BASIC_RATE)}/day · ` +
                        `OT rate: ${formatMoney(OT_RATE)}/hour.`;

                } catch (error) {

                    console.error("Salary summary error:", error);

                    weeklyList.innerHTML = `
                        <tr>
                            <td colspan="6">${escapeHTML(error.message)}</td>
                        </tr>
                    `;

                    basicElement.textContent = "₱ --.--";
                    otElement.textContent = "₱ --.--";
                    overallElement.textContent = "₱ --.--";

                    message.textContent = error.message;
                }
            }

            applyFilterButton.addEventListener(
                "click",
                loadSalarySummary
            );

            // Initial display: Overall Salary
            await loadSalarySummary();
        }


        // Render the DTR page        
        async function renderDTR() {
            mainContent.innerHTML = `
                <section class="dashboard-welcome">
                    <span class="dashboard-label">EMPLOYEE PORTAL</span>
                    <h1>Attendance Management</h1>
                    <p class="dashboard-muted">
                        Manually record your work date and attendance hours.
                    </p>
                </section>

                <section class="dashboard-panel">
                    <span class="dashboard-label">ATTENDANCE ENTRY</span>

                    <form id="attendance-form">
                        <div class="dtr-form-grid">
                            <label>
                                Work Date
                                <input type="date" id="attendance-date" required>
                            </label>

                            <label>
                                Attendance Category
                                <select id="attendance-type" required>
                                    <option value="regular">Regular</option>
                                    <option value="sunday">Sunday</option>
                                    <option value="holiday">Holiday</option>
                                </select>
                            </label>

                            <label>
                                Time In
                                <input type="time" id="attendance-time-in" required>
                            </label>

                            <label>
                                Time Out
                                <input type="time" id="attendance-time-out" required>
                            </label>
                        </div>

                        <label class="dtr-remarks">
                            Remarks (Optional)
                            <input type="text" id="attendance-remarks"
                                maxlength="255" placeholder="Enter remarks">
                        </label>

                        <div class="dtr-actions">
                            <button type="submit" class="dtr-button">
                                SAVE ATTENDANCE
                            </button>

                            <button type="button" class="dtr-button timeout"
                                id="mark-absent-btn">
                                MARK ABSENT
                            </button>
                        </div>
                    </form>

                    <p class="dtr-message" id="dtr-message"></p>
                </section>

                <section class="dashboard-panel">
                    <span class="dashboard-label">ATTENDANCE RECORDS</span>
                    <div style="overflow-x:auto;">
                        <div class="dtr-table-scroll">
                            <table class="dtr-table">
                               <thead>
                                <tr>
                                    <th>Work Date</th>
                                    <th>Day</th>
                                    <th>Category</th>
                                    <th>Time In</th>
                                    <th>Time Out</th>
                                    <th>Duty Hours</th>
                                    <th>OT Hours</th>
                                    <th>Undertime Hours</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                                <tbody id="attendance-list">
                                    <tr><td colspan="11">Loading records...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            `;

            const dateInput = mainContent.querySelector("#attendance-date");
            const form = mainContent.querySelector("#attendance-form");
            const message = mainContent.querySelector("#dtr-message");
            const absentButton = mainContent.querySelector("#mark-absent-btn");
            const list = mainContent.querySelector("#attendance-list");

            // Default date is today's local date, but it can be changed manually.
            const now = new Date();
            dateInput.value = [
                now.getFullYear(),
                String(now.getMonth() + 1).padStart(2, "0"),
                String(now.getDate()).padStart(2, "0")
            ].join("-");

            function escapeValue(value) {
                return escapeHTML(value ?? "");
            }

            // Format date to "MMM DD, YYYY" (e.g., "Jan 01, 2024")
            function formatDate(value) {
                if (!value) return "—";

                const dateString = String(value).slice(0, 10);
                const [year, month, day] = dateString.split("-").map(Number);

                if (!year || !month || !day) return "—";

                const date = new Date(year, month - 1, day);

                return date.toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit"
                });
            }

            // Format date to "Weekday" (e.g., "Monday")
            function formatDay(value) {
                if (!value) return "—";

                const dateString = String(value).slice(0, 10);
                const [year, month, day] = dateString.split("-").map(Number);

                if (!year || !month || !day) return "—";

                const date = new Date(year, month - 1, day);

                return date.toLocaleDateString("en-US", {
                    weekday: "long"
                });
            }

            // Format time to "HH:MM AM/PM" (e.g., "08:30 AM")
            function formatTime(value) {
                if (!value) return "--:--";

                const date = new Date(value);

                if (Number.isNaN(date.getTime())) {
                    return "--:--";
                }

                return date.toLocaleTimeString("en-PH", {
                    timeZone: "Asia/Manila",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                });
            }

            // Load attendance records from the server and display them in the table            
            async function loadAttendance() {
                try {
                    const response = await fetch("/api/attendance/history");
                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(
                            result.message || "Unable to load records."
                        );
                    }

                    const records = Array.isArray(result.attendance)
                        ? result.attendance
                        : [];

                    if (records.length === 0) {
                        list.innerHTML = `
                            <tr>
                                <td colspan="11">No attendance records found.</td>
                            </tr>
                        `;
                        return;
                    }

                    list.innerHTML = records.map(record => `
                        <tr>
                            <td>${formatDate(record.attendance_date)}</td>
                            <td>${formatDay(record.attendance_date)}</td>
                            <td>${escapeValue(record.attendance_type)}</td>
                            <td>${formatTime(record.time_in)}</td>
                            <td>${formatTime(record.time_out)}</td>

                            <td>${Number(record.duty_hours || 0).toFixed(2)} hrs</td>
                            <td>${Number(record.overtime_hours || 0).toFixed(2)} hrs</td>
                            <td>${Number(record.undertime_hours || 0).toFixed(2)} hrs</td>
                            <td>₱${Number(record.undertime_deduction || 0).toFixed(2)}</td>

                            <td>${escapeValue(record.attendance_status)}</td>

                            <td>
                                <div class="dtr-row-actions">
                                    <button
                                        type="button"
                                        class="dtr-edit-btn"
                                        data-action="edit"
                                        data-id="${Number(record.id)}">
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        class="dtr-delete-btn"
                                        data-action="delete"
                                        data-id="${Number(record.id)}">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join("");

                } catch (error) {
                    console.error("Attendance history error:", error);

                    list.innerHTML = `
                        <tr>
                            <td colspan="11">${escapeValue(error.message)}</td>
                        </tr>
                    `;
                }
            }


            // Handle Edit and Delete Actions
            list.addEventListener("click", async event => {
                const button = event.target.closest("button[data-action]");
                if (!button) return;

                const id = button.dataset.id;
                const action = button.dataset.action;

                if (action === "delete") {
                    const confirmed = confirm(
                        "Are you sure you want to delete this attendance record? This cannot be undone."
                    );

                    if (!confirmed) return;

                    try {
                        const response = await fetch(`/api/attendance/${id}`, {
                            method: "DELETE"
                        });

                        const result = await response.json();

                        if (!response.ok || !result.success) {
                            throw new Error(result.message || "Unable to delete record.");
                        }

                        message.textContent = result.message;
                        await loadAttendance();

                    } catch (error) {
                        message.textContent = error.message;
                    }

                    return;
                }

                if (action === "edit") {
                    try {
                        const response = await fetch("/api/attendance/history");
                        const result = await response.json();

                        if (!response.ok || !result.success) {
                            throw new Error(result.message || "Unable to load record.");
                        }

                        const record = result.attendance.find(
                            item => String(item.id) === String(id)
                        );

                        if (!record) {
                            throw new Error("Attendance record not found.");
                        }

                        const dateValue = String(record.attendance_date).slice(0, 10);

                        const date = prompt("Work Date (YYYY-MM-DD):", dateValue);
                        if (date === null) return;

                        const category = prompt(
                            "Category (regular, sunday, or holiday):",
                            record.attendance_type
                        );
                        if (category === null) return;

                        const getTimeValue = value => {
                            if (!value) return "";
                            if (value instanceof Date) {
                                return `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;
                            }

                            const match = String(value).match(/(\d{2}):(\d{2})/);
                            return match ? `${match[1]}:${match[2]}` : "";
                        };

                        const timeIn = prompt(
                            "Time In (HH:MM):",
                            getTimeValue(record.time_in)
                        );
                        if (timeIn === null) return;

                        const timeOut = prompt(
                            "Time Out (HH:MM):",
                            getTimeValue(record.time_out)
                        );
                        if (timeOut === null) return;

                        const remarks = prompt(
                            "Remarks:",
                            record.remarks || ""
                        );
                        if (remarks === null) return;

                        const updateResponse = await fetch(`/api/attendance/${id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                attendanceDate: date,
                                attendanceType: category.trim().toLowerCase(),
                                timeIn,
                                timeOut,
                                remarks
                            })
                        });

                        const updateResult = await updateResponse.json();

                        if (!updateResponse.ok || !updateResult.success) {
                            throw new Error(
                                updateResult.message || "Unable to update record."
                            );
                        }

                        message.textContent = updateResult.message;
                        await loadAttendance();

                    } catch (error) {
                        message.textContent = error.message;
                    }
                }
            });

            // SUBMIT ATTENDANCE FORM
            form.addEventListener("submit", async event => {
                event.preventDefault();

                const payload = {
                    attendanceDate: dateInput.value,
                    attendanceType: mainContent.querySelector("#attendance-type").value,
                    timeIn: mainContent.querySelector("#attendance-time-in").value,
                    timeOut: mainContent.querySelector("#attendance-time-out").value,
                    remarks: mainContent.querySelector("#attendance-remarks").value
                };

                message.textContent = "Saving attendance...";

                try {
                    const response = await fetch("/api/attendance/save", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    });

                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(result.message || "Unable to save attendance.");
                    }

                    message.textContent = result.message;
                    form.reset();
                    dateInput.value = payload.attendanceDate;

                    await loadAttendance();

                } catch (error) {
                    console.error("Save attendance error:", error);
                    message.textContent = error.message;
                }
            });

            absentButton.addEventListener("click", async () => {
                if (!dateInput.value) {
                    message.textContent = "Please select a work date.";
                    return;
                }

                if (!confirm("Mark this employee as absent on the selected date?")) {
                    return;
                }

                message.textContent = "Saving absent record...";

                try {
                    const response = await fetch("/api/attendance/absent", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            attendanceDate: dateInput.value,
                            remarks: "Absent"
                        })
                    });

                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(result.message || "Unable to save absent record.");
                    }

                    message.textContent = result.message;
                    await loadAttendance();

                } catch (error) {
                    console.error("Absent record error:", error);
                    message.textContent = error.message;
                }
            });

            await loadAttendance();
        }

        function renderSettings() {
            const avatar = user?.avatar || "";
            const avatarContent = avatar
                ? `<img src="${escapeHTML(avatar)}" alt="Profile Picture">`
                : `<span>${escapeHTML((fullName || "U").charAt(0).toUpperCase())}</span>`;

            mainContent.innerHTML = `
                <header class="dashboard-topbar">
                    <h2>Account Settings</h2>
                    <span class="dashboard-status">
                        ● SYSTEM ONLINE
                    </span>
                </header>

                <section class="dashboard-welcome">
                    <span class="dashboard-label">EMPLOYEE PORTAL</span>
                    <h1>Account Settings</h1>
                    <p class="dashboard-muted">
                        Manage your personal profile and account information.
                    </p>
                </section>

                <section class="dashboard-account settings-profile-card">
                    <h3>PROFILE INFORMATION</h3>

                    <div class="settings-profile-details">
                        <div class="settings-avatar">
                            ${avatarContent}
                        </div>

                        <div class="settings-profile-text">
                            <h2>${escapeHTML(fullName)}</h2>
                            <p>@${escapeHTML(username)}</p>
                            <span>${escapeHTML(role)}</span>
                        </div>
                    </div>
                </section>

                <section class="dashboard-account settings-form-card">
                    <h3>EDIT FULL NAME</h3>

                    <label for="settings-fullname">Full Name</label>
                    <input
                        type="text"
                        id="settings-fullname"
                        value="${escapeHTML(fullName)}"
                        placeholder="Enter your full name"
                    >

                    <button type="button" id="save-fullname">
                        Save Full Name
                    </button>
                </section>

                <section class="dashboard-account settings-form-card">
                    <h3>EDIT USERNAME</h3>

                    <label for="settings-username">Username</label>
                    <input
                        type="text"
                        id="settings-username"
                        value="${escapeHTML(username)}"
                        placeholder="Enter your username"
                    >

                    <button type="button" id="save-username">
                        Save Username
                    </button>
                </section>

                <section class="dashboard-account settings-form-card">
                    <h3>CHANGE PASSWORD</h3>

                    <label for="settings-current-password">Current Password</label>
                    <input
                        type="password"
                        id="settings-current-password"
                        placeholder="Enter current password"
                    >

                    <label for="settings-new-password">New Password</label>
                    <input
                        type="password"
                        id="settings-new-password"
                        placeholder="Enter new password"
                    >

                    <label for="settings-confirm-password">Confirm New Password</label>
                    <input
                        type="password"
                        id="settings-confirm-password"
                        placeholder="Confirm new password"
                    >

                    <button type="button" id="save-password">
                        Update Password
                    </button>
                </section>
            `;

            const fullNameInput = mainContent.querySelector("#settings-fullname");
            const usernameInput = mainContent.querySelector("#settings-username");

            const saveFullNameButton = mainContent.querySelector("#save-fullname");
            const saveUsernameButton = mainContent.querySelector("#save-username");
            const savePasswordButton = mainContent.querySelector("#save-password");

            // =====================================================
            // SAVE FULL NAME
            // =====================================================

            async function saveProfile() {
                console.log("SAVE PROFILE BUTTON CLICKED");

                const newFullName = fullNameInput.value.trim();
                const newUsername = usernameInput.value.trim();

                if (!newFullName || !newUsername) {
                    alert("Full Name and Username are required.");
                    return;
                }

                try {
                    const response = await fetch("/api/auth/profile", {
                        method: "PUT",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            fullName: newFullName,
                            username: newUsername
                        })
                    });

                    const result = await response.json();

                    if (!response.ok || !result.success || !result.user) {
                        alert(result.message || "Unable to update profile.");
                        return;
                    }

                    // Update current user data
                    user.fullName = result.user.fullName;
                    user.username = result.user.username;
                    user.avatar = result.user.avatar;

                    alert("Profile updated successfully.");

                    renderSettings();

                } catch (error) {
                    console.error("Profile update error:", error);
                    alert("Unable to connect to the server.");
                }
            }

            saveFullNameButton.addEventListener("click", saveProfile);
            saveUsernameButton.addEventListener("click", saveProfile);

            // =====================================================
            // CHANGE PASSWORD
            // =====================================================

            savePasswordButton.addEventListener("click", async () => {
                const currentPassword = mainContent.querySelector(
                    "#settings-current-password"
                ).value;

                const newPassword = mainContent.querySelector(
                    "#settings-new-password"
                ).value;

                const confirmPassword = mainContent.querySelector(
                    "#settings-confirm-password"
                ).value;

                if (!currentPassword || !newPassword || !confirmPassword) {
                    alert("Please complete all password fields.");
                    return;
                }

                if (newPassword.length < 8) {
                    alert("New password must be at least 8 characters.");
                    return;
                }

                if (newPassword !== confirmPassword) {
                    alert("New passwords do not match.");
                    return;
                }

                try {
                    const response = await fetch("/api/auth/password", {
                        method: "PUT",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            currentPassword,
                            newPassword,
                            confirmPassword
                        })
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        alert(result.message || "Unable to change password.");
                        return;
                    }

                    alert("Password changed successfully.");

                    mainContent.querySelector("#settings-current-password").value = "";
                    mainContent.querySelector("#settings-new-password").value = "";
                    mainContent.querySelector("#settings-confirm-password").value = "";

                } catch (error) {
                    console.error("Password update error:", error);
                    alert("Unable to connect to the server.");
                }
            });
            
        }

        // SIDEBAR NAVIGATION
        container.querySelectorAll(".dashboard-menu-item").forEach(button => {

            button.addEventListener("click", () => {

                const selectedPage = button.dataset.page;

                // Update active menu
                container.querySelectorAll(".dashboard-menu-item").forEach(item => {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                // DASHBOARD
                if (selectedPage === "dashboard") {
                    if (attendanceChart) {
                        attendanceChart.destroy();
                        attendanceChart = null;
                    }

                    mainContent.innerHTML = dashboardHome;
                    loadDashboardData();
                    return;
                }

                // MY DTR
                if (selectedPage === "dtr") {
                    renderDTR();
                    return;
                }

                // OVERTIME
                if (selectedPage === "overtime") {
                    renderOvertime();
                    return;
                }

                // SALARY
                if (selectedPage === "salary") {
                    renderSalary();
                    return;
                }

                // ACCOUNT SETTINGS
                if (selectedPage === "settings") {
                    renderSettings();
                    return;
                }

                if (selectedPage === "developer") {
                    renderDeveloper(mainContent);
                    return;
                }

                // THE DEVELOPER / OTHER MODULES
                mainContent.innerHTML = `
                    <header class="dashboard-topbar">
                        <h2>${pageTitles[selectedPage]}</h2>
                        <span class="dashboard-status">
                            ● SYSTEM ONLINE
                        </span>
                    </header>

                    <section class="dashboard-welcome">
                        <span class="dashboard-label">EMPLOYEE PORTAL</span>
                        <h1>${pageTitles[selectedPage]}</h1>
                        <p class="dashboard-muted">
                            This module is ready for development.
                        </p>
                    </section>
                `;
            });

        });
        
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
}
