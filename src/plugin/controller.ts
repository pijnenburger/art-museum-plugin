import showNotification from '../helpers/showNotification';
import { FONT_LIST } from '../helpers/constants';
import { generateArtStyle, generateFrameStyle } from '../helpers/styles';

figma.showUI(__html__, { width: 340, height: 490, themeColors: true });
Promise.all(FONT_LIST.map((font) => figma.loadFontAsync(font)));

let currentViewX = figma.viewport.center.x;
let currentViewY = figma.viewport.center.y;

function showErrorNotification(message: string) {
  showNotification(message, { error: true, timeout: 2000 });
}

async function createArtwork(msg) {
  const { containerWidth, containerHeight, maxX, maxY, framed, artworkTitle, caption, items, label, scaleFactor } = msg;

  const baseSize = 512;
  const size = 248;

  const container = figma.createFrame();
  container.x = currentViewX;
  container.y = currentViewY;
  container.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
  figma.currentPage.appendChild(container);

  container.resize(containerWidth / (baseSize / size), containerHeight / (baseSize / size));
  container.name = artworkTitle;

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
    pictureFrame.verticalPadding = 25 * scaleFactor;
    pictureFrame.horizontalPadding = 25 * scaleFactor;
    pictureFrame.strokes = [{ type: 'SOLID', color: { r: 0.47, g: 0.27, b: 0.13 }, opacity: 1 }];
    pictureFrame.strokeWeight = 3 * scaleFactor;
    pictureFrame.strokeCap = 'ROUND';
    pictureFrame.dashPattern = [4 * scaleFactor, 8 * scaleFactor];
    pictureFrame.strokeAlign = 'OUTSIDE';
    pictureFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 1 }];

    const FRAME_STYLE = generateFrameStyle(scaleFactor);
    pictureFrame.effects = FRAME_STYLE;
    const ART_STYLE = generateArtStyle(scaleFactor);
    container.effects = ART_STYLE;

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
    const title = label?.title || '[untitled]';
    const makerLine = label?.makerLine || label?.principalMaker || '[unknown artist]';
    const plaqueDescription =
      label?.plaqueDescriptionEnglish ||
      label?.plaqueDescriptionDutch ||
      label?.description ||
      '[no description available]';

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

figma.on('run', () => {
  figma.clientStorage.getAsync('artmuseum_data').then((data) => {
    setTimeout(() => {
      figma.ui.postMessage({ type: 'fetched-data', data });
    }, 200);
  });
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'save-data') {
    figma.clientStorage.setAsync('artmuseum_data', msg.data).then(() => {
      figma.ui.postMessage({ type: 'data-saved', data: msg.data });
    });
  }

  if (msg.type === 'fetch-data') {
    figma.clientStorage.getAsync('artmuseum_data').then((data) => {
      figma.ui.postMessage({ type: 'fetched-data', data });
    });
  }

  switch (msg.type) {
    case 'no-artwork-found':
      showErrorNotification('No artworks found.');
      break;
    case 'error':
      showErrorNotification('An error occurred.');
      break;
    case 'resize':
      figma.ui.resize(msg.size.w, msg.size.h);
      break;
    case 'create':
      await createArtwork(msg);
      figma.closePlugin();
      break;
  }
};
