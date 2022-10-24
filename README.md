# m-riotApi
Simple scraper for easier access to the Riot APIdata.

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