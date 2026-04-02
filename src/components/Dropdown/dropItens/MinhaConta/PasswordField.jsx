// components/MinhaConta/PasswordField.jsx
import { useState } from 'react';

const PasswordField = ({ 
  label, 
  value, 
  onChange, 
  disabled, 
  placeholder,
  id 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrapper">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={disabled ? "editing-mode" : ""}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
        >
          <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
        </button>
      </div>
    </div>
  );
};

export default PasswordField;