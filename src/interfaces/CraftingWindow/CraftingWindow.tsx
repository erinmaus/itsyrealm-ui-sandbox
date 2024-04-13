import { Fragment } from "react/jsx-runtime";
import styled from "styled-components";
import Button from "../../components/button/Button";
import TextInput from "../../components/input/TextInput";
import ItemIcon from "../../components/item/ItemIcon";
import Label, {
  LabelFontFamily,
  LabelStyle,
} from "../../components/label/Label";
import Group from "../../components/panel/Group";
import TitleBar from "../../components/panel/TitleBar";
import Scrollable from "../../components/scrollable/Scrollable";
import Window from "../../components/window/Window";
import { CraftList } from "../../db/DB";

export interface CraftingWindowProps {
  list: CraftList;
}

const Content = styled.div`
  margin-top: 64px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RightColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 12px;
`;

const InputRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GridWrapper = styled.div`
  position: absolute;

  left: 12px;
  right: 12px;
  top: 12px;
  bottom: 12px;

  overflow: auto;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  overflow: auto;
`;

const Title = styled(LabelStyle)`
  flex-basis: 100%;
`;

const CraftingWindow = ({ list }: CraftingWindowProps) => {
  return (
    <Window width="640px" height="480px">
      <TitleBar>
        <Label
          as="h1"
          family={LabelFontFamily.Serif}
          size="2rem"
          lineHeight="48px"
          weight="600"
        >
          Craft an item
        </Label>
        <Button width="48px" height="48px" buttonColor="dangerousActionColor">
          <Label>X</Label>
        </Button>
      </TitleBar>
      <Content>
        <Group width="290px" height="228px">
          <Scrollable Container={GridWrapper}>
            <Grid>
              {list.groups
                .filter((group) => group.actions.length > 0)
                .map((group) => (
                  <Fragment key={group.literal}>
                    <Title
                      key={group.literal}
                      as="h3"
                      $family={LabelFontFamily.Serif}
                      $size="1.5rem"
                      $lineHeight="2rem"
                    >
                      {group.literal}
                    </Title>
                    {group.actions.map((action, index) => (
                      <Button
                        key={`${group.literal}-${index}`}
                        width="48px"
                        height="48px"
                      >
                        <ItemIcon
                          item={
                            action.outputs?.find(
                              (output) => output.type === "Item",
                            )?.resource ?? "Null"
                          }
                          quantity={
                            action.outputs?.find(
                              (output) => output.type === "Item",
                            )?.count ?? 1
                          }
                        />
                      </Button>
                    ))}
                  </Fragment>
                ))}
            </Grid>
          </Scrollable>
        </Group>
        <RightColumn>
          <Group width="290px" height="228px"></Group>
          <Label
            family={LabelFontFamily.Serif}
            size="1.5rem"
            lineHeight="1.5rem"
          >
            Quantity:
          </Label>
          <InputRow>
            <TextInput value="0" width="calc(100% - 128px - 24px)" />
            <Button
              width="128px"
              height="48px"
              buttonColor="primaryActionColor"
            >
              <Label>Make it!</Label>
            </Button>
          </InputRow>
          <InputRow>
            <Button width="96px" height="48px">
              <Label>Make 1</Label>
            </Button>
            <Button width="96px" height="48px">
              <Label>Make 10</Label>
            </Button>
            <Button width="96px" height="48px">
              <Label>Make All</Label>
            </Button>
          </InputRow>
        </RightColumn>
      </Content>
    </Window>
  );
};

export default CraftingWindow;
