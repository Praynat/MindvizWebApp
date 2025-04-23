import Joi from "joi";
import { useState, useCallback, useMemo } from "react";
import { useSnack } from "../../Providers/Utils/SnackbarProvider";

export default function useForm(initialForm, schema, handleSubmit) {
  const [data, setData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const setSnack = useSnack(); 


  const validateProperty = useCallback((name, value) => {
    const obj = { [name]: value };
    const fieldSchema = Joi.object({ [name]: schema[name] });
    const { error } = fieldSchema.validate(obj);
    return error ? error.details[0].message : null;
  }, [schema]);

  const handleChange = useCallback((event) => {
    const name = event.target.name;
    const value = event.target.value;
    const errorMessage = validateProperty(name, value);
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    } else {
      setErrors((prev) => {
        let obj = { ...prev };
        delete obj[name];
        return obj;
      });
    }

    setData((prev) => ({ ...prev, [name]: value }));
  }, [validateProperty]);

  const handleCheckboxChange = useCallback(
    (event) => {
      const name = event.target.name;
      const value = event.target.checked;
      const errorMessage = validateProperty(name, value);
      if (errorMessage) {
        setErrors((prev) => ({ ...prev, [name]: errorMessage }));
      } else {
        setErrors((prev) => {
          let obj = { ...prev };
          delete obj[name];
          return obj;
        });
      }
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [validateProperty]
  );
  const handleReset = useCallback(() => {
    setData(initialForm);
    setErrors({});
  }, [initialForm]);

 const validateForm = useCallback(() => {
    const schemaForValidate = Joi.object(schema);
    const filteredData = Object.keys(data).reduce((acc, key) => {
      // Ensure schema is defined before checking hasOwnProperty
      if (schema && schema.hasOwnProperty(key)) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    const { error } = schemaForValidate.validate(filteredData, { abortEarly: false });
    if (error) {
      // Log the specific validation errors
      console.error("Joi Validation Error Details:", error.details);
      return false;
    }
    return true;
  }, [data, schema]);

  const onSubmit = useCallback((e) => {
    e.preventDefault(); 
    if (validateForm()) {
      handleSubmit(data);
    } else {
      setSnack("error", "Form validation failed");
    }
  }, [data, handleSubmit, setSnack, validateForm]);

  const onContactSubmit = useCallback(() => {
    setTimeout(() => {
      setSnack("success","Message Sent");        
    }, 500);    
  }, [setSnack]);

  return useMemo(() => ({
    data,
    errors,
    setData,
    handleChange,
    handleCheckboxChange,
    handleReset,
    onSubmit,
    validateForm,
    onContactSubmit
  }), [data, errors, handleChange,handleCheckboxChange, handleReset, onSubmit, validateForm,onContactSubmit]);
}