import React, { useEffect, useState } from 'react';
import { Label, Button, Checkbox, Icon, Input } from 'react-figma-plugin-ds';
import { Range, getTrackBackground } from 'react-range';
import ReactLoading from 'react-loading';
import CornerResize from './CornerResize';
import { fetchArtworkDetails } from '../../helpers/fetchArtwork';
// import parentPostMessage from '../../helpers/parentPostMessage';

import types from '../options/productTypes.json';
import qualityLevels from '../options/qualityLevels.json';
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import '../styles/ui.css';

const App = () => {
  const step = 1;
  const min = 0;
  const max = 4;

  const [data, setData] = useState({
    quality: [2],
    type: '',
    toppieces: false,
    onDisplay: true,
    framed: true,
    caption: true,
  });
  const [query, setQuery] = useState('');
  const [resultCount, setResultCount] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Send a message to your controller to fetch the stored data
    parent.postMessage({ pluginMessage: { type: 'fetch-data' } }, '*');

    const onMessage = (event) => {
      if (!event.data.pluginMessage) return; // Guard clause
      const { type, data } = event.data.pluginMessage;
      if (type === 'fetched-data' && data) {
        console.log('Fetched data:', data);
        setData(data);
      }
    };
    window.addEventListener('message', onMessage);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  // Generate qualityLabel array from qualityLevels JSON
  const qualityLabel = qualityLevels.map((quality) => quality.label);
  const qualityLevel = Object.fromEntries(qualityLevels.map((quality) => [quality.value, quality.level]));

  // this calculates the count of options before sending it
  useEffect(() => {
    let typeFilter = data.type ? `&type=${data.type}` : '';
    let queryFilter = query !== '' ? `&q=${encodeURIComponent(query)}` : '';
    let onDisplayFilter = data.onDisplay ? '&ondisplay=true' : '';
    let topFilter = `&toppieces=${data.toppieces.toString()}`;

    const fetchData = async () => {
      setIsLoading(true);
      // Do initial
      try {
        let countUrl = `https://www.rijksmuseum.nl/api/en/collection?key=m6fzmvxx${typeFilter}&imgonly=true&culture=en&p=1&ps=1${topFilter}${onDisplayFilter}${queryFilter}&st=objects`;
        const count = await fetch(countUrl).then((r) => r.json().then((r) => r.count));
        setResultCount(count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };
    // Call the fetchData function when the component mounts
    fetchData();
    return () => {};
  }, [data.type, query, data.toppieces, data.onDisplay]);

  // Update data state method
  const updateData = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (key) => (e) => {
    updateData(key, e);
  };

  const queryHandler = (event) => {
    setQuery(event);
  };

  const onCreate = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await fetchArtworkDetails(data, query, resultCount, qualityLevel);
    parent.postMessage({ pluginMessage: { type: 'save-data', data } }, '*');
    setIsLoading(false);
  };

  const Tab = ({ label, showEmoji = false, emoji = '', active, onClick }) => (
    <div className={`tab ${active && 'tab_active'}`} onClick={onClick}>
      {showEmoji && emoji && <div className="tab_emoji">{emoji}</div>}
      <div className="tab_label">{label}</div>
    </div>
  );

  return (
    <form className="app" onSubmit={onCreate}>
      <div className="scroll-container">
        <div className="input-form">
          {/* Brand Tabs */}
          <div className="row">
            <div className="input-container">
              <div className="row">
                <Label>Object</Label>
                <Label className="label-right">{resultCount} items</Label>
              </div>
              <div className="tab_container">
                {types.map((type) => (
                  <Tab
                    showEmoji
                    emoji={type.emoji}
                    key={type.value}
                    label={type.label}
                    active={data.type === type.value}
                    onClick={() => setData({ ...data, type: type.value })}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Search */}
          <div className="search-input-container">
            <Icon color="black3" name="search" className="search-icon" />
            <Input
              className="input__field search-input"
              placeholder="Search for artist, style or century"
              onChange={queryHandler}
            />
          </div>
          <div className="divider" />
          {/* Quality Selector */}
          <div className="row">
            <div className="input-container">
              <div className="row">
                <Label>Quality</Label>
                <Label className="label-right">{qualityLabel[data.quality[0]]}</Label>
              </div>
              <Range
                values={data.quality}
                step={step}
                min={min}
                max={max}
                onChange={(values) => updateData('quality', values)}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: '36px',
                      display: 'flex',
                      width: '100%',
                    }}
                  >
                    <div
                      ref={props.ref}
                      style={{
                        height: '6px',
                        width: '100%',
                        borderRadius: '4px',
                        background: getTrackBackground({
                          values: data.quality,
                          colors: ['var(--figma-color-bg-brand)', 'var(--figma-color-bg-secondary)'],
                          min: min,
                          max: max,
                        }),
                        alignSelf: 'center',
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '16px',
                      width: '16px',
                      borderRadius: '16px',
                      border: '1px solid var(--figma-color-border-onbrand)',
                      backgroundColor: 'var(--figma-color-text-onbrand)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  ></div>
                )}
              />
            </div>
          </div>
          {/* Toggleable options */}
          <div className="divider" />
          <div className="row">
            <Icon color="black3" name="star-off" />
            <Label>Toppieces only</Label>
            <Checkbox
              label=""
              type="switch"
              defaultValue={data.toppieces}
              onChange={handleCheckboxChange('toppieces')}
              key={`toppieces-${data.toppieces}`}
            />
          </div>
          <div className="divider" />
          <div className="row">
            <Icon color="black3" name="image" />
            <Label>On display</Label>
            <Checkbox
              label=""
              type="switch"
              defaultValue={data.onDisplay}
              onChange={handleCheckboxChange('onDisplay')}
              key={`onDisplay-${data.onDisplay}`}
            />
          </div>
          <div className="divider" />
          <div className="row">
            <Icon color="black3" name="frame" />
            <Label>With frame</Label>
            <Checkbox
              label=""
              type="switch"
              defaultValue={data.framed}
              onChange={handleCheckboxChange('framed')}
              key={`framed-${data.framed}`}
            />
          </div>
          <div className="divider" />
          <div className="row">
            <Icon color="black3" name="draft" />
            <Label>With description</Label>
            <Checkbox
              label=""
              type="switch"
              defaultValue={data.caption}
              onChange={handleCheckboxChange('caption')}
              key={`caption-${data.caption}`}
            />
          </div>
          <div className="divider" />
        </div>
      </div>
      <div className="actions">
        {/* Artwork provided by Rijksmuseum Amsterdam */}
        <Button className="primary-btn flex-grow" isDisabled={isLoading}>
          {!isLoading ? (
            <span>Import artwork</span>
          ) : (
            <ReactLoading type={'bubbles'} color={'var(--figma-color-text)'} height={32} width={32} />
          )}
        </Button>
      </div>
      <CornerResize />
    </form>
  );
};

export default App;
