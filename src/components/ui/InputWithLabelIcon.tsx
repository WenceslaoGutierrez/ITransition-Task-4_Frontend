import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Label } from './label';

export interface InputWithLabelIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  onIconClick?: () => void;
}

const InputWithLabelIcon = React.forwardRef<HTMLInputElement, InputWithLabelIconProps>(
  ({ className, type, label, icon, id, containerClassName, onIconClick, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className={cn('relative', containerClassName)}>
        <Input type={type} id={inputId} className={cn('peer h-12 pt-3', className, icon ? 'pr-10' : '')} placeholder=" " ref={ref} {...props} />
        <Label
          htmlFor={inputId}
          className={cn(
            'font-normal absolute left-3 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-xs'
          )}
        >
          {label}
        </Label>
        {icon && (
          <div
            className={cn('absolute right-3 top-1/2 -translate-y-1/2 transform', onIconClick ? 'cursor-pointer' : 'pointer-events-none')}
            onClick={onIconClick}
            role={onIconClick ? 'button' : undefined}
            aria-label={onIconClick ? 'Toggle icon action' : undefined}
          >
            {icon}
          </div>
        )}
      </div>
    );
  }
);

export { InputWithLabelIcon };
