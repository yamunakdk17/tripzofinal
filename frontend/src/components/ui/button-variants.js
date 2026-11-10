import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0193e8] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#012438] text-white hover:bg-[#020522]',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-[#d9d9d9] bg-white text-[#020522] hover:bg-[#f5f5f5]',
        secondary: 'bg-[#c8deea] text-[#020522] hover:bg-[#b8d2e0]',
        ghost: 'text-[#020522] hover:bg-[#f5f5f5]',
        link: 'text-[#0193e8] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
