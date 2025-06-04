import React, { useState } from 'react';
import { InputWithLabelIcon, type InputWithLabelIconProps } from './InputWithLabelIcon';
import { Eye, EyeClosed } from 'lucide-react';

export interface PasswordInputProps extends Omit<InputWithLabelIconProps, 'type' | 'icon' | 'onIconClick'> {
  initialIconClassName?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ initialIconClassName = 'h-5 w-5 text-muted-foreground', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const icon = showPassword ? <EyeClosed className={initialIconClassName} /> : <Eye className={initialIconClassName} />;

  return (
    <InputWithLabelIcon
      {...props}
      type={showPassword ? 'text' : 'password'}
      icon={icon}
      onIconClick={togglePasswordVisibility}
      aria-label={props['aria-label'] || props.label || 'Password'}
    />
  );
};

export { PasswordInput };
