import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
//* o useMemo é muito utilizado para evitar re-renders desnecessarios e calculos desnecessarios
//? ele guarda o "calculo" das funções que ele recebe, caso os componentes não alterem, ele ira reutilizar os valores ja passados
//? muito util em diversos casos que exigem comunicação com banco de dados com frequencia
//? porem vale ressalta que isso pode causar um aumento de memória
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductRowProps {
  product: Product;
}

//? sei que deveria usar o useMemo, porem como preciso salvar o objeot completo para reutilizar, acho melhor usar o memo em cada linha
const ProductRow = memo(({ product }: ProductRowProps) => (
  <tr>
    <td>{product.id}</td>
    <td>{product.name}</td>
    <td>{product.description}</td>
    <td>${parseFloat(product.price).toFixed(2)}</td>
    <td>{product.isActive ? 'Active' : 'Inactive'}</td>
    <td>{new Date(product.createdAt).toLocaleDateString()}</td>
  </tr>
));

ProductRow.displayName = 'ProductRow';

export function ProductListV2() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Error loading products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const PaginationControls = (
    <div className="pagination">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Products List</h1>
        <button className="nav-button" onClick={() => navigate('/')}>
          Create New Product
        </button>
        <button className="nav-button" onClick={() => navigate('/products/')}>
          list products
        </button>
      </div>

      {error && <div className="message error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      {PaginationControls}
    </div>
  );
}
