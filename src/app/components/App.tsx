import React, { useState } from 'react';
import { Label, Button, Checkbox, Icon, Input, Select } from 'react-figma-plugin-ds';
import { Range, getTrackBackground } from 'react-range';
import ReactLoading from 'react-loading';
import CornerResize from './CornerResize';
import { fetchArtworkDetails } from '../../helpers/fetchArtwork';

import types from '../options/types.json';
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import '../styles/ui.css';

const App = () => {
  const step = 1;
  const min = 0;
  const max = 4;

  const [data, setData] = useState({
    values: [2],
    type: '',
    query: '',
    search: false,
    toppieces: false,
    onDisplay: true,
    framed: true,
    caption: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const qualityLabel = ['Low', 'Medium', 'High', 'Very High', 'Ultra'];
  const qualityLevel = {
    4: 'z0',
    3: 'z1',
    2: 'z2',
    1: 'z3',
    0: 'z4',
  };

  // Update data state method
  const updateData = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (key) => (e) => {
    updateData(key, e);
  };

  const queryHandler = (event) => {
    setData({ ...data, query: event });
  };

  const typeHandler = (event) => {
    setData({ ...data, type: event.value });
  };

  const onCreate = async () => {
    setIsLoading(true);
    await fetchArtworkDetails(data, qualityLevel);
    setIsLoading(false);
  };

  return (
    <div className="app">
      <div className="form">
        {/* Product type Selector */}
        <div className="row select-row">
          <Label>Type</Label>
          <Select
            className="input-select"
            defaultValue={data.type}
            onChange={typeHandler}
            options={types}
            placeholder="Select..."
          />
        </div>
        <div className="divider" />
        {/* Quality Selector */}
        <div className="row">
          <div className="input-container">
            <div className="row">
              <Label>Quality</Label>
              <Label className="label-right">{qualityLabel[data.values[0]]}</Label>
            </div>
            <Range
              values={data.values}
              step={step}
              min={min}
              max={max}
              onChange={(values) => updateData('values', values)}
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
                        values: data.values,
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
          <Icon color="black3" name="search" />
          <Label>Search</Label>
          <Checkbox label="" type="switch" defaultValue={data.search} onChange={handleCheckboxChange('search')} />
        </div>
        {data.search === true ? (
          <Input className="input__field" placeholder="Search for artist, style or century" onChange={queryHandler} />
        ) : null}{' '}
        <div className="divider" />
        <div className="row">
          <Icon color="black3" name="star-off" />
          <Label>Toppieces only</Label>
          <Checkbox label="" type="switch" defaultValue={data.toppieces} onChange={handleCheckboxChange('toppieces')} />
        </div>
        <div className="divider" />
        <div className="row">
          <Icon color="black3" name="image" />
          <Label>On display</Label>
          <Checkbox label="" type="switch" defaultValue={data.onDisplay} onChange={handleCheckboxChange('onDisplay')} />
        </div>
        <div className="divider" />
        <div className="row">
          <Icon color="black3" name="frame" />
          <Label>With frame</Label>
          <Checkbox label="" type="switch" defaultValue={data.framed} onChange={handleCheckboxChange('framed')} />
        </div>
        <div className="divider" />
        <div className="row">
          <Icon color="black3" name="draft" />
          <Label>With description</Label>
          <Checkbox label="" type="switch" defaultValue={data.caption} onChange={handleCheckboxChange('caption')} />
        </div>
        <div className="divider" />
      </div>
      <div className="actions">
        {/* Artwork provided by Rijksmuseum Amsterdam */}
        <Button className="primary-btn flex-grow" onClick={onCreate} isDisabled={isLoading}>
          {!isLoading ? (
            'Import Artwork'
          ) : (
            <ReactLoading type={'bubbles'} color={'var(--figma-color-text)'} height={32} width={32} />
          )}
        </Button>
      </div>
      <CornerResize />
    </div>
  );
};

export default App;
