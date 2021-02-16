# idena-bridge-ui

### installation 
go to public/js/script.js  and find global_variables
then edit the values with your own 
```
var global_variables = {
    "API_URL": "http://localhost:8000", # the API url 
    "BSC_EXPLORER": "https://testnet.bscscan.com", # the BSC explorer url
    "IDENA_EXPLORER": "https://scan.idena.io",  # the IDENA explorer url
    "MIN_SWAP": 10,  # Min amount that can be swapped
    "BSC_FEES": 150, # this should be same value as the backend one's
    "IDENA_FIXED_FEES": 1, # this should be same value as the backend one's
    "BSC_CONTRACT": "0x6a719bcbDCCcCe1459C48f34E769A3c43C5B9415", # this should be same value as the backend one's
    "IDENA_WALLET": "0xf2bb83e71f9338d634eb4590a070494455e22a81" # the bridge's wallet address on idena blockchain
};
```
to start the ui execute this ```npm start```