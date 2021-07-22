document.addEventListener('DOMContentLoaded', function () {
    updateCardsLinks();
    fetchData();
}, false);

function updateCardsLinks() {
    document.getElementById("bsc-link").href = global_variables.BSC_EXPLORER + "/token/" + global_variables.BSC_CONTRACT;
    document.getElementById("idena-link").href = global_variables.IDENA_EXPLORER + "/address/" + global_variables.IDENA_WALLET;
}

function fetchData() {
    axios.get("/api/tokensupply")
        .then(function (response) {
            document.getElementById("total-bsc").innerHTML = (Number(response.data.result) / 1000000000000000000).toFixed(3) + " iDNA";
        })
        .catch(function (error) {
            console.log(error);
        });

    axios.get(`https://api.idena.io/api/Address/${global_variables.IDENA_WALLET}`)
        .then(function (response) {
            document.getElementById("total-idena").innerHTML = Number(response.data.result.balance).toFixed(3) + " iDNA";
        })
        .catch(function (error) {
            console.log(error);
        });
}