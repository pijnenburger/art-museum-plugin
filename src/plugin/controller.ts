import showNotification from '../helpers/showNotification';
import { FONT_LIST } from '../helpers/constants';

figma.showUI(__html__, { width: 340, height: 460, themeColors: true });
Promise.all(FONT_LIST.map((font) => figma.loadFontAsync(font)));

function showErrorNotification(message: string) {
  showNotification(message, { error: true, timeout: 2000 });
}

let currentViewX = figma.viewport.center.x;
let currentViewY = figma.viewport.center.y;

async function createArtwork(msg) {
  // Load fonts
  await Promise.all(FONT_LIST.map((font) => figma.loadFontAsync(font)));

  const { containerWidth, containerHeight, maxX, maxY, framed, artworkTitle, caption, items, label } = msg;

  const baseSize = 512;
  const size = 248;

  const container = figma.createFrame();
  container.x = currentViewX;
  container.y = currentViewY;
  container.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
  figma.currentPage.appendChild(container);

  container.resize(containerWidth / (baseSize / size), containerHeight / (baseSize / size));
  container.name = 'Artwork';

  for (const item of JSON.parse(items)) {
    const imageOldUrl = item.url;
    const imageUrl = imageOldUrl.replace('http', 'https');

    const frame = figma.createFrame();
    const finalWidth = containerWidth / (baseSize / size) - item.x * size;
    const finalHeight = containerHeight / (baseSize / size) - item.y * size;
    const frameWidth = item.x === maxX ? finalWidth : size;
    const frameHeight = item.y === maxY ? finalHeight : size;

    frame.resize(frameWidth, frameHeight);
    frame.x = item.x * size;
    frame.y = item.y * size;

    const image = await figma.createImageAsync(imageUrl);
    frame.fills = [
      { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 },
      { type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash },
    ];

    container.appendChild(frame);
  }

  if (framed) {
    // Create framed artwork
    const pictureFrame = figma.createFrame();
    pictureFrame.name = artworkTitle;
    pictureFrame.x = Math.floor(currentViewX);
    pictureFrame.y = Math.floor(currentViewY);
    pictureFrame.clipsContent = true;
    pictureFrame.layoutMode = 'HORIZONTAL';
    pictureFrame.layoutAlign = 'STRETCH';
    pictureFrame.counterAxisSizingMode = 'AUTO';
    pictureFrame.verticalPadding = 48;
    pictureFrame.horizontalPadding = 48;
    pictureFrame.strokes = [{ type: 'SOLID', color: { r: 0.47, g: 0.27, b: 0.13 }, opacity: 1 }];
    pictureFrame.strokeWeight = 8;
    pictureFrame.strokeCap = 'ROUND';
    pictureFrame.dashPattern = [12, 24];
    pictureFrame.strokeAlign = 'OUTSIDE';
    pictureFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 1 }];
    pictureFrame.effects = [
      {
        type: 'INNER_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.25 },
        offset: { x: -12, y: -12 },
        radius: 12,
        spread: 24,
        visible: true,
        blendMode: 'NORMAL',
      },
      {
        type: 'INNER_SHADOW',
        color: { r: 0.62, g: 0.35, b: 0.17, a: 1 },
        offset: { x: 0, y: 0 },
        radius: 0,
        spread: 32,
        visible: true,
        blendMode: 'NORMAL',
      },
      {
        type: 'INNER_SHADOW',
        color: { r: 0.83, g: 0.55, b: 0.37, a: 1 },
        offset: { x: 0, y: 0 },
        radius: 0,
        spread: 24,
        visible: true,
        blendMode: 'NORMAL',
      },
      {
        type: 'INNER_SHADOW',
        color: { r: 0.47, g: 0.27, b: 0.13, a: 1 },
        offset: { x: 0, y: 0 },
        radius: 0,
        spread: 16,
        visible: true,
        blendMode: 'NORMAL',
      },
      {
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 48 },
        radius: 40,
        visible: true,
        blendMode: 'NORMAL',
      },
      {
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 48 },
        radius: 40,
        visible: true,
        blendMode: 'NORMAL',
      },
      {
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 64 },
        radius: 48,
        visible: true,
        blendMode: 'NORMAL',
      },
    ];

    container.effects = [
      {
        type: 'INNER_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.2 },
        offset: { x: -8, y: -8 },
        radius: 4,
        visible: true,
        blendMode: 'NORMAL',
      },
      {
        type: 'INNER_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.2 },
        offset: { x: 4, y: 4 },
        radius: 8,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      },
    ];

    pictureFrame.appendChild(container);
    figma.currentPage.selection = [pictureFrame];
  }

  if (caption) {
    // Create caption
    const captionFrame = figma.createFrame();
    captionFrame.name = 'Caption';
    captionFrame.resize(320, 100);
    captionFrame.clipsContent = true;
    captionFrame.layoutMode = 'VERTICAL';
    captionFrame.layoutAlign = 'STRETCH';
    captionFrame.counterAxisSizingMode = 'FIXED';
    captionFrame.verticalPadding = 32;
    captionFrame.horizontalPadding = 32;
    captionFrame.itemSpacing = 12;
    captionFrame.x = Math.floor(currentViewX);
    captionFrame.y = Math.floor(currentViewY) + (containerHeight / (baseSize / size) + 48 + 100);

    // Create caption text elements
    // Ensure label properties exist before accessing them
    const title = label?.title || '-';
    const makerLine = label?.makerLine || '-';
    const plaqueDescription = label?.plaqueDescriptionEnglish || label?.plaqueDescriptionDutch || '-';

    const titleText = figma.createText();
    titleText.fontName = { family: 'Inter', style: 'Bold' };
    titleText.fontSize = 14;
    titleText.characters = title;

    const makerLineText = figma.createText();
    makerLineText.fontName = { family: 'Inter', style: 'Italic' };
    makerLineText.fontSize = 12;
    makerLineText.characters = makerLine;

    const plaqueDescriptionText = figma.createText();
    plaqueDescriptionText.fontSize = 10;
    plaqueDescriptionText.characters = plaqueDescription;

    captionFrame.appendChild(titleText);
    captionFrame.appendChild(makerLineText);
    captionFrame.appendChild(plaqueDescriptionText);
    titleText.layoutAlign = 'STRETCH';
    makerLineText.layoutAlign = 'STRETCH';
    plaqueDescriptionText.layoutAlign = 'STRETCH';
  }
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'resize') {
    figma.ui.resize(msg.size.w, msg.size.h);
  } else
    try {
      if (msg.type === 'create') {
        await createArtwork(msg);
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorNotification('An error occurred.');
    } finally {
      figma.closePlugin();
    }
};
