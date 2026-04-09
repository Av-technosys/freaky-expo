import React from 'react';
import { Text, Platform, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none overflow-hidden',
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: 'shadow-sm shadow-black/5',
        destructive: 'bg-destructive active:bg-destructive/90 dark:bg-destructive/60 shadow-sm shadow-black/5',
        outline: 'border border-border bg-background shadow-sm shadow-black/5',
        secondary: 'bg-secondary shadow-sm shadow-black/5',
        ghost: '',
        link: '',
      },
      size: {
        default: 'h-10 px-4 py-2 sm:h-9',
        sm: 'h-9 gap-1.5 rounded-md px-3 sm:h-8',
        lg: 'h-11 rounded-md px-6 sm:h-10',
        icon: 'h-10 w-10 sm:h-9 sm:w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
const buttonTextVariants = cva(
  cn('font-medium', Platform.select({ web: 'pointer-events-none transition-colors' })),
  {
    variants: {
      variant: {
        default: 'text-white',
        destructive: 'text-white',
        outline: 'text-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-foreground',
        link: 'text-primary underline',
      },
      size: {
        default: 'text-base',   // bigger than text-sm
        sm: 'text-sm',
        lg: 'text-lg',          // larger text for big buttons
        icon: 'text-xl',        // icon-only buttons can be larger
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);


type ButtonProps = React.ComponentProps<typeof Pressable> & VariantProps<typeof buttonVariants> & {
  children?: React.ReactNode;
};

function Button({ className, variant, size, children, ...props }: ButtonProps) {
  const gradientColors = ['#FACC15', '#F97316'] as const;

  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        className={cn(buttonVariants({ variant, size }), className)}
      >
        <Pressable
          className={cn(props.disabled && 'opacity-50', 'flex-1 items-center justify-center')}
          role="button"
          {...props}
        >
          {typeof children === 'string' ? (
            <Text className={buttonTextVariants({ variant, size })}>{children}</Text>
          ) : (
            children
          )}
        </Pressable>
      </LinearGradient>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
