# RiotRacers-SendAssetApp

The Send Asset App is a NODE JS CLI app that when called with the correct CLI arguments will query the db for assets (cars, gas stations, etc) with a saleStatus of (3) Transfer Pending it will create a transaction on the Polygon chain to transfer the asset from us to the buyer. 

CLI Arguments  
Action ('list', 'transfer') 
AssetType ('car', 'gasstation', 'mechanicshop', 'racetrackland')
NumberToProcess (#) - this will limit the number of items that the app processes

The app should output clearly what it is doing and the current status. It should also output the blockchain transaction IDs for each transfer. Each blockchain transaction ID should also be stored in the TransactionLogs table in the RR database.
