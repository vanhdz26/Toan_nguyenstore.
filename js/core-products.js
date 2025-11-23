/* ============================================================
   CORE-PRODUCTS – Quản lý toàn bộ dữ liệu sản phẩm
   ============================================================ */

/* KEY LƯU TRỮ SẢN PHẨM ADMIN */
const ADMIN_PRODUCTS_KEY = "ADMIN_PRODUCTS";

/* ============================================================
   DANH SÁCH SẢN PHẨM MẶC ĐỊNH (Fallback)
   ============================================================ */
const DEFAULT_PRODUCTS = [
    {
        id: "f1",
        name: "Áo Cartoon T-shirt",
        brand: "Adidas",
        price: 100,
        category: "Áo",
        images: ["img/products/f1.jpg", "img/products/f2.jpg", "img/products/f3.jpg", "img/products/f4.jpg"],
        description: "Chất liệu cotton thoáng mát."
    },
    {
        id: "f2",
        name: "Áo Tay Ngắn Basic",
        brand: "Adidas",
        price: 100,
        category: "Áo",
        images: ["img/products/f2.jpg"],
        description: "Form trẻ trung, thoải mái."
    },
    {
        id: "n1",
        name: "Áo Cotton N1",
        brand: "Adidas",
        price: 100,
        category: "Áo",
        images: ["img/products/n1.jpg"],
        description: "Sản phẩm trending."
    }
];

/* ============================================================
   LẤY – LƯU SẢN PHẨM ADMIN
   ============================================================ */
function getAdminProducts() {
    return JSON.parse(localStorage.getItem(ADMIN_PRODUCTS_KEY)) || [];
}

function saveAdminProducts(list) {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(list));
}

/* ============================================================
   LẤY TẤT CẢ SẢN PHẨM (ADMIN > DEFAULT)
   ============================================================ */
function getAllProducts() {
    const adminList = getAdminProducts();
    if (adminList.length > 0) return adminList;
    return DEFAULT_PRODUCTS;
}

/* ============================================================
   LẤY SẢN PHẨM THEO ID  (SO SÁNH THEO STRING ĐỂ TRÁNH LỆCH KIỂU)
   ============================================================ */
function getProductById(id) {
    const list = getAllProducts();
    return list.find(p => String(p.id) === String(id));
}

/* ============================================================
   ADMIN – THÊM SẢN PHẨM
   ============================================================ */
function addProduct(product) {
    let list = getAdminProducts();
    list.push(product);
    saveAdminProducts(list);
}

/* ============================================================
   ADMIN – XOÁ SẢN PHẨM
   ============================================================ */
function deleteProduct(id) {
    let list = getAdminProducts();
    list = list.filter(p => String(p.id) !== String(id));
    saveAdminProducts(list);
}

/* ============================================================
   ADMIN – CẬP NHẬT SẢN PHẨM
   ============================================================ */
function updateProduct(updated) {
    let list = getAdminProducts();

    list = list.map(p => String(p.id) === String(updated.id) ? updated : p);

    saveAdminProducts(list);
}
