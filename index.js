const get = (url) => fetch(url).then(res => res.json()).catch(error => error);

const parseReports = (statusData) => statusData.map(({ id, platforms, created_at, updates, incident_severity }) => {
    const updateReports = updates.map(({ id, publish_locations, author, created_at, translations, titles }) => {
        const isAmericanLocale = ({ locale }) => locale === "en_US";

        const translation = translations.find(isAmericanLocale)?.content ?? "";
        const title = titles.find(isAmericanLocale)?.content ?? "";

        return { id, publish_locations, author, created_at, translation, title };
    });

    return { id, platforms, created_at, updateReports, incident_severity };
});

module.exports = (apiKey) => {
    const lol = {
        /**
         * @name                  regionStatus
         * @category              League of Legends
         * @description           Returns an Object with maintenance and incident reports for providen platform.
         * @author                m.
         * @param   { String }    region        Specify an region (BR1, EUN1, EUW1, JP1, KR, LA1, LA2, NA1, OC1, PBE1, RU, TR1) to search for.
         * 
         * @returns { Object }
         */
        platformStatus: (region) => {
            const url = `https://${region.toLowerCase()}.api.riotgames.com/lol/status/v4/platform-data?api_key=${apiKey}`;

            return get(url)
                .then(({ incidents, maintenances }) => ({
                    incidentReports: parseReports(incidents),
                    maintenanceReports: parseReports(maintenances),
                })); // tbh its better to just let it throw than to just silently return errors
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
        getPuuid: (gameName, tagLine, region) => {
            const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${apiKey}`;
            return get(url).then(data => data.puuid);
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
        championRotations: (region) => get(`https://${region}.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${apiKey}`),
    };

    const valorant = {
        /**
         * @name                  getContent
         * @category              Valorant
         * @description           Returns an Object with all API info about VALORANT assets.
         * @author                m.
         * 
         * @returns { Object }
         */
        getContent: () => get(`https://eu.api.riotgames.com/val/content/v1/contents?api_key=${apiKey}`),
        /**
         * @name                  regionStatus
         * @category              VALORANT
         * @description           Returns an Object with maintenance and incident reports for providen platform.
         * @author                m.
         * @param   { String }    region        Specify an region (AP, BR, EU, KR, LATAM, NA) to search for.
         * 
         * @returns { Object }
         */
        platformStatus: (region) => {
            const url = `https://${region.toLowerCase()}.api.riotgames.com/val/status/v1/platform-data?api_key=${apiKey}`;

            return get(url)
                .then(({ incidents, maintenances }) => ({
                    incidentReports: parseReports(incidents),
                    maintenanceReports: parseReports(maintenances),
                }))
                .catch(error => error);
        }
    };

    return { lol, valorant };
};