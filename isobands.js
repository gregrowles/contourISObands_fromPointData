
runAsyncGet = async ( fetchURL, getData ) => {

	let resolveDataGet = new Promise((resolve, reject) => {

		$.ajax({
			url: fetchURL,
			type: 'get',
			dataType: 'json',
			contentType: 'application/json',
			success: function ( respData ) {
				resolve ( respData );
			},
			data: JSON.stringify( getData ),
			error: function ( err ) {
				console.log( 'GetERROR', err );
				reject( err );
			}
		});

	});

	let result = await resolveDataGet;

	return result
}
asyncGetData = async ( getUrl, data ) => {

	let resolveGet = new Promise(function(resolve, reject) {

		resolve( runAsyncGet( getUrl, data ) );

	});

	let newData = await resolveGet;

	return newData;

}
getFINDcountiesGeoJSON = async ( callback ) => {

    var url = 'find.counties.json';
	var result = await asyncGetData( url );

	if ( callback ) callback( result )
	else return result;
}
getRNDGeoJSON = async ( callback ) => {

    let result = [ {
        type: "Feature",
        properties: {},
        geometry: {
            type: "MultiPolygon",
            coordinates: [
                [
                    [
                        [110.763, 41.376],
                        [110.823, 41.381],
                        [110.815, 41.357],
                        [110.944, 41.317],
                        [110.978, 41.346],
                        [111.026, 41.299],
                        [111.085, 41.285],
                        [111.096, 41.306],
                        [111.232, 41.238],
                        [111.273, 41.289],
                        [111.439, 41.327],
                        [111.724, 41.309],
                        [111.833, 41.252],
                        [111.822, 41.216],
                        [111.862, 41.204],
                        [111.874, 41.129],
                        [112.027, 41.046],
                        [112.011, 41.003],
                        [112.035, 40.968],
                        [112.138, 40.938],
                        [112.178, 40.818],
                        [112.144, 40.761],
                        [112.086, 40.738],
                        [112.124, 40.697],
                        [112.108, 40.657],
                        [112.038, 40.654],
                        [112.092, 40.587],
                        [112.046, 40.559],
                        [112.218, 40.448],
                        [112.259, 40.391],
                        [112.229, 40.354],
                        [112.264, 40.356],
                        [112.305, 40.253],
                        [111.964, 39.795],
                        [111.925, 39.611],
                        [111.829, 39.619],
                        [111.777, 39.588],
                        [111.64, 39.643],
                        [111.511, 39.663],
                        [111.43, 39.642],
                        [111.435, 39.67],
                        [111.358, 39.721],
                        [111.366, 39.789],
                        [111.439, 39.896],
                        [111.405, 40.044],
                        [111.308, 40.151],
                        [111.039, 40.27],
                        [111.024, 40.31],
                        [111.108, 40.33],
                        [111.121, 40.382],
                        [110.953, 40.495],
                        [110.895, 40.483],
                        [110.837, 40.534],
                        [110.874, 40.585],
                        [110.796, 40.611],
                        [110.78, 40.79],
                        [110.705, 40.805],
                        [110.739, 40.917],
                        [110.623, 40.941],
                        [110.672, 41.053],
                        [110.639, 41.1],
                        [110.65, 41.164],
                        [110.554, 41.224],
                        [110.559, 41.261],
                        [110.512, 41.291],
                        [110.547, 41.288],
                        [110.569, 41.331],
                        [110.629, 41.31],
                        [110.719, 41.385],
                        [110.763, 41.376]
                    ]
                ]
            ]
        }
    } ];

    if ( callback ) callback( result );
    else return result;
}
getKEGeoJSON = async ( callback ) => {

    var url = 'ke.json'; //'kenya.geojson';
	var result = await asyncGetData( url );

	if ( callback ) callback( result )
	else return result;
}
getKenyaGeoJSON = async ( callback ) => {

    var url = 'kenya.geojson';
	var result = await asyncGetData( url );

	if ( callback ) callback( result )
	else return result;
}
getPointData = async ( callback ) => {

    var url = 'point.data.json';
	var result = await asyncGetData( url );

	if ( callback ) callback( result )
	else return result;
}
getLabData = async ( callback ) => {

    var url = 'labs.data.json';
	var result = await asyncGetData( url );

	if ( callback ) callback( result )
	else return result;
}

turfISObands = () => {

    getKEGeoJSON( ( boundaries ) => {

        boundaries[ 'crs' ] = { type: "name", properties: {  name: "urn:ogc:def:crs:OGC:1.3:CRS84" } };

        getPointData( ( pointData) => {


            console.log( 'pointData', pointData );
            let pointArr = [];
        
            for ( var i = 0; i < pointData.length; i++ )
            {
                let row = pointData[ i ];
                let point = turf.point( row.viewMode.geometry.coordinates, { id: row.id, name: row.name, code: row.code, level: row.level, value: parseFloat( row?.data?.historicReferrals?.sum || 0 ) } )
        
                pointArr.push( point );
        
            }
        
            // need points (with z-Values), e.g. node.properties.metric.capacity
            var points = turf.featureCollection( pointArr );
        
            // need interpolationOptions
            var interpolate_options = {
                gridType: "points",
                property: "value",
                units: "degrees",
                weight: 10
            };
        
            // need interpolation grid (square outer region)
            let grid = turf.interpolate( points, 0.05, interpolate_options );
            grid.features.map((i) => (i.properties.value = i.properties.value.toFixed(2)));
        
        
            console.log('grid', grid);
            console.log('grid', grid.features.filter( row => row.properties.value !== '0.00' ) );
        
            var isobands_options = {
                zProperty: "value",
                commonProperties: {
                    "fill-opacity": 0.8
                },
                breaksProperties: [{
                        fill: "#e3e3ff"
                    },
                    {
                        fill: "#c6c6ff"
                    },
                    {
                        fill: "#a9aaff"
                    },
                    {
                        fill: "#8e8eff"
                    },
                    {
                        fill: "#7171ff"
                    },
                    {
                        fill: "#5554ff"
                    },
                    {
                        fill: "#3939ff"
                    },
                    {
                        fill: "#1b1cff"
                    },
                    {
                        fill: "#1500ff"
                    }
                ]
            };
        
            var isoBand_rangeGroups = [1, 10, 20, 30, 50, 70, 100];
        
            let isobands = turf.isobands(
                grid,
                isoBand_rangeGroups,
                isobands_options
            );
        
            boundaries = turf.flatten( boundaries );
            isobands = turf.flatten( isobands );
        
            let features = [];
        
            isobands.features.forEach(function (layer1) {
        
                boundaries.features.forEach(function (layer2) {
                    let intersection = null;
                    try {
                        intersection = turf.intersect(layer1, layer2);
                    } catch (e) {
                        layer1 = turf.buffer(layer1, 0);
                        intersection = turf.intersect(layer1, layer2);
                    }
                    if (intersection != null) {
                        intersection.properties = layer1.properties;
                        intersection.id = Math.random() * 100000;
                        features.push(intersection);
                    }
                });
            });
        
            let intersection = turf.featureCollection(features);
        
            console.log( 'intersection', intersection );

        })
    
        
    })


}

onEachBoundaryFeature = ( feature, layer ) => {

    layer.bindTooltip( feature.properties.value, { direction: 'right', offset: [ 0, -5 ], sticky: true } );
}
styleBoundaries = ( f, l ) => {

    return { weight: 2, color: '#808080' };
}

styleISObands = ( f, l ) => {

    let style = f.properties;
    let leftVal = parseFloat( f.properties.value.split('-')[ 0 ] / 100 );
    console.log( f, style );
    style[ 'fillOpacity' ] = leftVal;

    return style;
}