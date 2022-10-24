const translate = require('./translateRegion');
const axios = require('axios');
module.exports = function(options){
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
            let url = `https://${region.toLowerCase()}.api.riotgames.com/lol/status/v4/platform-data?api_key=${this.apiKey}`;
            const res = await axios.get(url).then((response) => {
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
                        if(translations) Array.from(translations).forEach(trans => { if(trans.locale === 'en_US') return translation = trans.content });
                        if(titles) Array.from(titles).forEach(title => { if(title.locale === 'en_US') return title = title.content });
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
                        if(translations) Array.from(translations).forEach(trans => { if(trans.locale === 'en_US') return translation = trans.content });
                        if(titles) Array.from(titles).forEach(title => { if(title.locale === 'en_US') return title = title.content });
                        updateReports.push({ id, publish_locations, author, created_at, translation, title });
                    });
                    maintenanceReports.push({ id, platforms, created_at, updateReports, incident_severity });
                });
                return { maintenanceReports, incidentReports };
            }).catch((err) => {
                return err.data;
            })
            return res;
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
            let url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${this.apiKey}`;
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
            let url = `https://${region}.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${this.apiKey}`;
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
            let url = `https://eu.api.riotgames.com/val/content/v1/contents?api_key=${this.apiKey}`;
            const res = await axios.get(url).then((response) => {
                return response.data;
            }).catch((err) => {
                return err.data;
            })
            return res;
        }
    }
}