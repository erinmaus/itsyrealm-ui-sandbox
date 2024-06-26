import { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import Smith from "./db/Smith.json";
import { useRecoloredImage } from "./images";
import CraftingWindow from "./interfaces/CraftingWindow/CraftingWindow";

const DEFAULT_THEME = {
  background: "#7f684a",
  button: "#9c7e55",
  primaryButton: "#bc5fd3",
  titleBar: "#423829",
  font: "#ffffff",
  textInputFont: "#423829",
  textInputColor: "#bfab8a",
  closeButton: "#c83737",

  primaryActionColor: "#bc5fd3",
  secondaryActionColor: "#9c7e55",
  dangerousActionColor: "#c83737",
  primaryLightFontColor: "#ffffff",
  primaryDarkFontColor: "#423829",
  backgroundColor: "#7f684a",
  darkBackgroundColor: "#423829",
  mediumBackgroundColor: "#5a4428",
  lightBackgroundColor: "#bfab8a",
};

function App() {
  const { store, getImage } = useRecoloredImage();

  const theme = useMemo(
    () => ({ ...DEFAULT_THEME, images: store, getImage }),
    [getImage, store],
  );

  return (
    <ThemeProvider theme={theme}>
      <CraftingWindow list={Smith} />
    </ThemeProvider>
  );
}

export default App;
