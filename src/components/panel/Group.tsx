import styled from "styled-components";
import { toTransientProps } from "../../util";
import GroupImage from "./images/Group.png";
import { PanelProps, PanelStyle } from "./Panel";

export const GroupStyle = styled(PanelStyle)`
  border-image: url(${GroupImage}) 24 24 fill / 24px 24px repeat;

  &:before {
    -webkit-mask-box-image: none;
  }
`;

const Group = (props: PanelProps) => (
  <GroupStyle {...toTransientProps<PanelProps>(props)} />
);

export default Group;
