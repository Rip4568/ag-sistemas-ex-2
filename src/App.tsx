import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import api from './api/axios'
import './App.css'
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';

interface FormData {
  name: string;
  price: string;
  description: string;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductForm />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App