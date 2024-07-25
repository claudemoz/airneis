/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import BannerCategory from "./components/BannerCategory";
import CardCategory from "./components/CardCategory";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import { fetchCategories } from "@/redux/slices/categories";
import styles from "./HomePage.module.css";
import { toast } from "sonner";

export default function HomePage() {
  const { categories, isLoading, error } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  if (error) {
    toast.error(`${error}`);
  }

  return (
    <>
      {!isLoading && Array.isArray(categories) && categories.length > 0 ? (
        <>
          <BannerCategory />
          <h3 className={`${styles.title} text-center`}>
            VENANT DES HAUTES TERRES D'ECOSSE <br /> NOS MEUBLES SONT IMMORTELES
          </h3>
          <div className={styles.grid}>
            {categories?.map((item) => (
            <CardCategory key={item._id} category={item} />
               //et transmettre ic categories de la vers la page BannerProduct? onclickc arte 
            ))}
          </div>
        </>
      ) : (
        <PuffLoader
          color="#000"
          loading={isLoading}
          cssOverride={{
            display: "flex",
            margin: "15% auto 0  auto",
            borderColor: "#000",
          }}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </>
  );
}
