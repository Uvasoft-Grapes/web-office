"use client"

import AppLayout from "@shared/layouts/AppLayout";
import ProtectedRoute from "@app/ProtectedRoute";
import { LuCreditCard, LuDollarSign, LuMinus, LuPlus, LuShoppingCart, LuStore, LuTrash2, LuUser } from "react-icons/lu";
import TextInput from "@shared/inputs/components/Text";
import CategorySelect from "@shared/inputs/components/CategorySelect";
import { ChangeEvent, useEffect, useState } from "react";
import { TypeCategory, TypeProduct } from "@shared/utils/types";
import axiosInstance from "@shared/utils/axiosInstance";
import { API_PATHS } from "@shared/utils/apiPaths";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import ProductCard from "@/src/app/store/components/ProductCard";
import Receipt from "@/src/app/store/components/Receipt";

export default function Store() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TypeCategory|undefined>();
  const [products, setProducts] = useState<TypeProduct[]|undefined>();
  const [name, setName] = useState("");
  const [cart, setCart] = useState<{ product:TypeProduct, quantity:number }[]>([]);
  const [receipt, setReceipt] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.PRODUCTS.GET_ALL_PRODUCTS, {
        params:{
          title:search,
          category,
        }
      });
      if(res.status === 200) {
        setProducts(res.data);
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error fetching products:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    };
  };

  useEffect(()=>{
    fetchProducts();
  },[category, search]);

  const addProduct = (newProduct:TypeProduct) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product._id === newProduct._id);
      if (existingItem) return prevCart.map((item) => (item.product._id === newProduct._id ? { ...item, quantity:item.quantity + 1 } : item));
      return [...prevCart, { product:newProduct, quantity:1 }];
    });
  };

  const removeFromCart = (productId:string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId))
  };

  const updateQuantity = (productId:string, newQuantity:number) => {
    if (newQuantity === 0) return removeFromCart(productId);
    setCart((prevCart) => prevCart.map((item) => (item.product._id === productId ? { ...item, quantity:newQuantity } : item)))
  };

  const clearCart = () => {
    setCart([]);
    setName("");
  };

  const getProductsQuantity = () => {
    let quantity = 0;
    cart.forEach((cartProduct) => {
      quantity += cartProduct.quantity;
    });
    return quantity;
  };

  const getTotal = () => {
    let total = 0;
    cart.forEach((cartProduct) => {
      total += cartProduct.product.price * cartProduct.quantity;
    });
    return total;
  };

  return(
    <ProtectedRoute>
      <AppLayout activeMenu="Punto de venta">
        <div className="flex flex-col lg:flex-row gap-4">
          <section className="card flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-1 text-primary-dark dark:text-primary-light">
                <LuStore className="text-2xl"/>
                <h2 className="font-semibold text-xl">Productos</h2>
              </span>
              <div className="flex-1 flex flex-wrap items-end gap-2">
                <div className="flex-1 min-w-60">
                  <TextInput name="search" placeholder="Buscar productos..." label="" action={(e:ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)}/>
                </div>
                <CategorySelect type="product" currentCategory={category} setCategory={setCategory}/>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {products?.map((product) => (
                <ProductCard key={product._id} product={product} addProduct={addProduct}/>
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-4 lg:w-1/3">
            <div className="card flex flex-col gap-1">
              <span className="flex-1 flex items-center gap-0.5 text-primary-dark dark:text-primary-light">
                <LuUser className="text-2xl"/>
                <h2 className="font-semibold text-xl">Cliente</h2>
              </span>
              <TextInput name="customer" placeholder="Nombre del cliente (opcional)" label="" action={(e:ChangeEvent<HTMLInputElement>)=>setName(e.target.value)}/>
            </div>
            <div className="card flex flex-col gap-4">
              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-primary-dark dark:text-primary-light">
                  <LuShoppingCart className="text-2xl"/>
                  <h2 className="font-semibold text-xl">Carrito</h2>
                </span>
                <button type="button" onClick={clearCart} className="card-btn-red">
                  <LuTrash2 className="text-lg"/>
                </button>
              </div>
              <ul className="flex flex-col gap-2 h-80 overflow-y-auto">
                {cart.length < 1 ?
                  <div className="flex-1 flex items-center justify-center font-semibold text-xl text-quaternary">
                    <p>No hay productos</p>
                  </div>
                :
                cart.map((cartProduct) => (
                  <li key={cartProduct.product._id} className="flex flex-wrap gap-2 p-4 rounded-md border border-secondary-light dark:border-tertiary-dark">
                    <div className="flex-1 flex flex-col gap-1 font-semibold text-primary-dark dark:text-primary-light">
                      <p className="text-lg line-clamp-3">{cartProduct.product.title}</p>
                      <span className="text-xs">${cartProduct.product.price * cartProduct.quantity}</span>
                    </div>
                    <div className="flex-1 flex gap-2 max-w-60 font-semibold text-sm text-primary-dark dark:text-primary-light">
                      <button type="button"  onClick={()=>updateQuantity(cartProduct.product._id, cartProduct.quantity - 1)} className="flex items-center justify-center size-10 lg:size-12 rounded-md border border-secondary-light dark:border-secondary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark duration-300">
                        <LuMinus className="text-base lg:text-lg"/>
                      </button>
                      <span className="flex-1 flex items-center justify-center size-10 lg:size-12 rounded-md border border-secondary-light dark:border-secondary-dark">{cartProduct.quantity}</span>
                      <button type="button" onClick={()=>updateQuantity(cartProduct.product._id, cartProduct.quantity + 1)} className="flex items-center justify-center size-10 lg:size-12 rounded-md border border-secondary-light dark:border-secondary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark duration-300">
                        <LuPlus className="text-base lg:text-lg"/>
                      </button>
                      <button type="button" onClick={()=>removeFromCart(cartProduct.product._id)} className="card-btn-red size-10 lg:size-12">
                        <LuTrash2 className="text-base lg:text-lg min-w-fit"/>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card flex flex-col gap-4">
              <h2 className="font-semibold text-2xl text-primary-dark dark:text-primary-light">Pagar</h2>
              <p className="flex items-center justify-between text-sm text-quaternary pb-2 border-b border-secondary-light dark:border-secondary-dark">
                <span>Productos:</span>
                <span>{getProductsQuantity()}</span>
              </p>
              <p className="flex items-center justify-between font-semibold text-lg text-primary-dark dark:text-primary-light">
                <span>Total:</span>
                <span>${getTotal()}</span>
              </p>
              <div className="flex gap-2">
                <button onClick={()=>setReceipt(true)} className="flex-1 card-btn-fill">
                  <LuDollarSign className="text-xl"/>
                  Efectivo
                </button>
                <button onClick={()=>setReceipt(true)} className="flex-1 card-btn-fill">
                  <LuCreditCard className="text-xl"/>
                  Tarjeta
                </button>
              </div>
            </div>
          </section>
          {receipt && <Receipt name={name} cart={cart} total={getTotal()} close={()=>setReceipt(false)}/>}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};