"use client";
import { fetchCats, updateProduct } from "@/app/lib/actions";
import LoadingOverlay from "react-loading-overlay-ts";
import styles from "@/app/ui/dashboard/products/products.module.css";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useFormState } from "react-dom";
import { fetchSingleProduct } from "@/app/lib/data";

const SingleProductPage = ({ params }) => {
  const { id } = params;
  const [isActive, setActive] = useState(false);
  const [category, setCat] = useState([]);
  const [selctedColors, setSelectedColors] = useState("");
  const [selctedCatName, setSelectedCatName] = useState("");

  const [selctedSizes, setSelectedSize] = useState("");
  const [errors, setErrors] = useState([]);
  const [product, setProduct] = useState({
    title: "",
    images: [],
    price: 0,
    description: "",
    category: "",
    stock: 0,
    discountedPrice: 0,
    ribbon: "",
    properties: {},
    collections:''
  });
  const [state, formAction] = useFormState(updateProduct, { errors: [] });
  console.log("product", JSON.stringify(product.properties));

  const inputFile = useRef(null);
  useEffect(() => {
    if (state?.errors) {
      setErrors(state?.errors);
    }
  }, [state]);

  const fetchProductData = async () => {
    const product = await fetchSingleProduct(id);
    console.log("productfromServer", product);
    const category = await fetchCats();
    const selectedCat = category?.cats?.find(
      (item) => item?._id === product?.category
    );
    setProduct({ ...product });
    setSelectedCatName(selectedCat?.name);
    setCat(category?.cats);
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (product?.category) {
      const selectedCat = category?.find(
        (item) => item?._id === product?.category
      );
      console.log("selectedCat", selectedCat);
      setSelectedCatName(selectedCat?.name);
    }
  }, [product?.category]);

  async function uploadImages(ev) {
    setActive(true);
    const files = ev.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      try {
        const res = await axios.post("/api/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const newData = res.data?.data || [];
        const productImage = product?.images || [];
        const allImages = [...productImage, ...newData];
        setActive(false);
        setProduct({ ...product, images: allImages });
      } catch (error) {
        setActive(false);
        console.log("ERERORRR", error, files);
      }
      setActive(false);
    }
  }

  const onButtonClick = (e) => {
    e.stopPropagation();
    inputFile.current.click();
  };

  const onRemoveColor = (e, index) => {
    e.stopPropagation();
    let prop = { ...product.properties };
    let arr = prop["color"]?.split(",");
    arr.splice(index, 1);
    console.log("props", prop);
    prop["color"] = arr.join(",");
    setProduct({ ...product, properties: prop });
  };
  const onClickAddColor = (e) => {
    e.stopPropagation();
    let obj = { ...product.properties };
    if (obj["color"]) {
      let temp = obj["color"];
      let result = temp.concat(",", selctedColors);
      obj["color"] = result;
    } else {
      obj["color"] = selctedColors;
    }
    setSelectedColors("");
    setProduct({ ...product, properties: obj });
  };
  const onRemoveSize = (e, index) => {
    e.stopPropagation();
    let prop = { ...product.properties };
    let arr = prop["size"]?.split(",");
    arr.splice(index, 1);
    console.log("props", prop);
    prop["size"] = arr.join(",");
    setProduct({ ...product, properties: prop });
  };
  const onClickAddSize = (e) => {
    e.stopPropagation();
    let obj = { ...product.properties };
    if (obj["size"]) {
      let temp = obj["size"];
      let result = temp.concat(",", selctedSizes);
      obj["size"] = result;
    } else {
      obj["size"] = selctedSizes;
    }
    setSelectedSize("");
    setProduct({ ...product, properties: obj });
  };
  console.log("Product", product);
  return (
    <LoadingOverlay
      active={isActive}
      spinner
      styles={{
        overlay: (base) => ({
          ...base,
          background: "rgba(0, 0,0, 0.3)",
        }),
      }}
    >
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <form className={styles.form} action={formAction}>
            <input type="hidden" name="id" value={product._id} />
            <input type="hidden" name="collections" value={product.collections} />
            <div className={styles.infoContainer}>
              {product?.images?.length > 0 &&
                product?.images?.map((image, index) => (
                  <div className={styles.imgContainer} key={index}>
                    <Image src={image || "/noavatar.png"} alt="" fill />
                  </div>
                ))}

              <div onClick={onButtonClick} className={styles.addphoto}>
                {isActive ? (
                  <Image
                    src={"/spinner.gif"}
                    width={50}
                    alt="loading"
                    height={50}
                  />
                ) : (
                  <p>ADD PHOTO</p>
                )}
                <input
                  type="file"
                  onChange={uploadImages}
                  ref={inputFile}
                  className={styles.hidden}
                  name="images-hidden"
                />
              </div>
              <div className={styles.errorMsg}>
                <p style={{ color: "red", fontSize: 10 }}>
                  {errors.find((error) => error?.path[0] === "images")?.message}
                </p>
              </div>
              <input type="hidden" name="images" value={product.images} />
            </div>

            <label>Title</label>
            <p style={{ color: "red", fontSize: 10 }}>
              {errors.find((error) => error?.path[0] === "title")?.message}
            </p>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              // required
            />

            <label>Cost Price</label>
            <p style={{ color: "red", fontSize: 10 }}>
              {errors.find((error) => error?.path[0] === "price")?.message}
            </p>
            <input
              type="text"
              name="price"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              // required
            />
            <label>Discounted Price</label>
            <p style={{ color: "red", fontSize: 10 }}>
              {
                errors.find((error) => error?.path[0] === "discountedPrice")
                  ?.message
              }
            </p>
            <input
              type="text"
              name="discountedPrice"
              value={product.discountedPrice}
              onChange={(e) =>
                setProduct({ ...product, discountedPrice: e.target.value })
              }
              // required
            />
            <label>Stock</label>
            <p style={{ color: "red", fontSize: 10 }}>
              {errors.find((error) => error?.path[0] === "stock")?.message}
            </p>
            <input
              type="text"
              name="stock"
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: e.target.value })
              }
            />
            <label>Category</label>
            <p style={{ color: "red", fontSize: 10 }}>
              {errors.find((error) => error?.path[0] === "category")?.message}
            </p>
            <select
              name="category"
              id="category"
              defaultValue=""
              onChange={(e) => {
                const selectedCat = category?.find(
                  (item) => item?._id === e.target.value
                );
                setProduct({
                  ...product,
                  category: e.target.value,
                  collections: selectedCat?.name,
                });
              }}
            >
              <option value={product?.category}>{selctedCatName}</option>
              {category
                ?.filter((fi) => fi?._id != product?.category)
                .map((item) => (
                  <option key={item._id} value={item._id}>
                    {item?.name}
                  </option>
                ))}
            </select>
            <label>Ribon</label>
            <input
              type="text"
              name="ribbon"
              value={product?.ribbon}
              placeholder={"On Sale,New Arrival"}
              onChange={(e) =>
                setProduct({ ...product, ribbon: e.target.value })
              }
            />

            <label>Add Property </label>
            <input
              type="hidden"
              name="properties"
              value={JSON.stringify(product.properties)}
            />
            <div className={styles.propertiesContainer}>
              <input
                type="text"
                name="color"
                placeholder="Enter Color"
                value={selctedColors}
                onChange={(e) => {
                  setSelectedColors(e.target.value);
                }}
              />
              <button
                disabled={selctedColors.length < 1}
                onClick={(e) => {
                  onClickAddColor(e);
                }}
                style={{
                  backgroundColor: selctedColors ? "#182237" : "gray",
                }}
                className={styles.propBox}
              >
                {"+"}
              </button>
              {product?.properties &&
                product.properties["color"] &&
                product.properties["color"]?.split(",").map((item, index) => (
                  <div key={item} className={styles.selectedItem}>
                    <p>{item}</p>
                    <div
                      className={styles.closeIcon}
                      onClick={(e) => {
                        onRemoveColor(e, index);
                      }}
                    >
                      <MdClose />
                    </div>
                  </div>
                ))}
            </div>
            <div className={styles.propertiesContainer}>
              <input
                type="text"
                name="size"
                placeholder="Enter Size"
                value={selctedSizes}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                }}
              />
              <button
                disabled={selctedSizes.length < 1}
                onClick={(e) => {
                  onClickAddSize(e);
                }}
                style={{
                  backgroundColor: selctedSizes ? "#182237" : "gray",
                }}
                className={styles.propBox}
              >
                {"+"}
              </button>
              {product?.properties &&
                product.properties["size"] &&
                product.properties["size"]?.split(",").map((item, index) => (
                  <div key={item} className={styles.selectedItem}>
                    <p>{item}</p>
                    <div
                      className={styles.closeIcon}
                      onClick={(e) => {
                        onRemoveSize(e, index);
                      }}
                    >
                      <MdClose />
                    </div>
                  </div>
                ))}
            </div>
            <label>Description</label>
            <p style={{ color: "red", fontSize: 10 }}>
              {
                errors.find((error) => error?.path[0] === "description")
                  ?.message
              }
            </p>
            <textarea
              name="description"
              id="desc"
              rows="10"
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              value={product.description}
            ></textarea>
            <button>UPDATE</button>
          </form>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default SingleProductPage;
