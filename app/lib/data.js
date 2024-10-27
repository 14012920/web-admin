//PRODUCT ACTION*****************

import { encode } from "base-64";

export const fetchSingleProduct = async (id) => {
  try {
    const response = await fetch(`/api/dashboard/products/${id}`);
    const res = await response.json();
    return res?.data;
  } catch (err) {
    console.log("payment errror", err);
    throw err;
  }
};

export const fetchAllPayment = async (page) => {
  const count = 10;
  try {
    console.log(
      `https://api.razorpay.com/v1/orders?expand[]=payments&count=${10}&skip=${page * count}`
    );
    const response = await fetch(
      `https://api.razorpay.com/v1/orders?expand[]=payments&count=${10}&skip=${page * count}`,
      {
        headers: {
          Authorization:
            "Basic " + encode("rzp_test_KP6LrT0X7DNstE" + ":" + "9AxpP6HNR4Kvkh1Xy0FLZ1XK"),
        },
      }
    );
    const res = await response.json();
    return { orders: res?.items, count };
  } catch (err) {
    console.log("payment errror", err);
    throw err;
  }
};

export const fetchOrder = async (id) => {
  try {
    const response = await fetch(`/api/dashboard/razorpayorder/${id}`);
    const res = await response.json();
    return res?.data;
  } catch (err) {
    console.log("Fetch order errror", err);
    throw err;
  }
};
export const cards = [
  {
    id: 1,
    title: "Total Users",
    number: 10,
    change: 12,
  },
  {
    id: 2,
    title: "Total Products",
    number: 20,
    change: -2,
  },
  {
    id: 3,
    title: "Orders",
    number: 15,
    change: 18,
  },
];
