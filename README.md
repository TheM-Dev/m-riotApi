# m-riotApi
Simple scraper for easier access to the Riot APIdata.

### Functions:
- League of Legends:
    - regionStatus(REGION) - Returns an Object with maintenance and incident reports for providen platform.
        **Response:**
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
        }```