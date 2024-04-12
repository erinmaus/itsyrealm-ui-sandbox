import styled from "styled-components";
import { toTransientProps, TransientProps } from "../../util";

export interface ItemIconProps {
  width?: string;
  height?: string;
  icon: string;
}

export const DEFAULT_WIDTH = 48;
export const DEFAULT_HEIGHT = 48;

export const IconStyle = styled.div<TransientProps<ItemIconProps>>`
  position: relative;

  width: ${(props) => props.$width ?? `${DEFAULT_WIDTH}px`};
  height: ${(props) => props.$height ?? `${DEFAULT_HEIGHT}px`};

  background: center / contain no-repeat
    url("Icons/${(props) => props.$icon}.png");
`;

const Icon = (props: ItemIconProps) => (
  <IconStyle {...toTransientProps(props)} />
);

export default Icon;
