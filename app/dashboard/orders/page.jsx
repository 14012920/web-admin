import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/orders/orders.module.css";
import Transactions from "@/app/ui/dashboard/transactions/transactions";
import { fetchAllPayment } from "../../lib/data";

const OrderPage = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 0;
  console.log("PAGEEEEE", page);
  const { count, orders } = await fetchAllPayment(page);
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a order..." />
      </div>
      <Transactions data={orders} />
      <Pagination count={100} />
    </div>
  );
};

export default OrderPage;
