import Image from "next/image";
import Link from "next/link";
import styles from "@/app/ui/dashboard/products/products.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import {
  deleteProduct,
  fetchCats,
  fetchProducts,
  getAllReview,
} from "@/app/lib/actions";

const ProductsPage = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const category = await fetchCats();
  const { count, products } = await fetchProducts(q, page);

  const getCatName = (catId) => {
    const selectedCat = category?.cats?.find(
      (item) => JSON.stringify(item?._id) === catId
    );
    return selectedCat?.name || "";
  };
   console.log("products", products);
  const getReview = async (id) => {
    console.log("productId888888", id);
    if (products?.length) {
      const reviewCount = await getAllReview(id);
      return reviewCount;
    }
    return "";
  };
  return (
    <div className={styles.containerMain}>
      <div className={styles.top}>
        <Search placeholder="Search for a product..." />
        <Link href="/dashboard/products/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Title</td>
            <td>Description</td>
            <td>Price</td>
            <td>Category</td>
            <td>Rating</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={JSON.stringify(product?._id)}>
              <td>
                <div className={styles.product}>
                  <Image
                    src={product?.images[0] || "/noproduct.jpg"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.productImage}
                  />
                  {product.title}
                </div>
              </td>
              <td>{product.description?.slice(0, 30)}</td>
              <td>{product.price}</td>
              <td>{getCatName(JSON.stringify(product?.category))}</td>
              <td>{getReview(product?._id)}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/products/${product._id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product._id} />
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default ProductsPage;
