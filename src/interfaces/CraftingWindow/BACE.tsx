import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../components/button/Button";
import Label, { LabelFontFamily } from "../../components/label/Label";
import Group, { GroupStyle } from "../../components/panel/Group";
import TitleBar from "../../components/panel/TitleBar";
import Scrollable from "../../components/scrollable/Scrollable";
import Window from "../../components/window/Window";

const WindowContent = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  margin-top: 48px;

  ${GroupStyle} {
    margin-top: 16px;
    width: calc(50% - 40px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }

  ${GroupStyle} > button {
    padding: 8px;
    width: 100%;
  }
`;

const ListContainer = styled.div`
  overflow: scroll;
  min-height: 0;
  margin-top: 16px;
  position: relative;
  flex: 1;
`;

const ListWrapper = styled.div`
  position: relative;
  height: 100%;
  overflow: scroll;
`;

const List = styled.ul`
  margin: 8px;

  li {
    list-style: disc outside;
    margin-left: 1rem;
  }
`;

const Categories: Record<string, string[]> = {
  Body: [
    "bike",
    "stroll",
    "dog sports",
    "hiking",
    "meal prep",
    "walk dogs",
    "eat healthy",
    "good things journal",
    "journal emotions",
  ],

  Achievement: [
    "work on 10% time",
    "clean office",
    "laundry",
    "c.s. catch-up",
    "math catch-up",
    "career development",
    "plan L&L",
    "document something",
    "tech debt",
  ],

  Community: [
    "call friend",
    "call Grandma",
    "spend 1-1 time with Jesse",
    "attend club/meet-up",
    "attend PUUC",
    "participate DSA",
    "contribute to open source",
    "date night with Jesse",
    "volunteer",
  ],

  Enjoyment: [
    "write poetry",
    "write prose",
    "write something technical",
    "play online game",
    "play single player game",
    "model something 3D",
    "animate something 3D",
    "sketch something",
    "illustrate something",
    "practice art",
    "read something technical",
    "read fiction",
    "plan travel",
    "plan staycation/weekend excursion",
    "plan video game",
    "travel somewhere",
    "ItsyRealm",
    "dine out",
    "movie",
    "TV show",
    "go to theme park",
  ],
};

const showConfetti = async (x: number, y: number) => {
  const result = await fetch("Animations/Confetti.png");
  const url = URL.createObjectURL(await result.blob());

  const element = document.createElement("img");
  element.src = url;
  element.style.position = "fixed";
  element.style.pointerEvents = "none";
  element.onload = () => {
    element.style.left = `${x - element.width / 2}px`;
    element.style.top = `${y - element.height / 2}px`;

    setTimeout(() => {
      element.parentElement?.removeChild(element);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  document.body.appendChild(element);
};

const ALL = 1 / 0;

const BACE = () => {
  const [currentCategory, setCurrentCategory] = useState<string>("Body");
  const [options, setCurrentOptions] = useState<string[]>([]);

  const randomize = useCallback(
    (category: string, count: number) => {
      const possibleOptions = [...Categories[category]];
      let result = [];
      while (count > 0 && possibleOptions.length > 0) {
        --count;
        result.push(
          possibleOptions.splice(
            Math.floor(Math.random() * possibleOptions.length),
            1,
          )[0],
        );
      }
      setCurrentOptions(result);
    },
    [setCurrentOptions],
  );

  useEffect(() => {
    randomize(currentCategory, ALL);
  }, [currentCategory, randomize]);

  return (
    <Window
      width="min(calc(100vw - 32px), 320px)"
      height="min(calc(100vh - 32px), 640px)"
    >
      <TitleBar>
        <Label
          as="h1"
          family={LabelFontFamily.Serif}
          size="2rem"
          lineHeight="48px"
          weight="600"
        >
          BACE Randomizer
        </Label>
      </TitleBar>
      <WindowContent>
        <Content>
          <Group>
            {Object.keys(Categories).map((key) => (
              <Button
                key={key}
                buttonColor={
                  currentCategory === key
                    ? "dangerousActionColor"
                    : "secondaryActionColor"
                }
                onClick={(event: MouseEvent) => {
                  setCurrentCategory(key);
                  setCurrentOptions(Categories[currentCategory]);
                  showConfetti(event.pageX, event.pageY);
                }}
              >
                <Label>{key}</Label>
              </Button>
            ))}
          </Group>
          <Group>
            <Button
              buttonColor="primaryActionColor"
              onClick={(event: MouseEvent) => {
                setCurrentOptions(Categories[currentCategory]);
                showConfetti(event.pageX, event.pageY);
              }}
            >
              <Label>All</Label>
            </Button>
            <Button
              buttonColor="primaryActionColor"
              onClick={(event: MouseEvent) => {
                randomize(currentCategory, ALL);
                showConfetti(event.pageX, event.pageY);
              }}
            >
              <Label>Randomize</Label>
            </Button>
            <Button
              buttonColor="primaryActionColor"
              onClick={(event: MouseEvent) => {
                randomize(currentCategory, 3);
                showConfetti(event.pageX, event.pageY);
              }}
            >
              <Label>Random 3</Label>
            </Button>
          </Group>
        </Content>
        <ListContainer>
          <Scrollable Container={ListWrapper}>
            <List>
              {options.map((option) => (
                <Label key={option} as="li" lineHeight="1.5rem" weight={400}>
                  {option}
                </Label>
              ))}
            </List>
          </Scrollable>
        </ListContainer>
      </WindowContent>
    </Window>
  );
};

export default BACE;
