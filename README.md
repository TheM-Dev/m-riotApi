# m-riotApi
Simple scraper for easier access to the Riot API data.

### Functions:
- League of Legends:
    - regionStatus(REGION) - Returns an Object with maintenance and incident reports for providen platform.
        Example response: 
        ```js
        {
            maintenanceReports: [],
            incidentReports: [
                {
                    id: 5352,
                    platforms: [Array],
                    created_at: '2022-10-07T17:33:46.120931+00:00',
                    updateReports: [Array],
                    incident_severity: 'warning'
                }
            ]
        }
        ```
    - getPuuid(GAMENAME, TAGLINE, REGION) - Returns an String with PUUID of providen player.
        Example response: 
        ```
            c70O0s54T9o3rHZV4eCGg-BHAZE7ZoS98djsd7hWu8bEY7W7_uMKV2Cf-j4eHCAQezYApm5NnAl4og
        ```
    - championRotations(REGION) - Returns an Object with info about champions rotations.
        Example response:
        ```js
        {
            "freeChampionIds": [
                3,
                27,
                30,
                35,
                37,
                54,
                89,
                110,
                111,
                127,
                154,
                221,
                240,
                245,
                420,
                555
            ],
            "freeChampionIdsForNewPlayers": [
                222,
                254,
                427,
                82,
                131,
                147,
                54,
                17,
                18,
                37
            ],
            "maxNewPlayerLevel": 10
        }
        ```
- VALORANT:
    - getContent() - Returns an Object with all API info about VALORANT assets.
        Example response: 
        ```js
        {
            "version": "release-05.08",
            "characters": [
                {
                    "name": "Fade",
                    "localizedNames": {
                        "ar-AE": "فايد",
                        "de-DE": "Fade",
                        "en-US": "Fade",
                        "es-ES": "Fade",
                        "es-MX": "Fade",
                        "fr-FR": "Fade",
                        "id-ID": "Fade",
                        "it-IT": "Fade",
                        "ja-JP": "フェイド",
                        "ko-KR": "페이드",
                        "pl-PL": "Fade",
                        "pt-BR": "Fade",
                        "ru-RU": "Fade",
                    ...
                }
            ...]
        }
        ```
    - regionStatus(REGION) - Returns an Object with maintenance and incident reports for providen platform.
        Example response: 
        ```js
        {
            maintenanceReports: [],
            incidentReports: [
                {
                    id: 5352,
                    platforms: [Array],
                    created_at: '2022-10-07T17:33:46.120931+00:00',
                    updateReports: [Array],
                    incident_severity: 'warning'
                }
            ]
        }
        ```