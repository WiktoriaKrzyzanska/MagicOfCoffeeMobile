import 'dotenv/config';
import appJson from './app.json';

export default () => ({
    ...appJson,
    ios: {
        ...appJson.ios,
        config: {
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        }
    },
    android: {
        ...appJson.android,
        config: {
            googleMaps: {
                apiKey: process.env.GOOGLE_MAPS_API_KEY,
            }
        }
    }
});
