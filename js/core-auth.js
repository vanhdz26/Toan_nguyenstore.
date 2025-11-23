/* ============================================================
   USER SYSTEM – LOGIN / REGISTER / LOGOUT / AUTH / NAVBAR
   ============================================================ */

/* -------------------------
   Lấy danh sách user từ DB
------------------------- */
function getUserDB() {
    return JSON.parse(localStorage.getItem("USER_DB")) || [];
}

function saveUserDB(db) {
    localStorage.setItem("USER_DB", JSON.stringify(db));
}

/* -------------------------
   Đăng ký User
------------------------- */
function registerUser(newUser) {
    const db = getUserDB();

    if (db.some(u => u.email === newUser.email)) {
        return { success: false, message: "Email đã tồn tại!" };
    }

    db.push({
        id: Date.now(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        address: newUser.address || "",
        role: "user"
    });

    saveUserDB(db);
    return { success: true };
}

/* -------------------------
   Đăng nhập User / Admin
------------------------- */
function login(email, password) {
    const db = getUserDB();

    const user = db.find(u => u.email === email && u.password === password);

    if (!user) {
        return { success: false, message: "Sai email hoặc mật khẩu!" };
    }

    const token = Date.now() + "-" + Math.random();

    localStorage.setItem("CURRENT_USER", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
    }));

    return { success: true, role: user.role };
}

/* -------------------------
   Lấy User hiện tại
------------------------- */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("CURRENT_USER")) || null;
}

/* -------------------------
   Đăng xuất
------------------------- */
function userLogout() {
    localStorage.removeItem("CURRENT_USER");
    window.location.href = "index.html";
}

/* -------------------------
   Chỉ user mới được vào
------------------------- */
function requireLogin() {
    if (!getCurrentUser()) {
        alert("Bạn cần đăng nhập!");
        window.location.href = "login-user.html";
    }
}

/* -------------------------
   Chỉ admin mới được vào
------------------------- */
function requireAdmin() {
    const u = getCurrentUser();
    if (!u || u.role !== "admin") {
        alert("Không có quyền truy cập!");
        window.location.href = "login.html";
    }
}

/* -------------------------
   NAVBAR User + Admin
------------------------- */

function displayUserNavbar() {
    const user = getCurrentUser();
    const area = document.getElementById("userArea");
    if (!area) return;

    // chưa đăng nhập
    if (!user) {
        area.innerHTML = `<a href="login-user.html">Đăng nhập</a>`;
        return;
    }

    // nếu admin
    if (user.role === "admin") {
        area.innerHTML = `
            <a href="admin-dashboard.html" style="color:#088178;">Admin</a>
            <a href="#" onclick="userLogout()" style="color:red;">Đăng xuất</a>
        `;
        return;
    }

    // nếu user
    area.innerHTML = `
        <a href="user-profile.html">Xin chào, ${user.name}</a>
        <a href="#" onclick="userLogout()" style="color:red;">Đăng xuất</a>
    `;
}
