import styled from "styled-components";
import { toTransientProps, TransientProps } from "../../util";

export interface PanelProps {
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  panelImage?: string;
  panelColor?: string;
  children?: React.ReactNode;
}

export const PanelStyle = styled.div<TransientProps<PanelProps>>`
  position: relative;

  border-image: url(${(props) =>
      props.theme.getImage(
        props.$panelImage ?? "Widgets/BasePanel.png",
        props.theme[props.$panelColor ?? "backgroundColor"] ||
          props.theme.backgroundColor,
      )})
    24 24 fill / 24px 24px repeat;

  padding: 12px;

  left: ${(props) => props.$x ?? "auto"};
  top: ${(props) => props.$y ?? "auto"};

  width: ${(props) => props.$width ?? "auto"};
  height: ${(props) => props.$height ?? "auto"};

  color: ${(props) => props.theme.fontColor};

  overflow: hidden;
`;

const Panel = (props: PanelProps) => (
  <PanelStyle {...toTransientProps(props)} />
);

export default Panel;
