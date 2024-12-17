export interface CustomEffect {
  type: 'INNER_SHADOW' | 'DROP_SHADOW'; // Adjust the effect types as needed
  color: RGBA;
  offset: { x: number; y: number };
  radius: number;
  spread?: number;
  visible: boolean;
  blendMode: BlendMode;
}
