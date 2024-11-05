import { useState, useCallback } from 'react';

// Custom hook for managing form data
function useAIFormData(initialData?: Record<string, any>) {
  const [formData, setFormData] = useState(initialData);

  // Function to update form data
  const updateFormData = useCallback((newData: Record<string, any>) => {
    setFormData(prevFormData => ({ ...prevFormData, ...newData }));
  }, []);

  return { formData, updateFormData };
}

export default useAIFormData;
