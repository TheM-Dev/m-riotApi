const translate = require('./translateRegion');
const axios = require('axios');
module.exports = function(options){
    this.baseUri = (region) => { return `https://${region.toLowerCase()}.api.riotgames.com/` };
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
        platformStatus = async region => {
            let url = `${this.baseUri(region)}lol/status/v4/platform-data?api_key=${this.apiKey}`;
            const res = await axios.get(url).then((response) => {
                const { maintenances, incidents } = response;
                const maintenanceReports = [];
                const incidentReports = [];
                incidents.forEach(i => {
                    const { id, platforms, created_at, updates, incident_severity } = i;
                    const updateReports = [];
                    updates.forEach(u => {
                        const { id, publish_locations, author, created_at, translations, titles } = u;
                        let title = ''; let translation = '';
                        translations.forEach(trans => { if(trans.locale === 'en_US') return translation = trans.content });
                        titles.forEach(title => { if(title.locale === 'en_US') return title = title.content });
                        updateReports.push({ id, publish_locations, author, created_at, translation, title });
                    });
                    incidentReports.push({ id, platforms, created_at, updateReports, incident_severity });
                });
                return { maintenanceReports, incidentReports };
            }).catch((err) => {
                return err;
            })
            return res;
        }
    }
}