document.addEventListener('DOMContentLoaded', function () {
    var params = new URL(window.location.href);
    var uuid = params.searchParams.get("uuid");
    var tx = params.searchParams.get("tx");

    if (uuid && tx) {
        document.getElementById("redirect-text").innerHTML = "Submiting...";
        submit(uuid, tx);
    } else {
        document.getElementById("redirect-text").innerHTML = "Missing parameters";
    }
}, false);


function submit(uuid, tx) {
    axios.post('/api/assign', {
            uuid: uuid,
            tx: tx
        })
        .then(function (response) {
            document.getElementById("redirect-text").innerHTML = "Redirecting...";
            window.location.replace(`/operation/${uuid}`)
        }).catch(function (err) {
            document.getElementById("redirect-text").innerHTML = 'Something went wrong.';
            document.getElementById("redirect-text2").innerHTML = 'Please submit the TxHash manually.';
        });

}