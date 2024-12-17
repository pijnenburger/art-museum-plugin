import { CustomEffect } from './types';

export function generateFrameStyle(scaleFactor: number): CustomEffect[] {
  return [
    {
      type: 'INNER_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.25 },
      offset: { x: -4 * scaleFactor, y: -4 * scaleFactor },
      radius: 4 * scaleFactor,
      spread: 8 * scaleFactor,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'INNER_SHADOW',
      color: { r: 0.62, g: 0.35, b: 0.17, a: 1 },
      offset: { x: 0, y: 0 },
      radius: 0,
      spread: 12 * scaleFactor,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'INNER_SHADOW',
      color: { r: 0.83, g: 0.55, b: 0.37, a: 1 },
      offset: { x: 0, y: 0 },
      radius: 0,
      spread: 8 * scaleFactor,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'INNER_SHADOW',
      color: { r: 0.47, g: 0.27, b: 0.13, a: 1 },
      offset: { x: 0, y: 0 },
      radius: 0,
      spread: 6 * scaleFactor,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.08 },
      offset: { x: 0, y: 16 * scaleFactor },
      radius: 16 * scaleFactor,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.08 },
      offset: { x: 0, y: 16 * scaleFactor },
      radius: 16 * scaleFactor,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.08 },
      offset: { x: 0, y: 24 * scaleFactor },
      radius: 16 * scaleFactor,
      visible: true,
      blendMode: 'NORMAL',
    },
  ];
}

export function generateArtStyle(scaleFactor: number): CustomEffect[] {
  return [
    {
      type: 'INNER_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.2 },
      offset: { x: -2 * scaleFactor, y: -2 * scaleFactor },
      radius: 2 * scaleFactor,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'INNER_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.2 },
      offset: { x: 1 * scaleFactor, y: 1 * scaleFactor },
      radius: 4 * scaleFactor,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
  ];
}

// export const ART_STYLE: CustomEffect[] = [
//   {
//     type: 'INNER_SHADOW',
//     color: { r: 0, g: 0, b: 0, a: 0.2 },
//     offset: { x: -8, y: -8 },
//     radius: 4,
//     visible: true,
//     blendMode: 'NORMAL',
//   },
//   {
//     type: 'INNER_SHADOW',
//     color: { r: 0, g: 0, b: 0, a: 0.2 },
//     offset: { x: 4, y: 4 },
//     radius: 8,
//     spread: 0,
//     visible: true,
//     blendMode: 'NORMAL',
//   },
// ];

// export const FRAME_STYLE: CustomEffect[] = [
//   {
//     type: 'INNER_SHADOW',
//     color: { r: 0, g: 0, b: 0, a: 0.25 },
//     offset: { x: -12, y: -12 },
//     radius: 12,
//     spread: 24,
//     visible: true,
//     blendMode: 'NORMAL',
//   },
//   {
//     type: 'INNER_SHADOW',
//     color: { r: 0.62, g: 0.35, b: 0.17, a: 1 },
//     offset: { x: 0, y: 0 },
//     radius: 0,
//     spread: 32,
//     visible: true,
//     blendMode: 'NORMAL',
//   },
//   {
//     type: 'INNER_SHADOW',
//     color: { r: 0.83, g: 0.55, b: 0.37, a: 1 },
//     offset: { x: 0, y: 0 },
//     radius: 0,
//     spread: 24,
//     visible: true,
//     blendMode: 'NORMAL',
//   },
//   {
//     type: 'INNER_SHADOW',
//     color: { r: 0.47, g: 0.27, b: 0.13, a: 1 },
//     offset: { x: 0, y: 0 },
//     radius: 0,
//     spread: 16,
//     visible: true,
//     blendMode: 'NORMAL',
//   },
//   {
//     type: 'DROP_SHADOW',
//     color: { r: 0, g: 0, b: 0, a: 0.08 },
//     offset: { x: 0, y: 48 },
//     radius: 40,
//     visible: true,
//     blendMode: 'NORMAL',
//   },
//   {
//     type: 'DROP_SHADOW',
//     color: { r: 0, g: 0, b: 0, a: 0.08 },
//     offset: { x: 0, y: 48 },
//     radius: 40,
//     visible: true,
//     blendMode: 'NORMAL',
//   },
//   {
//     type: 'DROP_SHADOW',
//     color: { r: 0, g: 0, b: 0, a: 0.08 },
//     offset: { x: 0, y: 64 },
//     radius: 48,
//     visible: true,
//     blendMode: 'NORMAL',
//   },
// ];
