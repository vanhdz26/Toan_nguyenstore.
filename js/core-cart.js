/* ============================================================
   CORE-CART – Quản lý giỏ hàng dùng chung
   ============================================================ */

const CART_KEY = "CART_ITEMS";

/* Lấy / lưu giỏ hàng */
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(list) {
    localStorage.setItem(CART_KEY, JSON.stringify(list));
}

/* Thêm vào giỏ hàng */
function addToCart(item) {
    let cart = getCart();

    const index = cart.findIndex(p => String(p.id) === String(item.id));
    if (index >= 0) {
        cart[index].quantity += item.quantity;
    } else {
        cart.push(item);
    }

    saveCart(cart);
}

/* Tính tổng tiền */
function getCartTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/* Xóa toàn bộ giỏ */
function clearCart() {
    localStorage.removeItem(CART_KEY);
}

/* Gắn sự kiện add cart trong Shop Page */
function createAddCartEvents() {
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const id = this.getAttribute("data-id");
            const product = getProductById(id);

            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.images[0],
                quantity: 1
            });

            alert("Đã thêm vào giỏ hàng!");
        });
    });
}

/* Render giỏ hàng */
function renderCart() {
    const tb = document.getElementById("cart-items");
    if (!tb) return;

    let cart = getCart();
    tb.innerHTML = "";

    cart.forEach(item => {
        tb.innerHTML += `
            <tr data-id="${item.id}">
                <td><a class="remove">X</a></td>
                <td><img src="${item.img}" /></td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td><input type="number" min="1" value="${item.quantity}" class="qty"></td>
                <td class="line">$${item.price * item.quantity}</td>
            </tr>
        `;
    });

    // Cập nhật tổng
    if (document.getElementById("totalPrice"))
        document.getElementById("totalPrice").innerText = getCartTotal();

    // Update quantity
    tb.querySelectorAll(".qty").forEach(input => {
        input.addEventListener("change", function () {
            const id = this.closest("tr").getAttribute("data-id");
            const qty = Number(this.value) || 1;

            let cart = getCart();
            let item = cart.find(i => String(i.id) === String(id));
            item.quantity = qty;

            saveCart(cart);
            renderCart();
        });
    });

    // Remove item
    tb.querySelectorAll(".remove").forEach(rm => {
        rm.addEventListener("click", function () {
            const id = this.closest("tr").getAttribute("data-id");
            let cart = getCart().filter(i => String(i.id) !== String(id));
            saveCart(cart);
            renderCart();
        });
    });
}
