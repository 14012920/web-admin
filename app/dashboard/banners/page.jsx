import { deleteBanner, fetchBanners } from "@/app/lib/actions";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import styles from "@/app/ui/dashboard/users/users.module.css";
import Image from "next/image";
import Link from "next/link";

const BannerPage = async () => {
  const { banners } = await fetchBanners();
  console.log("banners",banners)

  return (
    <div className={styles.containerMain}>
      <div className={styles.top}>
        <Link href="/dashboard/banners/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Banner Title</td>
            <td>Banner SubTitle</td>
            <td>URL</td>
            <td>Image</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {banners.map((banners) => (
            <tr key={banners._id}>
              <td>
                <div className={styles.banners}>{banners.title}</div>
              </td>
              <td>
                <div className={styles.banners}>{banners.subtitle}</div>
              </td>
              <td>
                <div className={styles.banners}>{banners.url}</div>
              </td>
              <td>
                <div className={styles.product}>
                  <Image
                    src={banners?.image || "/noproduct.jpg"}
                    alt={banners?.image}
                    width={150}
                    height={100}
                    className={styles.productImage}
                  />
                </div>
              </td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/banners/${banners._id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deleteBanner}>
                    <input type="hidden" name="_id" value={banners._id} />
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
      <Pagination count={banners.length} />
    </div>
  );
};

export default BannerPage;
