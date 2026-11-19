
/* =========================================================
   EGM DTR SYSTEM
   MAIN APPLICATION
   SPA ENTRY POINT
   ========================================================= */

import { renderAuthPage } from "./auth.js";
import { renderDashboard } from "./dashboard.js";

const pageContent = document.getElementById("page-content");

// ========================================
// GLOBAL HEADER
// ========================================

function renderMainHeader(user = null) {
    const header = document.getElementById("main-header");

    if (!header) return;

    if (!user) {
        header.innerHTML = "";
        header.style.display = "none";
        return;
    }

    header.style.display = "block";

    const avatar = user.avatar
        ? user.avatar
        : "";

    const avatarContent = avatar
        ? `<img src="${avatar}" alt="Profile Picture">`
        : `<span>${(user.fullName || "U").charAt(0).toUpperCase()}</span>`;

    header.innerHTML = `
        <div class="main-header-content">

            <div class="main-header-brand">
                <div class="main-header-logo">
                    <img src="/img/fav-icon.png" alt="EGM Logo">
                </div>

                <div class="main-header-title">
                    <h2>EGM Personal E-DTR</h2>
                    <span>Management System</span>
                </div>
            </div>

            <!-- MOBILE ACCOUNT MENU BUTTON -->
            <button
                type="button"
                class="account-menu-toggle"
                id="account-menu-toggle"
                aria-label="Open account menu"
                aria-expanded="false"
                aria-controls="main-header-account"
            >
                <i class="fas fa-bars"></i>
            </button>

            <!-- ACCOUNT INFORMATION / DROPDOWN -->
            <div class="main-header-account" id="main-header-account">

                <div class="main-header-user-info">

                    <span class="main-header-status">
                        <span class="status-indicator"></span>
                        SYSTEM ONLINE
                    </span>

                    <strong>${escapeHeaderText(user.fullName || "User")}</strong>

                </div>

                <div class="main-header-avatar">
                    ${avatarContent}
                </div>

                <button
                    type="button"
                    class="header-logout-button"
                    id="header-logout-button"
                >
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>

            </div>

        </div>
    `;

    
    // ========================================
    // MOBILE ACCOUNT MENU
    // ========================================

    const accountMenuToggle = document.getElementById("account-menu-toggle");
    const accountMenu = document.getElementById("main-header-account");

    if (accountMenuToggle && accountMenu) {

        // CLOSED BY DEFAULT
        accountMenu.classList.remove("account-menu-open");
        accountMenuToggle.setAttribute("aria-expanded", "false");
        accountMenuToggle.setAttribute("aria-label", "Open account menu");

        function closeAccountMenu() {
            accountMenu.classList.remove("account-menu-open");

            accountMenuToggle.setAttribute("aria-expanded", "false");
            accountMenuToggle.setAttribute("aria-label", "Open account menu");
            accountMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }

        // TOGGLE MENU
        accountMenuToggle.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = accountMenu.classList.toggle("account-menu-open");

            accountMenuToggle.setAttribute("aria-expanded", String(isOpen));
            accountMenuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close account menu" : "Open account menu"
            );

            accountMenuToggle.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // PREVENT CLOSING WHEN CLICKING INSIDE THE CARD
        accountMenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        // CLOSE WHEN CLICKING ANYWHERE OUTSIDE
        document.addEventListener("click", () => {
            closeAccountMenu();
        });

        // CLOSE USING ESCAPE KEY
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeAccountMenu();
            }
        });

        // CLOSE WHEN SWITCHING TO DESKTOP
        window.addEventListener("resize", () => {
            if (window.innerWidth > 600) {
                closeAccountMenu();
            }
        });

    }



    const logoutButton = header.querySelector("#header-logout-button");

        logoutButton.addEventListener("click", () => {
            handleLogout();
    });
}

function escapeHeaderText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

/* =========================================================
   PAGE RENDERER
   ========================================================= */

function renderPage(page, user = null) {

    switch (page) {

        case "signin":
        case "signup":
        case "auth":

            renderMainHeader(null);
            renderAuthPage(pageContent, handleLoginSuccess);
            break;

        case "dashboard":

            renderMainHeader(user);

            renderDashboard(
                pageContent,
                user,
                handleLogout
            );
            break;

        default:

            renderMainHeader(null);
            renderAuthPage(pageContent, handleLoginSuccess);
            break;
    }
}

/* =========================================================
   LOGIN SUCCESS
   ========================================================= */

function handleLoginSuccess(user) {
    renderPage("dashboard", user);
}

/* =========================================================
   LOGOUT
   ========================================================= */

async function handleLogout() {

    try {

        const response = await fetch("/api/auth/logout", {
            method: "POST"
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Unable to logout.");
            return;
        }

        renderPage("auth");

    } catch (error) {

        console.error("Logout error:", error);
        alert("Unable to connect to the server.");

    }
}

/* =========================================================
   SESSION CHECK
   ========================================================= */

async function initializeApp() {

    try {

        const response = await fetch("/api/auth/me");
        const result = await response.json();

        if (response.ok && result.success && result.user) {
            renderPage("dashboard", result.user);
            return;
        }

    } catch (error) {

        console.error("Session check error:", error);

    }

    renderPage("auth");
}

/* =========================================================
   INITIAL APPLICATION
   ========================================================= */

initializeApp();

// ========================================
// GLOBAL FOOTER
// ========================================

function renderMainFooter() {
    const footer = document.getElementById("main-footer");

    if (!footer) return;

    footer.innerHTML = `
        <div class="main-footer-content">
            <p>
                All Rights Reserved © EGM Personal E-DTR Management System
            </p>

            <p>
                Developed By:
                <a
                    href="https://www.facebook.com/EGM.freelancer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-developer-link"
                >
                    EGM Kuya Ram Developer
                </a>
            </p>
        </div>
    `;
}

renderMainFooter();
