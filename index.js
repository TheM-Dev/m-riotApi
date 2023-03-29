// Use code style tools (eslint/prettier)
// its nice to keep it in a separate file, tho its so small it could be here as well to keep it in one file :D
const translate = require('./translateRegion');
// Again, no need for axios. Just use Fetch API
const axios = require('axios');

// Just pass the apiKey as a param. Tho wrapping it in an object is quite a common pattern in JS world. But this module function works like a constructor function
// could be an arrow function tbh, no difference tbh as it is the matter of preference
module.exports = function (options) {
    // No need to assign it to `this`
    this.apiKey = options.apiKey;
    this.lol = {
        /**
         * @name                  regionStatus
         * @category              League of Legends
         * @description           Returns an Object with maintenance and incident reports for providen platform.
         * @author                m.
         * @param   { String }    region        Specify an region (BR1, EUN1, EUW1, JP1, KR, LA1, LA2, NA1, OC1, PBE1, RU, TR1) to search for.
         * 
         * @returns { Object }
         */
        platformStatus: async region => {
            // use `const` instead of `let`, you are not reasigning it later on.
            // Why is the `region` toLowerCase here and not in the rest of the urls? Sometimes it is and sometimes not. Quite inconsistent
            let url = `https://${region.toLowerCase()}.api.riotgames.com/lol/status/v4/platform-data?api_key=${this.apiKey}`;
            // just return axios.get... no need for the intermediatary object to return it instantly. Especially when it has a non-meaningful name
            // just return the promise, no need to async/await it
            const res = await axios.get(url).then((response) => {
                // because of Axios usage u need to unwrap it from `data`
                // you could just destructure the `response` in the args ({ incidents, maintenances }) => {...}
                // Same as above, use `const` over `let` if ur not reasigning values
                let incidents = response.data.incidents;
                let maintenances = response.data.maintenances;
                // no need for those, use Array.map()
                const maintenanceReports = [];
                const incidentReports = [];
                // destructure it incidents.map(({ id, platforms, created_at, ...etc }) => ...)
                Array.from(incidents).forEach(i => {
                    const { id, platforms, created_at, updates, incident_severity } = i;
                    const updateReports = []; // same thing, just map over `updates`
                    Array.from(updates).forEach(u => { // destructure `u`
                        const { id, publish_locations, author, created_at, translations, titles } = u;
                        let title = ''; let translation = ''; // dont inline it, less readable.

                        // use const translation = Array.find(...) ?? "";
                        // find will return an object or undef if it cant match it, nullish coalescing operator will allow for fallback to initial "" when its undef
                        if (translations) Array.from(translations).forEach(trans => { if (trans.locale === 'en_US') return translation = trans.content });

                        // same as above, i can see a potential for some predicate extraction or even a function
                        if (titles) Array.from(titles).forEach(title => { if (title.locale === 'en_US') return title = title.content });

                        // no need for pushing when you have `map`, just return the object
                        updateReports.push({ id, publish_locations, author, created_at, translation, title });
                    });
                    // same as above, just return object while using Array.map
                    incidentReports.push({ id, platforms, created_at, updateReports, incident_severity });
                });
                // same as in the case of incidents
                Array.from(maintenances).forEach(i => {
                    // this is the same code, just extract a function and use it two times ;)
                    const { id, platforms, created_at, updates, incident_severity } = i;
                    const updateReports = [];
                    Array.from(updates).forEach(u => {
                        const { id, publish_locations, author, created_at, translations, titles } = u;
                        let title = ''; let translation = '';
                        if (translations) Array.from(translations).forEach(trans => { if (trans.locale === 'en_US') return translation = trans.content });
                        if (titles) Array.from(titles).forEach(title => { if (title.locale === 'en_US') return title = title.content });
                        updateReports.push({ id, publish_locations, author, created_at, translation, title });
                    });
                    maintenanceReports.push({ id, platforms, created_at, updateReports, incident_severity });
                });
                return { maintenanceReports, incidentReports };
            }).catch((err) => {
                return err.data; // don't forget to change that when removing axios
            })
            return res; // redundant
        },
        /**
         * @name                  getPuuid
         * @category              League of Legends
         * @description           Returns an String with PUUID of providen player.
         * @author                m.
         * @param   { String }    gameName      Specify Player Name (the part before hash).
         * @param   { String }    tagLine       Specify Player Tag (the part after hash).
         * @param   { String }    region        Specify an region (europe, americas, esports, asia) to search for.
         * 
         * @returns { String }
         */
        getPuuid: async (gameName, tagLine, region) => {
            // const
            let url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${this.apiKey}`;
            // could be simplified a lot if you wouldn;t use axios
            // no need for async, just pass the promise and let the clients await it wherever they are consuming it
            // just return it ;)
            const res = await axios.get(url).then((response) => {
                const { puuid } = response.data;
                return puuid;
            }).catch((err) => {
                return err.data;
            })
            return res;
        },
        /**
         * @name                  championRotations
         * @category              League of Legends
         * @description           Returns an Object with info about champions rotations.
         * @author                m.
         * @param   { String }    region        Specify an region (BR1, EUN1, EUW1, JP1, KR, LA1, LA2, NA1, OC1, PBE1, RU, TR1) to search for.
         * 
         * @returns { Object }
         */
        championRotations: async (region) => {
            // const
            let url = `https://${region}.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${this.apiKey}`;
            // same as above
            const res = await axios.get(url).then((response) => {
                return response.data;
            }).catch((err) => {
                return err.data;
            })
            return res;
        }
    }
    this.valorant = {
        /**
         * @name                  getContent
         * @category              Valorant
         * @description           Returns an Object with all API info about VALORANT assets.
         * @author                m.
         * 
         * @returns { Object }
         */
        getContent: async () => {
            // const, same as above ;)
            let url = `https://eu.api.riotgames.com/val/content/v1/contents?api_key=${this.apiKey}`;
            const res = await axios.get(url).then((response) => {
                return response.data;
            }).catch((err) => {
                return err.data;
            })
            return res;
        },
        /**
         * @name                  regionStatus
         * @category              VALORANT
         * @description           Returns an Object with maintenance and incident reports for providen platform.
         * @author                m.
         * @param   { String }    region        Specify an region (AP, BR, EU, KR, LATAM, NA) to search for.
         * 
         * @returns { Object }
         */
        platformStatus: async region => {
            // const
            let url = `https://${region.toLowerCase()}.api.riotgames.com/val/status/v1/platform-data?api_key=${this.apiKey}`;
            // just return it :) same reasons as above. async functions returns promise anyways
            const res = await axios.get(url).then((response) => {
                // this is the duplicate code as LOL platform status
                // you can reuse it somehow. or just keep it copied but refactor it as well as i mentioned above.
                // The reason why it might be a good idea to duplicate that code is that those APIs are the same BY ACCIDENT
                // they are two different apis in the end, and one might change while the other not
                let incidents = response.data.incidents;
                let maintenances = response.data.maintenances;
                const maintenanceReports = [];
                const incidentReports = [];
                Array.from(incidents).forEach(i => {
                    const { id, platforms, created_at, updates, incident_severity } = i;
                    const updateReports = [];
                    Array.from(updates).forEach(u => {
                        const { id, publish_locations, author, created_at, translations, titles } = u;
                        let title = ''; let translation = '';
                        if (translations) Array.from(translations).forEach(trans => { if (trans.locale === 'en_US') return translation = trans.content });
                        if (titles) Array.from(titles).forEach(title => { if (title.locale === 'en_US') return title = title.content });
                        updateReports.push({ id, publish_locations, author, created_at, translation, title });
                    });
                    incidentReports.push({ id, platforms, created_at, updateReports, incident_severity });
                });
                Array.from(maintenances).forEach(i => {
                    const { id, platforms, created_at, updates, incident_severity } = i;
                    const updateReports = [];
                    Array.from(updates).forEach(u => {
                        const { id, publish_locations, author, created_at, translations, titles } = u;
                        let title = ''; let translation = '';
                        if (translations) Array.from(translations).forEach(trans => { if (trans.locale === 'en_US') return translation = trans.content });
                        if (titles) Array.from(titles).forEach(title => { if (title.locale === 'en_US') return title = title.content });
                        updateReports.push({ id, publish_locations, author, created_at, translation, title });
                    });
                    maintenanceReports.push({ id, platforms, created_at, updateReports, incident_severity });
                });
                return { maintenanceReports, incidentReports };
            }).catch((err) => {
                return err.data;
            })
            return res;
        }
    }
}