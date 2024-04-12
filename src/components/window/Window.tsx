import styled, { keyframes } from "styled-components";
import Panel, { PanelProps } from "../panel/Panel";

interface WindowProps extends PanelProps {
  Frame?: React.ComponentType<PanelProps>;
  Container?: React.ComponentType<{
    children?: React.ReactNode;
    className?: string;
  }>;
  titleBar?: React.ReactNode;
}

const InKeyFrames = keyframes`
    from {
        transform: scale(90%);
    }

    50% {
        transform: scale(80%);
    }

    to {
        transform: scale(100%);
    }
`;

export const WindowFrame = styled(Panel)`
  animation: ${InKeyFrames} 0.25s ease-out;
`;

export const WindowContainer = styled.div`
  position: absolute;

  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const CenteredWindowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;

  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Window = ({
  Frame = WindowFrame,
  Container = CenteredWindowContainer,
  children,
  ...otherProps
}: WindowProps) => {
  return (
    <Container className="disable-scrollbars">
      <Frame {...otherProps}>{children}</Frame>
    </Container>
  );
};

export default Window;
