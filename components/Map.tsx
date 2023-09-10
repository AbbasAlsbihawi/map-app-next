// s/Map.tsx
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import L from 'leaflet';
import * as turf from '@turf/turf';
import { useState } from 'react';

const Map = () => {
    const customMarker = new L.Icon({
        iconUrl: '/favicon.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });


    // Function to convert a circle to a polygon
    function circleToPolygon(center: [number, number], radiusInMeters: number, numberOfSegments = 64) {
        return turf.circle(center, radiusInMeters / 1000, {
            steps: numberOfSegments,
            units: 'kilometers'
        });
    }
    const [features, setFeatures] = useState<any[]>([]);

    const handleCreate = (e: any) => {
        const { layer, layerType } = e;

        if (layerType === 'circle') {
            const center = layer.getLatLng();
            const radius = layer.getRadius();
            const circlePolygon = circleToPolygon([center.lng, center.lat], radius);

            console.log("Circle converted to Polygon GeoJSON:", circlePolygon);
            setFeatures(prevFeatures => [...prevFeatures, circlePolygon]);
        } else {
            const geoJSON = layer.toGeoJSON();
            setFeatures(prevFeatures => [...prevFeatures, geoJSON]);
        }
    };

    const handleEdit = (e: any) => {
        const { layers } = e;
        layers.eachLayer((layer: any) => {
            const geoJSON = layer.toGeoJSON();
            console.log("Edited GeoJSON:", geoJSON);
        });
        // const editedLayers = e.layers;
        // const updatedFeatures: any[] = [...features];  // Clone the existing features

        // editedLayers.eachLayer((layer: any) => {
        //     const newGeoJSON = layer.toGeoJSON();

        //     // Assuming that the coordinates can be used as a unique identifier
        //     const index = updatedFeatures.findIndex(f =>
        //         JSON.stringify(f.geometry.coordinates) === JSON.stringify(newGeoJSON.geometry.coordinates)
        //     );

        //     if (index !== -1) {
        //         // Replace the old feature with the edited feature
        //         updatedFeatures[index] = newGeoJSON;
        //     }
        // });

        // setFeatures(updatedFeatures);
    };

    const handleDelete = (e: any) => {
        const deletedLayers = e.layers;
        let remainingFeatures: any[] = [...features];  // Clone the existing features

        deletedLayers.eachLayer((layer: any) => {
            const deletedGeoJSON = layer.toGeoJSON();

            // Filter out the deleted feature
            remainingFeatures = remainingFeatures.filter(f =>
                JSON.stringify(f.geometry.coordinates) !== JSON.stringify(deletedGeoJSON.geometry.coordinates)
            );
        });

        setFeatures(remainingFeatures);
    };


    // const handleCreate = (e: any) => {
    //     const { layer, layerType } = e;

    //     if (layerType === 'circle') {
    //         const center = layer.getLatLng();
    //         const radius = layer.getRadius();
    //         const circlePolygon = circleToPolygon([center.lng, center.lat], radius);

    //         console.log("Circle converted to Polygon GeoJSON:", circlePolygon);
    //     } else {
    //         const geoJSON = layer.toGeoJSON();
    //         console.log("Created GeoJSON:", geoJSON);
    //     }
    // }


    // const handleCreate = (e: any) => {
    //     const { layer } = e;
    //     const geoJSON = layer.toGeoJSON();
    //     console.log("Created GeoJSON:", geoJSON);


    //     // const { layer, layerType } = e;

    //     // if (layerType === 'circle') {
    //     //     const center = layer.getLatLng();
    //     //     const radius = layer.getRadius();
    //     //     const circleGeoJSON = {
    //     //         type: 'Feature',
    //     //         properties: {
    //     //             radius: radius
    //     //         },
    //     //         geometry: {
    //     //             type: 'Point',
    //     //             coordinates: [center.lng, center.lat]
    //     //         }
    //     //     };
    //     //     console.log("Created Circle GeoJSON:", circleGeoJSON);
    //     // } else {
    //     //     const geoJSON = layer.toGeoJSON();
    //     //     console.log("Created GeoJSON:", geoJSON);
    //     // }
    // }

    // const handleEdit = (e: any) => {
    //     const { layers } = e;
    //     layers.eachLayer((layer: any) => {
    //         const geoJSON = layer.toGeoJSON();
    //         console.log("Edited GeoJSON:", geoJSON);
    //     });
    // }

    // const handleDelete = (e: any) => {
    //     const { layers } = e;
    //     layers.eachLayer((layer: any) => {
    //         const geoJSON = layer.toGeoJSON();
    //         console.log("Deleted GeoJSON:", geoJSON);
    //     });
    // }
    const mapConfig = {
        lat: 33.305111,
        lng: 44.367466,
        zoom: 10
    };
    return (
        <div className="h-screen"> 
            <MapContainer
                center={[mapConfig.lat, mapConfig.lng]} zoom={mapConfig.zoom}
                style={{ height: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={handleCreate}
                        onEdited={handleEdit} 
                        onDeleted={handleDelete}
                        // edit={{
                        //     edit: false,
                        //     remove: false
                        // }}
                        draw={{
                            rectangle: false,
                            marker: {
                                icon: customMarker
                            },
                            polyline: {
                                shapeOptions: {
                                    color: '#f72585', // Line color
                                    weight: 5
                                }
                            },
                            circle: {
                                shapeOptions: {
                                    color: '#3a0ca3' // Circle color
                                }
                            }
                        }}
                    />
                </FeatureGroup>
            </MapContainer>
        </div>
    );
}

export default Map;


// npm install
//  leaflet react-leaflet react-leaflet-draw @types/leaflet @types/react-leaflet leaflet-draw next-transpile-modules tailwindcss postcss autoprefixer

