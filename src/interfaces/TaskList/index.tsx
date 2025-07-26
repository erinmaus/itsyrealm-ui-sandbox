import { ChangeEvent, useCallback, useEffect, useState } from "react";
import styled, { keyframes, useTheme } from "styled-components";
import Button, { ButtonStyle } from "../../components/button/Button";
import TextArea, { TextAreaStyle } from "../../components/input/TextArea";
import Label, {
  LabelFontFamily,
  LabelStyle,
} from "../../components/label/Label";
import Scrollable from "../../components/scrollable/Scrollable";
import Window from "../../components/window/Window";
import { useShowConfetti } from "../../useShowConfetti";

const ScrollBackgroundKeyFrames = keyframes`
    from {
        background-position: 0%;
    }

    to {
        background-position: 100%;
    }
`;

const PaperWindowContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
`;

const PaperWindow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 320px;
  max-height: 640px;
  padding: 8px;
  gap: 8px;

  ${TextAreaStyle} {
    padding: 0px 8px;
    line-height: 24px;
    font-size: 16px;
    min-height: 12em;
    flex: 1;
  }

  ${ButtonStyle} {
    align-self: center;
  }

  border-image: url("Tasks/Paper.png") 64 64 fill / 64px 64px repeat;
`;

const WindowContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: calc(100% - 64px);
  min-height: calc(640px - 64px);
  padding: 12px;
  gap: 8px;
`;

const TaskListContainer = styled.div`
  overflow: scroll;
  min-height: 0;
  margin-top: 16px;
  margin-bottom: 16px;
  position: relative;
  flex: 1;
  height: 100%;
`;

const ProgressBar = styled.div`
  width: 100%;
  border-radius: 16px;
  border: 4px solid #7137c8;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const CurrentProgressBar = styled.div<{ $percent: number }>`
  width: ${(props) => props.$percent * 100}%;
  height: 48px;
  border-radius: ${(props) =>
    props.$percent === 1 ? "12px" : "12px 0px 0px 12px"};
  animation: ${ScrollBackgroundKeyFrames} infinite 5s linear;
  background: url("Tasks/ProgressGold.png");
  transition:
    0.25s ease-in-out width,
    0.25s ease-in-out border-radius;
`;

const RemainingProgressBar = styled.div<{ $percent: number }>`
  width: ${(props) => (1 - props.$percent) * 100}%;
  height: 48px;
  border-radius: ${(props) =>
    props.$percent === 0 ? "12px" : "0px 12px 12px 0px"};
  background: url("Tasks/ProgressStar.png");
  transition:
    0.25s ease-in-out width,
    0.25s ease-in-out border-radius;
`;

const BounceKeyFrames = keyframes`
    from {
        transform: scale(120%) rotate(0);
    }

    50% {
        transform: scale(60%) rotate(360deg);
    }

    to {
        transform: scale(100%) rotate(360deg);
    }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  ${LabelStyle} {
    color: ${(props) => props.theme.primaryDarkFontColor};
    mix-blend-mode: normal;
  }
`;

const RotationKeyFrames1 = keyframes`
  from {
    transform: rotate(0)
  }

  to {
    transform: rotate(360deg)
  }
`;

const RotationKeyFrames2 = keyframes`
  from {
    transform: rotate(180deg)
  }

  to {
    transform: rotate(-180deg)
  }
`;

const GratsForeground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background: center / contain no-repeat url("Tasks/GratsForeground.png");

  animation: ${RotationKeyFrames1} infinite 16s linear;
`;

const GratsBackground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background: center / contain no-repeat url("Tasks/GratsBackground.png");

  animation: ${RotationKeyFrames2} infinite 8s linear;
`;

const GratsWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  ${LabelStyle} {
    margin-top: 256px;
    color: #ffd42a;
    paint-order: stroke fill;
    -webkit-text-stroke: 24px black;
    animation: ${BounceKeyFrames} 0.5 ease-in-out;
  }

  z-index: 1500;
`;

const FadeInOutKeyFrames = keyframes`
    from {
      opacity: 0;
    }

    25% {
      opacity: 1;
    }

    75% {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
`;

const Congrats = styled.div`
  pointer-events: none;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  opacity: 0;

  img {
    z-index: 1000;
  }

  animation: ${FadeInOutKeyFrames} 2s ease-in-out;

  z-index: 1000;
`;

const saveTasks = (task: string) => localStorage.setItem("taskItems", task);
const loadTasks = (): string =>
  localStorage.getItem("taskItems") ??
  `
✅ make breakfast
make lunch
make dinner
`;

const TaskList = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [taskInput, setTaskInput] = useState<string>(loadTasks());
  const [showCongrats, setShowCongrats] = useState(false);
  const { showConfetti } = useShowConfetti();

  const currentTasks = taskInput
    .split("\n")
    .map((element) => element.trim())
    .filter((element) => element !== "");
  const completeTasks = currentTasks.filter((task) => task.match(/^✅\s/));
  const percent = completeTasks.length / Math.max(currentTasks.length, 1);

  useEffect(() => {
    if (percent === 1) {
      setShowCongrats(true);
      setTimeout(() => {
        setShowCongrats(false);
      }, 2000);
    }
  }, [percent, setShowCongrats]);

  useEffect(() => {
    saveTasks(taskInput);
  }, [taskInput]);

  const handleBeginEdit = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const handleEdit = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setTaskInput(event.target.value);
    },
    [setTaskInput],
  );

  const handleFinishEdit = useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  return (
    <Window Frame={PaperWindow} Container={PaperWindowContainer}>
      <WindowContent>
        {showCongrats && (
          <Congrats>
            <GratsBackground />
            <GratsForeground />
            <img src="Animations/Mimic.png" alt="" />
            <GratsWrapper>
              <Label
                family={LabelFontFamily.Serif}
                size="128px"
                color={theme.primaryActionColor}
              >
                GRATS!
              </Label>
            </GratsWrapper>
          </Congrats>
        )}
        <ProgressBar>
          <CurrentProgressBar $percent={percent} />
          <RemainingProgressBar $percent={percent} />
        </ProgressBar>
        <TaskListContainer>
          {!isEditing && (
            <Scrollable>
              {currentTasks.map((task, index, tasks) => {
                if (task.match(/^✅\s/)) {
                  const toggle = () => {
                    setTaskInput(
                      tasks
                        .map((t, i) =>
                          i === index ? t.replace(/^✅\s/, "") : t,
                        )
                        .join("\n"),
                    );
                  };

                  return (
                    <Content>
                      <img
                        src="Tasks/Done.png"
                        alt="task done"
                        role="button"
                        width="24px"
                        height="24px"
                        tabIndex={0}
                        onClick={toggle}
                      />
                      <Label
                        lineHeight="24px"
                        size="16px"
                        color={theme.darkBackgroundColor}
                      >
                        {task.replace(/^✅\s/, "")}
                      </Label>
                    </Content>
                  );
                } else {
                  const toggle = () => {
                    setTaskInput(
                      tasks
                        .map((t, i) => (i === index ? "✅ " + t : t))
                        .join("\n"),
                    );
                    showConfetti(
                      document.body.getBoundingClientRect().width / 2,
                      document.body.getBoundingClientRect().height / 2,
                    );
                  };

                  return (
                    <Content>
                      <img
                        src="Tasks/Pending.png"
                        alt="task pending"
                        role="button"
                        width="24px"
                        height="24px"
                        tabIndex={0}
                        onClick={toggle}
                      />
                      <Label
                        lineHeight="24px"
                        size="16px"
                        color={theme.darkBackgroundColor}
                      >
                        {task}
                      </Label>
                    </Content>
                  );
                }
              })}
            </Scrollable>
          )}
          {isEditing && <TextArea onChange={handleEdit} value={taskInput} />}
        </TaskListContainer>
        <Button
          width="50%"
          height="48px"
          buttonColor="primaryActionColor"
          onClick={isEditing ? handleFinishEdit : handleBeginEdit}
        >
          <Label>{isEditing ? "Done" : "Edit"}</Label>
        </Button>
      </WindowContent>
    </Window>
  );
};

export default TaskList;
