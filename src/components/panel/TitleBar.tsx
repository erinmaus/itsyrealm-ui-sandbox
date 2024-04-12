import styled from "styled-components";
import { PanelProps, PanelStyle } from "./Panel";
import TitleBarImage from "./images/TitleBar.png";
import TitleBarMaskImage from "./images/TitleBar.mask.png";
import { toTransientProps } from "../../util";

export const TitleBarStyle = styled(PanelStyle)`
  position: absolute;

  left: 0;
  right: 0;
  top: 0;

  display: flex;
  justify-content: space-between;

  border-image: url(${TitleBarImage}) 12 12 fill / 12px 12px repeat;

  padding: 8px;
  height: 48px;

  &:before {
    background-color: ${(props) => props.theme.titleBar};
    -webkit-mask-box-image: url(${TitleBarMaskImage}) 12 12 fill / 12px 12px
      repeat;
  }
`;

const TitleBar = (props: PanelProps) => (
  <TitleBarStyle {...toTransientProps(props)} />
);

export default TitleBar;
