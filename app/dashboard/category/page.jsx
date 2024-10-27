import { deleteCat, fetchCats } from "@/app/lib/actions";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import styles from "@/app/ui/dashboard/category/category.module.css";
import Image from "next/image";
import Link from "next/link";

const CategoryPage = async () => {
  const { cats } = await fetchCats();

  return (
    <div className={styles.containerMain}>
      <div className={styles.top}>
        <Link href="/dashboard/category/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Cat Name</td>

            <td>Image</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {cats.map((cat) => (
            <tr key={cat._id}>
              <td>
                <div className={styles.cat}>{cat.name}</div>
              </td>

              <td>
                {" "}
                <div className={styles.product}>
                  <Image
                    src={cat?.image || "/noproduct.jpg"}
                    alt={cat?.image}
                    width={80}
                    height={80}
                    className={styles.productImage}
                  />
                </div>
              </td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/category/${cat._id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deleteCat}>
                    <input type="hidden" name="_id" value={cat._id} />
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
      <Pagination count={cats.length} />
    </div>
  );
};

export default CategoryPage;
