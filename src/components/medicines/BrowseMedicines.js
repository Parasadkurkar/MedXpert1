import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext'; 

const BrowseMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
   const { addToCart } = useCart();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await api.get('/medicines');
        setMedicines(res.data);
      } catch (err) {
        console.error('Failed to load medicines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Filter medicines based on search and category
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === 'all' || medicine.category === category;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading medicine catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">Browse Medicines</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Search Medicines</label>
            <input
              type="text"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="pain-relief">Pain Relief</option>
              <option value="antibiotics">Antibiotics</option>
              <option value="allergy">Allergy</option>
              <option value="diabetes">Diabetes</option>
              <option value="heart">Heart Health</option>
              <option value="vitamins">Vitamins & Supplements</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">&nbsp;</label>
            <button 
              onClick={() => {
                setSearchTerm('');
                setCategory('all');
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-xl">No medicines found matching your criteria</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setCategory('all');
              }}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              View All Medicines
            </button>
          </div>
        ) : (
          filteredMedicines.map(medicine => (
            <div key={medicine._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                {medicine.image ? (
                  <img 
                    src={medicine.image} 
                    alt={medicine.name}
                    className="object-contain h-full w-full"
                  />
                ) : (
                  <div className="text-4xl">💊</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{medicine.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{medicine.manufacturer}</p>
                <p className="text-gray-700 mb-3 line-clamp-2">{medicine.description}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold">₹{medicine.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart({
                        id: medicine._id,
                        name: medicine.name,
                        price: medicine.price,
                        image: medicine.image
                      })}
                      className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseMedicines;