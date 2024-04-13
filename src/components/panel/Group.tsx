import styled from "styled-components";
import { toTransientProps } from "../../util";
import { PanelProps, PanelStyle } from "./Panel";

export const GroupStyle = styled(PanelStyle)`
  border-image: url(${(props) =>
      props.theme.getImage(
        props.$panelImage ?? "Widgets/BaseGroup.png",
        props.theme[props.$panelColor ?? "mediumBackgroundColor"] ||
          props.theme.backgroundColor,
      )})
    24 24 fill / 24px 24px repeat;
`;

const Group = (props: PanelProps) => (
  <GroupStyle {...toTransientProps<PanelProps>(props)} />
);

export default Group;
