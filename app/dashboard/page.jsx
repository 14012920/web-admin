import { getDashboadCount } from "../lib/actions";
import { fetchAllPayment, fetchOrder } from "../lib/data";
import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
import styles from "../ui/dashboard/dashboard.module.css";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import Transactions from "../ui/dashboard/transactions/transactions";

const Dashboard = async () => {
  const { orders } = await fetchAllPayment();
  const count = await getDashboadCount();
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card count={count?.userCount} title={"Total Users"} />
          <Card count={count?.orderCount} title="Total Orders" />
          <Card count={count?.ProductCount} title="Total Products" />
        </div>
        <h2 className={styles.title}>Latest Transactions</h2>
        <Transactions data={orders} />
        <Chart />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
