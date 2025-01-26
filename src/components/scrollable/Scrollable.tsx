import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

const SCROLL_SPEED_PIXELS_PER_SECOND = 100;

const Scrollable = ({ children, Container, ...props }: ScrollableProps) => {
  const scrollDownButton = useRef<HTMLButtonElement>(null);
  const scrollUpButton = useRef<HTMLButtonElement>(null);
  const scrollThumbButton = useRef<HTMLButtonElement>(null);
  const [scrollTrack, setScrollTrack] = useState<HTMLDivElement>();
  const [content, setContent] = useState<HTMLDivElement>();
  const [container, setContainer] = useState<HTMLDivElement>();
  const [scrollThumbButtonHeight, setScrollThumbButtonHeight] = useState(96);
  const [scrollThumbButtonPosition, setScrollThumbButtonPosition] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const onHandleResize = useCallback(
    (
      container: HTMLDivElement,
      content: HTMLDivElement,
      track?: HTMLDivElement,
    ) => {
      const { clientHeight: containerHeight } = content;
      const { clientHeight: containerScrollHeight } = container;

      setVisible(containerScrollHeight > containerHeight);

      if (track) {
        const { clientHeight: trackHeight } = track;

        setScrollThumbButtonHeight(
          Math.max((containerHeight / containerScrollHeight) * trackHeight, 48),
        );
      }
    },
    [setScrollThumbButtonHeight, setVisible],
  );

  const onContentMounted = useCallback(
    (container: HTMLDivElement) => {
      if (container) {
        const {
          clientHeight: containerHeight,
          scrollHeight: containerScrollHeight,
        } = container;

        setVisible(containerHeight > containerScrollHeight);
        setContent(container);
      }
    },
    [setContent, setVisible],
  );

  const onScrollTrackMounted = useCallback(
    (element: HTMLDivElement) => {
      setScrollTrack(element);
    },
    [setScrollTrack],
  );

  const onContainerMounted = useCallback(
    (element: HTMLDivElement) => {
      setContainer(element);
    },
    [setContainer],
  );

  const onBeginScrollUp = useCallback(
    (event: SyntheticEvent) => {
      setIsScrollingUp(true);
      event.preventDefault();
    },
    [setIsScrollingUp],
  );

  const onEndScrollUp = useCallback(
    (event: SyntheticEvent) => {
      setIsScrollingUp(false);
      event.preventDefault();
    },
    [setIsScrollingUp],
  );

  const onBeginScrollDown = useCallback(
    (event: SyntheticEvent) => {
      setIsScrollingDown(true);
      event.preventDefault();
    },
    [setIsScrollingDown],
  );

  const onEndScrollDown = useCallback(
    (event: SyntheticEvent) => {
      setIsScrollingDown(false);
      event.preventDefault();
    },
    [setIsScrollingDown],
  );

  const scroll = useCallback(
    (direction: number) => {
      if (container) {
        let startTime: DOMHighResTimeStamp;
        let handle: number;
        const scrollUp = (currentTime: DOMHighResTimeStamp) => {
          if (startTime === undefined) {
            startTime = currentTime;
          }

          const deltaTime = (currentTime - startTime) / 1000;
          const scrollY = Math.max(
            container.scrollTop +
              direction * deltaTime * SCROLL_SPEED_PIXELS_PER_SECOND,
            0,
          );

          container.scrollTo({
            top: scrollY,
            behavior: "smooth",
          });

          handle = requestAnimationFrame(scrollUp);
        };

        handle = requestAnimationFrame(scrollUp);

        return () => {
          cancelAnimationFrame(handle);
        };
      }
    },
    [container],
  );

  useEffect(() => {
    if (isScrollingUp) {
      return scroll(-1);
    }
  }, [isScrollingUp, scroll]);

  useEffect(() => {
    if (isScrollingDown) {
      return scroll(1);
    }
  }, [isScrollingDown, scroll]);

  useEffect(() => {
    if (isScrollingUp && container) {
      console.log("--- is scrolling up", isScrollingUp);

      let startTime: DOMHighResTimeStamp;
      let handle: number;
      const scrollUp = (currentTime: DOMHighResTimeStamp) => {
        if (startTime === undefined) {
          startTime = currentTime;
        }

        const deltaTime = (currentTime - startTime) / 1000;
        const scrollY = Math.max(
          container.scrollTop - deltaTime * SCROLL_SPEED_PIXELS_PER_SECOND,
          0,
        );

        container.scrollTo({
          top: scrollY,
          behavior: "smooth",
        });

        handle = requestAnimationFrame(scrollUp);
      };

      handle = requestAnimationFrame(scrollUp);

      return () => {
        cancelAnimationFrame(handle);
      };
    }
  }, [isScrollingUp, container]);

  const onHandleScrollThumbPosition = useCallback(
    (_event: React.UIEvent<HTMLDivElement>) => {
      if (scrollThumbButton.current && scrollTrack && content && container) {
        const { clientHeight: scrollHeight } = content;
        const { clientHeight: contentHeight, scrollTop: scrollY } = container;
        const { clientHeight: trackHeight } = scrollTrack;
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
    [
      scrollThumbButton,
      scrollTrack,
      content,
      container,
      setScrollThumbButtonPosition,
    ],
  );

  useLayoutEffect(() => {
    if (container && content) {
      const observer = new ResizeObserver(() => {
        onHandleResize(content, container, scrollTrack);
      });

      observer.observe(content);

      return () => {
        observer.unobserve(content);
      };
    }
  }, [container, content, scrollTrack, onHandleResize]);

  const onBeginDrag = useCallback(
    (event: SyntheticEvent) => {
      setIsDragging(true);
      event.preventDefault();
    },
    [setIsDragging],
  );

  const onEndDrag = useCallback(
    (event: SyntheticEvent) => {
      setIsDragging(false);
      event.preventDefault();
    },
    [setIsDragging],
  );

  useEffect(() => {
    if (isDragging) {
      let offsetY: number;

      const scrollByPagePosition = (pageY: number) => {
        if (container && scrollTrack && scrollThumbButton.current) {
          const { clientHeight: trackHeight } = scrollTrack;

          const trackBounds = scrollTrack.getBoundingClientRect();

          if (!offsetY) {
            const buttonBounds =
              scrollThumbButton.current.getBoundingClientRect();
            offsetY = pageY - buttonBounds.top;
          }

          const minY = trackBounds.top;
          const maxY = trackBounds.top + trackHeight;
          const relativeY = Math.min(
            Math.max(pageY - minY - offsetY, 0) / (maxY - minY),
            1,
          );

          container.scrollTo({
            top: relativeY * container.scrollHeight,
            behavior: "auto",
          });
        }
      };

      const handleMouseMove = (event: MouseEvent) => {
        scrollByPagePosition(event.pageY);
      };

      let touchIdentifier: number;
      const handleTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 0) {
          if (touchIdentifier === undefined) {
            touchIdentifier = event.touches[0].identifier;
          }

          for (let i = 0; i < event.touches.length; ++i) {
            const touch = event.touches[i];
            if (touch.identifier === touchIdentifier) {
              scrollByPagePosition(touch.pageY);
              break;
            }
          }
        }

        event.preventDefault();
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      const handleTouchUp = (event: TouchEvent) => {
        if (touchIdentifier === undefined) {
          setIsDragging(false);
        }

        for (let i = 0; i < event.touches.length; ++i) {
          const touch = event.touches[i];
          if (touch.identifier === touchIdentifier) {
            setIsDragging(false);
            break;
          }
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchUp);
      };
    }
  }, [isDragging, container, scrollTrack, setIsDragging]);

  return (
    <>
      <Container
        {...props}
        ref={onContainerMounted}
        onScroll={onHandleScrollThumbPosition}
      >
        <div
          ref={onContentMounted}
          style={{ paddingRight: visible ? "48px" : "0px" }}
        >
          {children}
        </div>
      </Container>
      {visible && (
        <Scrollbar>
          <ButtonStyle
            ref={scrollUpButton}
            $width="48px"
            $height="48px"
            onTouchStartCapture={onBeginScrollUp}
            onTouchEndCapture={onEndScrollUp}
            onMouseDown={onBeginScrollUp}
            onMouseUp={onEndScrollUp}
          >
            <Icon width="32px" height="32px" icon={"Common/ScrollUp"} />
          </ButtonStyle>
          <Track ref={onScrollTrackMounted}>
            <ButtonStyle
              ref={scrollThumbButton}
              $y={`${scrollThumbButtonPosition}px`}
              $height={`${scrollThumbButtonHeight}px`}
              $width="48px"
              onTouchStartCapture={onBeginDrag}
              onTouchEndCapture={onEndDrag}
              onMouseDown={onBeginDrag}
              onMouseUp={onEndDrag}
            />
          </Track>
          <ButtonStyle
            ref={scrollDownButton}
            $width="48px"
            $height="48px"
            onTouchStartCapture={onBeginScrollDown}
            onTouchEndCapture={onEndScrollDown}
            onMouseDown={onBeginScrollDown}
            onMouseUp={onEndScrollDown}
          >
            <Icon width="32px" height="32px" icon={"Common/ScrollDown"} />
          </ButtonStyle>
        </Scrollbar>
      )}
    </>
  );
};

export default Scrollable;
