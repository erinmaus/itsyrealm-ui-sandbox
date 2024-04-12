type Props = {
  [key: string]: any;
};

export const DefaultExcludedProps = ["children", "as"] as const;
export type TransientPropKey<
  Key extends string,
  ExcludedProps = DefaultExcludedTransientProps,
> = Key extends ExcludedProps ? Key : `$${Key}`;
export type TransientProps<
  OtherProps,
  ExcludedProps = DefaultExcludedTransientProps,
> = {
  [K in keyof OtherProps as K extends string
    ? TransientPropKey<K, ExcludedProps>
    : never]: OtherProps[K];
};
export type DefaultExcludedTransientProps =
  (typeof DefaultExcludedProps)[number];

export const toTransientProps = <
  OtherProps extends Props,
  ExcludedProps = DefaultExcludedTransientProps,
>(
  props: OtherProps,
  excludedProps: string[] = ["children"],
) => {
  return Object.keys(props).reduce(
    (
      result: TransientProps<OtherProps, ExcludedProps>,
      currentValue: string,
    ) => {
      return {
        [excludedProps.includes(currentValue)
          ? currentValue
          : `$${currentValue}`]: props[currentValue],
        ...result,
      };
    },
    {} as TransientProps<OtherProps, ExcludedProps>,
  );
};
