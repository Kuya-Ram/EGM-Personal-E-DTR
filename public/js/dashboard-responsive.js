
export function initializeDashboardResponsive() {

    const menuButton = document.getElementById("mobile-menu-toggle");
    const sidebar = document.querySelector(".dashboard-sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (!menuButton || !sidebar || !overlay) return;

    function openMenu() {
        sidebar.classList.add("mobile-open");
        overlay.classList.add("active");

        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Close navigation menu");

        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");

        document.body.style.overflow = "";
    }

    menuButton.addEventListener("click", () => {
        const isOpen = sidebar.classList.contains("mobile-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener("click", closeMenu);

    sidebar.querySelectorAll(".dashboard-menu-item").forEach(item => {
        item.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}

window.initializeDashboardResponsive = function () {
    // Hamburger menu code dito
};