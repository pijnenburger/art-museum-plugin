export const fetchResultCount = async (data: any, query: string) => {
  let typeFilter = data.type ? `&type=${data.type}` : '';
  let queryFilter = query !== '' ? `&q=${encodeURIComponent(query)}` : '';
  let onDisplayFilter = data.onDisplay ? '&ondisplay=true' : '';

  try {
    let countUrl = `https://www.rijksmuseum.nl/api/en/collection?key=m6fzmvxx${typeFilter}&imgonly=true&culture=en&p=1&ps=1${onDisplayFilter}${queryFilter}`;
    const count = await fetch(countUrl).then((r) => r.json().then((r) => r.count));
    return count;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
