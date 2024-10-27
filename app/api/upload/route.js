import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { connectToDB } from "../../lib/utils";
import { NextResponse } from "next/server";
const bucketName = "online-women-store";

export const POST = async (req, res) => {
  connectToDB();
  // try {
  const form = await req.formData();
  const files = form.getAll("file");
  // const { fields, files } = await new Promise((resolve, reject) => {
  //   form.parse(req, (err, fields, files) => {
  //     if (err) reject("REJETTTT", err);
  //     resolve({ fields, files });
  //   });
  // });
  console.log("length:", files);
  const client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  // const response = await Promise.all(
  //   files.map(async (file) => {
  //     // not sure why I have to override the types here
  //     const Body = await file.arrayBuffer();
  //     const ext = file.name.split(".").pop();
  //     const newFilename = Date.now() + "." + ext;
  //     console.log("response****", response);
  //   await  client.send(
  //       new PutObjectCommand({
  //         Bucket: bucketName,
  //         Key: newFilename,
  //         Body: Body,
  //         ACL: "public-read",
  //         ContentType: mime.lookup(file.path),
  //       })
  //     );
  //   })
  // );

  const links = [];
  for (const file of files) {
    const ext = file.name.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    const Body = await file.arrayBuffer();
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: Body,
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    console.log("links", link);
    links.push(link);
  }
  return NextResponse.json({ msg: "success", data: links });
  // } catch (error) {
  //   return NextResponse.json({ msg: "error", data: [], error: error });
  // }
};
