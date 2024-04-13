import { useCallback, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ButtonStyle } from "../button/Button";
import Icon from "../icon/Icon";

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface BaseScrollableProps {
  Container: React.ComponentType<DivProps>;
}

export type ScrollableProps = BaseScrollableProps & DivProps;

const Scrollbar = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Track = styled.div`
  position: relative;
  width: 48px;
  height: calc(100% - 96px);
`;

const Scrollable = ({ children, Container, ...props }: ScrollableProps) => {
  const scrollDownButton = useRef<HTMLButtonElement>(null);
  const scrollUpButton = useRef<HTMLButtonElement>(null);
  const scrollThumbButton = useRef<HTMLButtonElement>(null);
  const scrollTrack = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [scrollThumbButtonHeight, setScrollThumbButtonHeight] = useState(96);
  const [scrollThumbButtonPosition, setScrollThumbButtonPosition] = useState(0);

  const onHandleResize = useCallback(
    (container: HTMLDivElement, track: HTMLDivElement) => {
      const {
        clientHeight: containerHeight,
        scrollHeight: containerScrollHeight,
      } = container;
      const { clientHeight: trackHeight } = track;

      setScrollThumbButtonHeight(
        Math.max((containerHeight / containerScrollHeight) * trackHeight, 48),
      );
    },
    [setScrollThumbButtonHeight],
  );

  const onHandleScrollThumbPosition = useCallback(
    (_event: React.UIEvent<HTMLDivElement>) => {
      if (scrollThumbButton.current && scrollTrack.current && content.current) {
        const {
          clientHeight: contentHeight,
          scrollTop: scrollY,
          scrollHeight,
        } = content.current;
        const { clientHeight: trackHeight } = scrollTrack.current;
        const { clientHeight: currentThumbButtonHeight } =
          scrollThumbButton.current;

        const newThumbButtonPosition = Math.max(
          Math.min(
            trackHeight - currentThumbButtonHeight,
            (scrollY / (scrollHeight - contentHeight)) *
              (trackHeight - currentThumbButtonHeight),
          ),
          0,
        );
        setScrollThumbButtonPosition(newThumbButtonPosition);
      }
    },
    [scrollThumbButton, scrollTrack, content, setScrollThumbButtonPosition],
  );

  useLayoutEffect(() => {
    if (content.current && scrollTrack.current) {
      const currentContent = content.current;
      const currentScrollTrack = scrollTrack.current;

      const observer = new ResizeObserver(() => {
        onHandleResize(currentContent, currentScrollTrack);
      });

      observer.observe(currentContent);

      return () => {
        observer.unobserve(currentContent);
      };
    }
  }, [content, scrollTrack, onHandleResize]);

  return (
    <>
      <Container
        {...props}
        ref={content}
        onScroll={onHandleScrollThumbPosition}
        style={{ paddingRight: "32px" }}
      >
        {children}
      </Container>
      <Scrollbar>
        <ButtonStyle ref={scrollUpButton} $width="48px" $height="48px">
          <Icon width="32px" height="32px" icon={"Common/ScrollUp"} />
        </ButtonStyle>
        <Track ref={scrollTrack}>
          <ButtonStyle
            ref={scrollThumbButton}
            $y={`${scrollThumbButtonPosition}px`}
            $height={`${scrollThumbButtonHeight}px`}
            $width="48px"
          />
        </Track>
        <ButtonStyle ref={scrollDownButton} $width="48px" $height="48px">
          <Icon width="32px" height="32px" icon={"Common/ScrollDown"} />
        </ButtonStyle>
      </Scrollbar>
    </>
  );
};

export default Scrollable;
