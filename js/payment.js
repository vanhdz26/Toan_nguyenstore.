/* ============================================================
   PAYMENT – DEMO THANH TOÁN VNPay / Momo
   ============================================================ */

function renderCheckoutSummary() {
    const items = getCart();
    const container = document.getElementById("summary-items");
    const totalEl = document.getElementById("summary-total");

    if (!container) return;

    if (!items.length) {
        container.innerHTML = "<p>Giỏ hàng đang trống.</p>";
        if (totalEl) totalEl.innerText = 0;
        return;
    }

    let html = "<ul>";
    let total = 0;

    items.forEach(item => {
        const lineTotal = Number(item.price) * Number(item.quantity || 0);
        total += lineTotal;
        html += `<li>${item.name} x ${item.quantity} = $${lineTotal}</li>`;
    });

    html += "</ul>";
    container.innerHTML = html;
    if (totalEl) totalEl.innerText = total;
}

/* Mở popup QR và tạo đơn hàng */
function handlePayment(method) {
    const fullname = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!fullname || !phone || !address) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng.");
        return;
    }

    const items = getCart();
    if (!items.length) {
        alert("Giỏ hàng đang trống.");
        return;
    }

    const total = getCartTotal();

    // Tạo đơn hàng
    createOrder({
        fullname,
        phone,
        address,
        items,
        total,
        paymentMethod: method
    });

    // Hiển thị QR (demo)
    const modal = document.getElementById("qrModal");
    const title = document.getElementById("qrTitle");
    const img = document.getElementById("qrImage");

    if (modal && title && img) {
        title.innerText = `Quét mã ${method} để thanh toán $${total}`;
        // ảnh demo, anh tự thay bằng ảnh thật nếu muốn
        img.src = method === "VNPay"
            ? "img/pay/vnpay-demo.png"
            : "img/pay/momo-demo.png";

        modal.style.display = "flex";
    } else {
        // fallback: không có modal thì hỏi confirm và redirect luôn
        if (confirm(`Xác nhận thanh toán $${total} qua ${method}?`)) {
            finishPayment();
        }
    }
}

/* Được gọi khi bấm nút "Đóng" trên modal QR */
function closeQR() {
    const modal = document.getElementById("qrModal");
    if (modal) modal.style.display = "none";
    finishPayment();
}

/* Hoàn tất thanh toán: xoá giỏ + chuyển sang success.html */
function finishPayment() {
    clearCart();
    window.location.href = "success.html";
}

/* Auto init trên trang checkout */
window.addEventListener("load", () => {
    renderCheckoutSummary();

    const btnVN = document.getElementById("payVNPay");
    const btnMomo = document.getElementById("payMomo");

    if (btnVN) btnVN.addEventListener("click", () => handlePayment("VNPay"));
    if (btnMomo) btnMomo.addEventListener("click", () => handlePayment("Momo"));
});
