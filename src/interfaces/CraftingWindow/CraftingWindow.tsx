import styled from "styled-components";
import Window from "../../components/window/Window";
import TitleBar from "../../components/panel/TitleBar";
import Group from "../../components/panel/Group";
import TextInput from "../../components/input/TextInput";
import Label, { LabelFontFamily } from "../../components/label/Label";
import Button from "../../components/button/Button";

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

const CraftingWindow = () => {
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
        <Button width="48px" height="48px" buttonColor="closeButton">
          <Label>X</Label>
        </Button>
      </TitleBar>
      <Content>
        <Group width="290px" height="228px" />
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
            <Button width="128px" height="48px" buttonColor="primaryButton">
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
