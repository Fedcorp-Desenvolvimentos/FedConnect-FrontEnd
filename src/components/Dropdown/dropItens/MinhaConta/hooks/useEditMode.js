// hooks/useEditMode.js
import { useState, useCallback } from 'react';

export const useEditMode = (initialData, saveFunction, resetFunction) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(initialData);
  const [originalData, setOriginalData] = useState(initialData);

  const startEditing = useCallback(() => {
    setOriginalData({ ...initialData });
    setEditedData({ ...initialData });
    setIsEditing(true);
  }, [initialData]);

  const cancelEditing = useCallback(() => {
    setEditedData({ ...originalData });
    setIsEditing(false);
    if (resetFunction) resetFunction(originalData);
  }, [originalData, resetFunction]);

  const saveEditing = useCallback(async () => {
    const success = await saveFunction(editedData);
    if (success) {
      setIsEditing(false);
    }
    return success;
  }, [editedData, saveFunction]);

  const updateField = useCallback((field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    isEditing,
    editedData,
    startEditing,
    cancelEditing,
    saveEditing,
    updateField
  };
};