export default function parentPostMessage(type: string, data?: object) {
  parent.postMessage(
    {
      pluginMessage: {
        type,
        ...data,
      },
      pluginId: '1146781921444949676',
    },
    'https://www.figma.com'
  );
}
