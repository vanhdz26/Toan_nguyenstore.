/* ============================================================
   SHOP PAGE – RENDER TẤT CẢ SẢN PHẨM
   (Dùng chung cho shop.html)
   ============================================================ */

/* ============================================================
   RENDER DANH SÁCH SẢN PHẨM
   ============================================================ */
function renderShopProducts(list = null) {
    const container = document.querySelector(".pro-container");
    if (!container) return;

    const products = list || getAllProducts();
    container.innerHTML = "";

    products.forEach(product => {
        container.innerHTML += `
            <div class="pro">
                <img src="${product.images[0]}" class="go-detail" data-id="${product.id}">

                <div class="des go-detail" data-id="${product.id}">
                    <span>${product.brand}</span>
                    <h5>${product.name}</h5>
                    <div class="star">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <h4>$${product.price}</h4>
                </div>

                <a href="#" class="add-cart-btn" data-id="${product.id}">
                    <i class="fa-solid fa-cart-plus cart"></i>
                </a>
            </div>
        `;
    });

    attachDetailEvents();
    createAddCartEvents(); // từ core-cart.js
}

/* ============================================================
   SỰ KIỆN XEM CHI TIẾT
   ============================================================ */
function attachDetailEvents() {
    document.querySelectorAll(".go-detail").forEach(el => {
        el.addEventListener("click", function () {
            let id = this.getAttribute("data-id");
            window.location.href = `sproduct.html?id=${id}`;
        });
    });
}

/* ============================================================
   KHỞI TẠO TRANG SHOP
   ============================================================ */
window.addEventListener("load", () => {
    renderShopProducts();
});
