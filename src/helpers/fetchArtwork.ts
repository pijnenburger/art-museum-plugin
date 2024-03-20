import parentPostMessage from './parentPostMessage';
import showNotification from './showNotification';

export const fetchArtworkDetails = async (data: any, resultCount: number, qualityLevel: { [key: number]: string }) => {
  try {
    let typeFilter = data.type ? `&type=${data.type}` : '';
    let queryFilter = data.search && data.query !== '' ? `&q=${encodeURIComponent(data.query)}` : '';
    let onDisplayFilter = data.onDisplay ? '&ondisplay=true' : '';
    let topFilter = `&toppieces=${data.toppieces.toString()}`;

    let randomNumber = Math.min(Math.ceil(Math.random() * resultCount), 10000);
    let url = `https://www.rijksmuseum.nl/api/en/collection?key=m6fzmvxx${typeFilter}&imgonly=true&culture=en&p=${randomNumber}&ps=1${topFilter}${onDisplayFilter}${queryFilter}&st=objects`;

    // console.log(firstUrl);
    let json = await fetch(url).then((r) => r.json());
    console.log('Artworks found:', json.count);

    if (json.count > 0) {
      let collectionID = json.artObjects[0].objectNumber;
      let artworkTitle = json.artObjects[0].longTitle;

      console.log(`Selected artwork: ${artworkTitle} (${collectionID})`);

      const [detailsResponse, tilesResponse] = await Promise.all([
        fetch(`https://www.rijksmuseum.nl/api/nl/collection/${collectionID}?key=m6fzmvxx&culture=en`),
        fetch(`https://www.rijksmuseum.nl/api/nl/collection/${collectionID}/tiles?key=m6fzmvxx`),
      ]);

      const [detailsData, tilesData] = await Promise.all([detailsResponse.json(), tilesResponse.json()]);

      let label = detailsData.artObject;
      let results = tilesData.levels.filter((obj) => {
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
      parentPostMessage('no-artwork-found');
      console.log('No artworks found.');
    }
  } catch (error) {
    showNotification('Error fetching artwork', { error: true, timeout: 2000 });
    console.error('Error fetching artwork:', error);
  }
};
