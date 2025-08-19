let cart = [];
let currentUserId = null;

// تحميل المنتجات وعرضها
async function loadProducts() {
    const res = await fetch("http://localhost:3000/products");
    const products = await res.json();

    const container = document.getElementById("product-container");
    if(!container) return; // لو احنا مش في index.html
    container.innerHTML = "";

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>السعر: ${product.price} جنيه</p>
            <button onclick="addToCart(${product.id})">أضف للعربة</button>
        `;
        container.appendChild(div);
    });
}

// إضافة للسلة
async function addToCart(id){
    if(!currentUserId){alert("سجل دخولك أولاً"); return;}
    const res = await fetch(`http://localhost:3000/cart/${currentUserId}`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({productId:id, quantity:1})
    });
    const data = await res.json();
    updateCartCount(data.cart);
}

function updateCartCount(userCart){
    const total = userCart ? userCart.reduce((sum,i)=>sum+i.quantity,0)
                           : cart.reduce((sum,i)=>sum+i.quantity,0);
    const elem = document.getElementById("cart-count");
    if(elem) elem.textContent = total;
}

// تسجيل دخول
const loginForm = document.getElementById("login-form");
if(loginForm){
    loginForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const res = await fetch("http://localhost:3000/login", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({username,password})
        });
        const data = await res.json();
        const msg = document.getElementById("login-msg");
        if(res.ok){
            currentUserId = data.userId;
            msg.textContent = data.message;
            setTimeout(()=>window.location="index.html",1000);
        }else{
            msg.textContent = data.message;
        }
    });
}

// تسجيل جديد
const registerForm = document.getElementById("register-form");
if(registerForm){
    registerForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const username = document.getElementById("reg-username").value;
        const password = document.getElementById("reg-password").value;
        const res = await fetch("http://localhost:3000/register", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({username,password})
        });
        const data = await res.json();
        const msg = document.getElementById("register-msg");
        msg.textContent = data.message;
    });
}

// عند تحميل الصفحة الرئيسية
document.addEventListener("DOMContentLoaded", loadProducts);