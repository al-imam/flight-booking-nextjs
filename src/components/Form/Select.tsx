"use client";

import { ComponentProps, useId } from "react";
import { Control, Controller, FieldError, FieldValues, UseFormRegisterReturn } from "react-hook-form";
import NormalSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import { twMerge } from "tailwind-merge";

interface SelectProps extends ComponentProps<CreatableSelect> {
  control: Control<any, any>;
  register: UseFormRegisterReturn;
  error?: FieldError;
  name: string;
  label?: string;
  title?: string;
  classNameLabel?: string;
}

export function Select({
  control,
  register,
  name,
  error,
  label,
  title = label,
  options,
  classNameLabel,
  ...rest
}: SelectProps) {
  const id = useId();
  const identity = name + id.replaceAll(":", "");

  return (
    <div className="flex flex-col gap-1" id={identity}>
      <label
        htmlFor={id}
        title={title}
        className={twMerge("line-clamp-1 text-base font-medium text-gray-800", classNameLabel)}
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CreatableSelect
            id={id}
            options={options}
            onMenuClose={() =>
              document.querySelector<HTMLInputElement>(`#${identity} input:not([type="hidden"])`)?.blur()
            }
            menuPosition="fixed"
            styles={{
              control: (styles, state) => ({
                ...styles,
                margin: 0,
                padding: 2,
                backgroundColor: "rgb(248 249 250)",
                borderColor: error
                  ? "rgb(245 57 57 / 0.5)"
                  : state.isFocused
                  ? "rgb(59 130 246 / 0.5)"
                  : state.isDisabled
                  ? "rgb(233 227 255)"
                  : "rgb(192 184 254)",
                opacity: state.isDisabled ? "0.5" : 1,
                borderWidth: 1.5,
                "&:hover": {
                  borderColor: "none",
                },
                boxShadow: state.isFocused
                  ? error
                    ? "0 0 0 1px rgb(245 57 57 / 0.5)"
                    : "0 0 0 1px rgb(59 130 246 / 0.5)"
                  : "none",
              }),
              placeholder: (provided) => ({
                ...provided,
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: "0.875rem",
                color: "#adb5bd",
                letterSpacing: "0.3px",
                userSelect: "none",
              }),
              valueContainer: (styles) => ({
                ...styles,
                userSelect: "none",
                color: "rgb(27 37 89)",
                letterSpacing: "0.3px",
              }),
            }}
            {...register}
            {...field}
            {...rest}
          />
        )}
      />

      {error && <p className="line-clamp-1 text-sm text-red-500/90">{error.message}</p>}
    </div>
  );
}

interface SelectNotCreatableProps extends ComponentProps<NormalSelect> {
  control: Control<any, any>;
  register: UseFormRegisterReturn;
  error?: FieldError;
  name: string;
  label?: string;
  title?: string;
  classNameLabel?: string;
}

export function SelectNotCreatable({
  control,
  register,
  name,
  error,
  label,
  title = label,
  options,
  classNameLabel,
  ...rest
}: SelectNotCreatableProps) {
  const id = useId();
  const identity = name + id.replaceAll(":", "");

  return (
    <div className="flex flex-col gap-1" id={identity}>
      <label
        htmlFor={id}
        title={title}
        className={twMerge("line-clamp-1 text-base font-medium text-gray-800", classNameLabel)}
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <NormalSelect
            id={id}
            options={options}
            menuPosition="fixed"
            onMenuClose={() =>
              document.querySelector<HTMLInputElement>(`#${identity} input:not([type="hidden"])`)?.blur()
            }
            styles={{
              control: (styles, state) => ({
                ...styles,
                margin: 0,
                padding: 2,
                backgroundColor: "rgb(248 249 250)",
                borderColor: error
                  ? "rgb(245 57 57 / 0.5)"
                  : state.isFocused
                  ? "rgb(59 130 246 / 0.5)"
                  : state.isDisabled
                  ? "rgb(233 227 255)"
                  : "rgb(192 184 254)",
                borderWidth: 1.5,
                opacity: state.isDisabled ? "0.5" : 1,
                "&:hover": {
                  borderColor: "none",
                },
                boxShadow: state.isFocused
                  ? error
                    ? "0 0 0 1px rgb(245 57 57 / 0.5)"
                    : "0 0 0 1px rgb(59 130 246 / 0.5)"
                  : "none",
              }),
              placeholder: (styles) => ({
                ...styles,
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                overflow: "hidden",
                color: "#adb5bd",
                letterSpacing: "0.3px",
                userSelect: "none",
              }),
              valueContainer: (styles) => ({
                ...styles,
                userSelect: "none",
                color: "rgb(27 37 89)",
              }),
            }}
            {...register}
            {...field}
            {...rest}
          />
        )}
      />

      {error && <p className="line-clamp-1 text-sm text-red-500/90">{error.message}</p>}
    </div>
  );
}
