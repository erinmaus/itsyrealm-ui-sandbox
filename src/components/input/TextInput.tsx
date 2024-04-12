import styled, { keyframes } from "styled-components";
import TextInputImage from "./images/TextInput.png";
import TextInputMaskImage from "./images/TextInput.mask.png";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TransientProps, toTransientProps } from "../../util";

export interface TextInputProps {
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  value?: string;
  children?: React.ReactNode;
}

const SpanAnimation = keyframes`
    from {
        transform: rotate(0) scale(100%);
    }

    25% {
        transform: rotate(-6.25deg) scale(120%);
    }

    50% {
        transform: rotate(0deg) scale(110%);
    }

    75% {
        transform: rotate(6.25deg) scale(90%);
    }

    to {
        transform: rotate(0deg) scale(100%);
    }
`;

const CaretAnimation = keyframes`
    from {
        border-right: 2px solid rgba(0, 0, 0, 0);
    }
    
    50% {
        border-right: 2px solid rgba(0, 0, 0, 1);
    }
    
    to {
        border-right: 2px solid rgba(0, 0, 0, 0);
    }
`;

const BaseTextInput = styled.div<TransientProps<TextInputProps>>`
  position: ${(props) =>
    props.$x === undefined && props.$y === undefined ? "relative" : "absolute"};

  border-image: url(${TextInputImage}) 12 12 fill / 12px 12px repeat;

  padding: 4px;
  min-height: 32px;
  max-height: 32px;

  left: ${(props) => props.$x ?? "auto"};
  top: ${(props) => props.$y ?? "auto"};

  width: ${(props) => props.$width ?? "auto"};
  height: ${(props) => props.$height ?? "auto"};

  color: ${(props) => props.theme.textInputFont};

  transition: filter 0.25s ease-in-out;

  overflow: hidden;

  &:before {
    position: absolute;

    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    content: "";

    background-color: ${(props) => props.theme.textInputColor};
    -webkit-mask-box-image: url(${TextInputMaskImage}) 12 12 fill / 12px 12px
      repeat;

    mix-blend-mode: multiply;
  }

  & .scroll {
    display: block;
    overflow: scroll;
    max-width: 100%;
    max-height: 32px;
  }

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    filter: brightness(0.75);
  }

  &:focus,
  &.focus {
    filter: brightness(1.25);
  }

  & span {
    display: inline-block;
    line-height: 32px;
    animation: ${SpanAnimation} 0.25s ease-in-out;
  }

  & span.selected {
    background-color: ${(props) => props.theme.background};
  }

  & span.caret {
    min-width: 2px;
    min-height: 32px;
    animation:
      ${CaretAnimation} 0.5s ease-in-out infinite,
      ${SpanAnimation} 0.25s ease-in-out;
    margin-right: -2px;
  }

  & > input[type="text"] {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 16px;

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    overflow: scroll;

    padding: 4px;
    border: none;
    margin: 0;
    outline: none;
    opacity: 0;
  }
`;

const NON_BREAKING_SPACE = String.fromCharCode(160);

const TextInput = ({ value, ...otherProps }: TextInputProps) => {
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLInputElement>(null);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [selectionStart, setSelectionStart] = useState(0);

  useEffect(() => {
    setCurrentValue(value ?? "");
  }, [value, setCurrentValue]);

  const onFocus = useCallback(() => {
    setIsFocused(true);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [setIsFocused]);

  const onBlur = useCallback(() => {
    setIsFocused(false);

    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [inputRef, setIsFocused]);

  const scroll = useMemo(
    () => () => {
      if (containerRef.current && inputRef.current) {
        containerRef.current.scrollLeft = inputRef.current.scrollLeft;
      }
    },
    [containerRef, inputRef],
  );

  const onChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setCurrentValue(event.currentTarget.value);
    },
    [setCurrentValue],
  );

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLInputElement>) => {
      scroll();
    },
    [scroll],
  );

  const onSelectionChange = useCallback(
    (event: Event): any => {
      if (isFocused && inputRef.current !== null) {
        setSelectionStart(inputRef.current.selectionStart ?? 0);
        setSelectionEnd(inputRef.current.selectionEnd ?? 0);
      }
    },
    [isFocused, setSelectionStart, setSelectionEnd],
  );

  useEffect(() => {
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [onSelectionChange, setSelectionEnd, setSelectionStart]);

  const characters = currentValue.split("");
  const spans = characters.reduce((spans, current, index) => {
    const selected =
      inputRef.current &&
      index >= (selectionStart ?? 0) &&
      index < (selectionEnd ?? 0);
    const direction = inputRef.current && inputRef.current.selectionDirection;
    const hasCaret =
      isFocused &&
      inputRef.current &&
      ((direction === "forward" &&
        index === (inputRef.current.selectionEnd ?? 0) - 1) ||
        (direction && index === (inputRef.current.selectionStart ?? 0) - 1));

    console.log({ selectionStart, selectionEnd, index });

    const textSpan = (
      <span
        className={`${selected ? "selected" : ""} ${hasCaret ? "caret" : ""}`}
        key={index}
      >
        {current === " " ? NON_BREAKING_SPACE : current}
      </span>
    );
    return [...spans, textSpan];
  }, [] as React.ReactNode[]);

  if (spans.length === 0 && isFocused) {
    spans.push(<span className="caret"></span>);
  }

  return (
    <BaseTextInput
      className={`${isFocused ? "focus" : ""}`}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      {...toTransientProps(otherProps)}
    >
      <input
        type="text"
        ref={inputRef}
        value={currentValue}
        onChange={onChange}
        onScroll={onScroll}
      />
      <div ref={containerRef} className="scroll">
        {spans}
      </div>
    </BaseTextInput>
  );
};

export default TextInput;
