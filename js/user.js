/* ============================================================
   USER SYSTEM – DÙNG CHUẨN VỚI core-auth.js
   ============================================================ */

/* -------------------------
   Lấy danh sách user
------------------------- */
function getUsersDB() {
    return JSON.parse(localStorage.getItem("USERS")) || [];
}

function saveUsersDB(db) {
    localStorage.setItem("USERS", JSON.stringify(db));
}

/* -------------------------
   Đăng ký User (gọi từ register.html)
------------------------- */
function registerUserFinal() {
    const name = document.getElementById("reg_name").value.trim();
    const phone = document.getElementById("reg_phone").value.trim();
    const email = document.getElementById("reg_email").value.trim();
    const pass = document.getElementById("reg_pass").value.trim();
    const address = document.getElementById("reg_address").value.trim();

    if (!name || !email || !pass) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const db = getUsersDB();

    if (db.some(u => u.email === email)) {
        alert("Email đã tồn tại!");
        return;
    }

    db.push({
        id: Date.now(),
        name,
        phone,
        email,
        password: pass,
        address,
        role: "user"
    });

    saveUsersDB(db);

    alert("Đăng ký thành công!");
    window.location.href = "login-user.html";
}

/* -------------------------
   Đăng nhập User
------------------------- */
function loginUserFinal() {
    const email = document.getElementById("log_email").value.trim();
    const pass = document.getElementById("log_pass").value.trim();

    const db = getUsersDB();
    const user = db.find(u => u.email === email && u.password === pass);

    if (!user) {
        alert("Sai email hoặc mật khẩu!");
        return;
    }

    localStorage.setItem("CURRENT_USER", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }));

    alert("Đăng nhập thành công!");
    window.location.href = "index.html";
}

/* -------------------------
   Lấy user hiện tại
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
   Navbar User
------------------------- */
function displayUserNavbar() {
    const user = getCurrentUser();
    const area = document.getElementById("userArea");
    if (!area) return;

    if (!user) {
        area.innerHTML = `<a href="login-user.html">Đăng nhập</a>`;
        return;
    }

    if (user.role === "admin") {
        area.innerHTML = `
            <a href="admin-dashboard.html">Admin</a>
            <a href="#" onclick="userLogout()" style="color:red;">Đăng xuất</a>
        `;
        return;
    }

    area.innerHTML = `
        <a href="order-history.html">Xin chào, ${user.name}</a>
        <a href="#" onclick="userLogout()" style="color:red;">Đăng xuất</a>
    `;
}
