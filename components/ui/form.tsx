"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"

// ---------- FORM ROOT ----------
const Form = FormProvider

// ---------- FORM FIELD ----------
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return <Controller {...props} />
}

// ---------- FORM ITEM ----------
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />
  }
)
FormItem.displayName = "FormItem"

// ---------- FORM LABEL ----------
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

// ---------- FORM CONTROL (MISSING EARLIER — NOW ADDED) ----------
const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center space-x-2", className)}
        {...props}
      />
    )
  }
)
FormControl.displayName = "FormControl"

// ---------- FORM MESSAGE ----------
const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { formState } = useFormContext()
    const body = children

    if (!body) return null

    return (
      <p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props}>
        {body}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

// ---------- EXPORT EVERYTHING ----------
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
}
