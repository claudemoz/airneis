/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
import { fetchProducts } from '@/redux/slices/products';
import styles from "./SearchProductPage.module.css";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import PuffLoader from "react-spinners/PuffLoader";
import CardProduct from "@/components/Shared/CardProduct";
import { fetchMaterials } from '@/redux/slices/materials';

export default function SearchProductPage() {
  const { products, isLoading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { materials } = useSelector((state) => state.materials);
  const [searchParams] = useSearchParams();
  const initFilters = {
    searchKey: searchParams.get('k'),
    categories: [],
    materials:[],
    price:{min: 0, max: 10000}
  };
  const [filters, setFilters ] = useState(initFilters);
  const [previousFilters, setPreviousFilters] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMaterials())
  }, []);

  //J'écoute les changements du filtre s'il change ou pas'
  useEffect(() => {
    const newFilters = {...filters, searchKey: searchParams.get('k')};
    setFilters(newFilters);
  }, [searchParams]);

  // Mise à jour et concevation de filtre
  useEffect(() => {
    // Je vérifie si le filtre a changé
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(previousFilters);
    if (filtersChanged) {
      dispatch(fetchProducts(filters));
      // je met à jour le filtre précédent pour relancer le call api
      setPreviousFilters(filters);
    }
  }, [filters, dispatch, previousFilters]);

  const handleFilter = (e) => {
    const { name, value } = e.target;
    const price = value.split(',')
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: {min:Number(price[0]), max:Number(price[1])},
    }));
  };

  const handleFilterCategory = (e) => {
    const { value, checked } = e.target;
    setFilters((prevFilters) => {
      const newCategories = checked
        ? [...prevFilters.categories, value]
        : prevFilters.categories?.filter((category) => category !== value);
      return { ...prevFilters, categories: newCategories };
    });
  };
  
  const handleFilterMaterial = (e) => {
    const { value, checked } = e.target;
    setFilters((prevFilters) => {
      const newMaterials = checked
        ? [...prevFilters.materials, value]
        : prevFilters.materials?.filter((material) => material !== value);
      return { ...prevFilters, materials: newMaterials };
    });
  };

  // console.log("filters ", filters);
  return (
    <div className='d-flex flex-1 justify-content-between'>
    {!isLoading && products?.length > 0 
    ? (
        <div className={products?.length > 0 ? styles.grid : ''}>
          {products.map((product) => <CardProduct product={product} key={product._id}/>)}
        </div>
      ) 
    : products?.length === 0 
    ? <div className='d-flex flex-1 justify-content-center align-items-center'>
        <h4>Pas de produits disponible</h4>
      </div>
    : (
      <PuffLoader
        color="#000"
        loading={isLoading}
        cssOverride={{
          display: "flex",
          margin: "15% auto 0 auto",
          borderColor: "#000",
        }}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    )}
    <div className={styles.filtersContainer}>
      <button onClick={()=>setFilters(initFilters)} className={`btn ${styles.btnReset}`}>Réinitialiser les filtres</button>
          <h4 className='my-10'>Prix</h4>
          <section className='mb-20'>
            {
              [[0,10000],[5, 500],[500, 1000],[1000, 1500],[1500, 2000],[2000, 10000]].map(item => (
              <div className='mb-10' key={item[0]}>
                <input 
                  type="radio" 
                  name="price" 
                  value={item} id={`${item[0]}_${item[1]}`}
                  checked={filters.price.min === item[0]}
                  onChange={handleFilter}
                />
                <label 
                  htmlFor={`${item[0]}_${item[1]}`} 
                  className='ml-5'>
                    {item[0] === 0 ? 'Tous les prix' : item[0] === 2000 ? 'Plus de 2000€': `Entre ${item[0]}€ et ${item[1]}€` }
                </label>
              </div>
              ))
            }
          </section>
          <section className='mb-20'>
            <h4 className='my-10'>Categories</h4>
            {categories?.map(c => (
              <p className='mb-10' key={c._id}>
                <input 
                  type="checkbox" 
                  value={c._id} 
                  name="categories" 
                  checked={filters.categories?.includes(c._id)}
                  onChange={handleFilterCategory} 
                />
                <label htmlFor="" className='ml-5'>{c.name}</label>
              </p>
            ))}
          </section>
          <section className='mb-20'>
            <h4 className='my-10'>Materiaux</h4>
            {materials?.map(m => (
              <p className='mb-10' key={m._id}>
                <input 
                  type="checkbox" 
                  name="materials"  
                  value={m._id} 
                  checked={filters.materials?.includes(m._id)} 
                  onChange={handleFilterMaterial}
                />
                <label htmlFor="" className='ml-5'>{m.name}</label>
              </p>
            ))}
          </section>
        </div>
  </div>
)}
