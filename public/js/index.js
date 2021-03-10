function bscToIdenaUI() {
    document.getElementById("button-0").style.opacity = 0.5;
    document.getElementById("button-1").style.opacity = 1;
    document.getElementById("card-0").classList.remove("swap-line");
    document.getElementById("card-1").classList.add("swap-line");
    document.getElementById("form-type").value = 1;
    document.getElementById("form-title").innerHTML = "Swap BEP20 iDNA to iDNA";
}
function idenaToBsc() {
    document.getElementById("button-0").style.opacity = 1;
    document.getElementById("button-1").style.opacity = 0.5;
    document.getElementById("card-0").classList.add("swap-line");
    document.getElementById("card-1").classList.remove("swap-line");
    document.getElementById("form-type").value = 0;
    document.getElementById("form-title").innerHTML = "Swap iDNA to BEP20 iDNA";
}
function createSwap() {
    if (!(parseFloat(document.getElementById("form-amount").value) >= global_variables.MIN_SWAP)) {
        toastr.error(`Min swap is ${global_variables.MIN_SWAP} iDNAs`);
        return
    }
    axios.post('/api/create', {
            type: parseInt(document.getElementById("form-type").value),
            amount: parseFloat(document.getElementById("form-amount").value),
            address: document.getElementById("form-to").value
        })
        .then(function (response) {
            if (response.status == 200) {
                toastr.success("Redirecting...");
                setTimeout(function () {
                    window.location.href = "/operation/" + response.data.result.uuid;
                }, 5000);
            } else {
                toastr.error("Something went wrong.");
            }

        })
        .catch(function (error) {
            toastr.error("Something went wrong.");
        });
}

function setNumberDecimal(event) {
    this.value = parseFloat(this.value).toFixed(8);
}