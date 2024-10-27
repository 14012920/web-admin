"use client";
import { fetchOrder } from "@/app/lib/data";
import styles from "./transactions.module.css";

const Transactions = ({ data }) => {
  const getFormatedDate = (timestamp) => {
    var todate = new Date(timestamp).getDate();
    var tomonth = new Date(timestamp).getMonth() + 1;
    var toyear = new Date(timestamp).getFullYear();
    var original_date = todate + "/" + tomonth + "/" + toyear;
    return original_date;
  };
  const FetchOrderById = async (id) => {
    console.log("callerd", id);
    const data = await fetchOrder(id);
    console.log("DAAAAATAAAA", data);
  };
  const getAddress = (obj) => {
    if (obj && Object.keys(obj).length > 0) {
      delete obj.id;
      delete obj.country;
      delete obj.tag;

      let address = "";
      for (const key in obj) {
        if (obj[key] !== "undefined" && obj[key] !== "shipping_address") {
          let ab = `${obj[key]}, `;

          address = address + ab;
        }
      }
      return address;
    }
    return "";
  };
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Order ID</td>
            <td>Amount</td>
            <td>Amount Due</td>
            <td>Date</td>
            <td>Customer Mobile</td>
            <td>Customer Email</td>
            <td>Shipping Address</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {data?.map((order) => (
            <tr
              key={order?.id}
              onClick={(e) => {
                e.stopPropagation();
                FetchOrderById(order?.id);
              }}
            >
              <td>{order?.id}</td>
              <td>₹{order?.line_items_total / 100}</td>
              <td>₹{order?.amount_due / 100}</td>
              <td>{getFormatedDate(order.created_at * 1000)}</td>
              <td>{order?.customer_details?.mobile}</td>
              <td>{order?.customer_details?.email}</td>
              <td>{getAddress(order?.customer_details?.shipping_address)}</td>

              <td>
                <span
                  className={`${styles.status} ${
                    order?.status === "paid" ? styles.done : styles.pending
                  }`}
                >
                  {order?.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
