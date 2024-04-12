import styled from "styled-components";
import { toTransientProps, TransientProps } from "../../util";

export interface ItemIconProps {
  width?: string;
  height?: string;
  item: string;
  quantity?: number;
  disabled?: boolean;
}

export const DEFAULT_WIDTH = 48;
export const DEFAULT_HEIGHT = 48;

export const ItemIconStyle = styled.div<TransientProps<ItemIconProps>>`
  position: relative;

  width: ${(props) => props.$width ?? `${DEFAULT_WIDTH}px`};
  height: ${(props) => props.$height ?? `${DEFAULT_HEIGHT}px`};

  background: center / contain no-repeat
    url("Icons/Items/${(props) => props.$item}.png");

  filter: ${(props) =>
    props.$disabled ? "greyscale(1) brightness(0.5)" : "none"};
`;

export interface ItemQuantityProps {
  color: string;
}

export const ItemQuantityStyle = styled.p<TransientProps<ItemQuantityProps>>`
  font-family: "Bebas Neue", sans-serif;
  font-size: 22px;
  position: absolute;
  top: 2px;
  right: 2px;
  color: ${(props) => props.$color};
`;

export const formatItemQuantity = (quantity: number): [string, string] => {
  const HUNDRED_THOUSAND = 100_000;
  const MILLION = 1_000_000;
  const BILLION = 1_000_000_000;
  const TRILLION = 1_000_000_000_000;
  const QUADRILLION = 1_000_000_000_000_000;

  let text: string, color: string;
  if (quantity >= QUADRILLION) {
    text = `${Math.floor(quantity / QUADRILLION)}q`;
    color = "#ff00ff";
  } else if (quantity >= TRILLION) {
    text = `${Math.floor(quantity / TRILLION)}t`;
    color = "#00ffff";
  } else if (quantity >= BILLION) {
    text = `${Math.floor(quantity / BILLION)}b`;
    color = "#ff80ff";
  } else if (quantity >= MILLION) {
    text = `${Math.floor(quantity / MILLION)}m`;
    color = "#00ff80";
  } else if (quantity >= HUNDRED_THOUSAND) {
    text = `${Math.floor((quantity / HUNDRED_THOUSAND) * 100)}k`;
    color = "#ffffff";
  } else {
    text = `${quantity}`;
    color = "#ffff00";
  }

  return [text, color];
};

const ItemIcon = ({ quantity = 1, ...props }: ItemIconProps) => {
  const [quantityText, quantityTextColor] = formatItemQuantity(quantity);
  return (
    <ItemIconStyle {...toTransientProps(props)}>
      {quantity !== 1 ? (
        <ItemQuantityStyle $color={quantityTextColor}>
          {quantityText}
        </ItemQuantityStyle>
      ) : null}
    </ItemIconStyle>
  );
};

export default ItemIcon;
