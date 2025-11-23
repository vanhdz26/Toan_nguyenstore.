/* ============================================================
   CORE-UI.JS – Điều khiển UI dùng chung (Navbar User + Mobile)
   ============================================================ */

/* ================================
   1. NAVBAR USER / ADMIN
================================= */

function displayUserNavbar() {
    const userArea = document.getElementById("userArea");
    if (!userArea) return;

    const user = JSON.parse(localStorage.getItem("CURRENT_USER")) || null;

    if (!user) {
        userArea.innerHTML = `<a href="login-user.html">Đăng nhập</a>`;
        return;
    }

    // Nếu là Admin
    if (user.role === "admin") {
        userArea.innerHTML = `
            <a href="admin-dashboard.html" style="color:#088178;">Admin</a>
            <a href="#" onclick="userLogout()" style="color:red;">Đăng xuất</a>
        `;
        return;
    }

    // Nếu là User
    userArea.innerHTML = `
        <a href="order-history.html">Xin chào, ${user.name}</a>
        <a href="#" onclick="userLogout()" style="color:red;">Đăng xuất</a>
    `;
}


/* ================================
   2. MOBILE MENU (Hamburger)
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const bar = document.getElementById('bar');
    const nav = document.getElementById('navbar');
    const close = document.getElementById('close');

    if (bar) {
        bar.onclick = () => {
            nav.classList.add('active');
        };
    }

    if (close) {
        close.onclick = () => {
            nav.classList.remove('active');
        };
    }
});
