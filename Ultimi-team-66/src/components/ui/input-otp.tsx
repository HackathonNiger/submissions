// "use client"

// import * as React from "react"
// import { OTPInput, OTPInputContext } from "input-otp"
// import { MinusIcon } from "lucide-react"

// import { cn } from "@/lib/utils"

// function InputOTP({
//   className,
//   containerClassName,
//   ...props
// }: React.ComponentProps<typeof OTPInput> & {
//   containerClassName?: string
// }) {
//   return (
//     <OTPInput
//       data-slot="input-otp"
//       containerClassName={cn(
//         "flex items-center gap-2 has-disabled:opacity-50",
//         containerClassName
//       )}
//       className={cn("disabled:cursor-not-allowed", className)}
//       {...props}
//     />
//   )
// }

// function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="input-otp-group"
//       className={cn("flex items-center", className)}
//       {...props}
//     />
//   )
// }

// function InputOTPSlot({
//   index,
//   className,
//   ...props
// }: React.ComponentProps<"div"> & {
//   index: number
// }) {
//   const inputOTPContext = React.useContext(OTPInputContext)
//   const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

//   return (
//     <div
//       data-slot="input-otp-slot"
//       data-active={isActive}
//       className={cn(
//         "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
//         className
//       )}
//       {...props}
//     >
//       {char}
//       {hasFakeCaret && (
//         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//           <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
//         </div>
//       )}
//     </div>
//   )
// }

// function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
//   return (
//     <div data-slot="input-otp-separator" role="separator" {...props}>
//       <MinusIcon />
//     </div>
//   )
// }

// export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Box from '@/components/ui/box'

// Wrapper around OTPInput
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn('flex items-center gap-2 has-disabled:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
}

// Group wrapper for OTP slots
function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <Box as="div" data-slot="input-otp-group" className={cn('flex items-center', className)} {...props} />
}

// Each single OTP slot
function InputOTPSlot({ index, className, ...props }: React.ComponentProps<'div'> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <Box
      as="div"
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <Box as="div" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Box as="div" className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </Box>
      )}
    </Box>
  )
}

// Optional separator between groups
function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <Box as="div" data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon className="text-gray-300" />
    </Box>
  )
}

// OTPField wrapper to handle maxLength, separators, and error states
interface OTPFieldProps {
  value: string
  onChange: (value: string) => void
  maxLength: number
  hasSeparator?: boolean
  separatorPosition?: 'middle' | 'custom'
  customSeparatorIndex?: number
  error?: boolean
  errorMessage?: string
}

export const OTPField = ({
  value,
  onChange,
  maxLength,
  hasSeparator = false,
  separatorPosition = 'middle',
  customSeparatorIndex,
  error = false,
  errorMessage,
}: OTPFieldProps) => {
  const getSeparatorIndex = () => {
    if (!hasSeparator) return -1
    if (separatorPosition === 'custom' && customSeparatorIndex !== undefined) {
      return Math.min(customSeparatorIndex, maxLength - 1)
    }
    return Math.floor(maxLength / 2) - 1
  }

  const separatorIndex = getSeparatorIndex()

  return (
    <Box as="div" className="flex flex-col gap-2">
      <InputOTP maxLength={maxLength} value={value} onChange={onChange} className={error ? 'border-destructive' : ''}>
        <InputOTPGroup>
          {Array.from({ length: maxLength }).map((_, index) => (
            <React.Fragment key={index}>
              <InputOTPSlot index={index} className={cn(error && 'border-destructive text-destructive')} />
              {hasSeparator && index === separatorIndex && (
                <InputOTPSeparator className={error ? 'text-destructive' : ''} />
              )}
            </React.Fragment>
          ))}
        </InputOTPGroup>
      </InputOTP>

      {error && errorMessage && (
        <Box className="text-destructive text-xs font-medium">{errorMessage}</Box>
      )}
    </Box>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
