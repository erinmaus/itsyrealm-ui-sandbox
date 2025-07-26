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
    element.style.zIndex = "10000";

    setTimeout(() => {
      element.parentElement?.removeChild(element);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  document.body.appendChild(element);
};

export const useShowConfetti = () => ({
  showConfetti,
});
