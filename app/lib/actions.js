"use server";

import { revalidatePath } from "next/cache";
import { Admin, Category, Hero, Order, Product, Review, User } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import { signIn } from "../auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "next-auth";
const productSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
  price: z.string().min(1, { message: "price is required" }),
  stock: z.string().min(1, { message: "stock is required" }),
  images: z.array(z.string()).min(1, { message: "image is required" }),
  description: z.string().min(1, { message: "description is required" }),
  category: z.string().min(1, { message: "category is required" }),
  discountedPrice: z.string().min(1, { message: "discounted price is required" }),
});
const catSchema = z.object({
  name: z.string().min(1, { message: "title is required" }),
  image: z.string().min(1, { message: "image is required" }),
});
const bannerSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
  image: z.string().min(1, { message: "image is required" }),
  url: z.string().min(1, { message: "url is required" }),
  subtitle: z.string().min(1, { message: "subtitle is required" }),
});
const loginSchema = z.object({
  email: z.string().min(1, { message: "email is required" }),
  password: z.string().min(1, { message: "password is required" }),
});
//USER*******************************
export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 2;
  try {
    await connectToDB();
    const count = await User.find({ mobile: { $regex: regex } }).count();
    const users = await User.find({ mobile: { $regex: regex } })
      .lean()
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchUser = async (id) => {
  console.log(id);
  try {
    connectToDB();
    const user = await User.findOne({ _id: id });
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};
export const addUser = async (formData) => {
  const { name, email, isAdmin } = Object.fromEntries(formData);

  try {
    connectToDB();
    const newUser = new Admin({
      name,
      email,
      isAdmin,
    });

    await newUser.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const updateUser = async (formData) => {
  const { _id, username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();
    const updateFields = {
      username,
      email,
      password,
      phone,
      address,
      isAdmin,
      isActive,
    };

    Object.keys(updateFields).forEach(
      (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
    );
    await User.findByIdAndUpdate(_id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update user!");
  }
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};
export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user!");
  }

  revalidatePath("/dashboard/products");
  NextResponse.redirect("/dashboard/products");
};

//PRODUCT ***************************
export const fetchProducts = async (q, page) => {
  console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 10;

  try {
    connectToDB();
    const count = await Product.find({ title: { $regex: regex } }).count();
    const products = await Product.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))
      .lean();
    return { count, products };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch products!");
  }
};

export const addProduct = async (prevState, formData) => {
  const formDataImage = formData.get("images");
  const images = (formDataImage && formDataImage?.split(",")) || [];
  const title = formData.get("title");
  const price = formData.get("price");
  const ribbon = formData.get("ribbon");
  const stock = formData.get("stock");
  const category = formData.get("category");
  const discountedPrice = formData.get("discountedPrice");
  const description = formData.get("description");
  const prop = formData.get("properties");
  const collections = formData.get("collections");

  const properties = JSON.parse(prop);
  try {
    const validation = productSchema.safeParse({
      images: images,
      title: title,
      price: price,
      stock: stock,
      category: category,
      discountedPrice: discountedPrice,
      description: description,
    });
    console.log("validation", validation);
    if (validation.success) {
      await connectToDB();
      const newProduct = new Product({
        title,
        description,
        price,
        stock,
        images,
        category,
        ribbon,
        discountedPrice,
        properties,
        collections,
      });
      await newProduct.save();
    } else {
      return {
        errors: validation.error.issues,
      };
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create product!");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const updateProduct = async (prevState, formData) => {
  const formDataImage = formData.get("images");
  const images = (formDataImage && formDataImage?.split(",")) || [];
  const title = formData.get("title");
  const price = formData.get("price");
  const ribbon = formData.get("ribbon");
  const stock = formData.get("stock");
  const category = formData.get("category");
  const discountedPrice = formData.get("discountedPrice");
  const description = formData.get("description");
  const prop = formData.get("properties");
  const _id = formData.get("id");
  const collections = formData.get("collections");
  console.log("Formmm", collections);
  const properties = JSON.parse(prop);
  try {
    connectToDB();
    const updateFields = {
      title,
      price,
      stock,
      images,
      description,
      category,
      ribbon,
      discountedPrice,
      properties,
      collections,
    };
    // Object.keys(updateFields).forEach(
    //   (key) =>
    //     (updateFields[key] === "" || undefined) && delete updateFields[key]
    // );
    await Product.updateOne({ _id }, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update product!");
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const deleteProduct = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Product.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete product!");
  }
  revalidatePath("/dashboard/products");
};

export const authenticate = async (prevState, formData) => {
  const { email, password } = Object.fromEntries(formData);

  try {
    const validation = loginSchema.safeParse({
      email: email,
      password: password,
    });
    if (validation?.success) {
      await signIn("credentials", { email, password });
      redirect("/dashboard");
    } else {
      return {
        errors: validation.error.issues,
      };
    }
  } catch (error) {
    console.log("ERRRRRRORRRRRRRRR", error);
    if (error instanceof AuthError) {
      switch (error.cause?.err?.code) {
        case "credentials":
          return "Invalid credentials";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
};

//CATEGORY ACTIONS*************
export const fetchCats = async () => {
  try {
    await connectToDB();
    const cats = await Category.find().lean();
    return { cats };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchCatBYid = async (id) => {
  try {
    await connectToDB();
    const catDetails = await Category.findOne({ _id: id });
    return { category: catDetails };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};
export const updateCats = async (prevState, formData) => {
  console.log("formdata", formData);
  const image = formData.get("image");
  const name = formData.get("name");
  const _id = formData.get("id");
  try {
    const validation = catSchema.safeParse({
      image: image,
      name: name,
    });
    console.log("validation", validation);
    if (validation.success) {
      const updateFields = {
        name,
        image,
      };

      Object.keys(updateFields).forEach(
        (key) => (updateFields[key] === "" || undefined) && delete updateFields[key]
      );
      await Category.updateOne({ _id }, updateFields);
    } else {
      return {
        errors: validation.error.issues,
      };
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create product!");
  }

  revalidatePath("/dashboard/category");
  redirect("/dashboard/category");
};

export const addCats = async (prevState, formData) => {
  const image = formData.get("image");
  const name = formData.get("name");
  try {
    const validation = catSchema.safeParse({
      image: image,
      name: name,
    });
    if (validation.success) {
      const addCat = new Category({
        name,
        image,
      });

      await addCat.save();
    } else {
      return {
        errors: validation.error.issues,
      };
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create product!");
  }

  revalidatePath("/dashboard/category");
  redirect("/dashboard/category");
};
export const deleteCat = async (formData) => {
  const { _id } = Object.fromEntries(formData);
  try {
    connectToDB();
    await Category.findByIdAndDelete({ _id: _id });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete cat");
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/category");
};

//BANNERS ACTIONS*************
export const fetchBanners = async () => {
  try {
    await connectToDB();
    const banners = await Hero.find().lean();
    return { banners };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch BANNERS!");
  }
};

export const fetchBannerById = async (id) => {
  try {
    await connectToDB();
    const bannersDetails = await Hero.findOne({ _id: id });
    return { banners: bannersDetails };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch bannersDetails!");
  }
};
export const updateBanner = async (prevState, formData) => {
  const image = formData.get("image");
  const title = formData.get("title");
  const url = formData.get("url");
  const subtitle = formData.get("subtitle");

  const _id = formData.get("id");

  try {
    const validation = bannerSchema.safeParse({
      image: image,
      url: url,
      title: title,
      subtitle: subtitle,
    });
    if (validation.success) {
      connectToDB();
      const updateFields = {
        title,
        image,
        url,
        subtitle,
      };
      console.log("updateFields", updateFields);

      // Object.keys(updateFields).forEach(
      //   (key) =>
      //     (updateFields[key] === "" || undefined) && delete updateFields[key]
      // );

      await Hero.updateOne({ _id }, updateFields);
    } else {
      return {
        errors: validation.error.issues,
      };
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update banners!");
  }
  revalidatePath("/dashboard/banners");
  redirect("/dashboard/banners");
};
export const addBanner = async (prevState, formData) => {
  const image = formData.get("image");
  const title = formData.get("title");
  const url = formData.get("url");
  const subtitle = formData.get("subtitle");

  try {
    const validation = bannerSchema.safeParse({
      image: image,
      url: url,
      title: title,
      subtitle: subtitle,
    });
    if (validation.success) {
      connectToDB();
      const addFields = {
        title,
        image,
        url,
        subtitle,
      };
      console.log("ADDFIELD", addFields);
      const addBanner = new Hero({
        title,
        image,
        url,
        subtitle,
      });
      await addBanner.save();
    } else {
      return {
        errors: validation.error.issues,
      };
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed to add banners!");
  }
  revalidatePath("/dashboard/banners");
  redirect("/dashboard/banners");
};

export const deleteBanner = async (formData) => {
  const { _id } = Object.fromEntries(formData);
  try {
    connectToDB();
    await Hero.findByIdAndDelete({ _id: _id });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete hero");
  }
  revalidatePath("/dashboard/banners");
  redirect("/dashboard/banners");
};

export const getDashboadCount = async () => {
  try {
    connectToDB();
    const ProductCount = await Product.find().count();
    const orderCount = await Order.find().count();
    const userCount = await User.find().count();
    return { ProductCount, orderCount, userCount };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to getDashboadCount!");
  }
};

export const addReview = async (formData) => {
  const { name, rating, review, productId } = Object.fromEntries(formData);
  console.log("fordataaaaaa", formData);
  try {
    connectToDB();
    const newReview = new Review({
      name,
      productId,
      rating,
      review,
    });

    await newReview.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create Review!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const getAllReview = async (productId) => {
  try {
    await connectToDB();
    const reviews = await Review.find({ productId }).lean();
    if (reviews) {
      return reviews?.length;
    }
    console.log("reviews", reviews);
    return 0;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch reviews!");
  }
};
