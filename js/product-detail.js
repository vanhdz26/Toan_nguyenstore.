/* ============================================================
   PRODUCT-DETAIL.JS – HIỂN THỊ CHI TIẾT SẢN PHẨM (BẢN ĐÚNG)
   ============================================================ */

/* 1) LẤY ID TRÊN URL */
const params = new URLSearchParams(window.location.search);
let productId = params.get("id");

if (!productId) {
    console.error("Không có ID sản phẩm");
    throw new Error("Thiếu ID sản phẩm!");
}

/* ============================================================
   2) LẤY SẢN PHẨM THEO ID (KHÔNG MAP SANG p001 NỮA)
   ============================================================ */
const product = getProductById(productId);

if (!product) {
    console.error("Sản phẩm không tồn tại:", productId);
    alert("Sản phẩm không tồn tại!");
    throw new Error("Product not found!");
}

/* ============================================================
   3) RENDER CHI TIẾT SẢN PHẨM
   ============================================================ */
function loadProductDetail() {

    const mainImg = document.getElementById("MainImg");
    mainImg.src = product.images[0];

    const smallGroup = document.querySelector(".small-img-group");
    smallGroup.innerHTML = "";

    product.images.forEach((img, index) => {
        smallGroup.innerHTML += `
            <div class="small-img-col">
                <img src="${img}" width="100%" class="small-img" data-index="${index}">
            </div>
        `;
    });

    // sự kiện đổi ảnh lớn
    setTimeout(() => {
        document.querySelectorAll(".small-img").forEach(img => {
            img.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                mainImg.src = product.images[index];
            });
        });
    }, 200);

    document.querySelector(".single-pro-details h4").innerText = product.name;
    document.querySelector(".single-pro-details h2").innerText = "$" + product.price;
    document.querySelector(".single-pro-details span").innerText = product.description;
}

/* ============================================================
   4) NÚT THÊM GIỎ HÀNG
   ============================================================ */
function initAddToCartDetail() {
    const btn = document.getElementById("addToCartBtn");
    const qtyInput = document.getElementById("productQty");

    if (!btn || !qtyInput) return;

    btn.addEventListener("click", () => {
        let qty = Number(qtyInput.value);
        if (qty < 1) qty = 1;

        addToCart({
            id: product.id,
            name: product.name,
            img: product.images[0],
            price: product.price,
            brand: product.brand,
            quantity: qty
        });

        alert("Đã thêm vào giỏ!");
    });
}

/* ============================================================
   5) AUTO INIT
   ============================================================ */
window.addEventListener("load", () => {
    loadProductDetail();
    initAddToCartDetail();
});
