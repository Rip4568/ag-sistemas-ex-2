import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'

interface FormData {
  name: string;
  price: string;
  description: string;
}

interface FormData {
  name: string;
  price: string;
  description: string;
}

export function ProductForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    description: ''
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setMessage({ text: 'Name is required', type: 'error' });
      return false;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      setMessage({ text: 'Price must be a positive number', type: 'error' });
      return false;
    }
    if (!formData.description.trim()) {
      setMessage({ text: 'Description is required', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price)
      });

      setMessage({ text: 'Product successfully registered!', type: 'success' });
      setFormData({ name: '', price: '', description: '' });
      
      // Redirect to products list after successful creation
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.log(error);
      setMessage({ text: 'Error registering product. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Product Registration</h1>
        <button className="nav-button" onClick={() => navigate('/products')}>
          View All Products
        </button>
      </div>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Register Product</button>
      </form>
    </div>
  );
}