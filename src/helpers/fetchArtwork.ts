import parentPostMessage from './parentPostMessage';

export const fetchArtworkDetails = async (data: any, qualityLevel: { [key: number]: string }) => {
  try {
    let typeFilter = data.types ? `&type=${encodeURIComponent(data.type)}` : '';
    let queryFilter = data.search && data.query !== '' ? `&q=${encodeURIComponent(data.query)}` : '';
    let onDisplayFilter = data.onDisplay ? '&ondisplay=true' : '';
    let topFilter = `&toppieces=${data.toppieces.toString()}`;

    let countUrl = `https://www.rijksmuseum.nl/api/nl/collection?key=m6fzmvxx&imgonly=true&culture=en&p=1&ps=1${typeFilter}${topFilter}${onDisplayFilter}${queryFilter}`;
    let count = await fetch(countUrl).then((r) => r.json().then((s) => s.count));

    let randomNumber = Math.min(Math.ceil(Math.random() * count), 10000);
    let firstUrl = `https://www.rijksmuseum.nl/api/nl/collection?key=m6fzmvxx&imgonly=true&culture=en&p=${randomNumber}&ps=1${typeFilter}${topFilter}${onDisplayFilter}${queryFilter}`;

    console.log(firstUrl);
    let jsonFirst = await fetch(firstUrl).then((r) => r.json());
    console.log('Artworks found:', jsonFirst.count);

    if (jsonFirst.count > 0) {
      let collectionID = jsonFirst.artObjects[0].objectNumber;
      let artworkTitle = jsonFirst.artObjects[0].longTitle;

      console.log(`Selected artwork: ${artworkTitle} (${collectionID})`);
      // Fetching the artworks details
      const collectionUrl = 'https://www.rijksmuseum.nl/api/nl/collection/' + collectionID + '?key=m6fzmvxx&culture=en';
      let resSecond = await fetch(collectionUrl);
      let jsonSecond = await resSecond.json();

      let label = jsonSecond.artObject;

      // Fetching the image tiles
      const fetchUrl = 'https://www.rijksmuseum.nl/api/nl/collection/' + collectionID + '/tiles?key=m6fzmvxx';

      let res = await fetch(fetchUrl);
      let json = await res.json();

      let results = json.levels.filter((obj) => {
        return obj.name === qualityLevel[data.values[0]];
      });

      const containerWidth = results[0].width;
      const containerHeight = results[0].height;
      const items = results[0].tiles;

      const maxX = Math.max.apply(
        Math,
        items.map(function (o: any) {
          return o.x;
        })
      );
      const maxY = Math.max.apply(
        Math,
        items.map(function (o: any) {
          return o.y;
        })
      );
      parentPostMessage('create', {
        items: JSON.stringify(items),
        containerWidth: parseInt(containerWidth, 10),
        containerHeight: parseInt(containerHeight, 10),
        maxX,
        maxY,
        artworkTitle,
        label,
        caption: data.caption,
        framed: data.framed,
      });
    } else {
      console.log('No artworks found.');
    }
  } catch (error) {
    console.error('Error fetching artwork:', error);
  }
};
