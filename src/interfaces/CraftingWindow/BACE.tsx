import { decode, encode } from "js-base64";
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router";
import styled, { useTheme } from "styled-components";
import { Categories } from "../../bace";
import Button from "../../components/button/Button";
import TextArea, { TextAreaStyle } from "../../components/input/TextArea";
import Label, { LabelFontFamily } from "../../components/label/Label";
import Group, { GroupStyle } from "../../components/panel/Group";
import TitleBar from "../../components/panel/TitleBar";
import Scrollable from "../../components/scrollable/Scrollable";
import Window from "../../components/window/Window";
import { useShowConfetti } from "../../useShowConfetti";

const WindowContent = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  ${TextAreaStyle} {
    margin-top: 16px;
    margin-bottom: 16px;
    flex: 1;
  }
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
  margin-bottom: 16px;
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ShareLink = styled.div`
  display: flex;
  white-space: nowrap;
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
`;

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  height: calc(100% - 64px);

  margin-top: 64px;
`;

const Footer = styled.div`
  margin-top: 8px;
`;

const ALL = 1 / 0;

const DEFAULT_ACTIVITIES: Categories = {
  Body: ["walk", "journal"],
  Achievements: ["work", "school"],
  Community: ["friends", "family"],
  Enjoyment: ["watch tv", "play video games", "read book"],
};

const loadItems = (defaultItems?: Categories): Categories => {
  const baceItemsStorage = localStorage.getItem("baceItems");
  if (!baceItemsStorage && defaultItems) {
    return defaultItems;
  }

  const baceItems: Categories = JSON.parse(baceItemsStorage ?? "{}");

  return {
    Body: baceItems.Body ?? defaultItems?.Body ?? DEFAULT_ACTIVITIES.Body,
    Achievements:
      baceItems.Achievements ??
      defaultItems?.Achievements ??
      DEFAULT_ACTIVITIES.Achievements,
    Community:
      baceItems.Community ??
      defaultItems?.Community ??
      DEFAULT_ACTIVITIES.Community,
    Enjoyment:
      baceItems.Enjoyment ??
      defaultItems?.Enjoyment ??
      DEFAULT_ACTIVITIES.Enjoyment,
  };
};

const saveItems = (items: Categories) => {
  localStorage.setItem("baceItems", JSON.stringify(items));
};

const BACE_ORDER = ["Body", "Achievements", "Community", "Enjoyment"];

interface CategoryButtonProps {
  isActive: boolean;
  category: string;
  onSelectCategory: (category: string) => void;
}

const CategoryButton = ({
  isActive,
  category,
  onSelectCategory,
}: CategoryButtonProps) => {
  const handleClick = useCallback(() => {
    onSelectCategory(category);
  }, [category, onSelectCategory]);

  return (
    <Button
      key={category}
      buttonColor={isActive ? "dangerousActionColor" : "secondaryActionColor"}
      onClick={handleClick}
    >
      <Label>{category}</Label>
    </Button>
  );
};

const BACE = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [wasShared, setWasShared] = useState(false);
  const [oldCategoryData, setOldCategoryData] = useState<string | null>(null);
  const [didLoad, setDidLoad] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_ACTIVITIES);
  const [currentCategory, setCurrentCategory] = useState<string>("Body");
  const [options, setCurrentOptions] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isShowingPopup, setIsShowingPopup] = useState(false);
  const [didCopy, setDidCopy] = useState(false);
  const shareLinkRef = useRef<HTMLDivElement>(null);
  const [didSave, setDidSave] = useState(true);
  const { showConfetti } = useShowConfetti();

  useEffect(() => {
    if (
      searchParams.has("categories") &&
      (!wasShared || oldCategoryData !== searchParams.get("categories"))
    ) {
      setCategories(
        JSON.parse(decode(searchParams.get("categories") || "") ?? "{}"),
      );
      setCurrentOptions(categories[currentCategory] ?? []);
      setWasShared(true);
      setOldCategoryData(searchParams.get("categories"));
    } else if ((!searchParams.has("categories") && wasShared) || !didLoad) {
      const savedCategories = loadItems(DEFAULT_ACTIVITIES);
      setCategories(savedCategories);
      setCurrentOptions(savedCategories[currentCategory]);
      setWasShared(false);
      setOldCategoryData(null);
    }
  }, [
    didLoad,
    wasShared,
    categories,
    currentCategory,
    searchParams,
    oldCategoryData,
    setOldCategoryData,
    setCategories,
    setWasShared,
    setSearchParams,
  ]);

  useEffect(() => {
    setDidLoad(true);
  }, [setDidLoad]);

  useEffect(() => {
    if (!didSave) {
      const beforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
      };

      window.addEventListener("beforeunload", beforeUnload);

      return () => {
        window.removeEventListener("beforeunload", beforeUnload);
      };
    }
  }, [didSave]);

  const randomize = useCallback(
    (category: string, count: number) => {
      console.log("RANDOMIZE", { category, count });
      const possibleOptions = [...categories[category]];
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
    [categories, setCurrentOptions],
  );

  const beginEditing = useCallback(
    (category?: string) => {
      setCategoryInput(categories[category ?? currentCategory].join("\n"));
      setIsEditing(true);
      setDidSave(false);
    },
    [categories, currentCategory, setCategoryInput, setIsEditing],
  );

  const handleBeginEdit = useCallback(() => {
    beginEditing();
  }, [beginEditing]);

  const handleEdit = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setCategoryInput(event.target.value);
    },
    [setCategoryInput],
  );

  const finishEditing = useCallback(() => {
    const { [currentCategory]: editedCategory, ...otherCategories } =
      categories;

    const result = {
      ...otherCategories,
      [currentCategory]: categoryInput
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item),
    };

    setCategories(result);
    setCurrentOptions(result[currentCategory]);

    setIsEditing(false);
  }, [
    categories,
    categoryInput,
    currentCategory,
    setCategories,
    setIsEditing,
    setCurrentOptions,
  ]);

  const handleFinishEdit = useCallback(
    (event: MouseEvent) => {
      finishEditing();

      if (event) {
        showConfetti(event.pageX, event.pageY);
      }
    },
    [finishEditing, showConfetti],
  );

  const share = useCallback(
    (event: MouseEvent) => {
      setDidCopy(false);
      setIsShowingPopup(true);
      showConfetti(event.pageX, event.pageY);
    },
    [setIsShowingPopup, setDidCopy, showConfetti],
  );

  const selectShareLink = useCallback(() => {
    if (shareLinkRef.current) {
      const selection = document.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(shareLinkRef.current);
        selection.removeAllRanges();
        selection.addRange(range);

        document.execCommand("copy");

        setDidCopy(true);
      }
    }
  }, [setDidCopy]);

  const handleClickShareLink = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      selectShareLink();
      showConfetti(event.pageX, event.pageY);
    },
    [selectShareLink, showConfetti],
  );

  const handlePressShareLink = useCallback(() => {
    selectShareLink();
  }, [selectShareLink]);

  const save = useCallback(
    (event: MouseEvent) => {
      saveItems(categories);
      setDidSave(true);
      showConfetti(event.pageX, event.pageY);
    },
    [categories, setDidSave, showConfetti],
  );

  const closePopup = useCallback(() => {
    setIsShowingPopup(false);
  }, []);

  const handleSelectCategory = useCallback(
    (category: string) => {
      if (isEditing) {
        finishEditing();
      }

      setCurrentCategory(category);

      if (isEditing) {
        beginEditing(category);
      }
    },
    [isEditing, finishEditing, beginEditing, setCurrentCategory],
  );

  const showAll = useCallback(() => {
    setCurrentOptions(categories[currentCategory]);
  }, [categories, currentCategory, setCurrentOptions]);

  const showRandom = useCallback(
    (event: MouseEvent) => {
      randomize(currentCategory, ALL);
      showConfetti(event.pageX, event.pageY);
    },
    [randomize, currentCategory, showConfetti],
  );

  const showRandom3 = useCallback(
    (event: MouseEvent) => {
      randomize(currentCategory, 3);
      showConfetti(event.pageX, event.pageY);
    },
    [randomize, currentCategory, showConfetti],
  );

  useEffect(() => {
    setCurrentOptions(categories[currentCategory]);
  }, [categories, currentCategory, setCurrentOptions]);

  const shareURL = useMemo(() => {
    const { protocol, host, pathname, hash } = window.location;

    const categoriesQueryData = encode(JSON.stringify(categories));

    return `${protocol}//${host}${pathname}${hash}?categories=${categoriesQueryData}`;
  }, [categories]);

  return (
    <>
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
              {BACE_ORDER.map((key) => (
                <CategoryButton
                  key={key}
                  category={key}
                  isActive={key === currentCategory}
                  onSelectCategory={handleSelectCategory}
                />
              ))}
            </Group>
            <Group>
              <Button onClick={showAll}>
                <Label>All</Label>
              </Button>
              <Button buttonColor="primaryActionColor" onClick={showRandom}>
                <Label>Randomize</Label>
              </Button>
              <Button buttonColor="primaryActionColor" onClick={showRandom3}>
                <Label>Random 3</Label>
              </Button>
            </Group>
          </Content>
          {!isEditing && (
            <ListContainer>
              <Scrollable Container={ListWrapper}>
                <List>
                  {options.map((option) => (
                    <Label
                      key={option}
                      as="li"
                      lineHeight="1.5rem"
                      weight={400}
                    >
                      {option}
                    </Label>
                  ))}
                </List>
              </Scrollable>
            </ListContainer>
          )}
          {isEditing && (
            <TextArea onChange={handleEdit} value={categoryInput} />
          )}
          <ButtonWrapper>
            <Button
              width="calc(50% - 6px)"
              height="48px"
              buttonColor="primaryActionColor"
              onClick={isEditing ? handleFinishEdit : handleBeginEdit}
            >
              <Label>{isEditing ? "Done" : "Edit"}</Label>
            </Button>
            <Button width="calc(50% - 6px)" height="48px" onClick={share}>
              <Label>Save/Share</Label>
            </Button>
          </ButtonWrapper>
          <Footer>
            <Label weight={400} align="center">
              @bkdoormaus on <a href="https://discord.com">Discord</a>/
              <a href="https://bsky.app/profile/bkdoormaus.bsky.social">
                BlueSky
              </a>
              !
            </Label>
            <Label weight={400} align="center">
              Make a copy of the{" "}
              <a href="https://docs.google.com/spreadsheets/d/1xrVOBhFbCtOEq9atx0VqgMVyO4B54V4c5Ds8ZUqS6PM/edit?usp=sharing">
                BACE Spreadsheet
              </a>
              !
            </Label>
          </Footer>
        </WindowContent>
      </Window>
      {isShowingPopup && (
        <Popup>
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
                Share
              </Label>
              <Button
                width="48px"
                height="48px"
                buttonColor="closeButton"
                onClick={closePopup}
              >
                <Label>X</Label>
              </Button>
            </TitleBar>
            <PopupContent>
              <div>
                <Label weight={400} lineHeight="24px">
                  Copy this link to bookmark or share the BACE activities
                  between devices.
                </Label>
                <Label color={theme.dangerousActionColor} lineHeight="24px">
                  ⚠️ If you lose this link, any changes you made will be lost if
                  you don't save with the "Save" button below.
                </Label>
              </div>
              <Group width="calc(100% - 24px)" height="24px">
                <ShareLink
                  ref={shareLinkRef}
                  tabIndex={0}
                  onClick={handleClickShareLink}
                  onKeyDown={handlePressShareLink}
                >
                  <Label family={LabelFontFamily.Monospace} lineHeight="24px">
                    {shareURL}
                  </Label>
                </ShareLink>
              </Group>
              <Button
                buttonColor="primaryActionColor"
                width="100%"
                height="48px"
                onClick={handleClickShareLink}
                disabled={didCopy}
              >
                <Label>{didCopy ? "Copied!" : "Copy Link"}</Label>
              </Button>
              <div>
                <Label weight={400} lineHeight="24px">
                  Or click this button to save locally to your device. You can
                  always use the link above to share later.
                </Label>
                <Label color={theme.dangerousActionColor} lineHeight="24px">
                  ⚠️ This will overwrite any saved BACE activity data on this
                  device. Please proceed with caution if using a shared link.
                </Label>
              </div>
              <Button
                buttonColor="primaryActionColor"
                width="100%"
                height="48px"
                onClick={save}
              >
                <Label>Save!</Label>
              </Button>
              <Button
                buttonColor="closeButton"
                width="100%"
                height="48px"
                onClick={closePopup}
              >
                <Label>Close</Label>
              </Button>
            </PopupContent>
          </Window>
        </Popup>
      )}
    </>
  );
};

export default BACE;
