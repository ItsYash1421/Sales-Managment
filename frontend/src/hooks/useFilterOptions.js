import { useState, useEffect } from 'react';
import { fetchFilterOptions } from '../services/api';

export const useFilterOptions = () => {
  const [options, setOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await fetchFilterOptions();
        setOptions(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading filter options:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  return { options, loading, error };
};
