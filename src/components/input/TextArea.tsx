import styled from "styled-components";
import { toTransientProps, TransientProps } from "../../util";

export interface TextAreaProps {
  onChange?: any;
  value?: string;
  panelImage?: string;
  panelColor?: string;
  children?: React.ReactNode;
}

export const TextAreaStyle = styled.textarea<TransientProps<TextAreaProps>>`
  display: block;
  outline: none;
  background: none;
  border: none;

  min-width: 2rem;
  min-height: 12rem;
  padding: 0.5rem;

  width: 100%;

  font-family: monospace;

  font-size: 1rem;
  font-weight: normal;

  border-image: url(${(props) =>
      props.theme.getImage(
        props.$panelImage ?? "Widgets/BaseTextInput.png",
        props.theme[props.$panelColor ?? "lightBackgroundColor"] ||
          props.theme.lightBackgroundColor,
      )})
    8 8 fill / 8px 8px repeat;

  color: ${(props) => props.theme.textInputFont};
`;

const TextArea = ({ value, onChange, ...props }: TextAreaProps) => (
  <TextAreaStyle
    onChange={onChange}
    value={value}
    {...toTransientProps<TextAreaProps>(props)}
  />
);

export default TextArea;
