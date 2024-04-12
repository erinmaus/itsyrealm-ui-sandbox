import { ThemeProvider } from "styled-components";
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
};

function App() {
  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      <CraftingWindow />
    </ThemeProvider>
  );
}

export default App;
