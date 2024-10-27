"use client";
import { fetchBannerById, updateBanner } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/banners/banners.module.css";
import axios from "axios";
import Image from "next/image";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";

const SingleBannerPage = ({ params }) => {
  const [banners, setBanners] = useState({
    title: "",
    image: "",
    url: "",
     subtitle:""
  });
  const [state, formAction] = useFormState(updateBanner, { errors: [] });
  const [errors, setErrors] = useState([]);
  const { id } = params;
  const inputFile = useRef(null);

  useEffect(() => {
    if (state?.errors) {
      setErrors(state?.errors);
    }
  }, [state]);

  const fetchBanerData = async () => {
    const { banners } = await fetchBannerById(id);
    setBanners(banners);
  };

  useEffect(() => {
    fetchBanerData();
  }, []);
  async function uploadImages(ev) {
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
        console.log("RESPONSE", res);
        const newData = res.data?.data[0] || [];
        setBanners({ ...banners, image: newData });
      } catch (error) {
        console.log("ERERORRR", error, files);
      }
    }
  }

  const onButtonClick = (e) => {
    e.stopPropagation();
    inputFile.current.click();
  };

  console.log(banners);
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form className={styles.form} action={formAction}>
          <div className={styles.infoContainer}>
            <div onClick={onButtonClick} className={styles.imgContainer}>
              <Image src={banners.image || "/noavatar.png"} alt="" fill />
            </div>
            <div className={styles.errorMsg}>
              <p style={{ color: "red", fontSize: 10 }}>
                {errors.find((error) => error?.path[0] === "image")?.message}
              </p>
            </div>
            {"ADD/EDIT IMAGE HERE"}
          </div>
          <input
            type="file"
            onChange={uploadImages}
            ref={inputFile}
            className={styles.hidden}
            name="images"
          />
          <input type="hidden" name="image" value={banners.image} />
          <input type="hidden" name="id" value={id} />
          <label>Title</label>
          <div className={styles.errorMsg}>
            <p style={{ color: "red", fontSize: 10 }}>
              {errors.find((error) => error?.path[0] === "title")?.message}
            </p>
          </div>
          <input
            type="text"
            name="title"
            placeholder={"Enter Title"}
            value={banners?.title}
            onChange={(e) =>
              setBanners({ ...banners, title: e?.target?.value })
            }
          />
            <label>SubTitle</label>
          <div className={styles.errorMsg}>
            <p style={{ color: "red", fontSize: 10 }}>
              {errors.find((error) => error?.path[0] === "subtitle")?.message}
            </p>
          </div>
          <input
            type="text"
            name="subtitle"
            placeholder={"Enter subtitle"}
            value={banners?.subtitle}
            onChange={(e) =>
              setBanners({ ...banners, subtitle: e?.target?.value })
            }
          />
          <label>Url</label>
          <div className={styles.errorMsg}>
            <p style={{ color: "red", fontSize: 10 }}>
              {errors.find((error) => error?.path[0] === "url")?.message}
            </p>
          </div>
          <input
            type="text"
            name="url"
            placeholder={"Enter URL"}
            value={banners?.url}
            onChange={(e) => setBanners({ ...banners, url: e?.target?.value })}
          />
          <button>UPDATE</button>
        </form>
      </div>
    </div>
  );
};

export default SingleBannerPage;
