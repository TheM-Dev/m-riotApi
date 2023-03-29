// Use code style tools (eslint/prettier)
// You weren;t using translateRegion here.
// Also it could be a good idea to use Object.freeze() to make it immutable as ur using it as an enum.
// In TS u could use Enum or Object as const (second is better).

const get = (url) => fetch(url).then(res => res.json()).catch(error => error);

const parseReports = (statusData) => statusData.map(({ id, platforms, created_at, updates, incident_severity }) => {
    const updateReports = updates.map(({ id, publish_locations, author, created_at, translations, titles }) => {
        // would extract this en_US magic string to some constant
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
            // please mind that regions have a " " space character in them. Are they supposed to be used as a part of that URL with spaces?
            const url = `https://${region.toLowerCase()}.api.riotgames.com/lol/status/v4/platform-data?api_key=${apiKey}`;

            return get(url)
                .then(({ incidents, maintenances }) => ({
                    incidentReports: parseReports(incidents),
                    maintenanceReports: parseReports(maintenances),
                }))
                .catch(error => error); // todo proper error handling for all of the requests
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
            return get(url).then(data => data.puuid).catch(error => error);
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
        championRotations: (region) => {
            const url = `https://${region}.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${apiKey}`;
            return get(url).catch(error => error);
        }
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
        getContent: () => {
            const url = `https://eu.api.riotgames.com/val/content/v1/contents?api_key=${apiKey}`;
            return get(url).then().catch(error => error);
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
        platformStatus: region => {
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