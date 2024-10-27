import { encode } from "base-64";
import { NextResponse } from "next/server";
export const GET = async (req, context) => {
  console.log("req*****", context.params.id);
  try {
    const response = await fetch(`https://api.razorpay.com/v1/orders/order_P6OLzlxIlYtvLj`, {
      headers: {
        Authorization:
          "Basic " + encode("rzp_test_KP6LrT0X7DNstE" + ":" + "9AxpP6HNR4Kvkh1Xy0FLZ1XK"),
      },
    });
    const res = await response.json();
    return NextResponse.json({ msg: "success", data: res });
  } catch (err) {
    console.log("errror", err);
    return NextResponse.json({ msg: "failure", data: {}, error: err });
  }
};
