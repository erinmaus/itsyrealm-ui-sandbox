import styled from "styled-components";
import { toTransientProps, TransientProps } from "../../util";

export enum LabelFontFamily {
  Serif = "Laila",
  SansSerif = "Roboto",
  Monospace = "monospace",
}

export interface LabelProps {
  family?: LabelFontFamily;
  size?: string;
  weight?: string | number;
  lineHeight?: string;
  style?: string;
  as?: string;
  color?: string;
  align?: string;
  children?: React.ReactNode;
}

export const LabelStyle = styled.p<TransientProps<LabelProps>>`
  font-family: ${(props) => props.$family ?? "Roboto"};
  font-size: ${(props) => props.$size ?? "1rem"};
  line-height: ${(props) => props.$lineHeight ?? props.$size ?? "1rem"};
  font-weight: ${(props) => props.$weight ?? 500};
  font-style: ${(props) => props.$style ?? "normal"};
  color: ${(props) => props.color ?? props.theme.font};
  text-align: ${(props) => props.$align ?? "inherit"};

  &:not(:first-of-type) {
    margin-top: 8px;
  }

  a,
  a:link,
  a:visited {
    color: ${(props) => props.theme.primaryLinkColor};
  }

  a:hover,
  a:focus {
    color: ${(props) => props.theme.secondaryLinkColor};
  }

  a:active {
    color: ${(props) => props.theme.link};
  }
`;

const Label = (props: LabelProps) => (
  <LabelStyle {...toTransientProps(props)} />
);

export default Label;
