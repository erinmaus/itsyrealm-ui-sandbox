import styled from "styled-components";
import { TransientProps, toTransientProps } from "../../util";

export enum LabelFontFamily {
  Serif = "Laila",
  SansSerif = "Roboto",
}

export interface LabelProps {
  family?: LabelFontFamily;
  size?: string;
  weight?: string | number;
  lineHeight?: string;
  style?: string;
  as?: string;
  color?: string;
  children?: React.ReactNode;
}

export const LabelStyle = styled.p<TransientProps<LabelProps>>`
  font-family: ${(props) => props.$family ?? "Roboto"};
  font-size: ${(props) => props.$size ?? "1rem"};
  line-height: ${(props) => props.$lineHeight ?? props.$size ?? "1rem"};
  font-weight: ${(props) => props.$weight ?? 500};
  font-style: ${(props) => props.$style ?? "normal"};
  color: ${(props) => props.color ?? props.theme.font};
  mix-blend-mode: lighten;
`;

const Label = (props: LabelProps) => (
  <LabelStyle {...toTransientProps(props)} />
);

export default Label;
