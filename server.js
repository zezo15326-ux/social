const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

let users = [];
const products = [
    {id:1,name:"منتج 1",price:120,img:"https://via.placeholder.com/200"},
    {id:2,name:"منتج 2",price:180,img:"https://via.placeholder.com/200"},
    {id:3,name:"منتج 3",price:250,img:"https://via.placeholder.com/200"}
];

// تسجيل مستخدم
app.post("/register",(req,res)=>{
    const {username,password}=req.body;
    if(users.find(u=>u.username===username)) return res.status(400).json({message:"المستخدم موجود"});
    const id = users.length+1;
    users.push({id,username,password,cart:[]});
    res.json({message:"تم التسجيل",userId:id});
});

// تسجيل دخول
app.post("/login",(req,res)=>{
    const {username,password}=req.body;
    const user = users.find(u=>u.username===username && u.password===password);
    if(!user) return res.status(400).json({message:"خطأ في البيانات"});
    res.json({message:"تم تسجيل الدخول",userId:user.id});
});

// المنتجات
app.get("/products",(req,res)=>res.json(products));

// إضافة للسلة
app.post("/cart/:userId",(req,res)=>{
    const user = users.find(u=>u.id==req.params.userId);
    if(!user) return res.status(400).json({message:"مستخدم غير موجود"});
    const {productId,quantity} = req.body;
    const existing = user.cart.find(i=>i.productId===productId);
    if(existing) existing.quantity += quantity;
    else user.cart.push({productId,quantity});
    res.json({message:"تمت الإضافة", cart:user.cart});
});

// جلب السلة
app.get("/cart/:userId",(req,res)=>{
    const user = users.find(u=>u.id==req.params.userId);
    if(!user) return res.status(400).json({message:"مستخدم غير موجود"});
    res.json(user.cart);
});

// حذف من السلة
app.delete("/cart/:userId/:productId",(req,res)=>{
    const user = users.find(u=>u.id==req.params.userId);
    if(!user) return res.status(400).json({message:"مستخدم غير موجود"});
    user.cart = user.cart.filter(i=>i.productId!=req.params.productId);
    res.json({message