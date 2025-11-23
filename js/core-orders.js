/* ============================================================
   CORE-ORDERS – Lưu và hiển thị đơn hàng
   ============================================================ */

const ORDERS_KEY = "ORDERS_DB";

/* Lấy / lưu tất cả đơn hàng */
function getAllOrders() {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}

function saveAllOrders(list) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
}

/* Tạo đơn hàng mới */
function createOrder(data) {
    const user = getCurrentUser(); // từ core-auth.js
    const list = getAllOrders();

    const order = {
        id: "ORD" + Date.now(),
        userId: user ? user.id : null,
        fullname: data.fullname,
        phone: data.phone,
        address: data.address,
        items: data.items || [],
        total: Number(data.total) || 0,
        paymentMethod: data.paymentMethod || "",
        status: "Đang xử lý",
        createdAt: new Date().toISOString()
    };

    list.push(order);
    saveAllOrders(list);

    return order;
}

/* Lấy đơn theo user */
function getOrdersByUser(userId) {
    return getAllOrders().filter(o => String(o.userId) === String(userId));
}

/* ============================================================
   RENDER LỊCH SỬ ĐƠN HÀNG CHO USER (order-history.html)
   ============================================================ */
function renderOrderHistory() {
    const user = getCurrentUser();
    const tbody =
        document.getElementById("orderHistoryBody") ||
        document.getElementById("orderTableBody");

    if (!tbody) return;

    if (!user) {
        tbody.innerHTML = `<tr><td colspan="5">Vui lòng đăng nhập để xem lịch sử đơn hàng.</td></tr>`;
        return;
    }

    const orders = getOrdersByUser(user.id);

    if (!orders.length) {
        tbody.innerHTML = `<tr><td colspan="5">Bạn chưa có đơn hàng nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = "";
    orders.forEach(o => {
        tbody.innerHTML += `
            <tr>
                <td>${o.id}</td>
                <td>${o.createdAt.substring(0, 10)}</td>
                <td>${o.total}$</td>
                <td>${o.paymentMethod}</td>
                <td>${o.status}</td>
            </tr>
        `;
    });
}

/* ============================================================
   RENDER ĐƠN HÀNG CHO ADMIN (orders.html)
   ============================================================ */
function renderAdminOrders() {
    const tbody = document.getElementById("adminOrderTable");
    if (!tbody) return;

    const orders = getAllOrders();
    tbody.innerHTML = "";

    if (!orders.length) {
        tbody.innerHTML = `<tr><td colspan="6">Chưa có đơn hàng nào.</td></tr>`;
        return;
    }

    orders.forEach(o => {
        tbody.innerHTML += `
            <tr>
                <td>${o.id}</td>
                <td>${o.fullname}</td>
                <td>${o.phone}</td>
                <td>${o.total}$</td>
                <td>${o.paymentMethod}</td>
                <td>${o.status}</td>
            </tr>
        `;
    });
}

/* Nút xoá toàn bộ đơn hàng (nếu admin có dùng) */
function clearAllOrders() {
    if (!confirm("Xoá toàn bộ đơn hàng?")) return;
    localStorage.removeItem(ORDERS_KEY);
    renderAdminOrders();
}
