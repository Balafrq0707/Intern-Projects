import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from './products';
import '../App.css'

const CategoryPage = () => {
  const { category } = useParams();

  return (
    <>
        <ProductList category={category} />
    </>
  );
};

export default CategoryPage;
