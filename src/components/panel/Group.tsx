import styled from "styled-components";
import { PanelProps, PanelStyle } from "./Panel";
import GroupImage from "./images/Group.png";
import { toTransientProps } from "../../util";

export const GroupStyle = styled(PanelStyle)`
  border-image: url(${GroupImage}) 24 24 fill / 24px 24px repeat;

  &:before {
    -webkit-mask-box-image: none;
  }
`;

const Group = (props: PanelProps) => (
  <GroupStyle {...toTransientProps(props)} />
);

export default Group;
