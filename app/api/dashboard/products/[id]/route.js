import { Product } from "@/app/lib/models";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export const GET = async (req, context) => {
  console.log("req*****", context.params.id);
  await connectToDB();
  const userId = context.params.id;
  if (userId) {
    const data = await Product.findOne({ _id: userId });
    return NextResponse.json({ msg: "success", data: data });
  } else {
    return NextResponse.json({ msg: "success", data: {} });
  }
};

// export const POST = async (req, res) => {
//   console.log("req*********", req?.method);
//   await connectToDB();
//   const { title, description, price, images, category, properties } = req.body;
//   const productDoc = await Product.create({
//     title,
//     description,
//     price,
//     images,
//     category,
//     properties,
//   });
//   res.json(productDoc);
// };
// export const PUT = async (req, res) => {
//   const { title, description, price, images, category, properties, _id } =
//     req.body;
//   await Product.updateOne(
//     { _id },
//     { title, description, price, images, category, properties }
//   );
//   res.json(true);
// };

// export const DELETE = async (req, res) => {
//   console.log("req*********", req?.method);

//   if (req.query?.id) {
//     await Product.deleteOne({ _id: req.query?.id });
//     res.json(true);
//   }
// };
