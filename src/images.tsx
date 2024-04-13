import { useSyncExternalStore } from "react";

type RecoloredImageStore = Record<string, string>;
type ImageStore = Record<string, RecoloredImageStore>;

let IMAGE_STORE: ImageStore = {};

type Listener = () => void;

let listeners: Listener[] = [];

export const subscribe = (listener: Listener) => {
  listeners = [...listeners, listener];

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

export const getSnapshot = () => {
  return IMAGE_STORE;
};

export const loadImage = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = (e) => {
      reject(e);
    };

    image.src = url;
  });
};

export const clearImages = () => {
  Object.values(IMAGE_STORE).forEach((images) =>
    Object.values(images).forEach((image) => URL.revokeObjectURL(image)),
  );
};

export const recolorImage = async (
  image: HTMLImageElement,
  color: string,
): Promise<string> => {
  const buffer = document.createElement("canvas");
  buffer.width = image.width;
  buffer.height = image.height;

  const context = buffer.getContext("2d");
  if (!context) {
    throw new Error("Could not create recolor context.");
  }

  context.drawImage(image, 0, 0);

  context.fillStyle = color;
  context.globalCompositeOperation = "multiply";
  context.fillRect(0, 0, buffer.width, buffer.height);

  context.globalAlpha = 1.0;
  context.globalCompositeOperation = "destination-in";
  context.drawImage(image, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    buffer.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not create blob."));
      } else {
        resolve(blob);
      }
    });
  });

  return URL.createObjectURL(blob);
};

export const addImage = async (url: string, color: string) => {
  if (IMAGE_STORE[url] && IMAGE_STORE[url][color]) {
    return;
  }

  if (!IMAGE_STORE[url]) {
    IMAGE_STORE[url] = {};
  }

  const image = await loadImage(url);
  const imageURL = await recolorImage(image, color);

  IMAGE_STORE[url] = {
    ...IMAGE_STORE[url],
    [color]: imageURL,
  };

  IMAGE_STORE = { ...IMAGE_STORE };

  listeners.forEach((listener) => listener());
};

export const getImage = (url: string, color: string): string => {
  if (
    !IMAGE_STORE[url] ||
    (!IMAGE_STORE[url][color] && IMAGE_STORE[url][color] !== "")
  ) {
    if (!IMAGE_STORE[url]) {
      IMAGE_STORE[url] = {};
    }

    IMAGE_STORE[url][color] = "";

    addImage(url, color);
  }

  return IMAGE_STORE[url][color];
};

export const useRecoloredImage = () => ({
  store: useSyncExternalStore(subscribe, getSnapshot),
  addImage,
  getImage,
  clearImages,
});
