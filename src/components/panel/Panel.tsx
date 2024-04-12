import styled from "styled-components";
import PanelImage from "./images/Panel.png";
import PanelMaskImage from "./images/Panel.mask.png";
import { TransientProps, toTransientProps } from "../../util";

export interface PanelProps {
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

export const PanelStyle = styled.div<TransientProps<PanelProps>>`
  position: relative;

  border-image: url(${PanelImage}) 12 12 fill / 12px 12px repeat;

  padding: 12px;

  left: ${(props) => props.$x ?? "auto"};
  top: ${(props) => props.$y ?? "auto"};

  width: ${(props) => props.$width ?? "auto"};
  height: ${(props) => props.$height ?? "auto"};

  color: ${(props) => props.theme.fontColor};

  overflow: hidden;

  &:before {
    position: absolute;

    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    content: "";

    background-color: ${(props) => props.theme.background};
    -webkit-mask-box-image: url(${PanelMaskImage}) 12 12 fill / 12px 12px repeat;

    z-index: 0;

    mix-blend-mode: multiply;
  }
`;

const Panel = (props: PanelProps) => (
  <PanelStyle {...toTransientProps(props)} />
);

export default Panel;
