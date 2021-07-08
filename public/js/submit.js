document.addEventListener('DOMContentLoaded', function () {
    var params = new URL(window.location.href);
    var uuid = params.searchParams.get("uuid");
    var tx = params.searchParams.get("tx");

    if (uuid && tx) {
        document.getElementById("retry-btn").onclick = function () {
            document.getElementById("redirect-text2").innerHTML = '';
            document.getElementById("retry-btn").classList.add("d-none");
            document.getElementById("redirect-text").innerHTML = "Submitting...";
            submit(uuid, tx);
        }
        document.getElementById("redirect-text").innerHTML = "Submitting...";
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
        if (err.response.status !== 400) {
            document.getElementById("redirect-text2").innerHTML = 'Please try again in few seconds.';
            document.getElementById("retry-btn").classList.remove("d-none");
        }
    });

}