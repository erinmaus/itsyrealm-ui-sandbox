import ButtonImage from "./images/Button.png";
import ButtonMaskImage from "./images/Button.mask.png";
import styled from "styled-components";
import { TransientProps, toTransientProps } from "../../util";

export interface ButtonProps {
  disabled?: boolean;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  buttonColor?: string;
  color?: string;
  as?: string;
  children?: React.ReactNode;
}

export const ButtonStyle = styled.button<TransientProps<ButtonProps>>`
  border: none;
  outline: none;
  background: none;

  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  border-image: url(${ButtonImage}) 12 12 fill / 12px 12px repeat;

  padding: 4px;

  left: ${(props) => props.$x ?? "auto"};
  top: ${(props) => props.$y ?? "auto"};

  min-width: ${(props) => props.$width ?? "auto"};
  min-height: ${(props) => props.$height ?? "auto"};

  transition: 0.5s ease-in-out filter;

  color: ${(props) => props.$color ?? props.theme.fontColor};

  &:before {
    position: absolute;

    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    content: "";

    background-color: ${(props) =>
      props.$buttonColor
        ? props.theme[props.$buttonColor] ?? props.$buttonColor
        : props.theme.button};
    -webkit-mask-box-image: url(${ButtonMaskImage}) 12 12 fill / 12px 12px
      repeat;

    z-index: 0;

    mix-blend-mode: multiply;
  }

  filter: ${(props) => (props.$disabled ? "grayscale(1)" : "")};

  &:hover {
    filter: brightness(1.1)
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
  <ButtonStyle {...toTransientProps(props)} />
);

export default Button;
