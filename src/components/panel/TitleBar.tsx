import styled from "styled-components";
import { toTransientProps } from "../../util";
import { PanelProps, PanelStyle } from "./Panel";

export const TitleBarStyle = styled(PanelStyle)`
  position: absolute;

  left: 0;
  right: 0;
  top: 0;

  display: flex;
  justify-content: space-between;

  border-image: url(${(props) =>
      props.theme.getImage(
        props.$panelImage ?? "Widgets/BaseTitleBar.png",
        props.theme[props.$panelColor ?? "darkBackgroundColor"] ||
          props.theme.backgroundColor,
      )})
    12 12 fill / 12px 12px repeat;

  padding: 8px;
  height: 48px;
`;

const TitleBar = (props: PanelProps) => (
  <TitleBarStyle {...toTransientProps(props)} />
);

export default TitleBar;
