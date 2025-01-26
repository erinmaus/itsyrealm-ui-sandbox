import styled from "styled-components";
import { toTransientProps, TransientProps } from "../../util";

export interface ButtonProps {
  onClick?: any;
  disabled?: boolean;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  buttonColor?: string;
  buttonImage?: string;
  color?: string;
  as?: string;
  children?: React.ReactNode;
}

export const ButtonStyle = styled.button.attrs<TransientProps<ButtonProps>>(
  (props) => ({
    style: {
      left: props.$x ?? "auto",
      top: props.$y ?? "auto",
    },
  }),
)`
  border: none;
  outline: none;
  background: none;

  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  border-image: url(${(props) =>
      props.theme.getImage(
        props.$buttonImage ?? "Widgets/BaseButton.png",
        props.theme[props.$buttonColor ?? "secondaryActionColor"] ||
          props.theme.secondaryActionColor,
      )})
    12 24 fill / 12px 24px repeat;

  min-width: ${(props) => props.$width ?? "auto"};
  min-height: ${(props) => props.$height ?? "auto"};
  width: ${(props) => props.$width ?? "auto"};
  height: ${(props) => props.$height ?? "auto"};

  transition: 0.25s ease-in-out filter;

  color: ${(props) => props.$color ?? props.theme.fontColor};

  filter: brightness(1) ${(props) => (props.$disabled ? "grayscale(1)" : "")};

  &:hover {
    filter: brightness(1.25)
      ${(props) => (props.$disabled ? "grayscale(1)" : "")};
  }

  &:active {
    filter: brightness(0.75)
      ${(props) => (props.$disabled ? "grayscale(1)" : "")};
  }

  & > * {
    pointer-events: none;
  }
`;

const Button = (props: ButtonProps) => (
  <ButtonStyle {...toTransientProps<ButtonProps>(props)} />
);

export default Button;
