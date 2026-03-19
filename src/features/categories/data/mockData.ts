// import { Category, Subcategory, Product } from"../types";
import type {
 Category,
 Subcategory,
 Product,
 NestedSubcategory,
 Store,
} from"../types";

export const categories: Category[] = [
 {
 id: 1,
 name:"Food",
 icon:"🍽️",
 bgColor:"bg-orange-100",
 iconColor:"text-orange-600",
 description:
"Discover restaurants, cafes, and delicious meals delivered to your doorstep.",
 },
 {
 id: 2,
 name:"Grocery",
 icon:"🛒",
 bgColor:"bg-green-100",
 iconColor:"text-green-600",
 description:"Fresh produce, daily essentials and household items.",
 },
 {
 id: 3,
 name:"Pharmacy",
 icon:"💊",
 bgColor:"bg-blue-100",
 iconColor:"text-blue-600",
 description:"Medications, health products and wellness items.",
 },
 {
 id: 4,
 name:"Fashion & Apparel",
 icon:"👕",
 bgColor:"bg-purple-100",
 iconColor:"text-purple-600",
 description:"Clothing, accessories and style essentials.",
 },
 {
 id: 5,
 name:"Home & Living",
 icon:"🏠",
 bgColor:"bg-orange-100",
 iconColor:"text-orange-600",
 description:"Furniture, decor and home improvement products.",
 },
 {
 id: 6,
 name:"Electronics",
 icon:"💻",
 bgColor:"bg-blue-100",
 iconColor:"text-blue-600",
 description:"Gadgets, devices and tech accessories.",
 },
 {
 id: 7,
 name:"Beauty & Care",
 icon:"💄",
 bgColor:"bg-pink-100",
 iconColor:"text-pink-600",
 description:"Cosmetics, skincare and personal care products.",
 },
];

export const subcategories: Record<number, Subcategory[]> = {
 1: [
 {
 id: 1,
 name:"Fast Food",
 description:"Quick bites and meals on the go.",
 tags: ["Burgers","Pizza","Sandwiches"],
 },
 {
 id: 2,
 name:"Fine Dining",
 description:"Premium restaurants and cuisine.",
 tags: ["Italian","French","Steakhouse"],
 },
 {
 id: 3,
 name:"Asian Cuisine",
 description:"Authentic flavors from Asia.",
 tags: ["Chinese","Japanese","Thai"],
 },
 {
 id: 4,
 name:"Cafes & Coffee",
 description:"Coffee shops and light refreshments.",
 tags: ["Espresso","Pastries"],
 },
 {
 id: 5,
 name:"Desserts & Sweets",
 description:"Cakes, ice cream and sweet treats.",
 tags: ["Bakery","Ice Cream","Chocolates"],
 },
 {
 id: 6,
 name:"Healthy Options",
 description:"Nutritious meals and organic food.",
 tags: ["Salads","Smoothies"],
 },
 ],
};

export const popularProducts: Record<number, Product[]> = {
 1: [
 {
 id: 1,
 name:"Classic Burger",
 store:"Burger Palace",
 price:"$12.99",
 rating: 4.5,
 image:
"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
 },
 {
 id: 2,
 name:"Margherita Pizza",
 store:"Italian Corner",
 price:"$18.99",
 rating: 4.7,
 image:
"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
 },
 {
 id: 3,
 name:"Sushi Combo",
 store:"Tokyo Express",
 price:"$24.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
 },
 {
 id: 4,
 name:"Cappuccino",
 store:"Coffee House",
 price:"$4.99",
 rating: 4.6,
 image:
"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
 },
 ],
 2: [
 {
 id: 101,
 name:"Premium Coffee Beans",
 store:"Fresh Market",
 price:"$32.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
 badge: { label:"New", className:"bg-blue-500"},
 category:"Drinks",
 originalPrice:"$80",
 },
 {
 id: 102,
 name:"Premium Coffee Beans",
 store:"Fresh Market",
 price:"$32.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
 badge: { label:"New", className:"bg-blue-500"},
 category:"Drinks",
 originalPrice:"$90",
 },
 {
 id: 103,
 name:"Premium Coffee Beans",
 store:"Fresh Market",
 price:"$32.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
 badge: { label:"New", className:"bg-blue-500"},
 category:"Drinks",
 originalPrice:"$80",
 },
 {
 id: 104,
 name:"Premium Coffee Beans",
 store:"Fresh Market",
 price:"$32.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
 badge: { label:"New", className:"bg-blue-500"},
 category:"Drinks",
 originalPrice:"$90",
 },
 {
 id: 105,
 name:"Premium Coffee Beans",
 store:"Fresh Market",
 price:"$32.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
 badge: { label:"New", className:"bg-blue-500"},
 category:"Drinks",
 originalPrice:"$80",
 },
 {
 id: 106,
 name:"Premium Coffee Beans",
 store:"Fresh Market",
 price:"$32.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
 badge: { label:"New", className:"bg-blue-500"},
 category:"Drinks",
 originalPrice:"$90",
 },
 {
 id: 107,
 name:"Premium Coffee Beans",
 store:"Fresh Market",
 price:"$32.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
 badge: { label:"New", className:"bg-blue-500"},
 category:"Drinks",
 originalPrice:"$80",
 },
 {
 id: 108,
 name:"Premium Coffee Beans",
 store:"Fresh Market",
 price:"$32.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
 badge: { label:"New", className:"bg-blue-500"},
 category:"Drinks",
 originalPrice:"$90",
 },
 {
 id: 109,
 name:"Premium Coffee Beans",
 store:"Fresh Market",
 price:"$32.99",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
 badge: { label:"New", className:"bg-blue-500"},
 category:"Drinks",
 originalPrice:"$80",
 },
 ],
};

export const nestedSubcategories: Record<number, NestedSubcategory[]> = {
 1: [
 {
 id: 0,
 name:"All Food",
 },
 {
 id: 1,
 name:"Restaurants",
 children: [
 { id: 11, name:"Fast Food"},
 { id: 12, name:"Pizza & Italian"},
 { id: 13, name:"Asian Cuisine"},
 { id: 14, name:"Egyptian Food"},
 ],
 },
 {
 id: 2,
 name:"Cafes & Desserts",
 children: [
 { id: 21, name:"Coffee Shop"},
 { id: 22, name:"Bakery & Pastry"},
 { id: 23, name:"Ice Cream"},
 ],
 },
 {
 id: 3,
 name:"Healthy Food",
 },
 {
 id: 4,
 name:"International",
 },
 ],
 2: [
 {
 id: 0,
 name:"All Grocery",
 },
 {
 id: 1,
 name:"Fresh fruits",
 },
 {
 id: 2,
 name:"Vegetables",
 },
 {
 id: 3,
 name:"Meat & Seafood",
 },
 {
 id: 4,
 name:"Dairy & Eggs",
 },
 {
 id: 5,
 name:"Snacks",
 },
 {
 id: 6,
 name:"Drinks",
 },
 ],
};

export const popularStores: Record<number, Store[]> = {
 1: [
 {
 id: 1,
 name:"Burger Palace",
 type:"Fast Food Restaurant",
 location:"Nasr City Cairo",
 rating: 4.8,
 reviews: 1500,
 image:
"https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
 status:"open",
 badges: ["20% OFF"],
 deliveryTime:"25-35 min",
 tags: ["Free Delivery","Fast Service"],
 },
 {
 id: 2,
 name:"Pizza Italiano",
 type:"Italian Restaurant",
 location:"Downtown Cairo",
 rating: 4.9,
 reviews: 2000,
 image:
"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
 status:"open",
 deliveryTime:"40-50 min",
 tags: ["Premium Quality"],
 },
 {
 id: 3,
 name:"Sushi Master",
 type:"Japanese Restaurant",
 location:"Zamalek, Cairo",
 rating: 5.0,
 reviews: 800,
 image:
"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
 status:"open",
 badges: ["NEW"],
 deliveryTime:"15-25 min",
 tags: ["Authentic","Fresh"],
 },
 {
 id: 4,
 name:"Sushi Master",
 type:"Japanese Restaurant",
 location:"Zamalek, Cairo",
 rating: 5.0,
 reviews: 800,
 image:
"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
 status:"open",
 badges: ["NEW"],
 deliveryTime:"15-25 min",
 tags: ["Authentic","Fresh"],
 },
 {
 id: 5,
 name:"Sushi Master",
 type:"Japanese Restaurant",
 location:"Zamalek, Cairo",
 rating: 5.0,
 reviews: 800,
 image:
"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
 status:"open",
 badges: ["NEW"],
 deliveryTime:"15-25 min",
 tags: ["Authentic","Fresh"],
 },
 {
 id: 6,
 name:"Sushi Master",
 type:"Japanese Restaurant",
 location:"Zamalek, Cairo",
 rating: 5.0,
 reviews: 800,
 image:
"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
 status:"open",
 badges: ["NEW"],
 deliveryTime:"15-25 min",
 tags: ["Authentic","Fresh"],
 },
 ],
};

export const categoryProducts: Record<number, Product[]> = {
 1: [
 {
 id: 1,
 name:"Classic Cheeseburger Combo",
 store:"Burger Palace",
 price:"89 EGP",
 originalPrice:"125 EGP",
 rating: 4.7,
 image:
"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
 badge: { label:"-35%", className:"bg-red-500"},
 category:"FAST FOOD",
 },
 {
 id: 2,
 name:"Pepperoni Pizza Large",
 store:"Pizza Italiano",
 price:"199 EGP",
 rating: 4.9,
 image:
"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
 badge: { label:"BEST SELLER", className:"bg-orange-500"},
 category:"PIZZA",
 },
 {
 id: 3,
 name:"Mixed Sushi Platter",
 store:"Sushi Master",
 price:"350 EGP",
 rating: 5.0,
 image:
"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
 badge: { label:"NEW", className:"bg-green-500"},
 category:"SUSHI",
 },
 {
 id: 4,
 name:"Chicken Shawarma Meal",
 store:"Shawarma House",
 price:"68 EGP",
 originalPrice:"75 EGP",
 rating: 4.6,
 image:
"https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&h=300&fit=crop",
 badge: { label:"-10%", className:"bg-red-500"},
 category:"FAST FOOD",
 },
 {
 id: 5,
 name:"Spaghetti Bolognese",
 store:"Pizza Italiano",
 price:"95 EGP",
 rating: 4.8,
 image:
"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
 category:"ITALIAN",
 },
 {
 id: 6,
 name:"Fried Chicken Bucket",
 store:"KFC",
 price:"140 EGP",
 originalPrice:"175 EGP",
 rating: 4.5,
 image:
"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
 badge: { label:"-20%", className:"bg-red-500"},
 category:"FAST FOOD",
 },
 {
 id: 7,
 name:"Grilled Chicken Salad Bowl",
 store:"Healthy Bites",
 price:"85 EGP",
 rating: 4.9,
 image:
"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
 category:"HEALTHY",
 },
 {
 id: 8,
 name:"Chocolate Lava Cake",
 store:"Sweet Dreams",
 price:"65 EGP",
 rating: 5.0,
 image:
"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
 badge: { label:"HOT", className:"bg-red-500"},
 category:"DESSERT",
 },
 ],
};
