import { BRAND_NAME } from "@/src/utils/data";
import { TypeProduct } from "@/src/utils/types";
import { format } from "date-fns";

export default function Receipt({ name, cart, total, close }:{ name:string, cart:{ product:TypeProduct, quantity:number }[], total:number, close:()=>void }) {
  return(
    <div className="fixed left-0 top-0 z-50 flex items-center justify-center bg-quaternary/50 w-screen h-screen">
      <section className="max-h-[90vh] p-3 rounded-md bg-primary-light dark:bg-primary-dark overflow-y-auto overflow-x-hidden">
        <div id="receipt" className="flex flex-col gap-10 p-5 sm:p-10 w-[80vw] sm:w-[400px] rounded text-sm bg-primary-light">
          <div className="text-center">
            <h3 className="font-bold text-base sm:text-lg">{BRAND_NAME}</h3>
            <p className="text-muted-foreground">123 Main Street</p>
            <p className="text-muted-foreground">Phone: (555) 123-4567</p>
            <p className="text-muted-foreground">{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
          </div>
        {name && (
          <div>
            <p>
              <strong>Customer:</strong> {name}
            </p>
          </div>
        )}
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.product._id} className="flex justify-between">
                <div>
                  <p>{item.product.title}</p>
                  <p className="text-muted-foreground">
                    {item.quantity} x ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <p>${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {/* <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>${getTotal().toFixed(2)}</p>
            </div> */}
            {/* <div className="flex justify-between">
              <p>Tax (8%):</p>
              <p>${tax.toFixed(2)}</p>
            </div> */}
            <div className="flex justify-between font-bold text-lg">
              <p>Total:</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-center text-muted-foreground">
            <p>Gracias por tu compra</p>
            <p>Que tengas un buen día!</p>
          </div>
        </div>
        <div className="flex gap-2 pt-3">
          <button type="button" onClick={close} className="flex-1 card-btn-fill">Finalizar</button>
          <button type="button" onClick={()=>{}} className="flex-1 card-btn-fill">Imprimir</button>
        </div>
      </section>
    </div>
  );
};