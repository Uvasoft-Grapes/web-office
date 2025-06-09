import { TypeProduct } from "@utils/types";

export default function ProductsList({ products }:{ products:TypeProduct[] }) {
  return(
    <ul className="flex-1 flex flex-col gap-4 max-h-full overflow-y-auto">
    {products.map(product => (
      <li key={product._id} className="flex items-center gap-4 p-3 border-b border-secondary-light dark:border-secondary-dark">
        <div className="flex-1 overflow-hidden">
          <p className="line-clamp-2 font-medium text-sm sm:text-base text-basic">{product.title}</p>
          <p className="line-clamp-1 text-xs sm:text-sm text-quaternary">{product.description}</p>
        </div>
      </li>
    ))}
    </ul>
  );
};