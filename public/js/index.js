document.addEventListener('DOMContentLoaded', function () {
    fetchData();
}, false);


function fetchData() {
    axios.get(`https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${global_variables.BSC_CONTRACT}`)
        .then(function (response) {
            document.getElementById("total-bsc").innerHTML = (Number(response.data.result) / 1000000000000000000).toFixed(3) + " iDNA";
        })
        .catch(function (error) {
            console.log(error);
        });

    axios.get(`http://api.idena.io/api/Address/${global_variables.IDENA_WALLET}`)
        .then(function (response) {
            document.getElementById("total-idena").innerHTML = Number(response.data.result.balance).toFixed(3) + " iDNA";
        })
        .catch(function (error) {
            console.log(error);
        });
}