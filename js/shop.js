/* ============================================================
   SHOP.JS – RENDER DANH SÁCH SẢN PHẨM + LỌC + SẮP XẾP + PHÂN TRANG
   Dùng chung với:
   - core-products.js  (getAllProducts, getProductById)
   - cart.js / core-cart.js (addToCart, getCart, ...)
   ============================================================ */

/* ============ CẤU HÌNH PHÂN TRANG ============ */
let currentPage = 1;
const perPage = 12;              // 12 sản phẩm / trang
let ALL_PRODUCTS = [];           // Toàn bộ sản phẩm từ core-products
let LAST_FILTERED_LIST = [];     // Lưu danh sách sau khi lọc + search + sort

/* ============================================================
   KHỞI TẠO TRANG SHOP
   ============================================================ */
function initShopPage() {
    const container = document.querySelector(".pro-container");
    if (!container) return; // không phải shop.html thì thôi

    // Lấy toàn bộ sản phẩm từ core-products
    if (typeof getAllProducts === "function") {
        ALL_PRODUCTS = getAllProducts();
    } else {
        console.error("Thiếu hàm getAllProducts trong core-products.js");
        ALL_PRODUCTS = [];
    }

    // Gắn event cho bộ lọc + sort
    setupFilterEvents();

    // Render lần đầu
    currentPage = 1;
    applyAllFilters();
}

/* ============================================================
   GẮN SỰ KIỆN CHO FILTER + SORT
   ============================================================ */
function setupFilterEvents() {
    const filterCategory = document.getElementById("filterCategory");
    const filterBrand    = document.getElementById("filterBrand");
    const filterPrice    = document.getElementById("filterPrice");
    const filterReset    = document.getElementById("filterReset");
    const sortOption     = document.getElementById("sortOption");

    if (filterCategory) {
        filterCategory.addEventListener("change", () => {
            currentPage = 1;
            applyAllFilters();
        });
    }

    if (filterBrand) {
        filterBrand.addEventListener("change", () => {
            currentPage = 1;
            applyAllFilters();
        });
    }

    if (filterPrice) {
        filterPrice.addEventListener("change", () => {
            currentPage = 1;
            applyAllFilters();
        });
    }

    if (filterReset) {
        filterReset.addEventListener("click", () => {
            if (filterCategory) filterCategory.value = "";
            if (filterBrand)    filterBrand.value    = "";
            if (filterPrice)    filterPrice.value    = "";
            currentPage = 1;
            applyAllFilters();
        });
    }

    if (sortOption) {
        sortOption.addEventListener("change", () => {
            currentPage = 1;
            applyAllFilters();
        });
    }
}

/* ============================================================
   ÁP DỤNG: TÌM KIẾM (URL), LỌC, SẮP XẾP
   ============================================================ */
function applyAllFilters() {
    let list = [...ALL_PRODUCTS];

    // 1. Tìm kiếm qua query ?search=
    const params  = new URLSearchParams(window.location.search);
    const keyword = params.get("search");

    if (keyword && keyword.trim().length > 0) {
        const word = keyword.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(word));

        const title = document.querySelector("#page-header h2");
        if (title) {
            title.innerText = `Kết quả tìm: "${keyword}"`;
        }
    }

    // 2. Lọc Category / Brand / Price
    const filterCategory = document.getElementById("filterCategory");
    const filterBrand    = document.getElementById("filterBrand");
    const filterPrice    = document.getElementById("filterPrice");

    if (filterCategory && filterCategory.value) {
        const cate = filterCategory.value.toLowerCase();
        list = list.filter(p => (p.category || "").toLowerCase().includes(cate));
    }

    if (filterBrand && filterBrand.value) {
        const brand = filterBrand.value.toLowerCase();
        list = list.filter(p => (p.brand || "").toLowerCase().includes(brand));
    }

    if (filterPrice && filterPrice.value) {
        const [min, max] = filterPrice.value.split("-").map(Number);
        list = list.filter(p => p.price >= min && p.price <= max);
    }

    // 3. Sắp xếp
    const sortOption = document.getElementById("sortOption");
    if (sortOption && sortOption.value) {
        switch (sortOption.value) {
            case "priceAsc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "priceDesc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "nameAsc":
                list.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "nameDesc":
                list.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
    }

    // Lưu lại danh sách sau khi lọc → dùng cho phân trang
    LAST_FILTERED_LIST = list;

    // Render sản phẩm + phân trang
    renderShopProducts(list);
}

/* ============================================================
   PHÂN TRANG – CẮT DANH SÁCH THEO currentPage
   ============================================================ */
function paginateProducts(list) {
    const start = (currentPage - 1) * perPage;
    return list.slice(start, start + perPage);
}

/* ============================================================
   RENDER NÚT PHÂN TRANG
   ============================================================ */
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / perPage) || 1;
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    pagination.innerHTML = "";

    // Prev
    if (currentPage > 1) {
        pagination.innerHTML += `
            <a href="#" onclick="gotoPage(${currentPage - 1}); return false;">Prev</a>
        `;
    }

    // Số trang
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <a href="#"
               class="${i === currentPage ? "active" : ""}"
               onclick="gotoPage(${i}); return false;">${i}</a>
        `;
    }

    // Next
    if (currentPage < totalPages) {
        pagination.innerHTML += `
            <a href="#" onclick="gotoPage(${currentPage + 1}); return false;">Next</a>
        `;
    }
}

/* ============================================================
   ĐỔI TRANG
   ============================================================ */
function gotoPage(page) {
    currentPage = page;
    renderShopProducts(LAST_FILTERED_LIST);
}

/* ============================================================
   RENDER SẢN PHẨM TRONG .pro-container
   (CÓ PHÂN TRANG)
   ============================================================ */
function renderShopProducts(list) {
    const container = document.querySelector(".pro-container");
    if (!container) return;

    container.innerHTML = "";

    const showList = paginateProducts(list);

    if (showList.length === 0) {
        container.innerHTML = `<h2>Không có sản phẩm nào!</h2>`;
        renderPagination(list.length);
        return;
    }

    showList.forEach(product => {
        const img = product.images && product.images.length > 0
            ? product.images[0]
            : "img/products/f1.jpg";

        container.innerHTML += `
            <div class="pro">
                <img src="${img}" class="go-detail" data-id="${product.id}">

                <div class="des go-detail" data-id="${product.id}">
                    <span>${product.brand || ""}</span>
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
    attachAddCartEvents();
    renderPagination(list.length);
}

/* ============================================================
   SỰ KIỆN XEM CHI TIẾT
   ============================================================ */
function attachDetailEvents() {
    document.querySelectorAll(".go-detail").forEach(el => {
        el.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            if (!id) return;
            window.location.href = `sproduct.html?id=${id}`;
        });
    });
}

/* ============================================================
   SỰ KIỆN THÊM GIỎ HÀNG
   ============================================================ */
function attachAddCartEvents() {
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const id = this.getAttribute("data-id");
            if (!id) return;

            if (typeof getProductById !== "function") {
                console.error("Thiếu getProductById trong core-products.js");
                return;
            }

            const product = getProductById(id);
            if (!product) return;

            // Chuẩn dữ liệu item đưa vào giỏ
            const item = {
                id: product.id,
                name: product.name,
                price: product.price,
                brand: product.brand,
                image: product.images && product.images[0],
                quantity: 1
            };

            if (typeof addToCart === "function") {
                addToCart(item);
            } else {
                console.error("Thiếu hàm addToCart trong cart.js / core-cart.js");
            }

            alert("Đã thêm vào giỏ hàng!");
        });
    });
}

/* ============================================================
   TỰ KHỞI ĐỘNG KHI LOAD TRANG SHOP
   ============================================================ */
window.addEventListener("load", initShopPage);
