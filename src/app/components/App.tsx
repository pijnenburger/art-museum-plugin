import React, { useEffect, useState } from 'react';
import { Label, Button, Checkbox, Icon, Input } from 'react-figma-plugin-ds';
import { Range, getTrackBackground } from 'react-range';
import ReactLoading from 'react-loading';
import CornerResize from './CornerResize';
import { fetchArtworkDetails } from '../../helpers/fetchArtwork';
import { fetchResultCount } from '../../helpers/fetchResultCount';

import types from '../options/productTypes.json';
import qualityLevels from '../options/qualityLevels.json';
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import '../styles/ui.css';

console.log(types);

const step = 1;
const min = 0;
const max = 4;

const App = () => {
  const [data, setData] = useState(() => ({
    quality: [2],
    type: '',
    onDisplay: true,
    framed: true,
    caption: true,
    resultCount: null,
  }));
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const initialFetchComplete = React.useRef(false);

  // Get the storedData
  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'fetch-data' } }, '*');
    function handleMessages(event) {
      const { type, data: newData } = event.data.pluginMessage;

      if (type === 'fetched-data') {
        console.log('restored data:', newData);

        setData((prev) => ({
          ...prev, // Preserve existing state
          ...newData, // Overwrite only valid properties
          type: newData?.type ?? prev.type, // Ensure 'type' is not undefined
        }));

        initialFetchComplete.current = true; // Mark initial fetch as complete
      }
    }
    window.addEventListener('message', handleMessages);

    return () => {
      // Cleanup the event listener
      window.removeEventListener('message', handleMessages);
    };
  }, []);

  const fetchData = async () => {
    if (!initialFetchComplete.current) return; // Prevent fetchData before initial data is set

    setIsLoading(true);
    const newCount = await fetchResultCount(data, query);
    updateData('resultCount', newCount);
    setIsLoading(false);
  };

  // this calculates the count of options before sending it
  useEffect(() => {
    // Call the fetchData function whenever data changes
    if (initialFetchComplete.current) {
      // Only run this effect if initial data has been fetched
      fetchData();
    }

    return () => {};
  }, [data.type, data.onDisplay, query]);

  // Generate qualityLabel array from qualityLevels JSON
  const qualityLabel = qualityLevels.map((quality) => quality.label);
  const qualityLevel = Object.fromEntries(qualityLevels.map((quality) => [quality.value, quality.level]));

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
    await fetchArtworkDetails(data, query, qualityLevel);
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
                <Label className="label-right">{data.resultCount} items</Label>
              </div>
              <div className="tab_container">
                {Array.isArray(types) &&
                  types.map((type) => (
                    <Tab
                      showEmoji
                      emoji={type.emoji}
                      key={type.value}
                      label={type.label}
                      active={data.type === type.value}
                      onClick={() => updateData('type', type.value)}
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
