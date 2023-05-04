import * as React from 'react';
import {useState} from 'react';
import {Label, Input, Checkbox, Button, Icon} from 'react-figma-plugin-ds';
import {Range, getTrackBackground} from 'react-range';
import ReactLoading from 'react-loading';

import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import '../styles/ui.css';

declare function require(path: string): any;

const App = ({}) => {
    const initialText = 'Import artwork';

    const step = 1;
    const min = 0;
    const max = 4;

    const [data, setData] = useState({
        values: [2],
        search: false,
        query: '',
        toppieces: false,
        onDisplay: false,
        framed: false,
        caption: true,
        loading: false,
    });

    const qualityLabel = {
        4: 'Ultra',
        3: 'Very High',
        2: 'High',
        1: 'Medium',
        0: 'Low',
    };

    const qualityLevel = {
        4: 'z0',
        3: 'z1',
        2: 'z2',
        1: 'z3',
        0: 'z4',
    };

    const valuesHandler = (event) => {
        setData({...data, values: event});
        // console.log(event);
    };

    const searchHandler = (event) => {
        setData({...data, search: event});
    };

    const queryHandler = (event) => {
        setData({...data, query: event});
    };

    const captionHandler = (event) => {
        setData({...data, caption: event});
    };

    const framedHandler = (event) => {
        setData({...data, framed: event});
    };

    const toppiecesHandler = (event) => {
        setData({...data, toppieces: event});
    };

    const onDisplayHandler = (event) => {
        setData({...data, onDisplay: event});
    };

    const onCreate = async () => {
        setData({...data, loading: true});

        // let objectFilter = (data.objectType === "all" ? "" : ("&objecttype=" + data.objectType));
        let onDisplayFilter = data.onDisplay === true ? '&ondisplay=true' : '';
        let queryFilter = data.query === '' ? '' : data.search === false ? '' : '&q=' + encodeURI(data.query);
        let topFilter = '&toppieces=' + data.toppieces.toString();

        const firstUrl =
            'https://www.rijksmuseum.nl/api/nl/collection?key=m6fzmvxx&imgonly=true&culture=en&ps=100' +
            topFilter +
            onDisplayFilter +
            queryFilter;
        console.log(firstUrl);

        // Fetching a list of artwork collections
        let resFirst = await fetch(firstUrl);
        let jsonFirst = await resFirst.json();

        let resCount = jsonFirst.count;

        // Random number should not be bigger than the number of results
        // Random number should be 0 if there is a search query and it's filled in
        let randomNumber =
            data.search === true
                ? 0
                : data.query === ''
                ? Math.floor(Math.random() * (resCount < 100 ? resCount : 100))
                : 0;
        // console.log(randomNumber);

        let collectionID = jsonFirst.artObjects[randomNumber].objectNumber;
        let artworkTitle = jsonFirst.artObjects[randomNumber].longTitle;

        // Fetching the artworks details
        const collectionUrl =
            'https://www.rijksmuseum.nl/api/nl/collection/' + collectionID + '?key=m6fzmvxx&culture=en';
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

        parent.postMessage(
            {
                pluginMessage: {
                    type: 'create',
                    items: JSON.stringify(items),
                    containerWidth: parseInt(containerWidth, 10),
                    containerHeight: parseInt(containerHeight, 10),
                    maxX,
                    maxY,
                    artworkTitle,
                    label,
                    caption: data.caption,
                    framed: data.framed,
                },
            },
            '*'
        );
    };

    return (
        <div className="app">
            <div className="form">
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
                            onChange={valuesHandler}
                            renderTrack={({props, children}) => (
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
                                                colors: [
                                                    'var(--figma-color-bg-brand)',
                                                    'var(--figma-color-bg-secondary)',
                                                ],
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
                            renderThumb={({props}) => (
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
                        ></Range>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="row">
                    <Icon color="black3" name="search" />
                    <Label>Search</Label>
                    <Checkbox label="" defaultValue={false} type="switch" onChange={searchHandler} />
                </div>
                {data.search === true ? (
                    <Input
                        className="input__field"
                        placeholder="Search for artist, style or century"
                        onChange={queryHandler}
                    />
                ) : null}
                <div className="divider"></div>
                <div className="row">
                    <Icon color="black3" name="star-off" />

                    <Label>Toppieces only</Label>
                    <Checkbox label="" id="test" defaultValue={data.toppieces} type="switch" onChange={toppiecesHandler} />
                </div>
                <div className="divider"></div>
                <div className="row">
                    <Icon color="black3" name="image" />

                    <Label>On display</Label>
                    <Checkbox label="" defaultValue={data.onDisplay} type="switch" onChange={onDisplayHandler} />
                </div>
                <div className="divider"></div>
                <div className="row">
                    <Icon color="black3" name="frame" />
                    <Label>With frame</Label>
                    <Checkbox label="" defaultValue={data.framed} type="switch" onChange={framedHandler} />
                </div>
                <div className="divider"></div>
                <div className="row">
                    <Icon color="black3" name="draft" />
                    <Label>With description</Label>
                    <Checkbox label="" defaultValue={data.caption} type="switch" onChange={captionHandler} />
                </div>
                <div className="divider"></div>
            </div>
            <div className="actions">
                {/* Artwork provided by Rijksmuseum Amsterdam */}
                <Button
                    className="primary-btn flex-grow"
                    onClick={onCreate}
                    isDisabled={data.loading === false ? false : true}
                >
                    {data.loading === false ? (
                        initialText
                    ) : (
                        <ReactLoading type={'bubbles'} color={'var(--figma-color-text)'} height={32} width={32} />
                    )}
                </Button>
            </div>
        </div>
    );
};

export default App;
