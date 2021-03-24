const getLastItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
document.addEventListener('DOMContentLoaded', function () {
    fetchData();
}, false);


function fetchData() {
    axios.get('/api/info/' + getLastItem(window.location.pathname))
        .then(function (response) {
            window.amount = parseFloat(response.data.result.amount).toFixed(8);
            window.uuid = response.data.result.uuid;
            window.address = response.data.result.address;
            if (response.data.result.status == "Success") {
                document.getElementById("card-status").innerHTML = '<i class="fas fa-check-circle display-5 text-success"></i>' + '<p>Success</p>';
            } else if (response.data.result.status == "Pending") {
                document.getElementById("card-status").innerHTML = '<i class="far fa-clock display-5 text-warning"></i>' + '<p>Pending</p>';
            } else if (response.data.result.status == "Fail") {
                document.getElementById("card-status").innerHTML = `<i class="fas fa-exclamation-triangle display-5 text-danger"></i><p>Failed</p><p>Reason : ${response.data.result.fail_reason}</p>`;
            } else {
                document.getElementById("card-status").innerHTML = '<i class="fas fa-exclamation-triangle display-5 text-danger"></i>' + '<p>Unkhown state</p>';
            }
            document.getElementById("card-amount").innerHTML = parseFloat(response.data.result.amount).toFixed(8);

            if (response.data.result.fees) {
                document.getElementById("card-fees").innerHTML = '~ ' + (parseFloat(response.data.result.fees)).toFixed(3) + " iDNA";
            } else {
                if (response.data.result.type == 0) {
                    document.getElementById("card-fees").innerHTML = "<a href='#'onclick='calculateBSCFees();'>Calculate</a>";
                } else {
                    document.getElementById("card-fees").innerHTML = '~ ' + parseFloat(global_variables.IDENA_FIXED_FEES).toFixed(3) + " iDNA";

                }
            }

            document.getElementById("card-time").innerHTML = moment(response.data.result.time).local().format('YYYY.MM.DD hh:mm:ss A');
            if (response.data.result.address && response.data.result.type == 0) {
                document.getElementById("card-to").innerHTML = response.data.result.address.substring(0, 10) + "...." + response.data.result.address.substring(32, 42);
                document.getElementById("card-to").href = global_variables.BSC_EXPLORER + "/address/" + response.data.result.address;
            } else {
                document.getElementById("card-to").innerHTML = response.data.result.address.substring(0, 10) + "...." + response.data.result.address.substring(32, 42);
                document.getElementById("card-to").href = global_variables.IDENA_EXPLORER + "/address/" + response.data.result.address;
            }
            document.getElementById("card-uuid").innerHTML = response.data.result.uuid;
            if (response.data.result.type == 0) {
                document.getElementById("card-type").innerHTML = 'IDENA <i class="fas fa-angle-double-right"></i> BSC';
                document.getElementById("step1-title").innerHTML = "1. Send the required amount to the bridge's wallet";
                document.getElementById("step2-title").innerHTML = "2. The bridge will mint tokens for your BSC address";
                document.getElementById("action-button").onclick = openIdenaApp;
                document.getElementById("action-button").innerHTML = "Send with idena App";
                if (response.data.result.idena_tx) {
                    document.getElementById("step1-bottom").innerHTML = `TxHash : <a href="${global_variables.IDENA_EXPLORER + "/transaction/" + response.data.result.idena_tx}">${response.data.result.idena_tx.substring(0, 10)}...${response.data.result.idena_tx.substring(30, 42)}</a>`;
                    if (response.data.result.mined == 0) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-warning">Mining</span>';
                    } else if (response.data.result.mined == 1) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-success">Confirmed</span>';
                    } else if (response.data.result.mined == 2) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-danger">Refused</span>';
                    } else {
                        document.getElementById("step1-status").innerHTML = '<span class="text-warning">Waiting</span>';
                    }
                    document.getElementById("card-buttons").classList.add("d-none");
                } else {
                    document.getElementById("step1-bottom").innerHTML = "";
                    document.getElementById("step1-status").innerHTML = '<span class="text-danger">Not Paid</span>';
                }
                if (response.data.result.bsc_tx) {
                    document.getElementById("step2-bottom").innerHTML = `TxHash : <a href="${global_variables.BSC_EXPLORER + "/tx/" + response.data.result.bsc_tx}">${response.data.result.bsc_tx.substring(0, 10)}...${response.data.result.bsc_tx.substring(30, 42)}</a>`;
                    document.getElementById("step2-status").innerHTML = '<span class="text-success">Sent</span>';

                } else {
                    document.getElementById("step2-bottom").innerHTML = "";
                    document.getElementById("step2-status").innerHTML = '<span class="text-warning">Pending</span>';
                }
            } else {
                document.getElementById("card-type").innerHTML = 'BSC <i class="fas fa-angle-double-right"></i> IDENA';
                document.getElementById("step1-title").innerHTML = "1. Burn your tokens";
                document.getElementById("step2-title").innerHTML = "2. Native idena will be sent to your wallet";
                document.getElementById("action-button").onclick = openMetamask;
                document.getElementById("action-button").innerHTML = "Open Meta Mask";
                if (response.data.result.bsc_tx) {
                    document.getElementById("step1-bottom").innerHTML = `TxHash : <a href="${global_variables.BSC_EXPLORER + "/tx/"+ response.data.result.bsc_tx}">${response.data.result.bsc_tx.substring(0, 10)}...${response.data.result.bsc_tx.substring(30, 42)}</a>`;
                    if (response.data.result.mined == 0) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-warning">Mining</span>';
                    } else if (response.data.result.mined == 1) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-success">Confirmed</span>';
                    } else if (response.data.result.mined == 2) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-danger">Refused</span>';
                    } else {
                        document.getElementById("step1-status").innerHTML = '<span class="text-warning">Waiting</span>';
                    }
                    document.getElementById("card-buttons").classList.add("d-none");
                } else {
                    document.getElementById("step1-bottom").innerHTML = "";
                    document.getElementById("step1-status").innerHTML = '<span class="text-warning">Pending</span>';
                }
                if (response.data.result.idena_tx) {
                    document.getElementById("step2-bottom").innerHTML = `TxHash : <a href="${global_variables.IDENA_EXPLORER + "/transaction/"+response.data.result.idena_tx}">${response.data.result.idena_tx.substring(0, 10)}...${response.data.result.idena_tx.substring(30, 42)}</a>`;
                    document.getElementById("step2-status").innerHTML = '<span class="text-success">Sent</span>';
                } else {
                    document.getElementById("step2-bottom").innerHTML = "";
                    document.getElementById("step2-status").innerHTML = '<span class="text-warning">Pending</span>';
                }
            }
        })
        .catch(function (error) {
            toastr.error("Something went wrong.");
        });
}

function submitTx() {
    toastr.info("Submitting Tx..");
    axios.post('/api/assign', {
            uuid: window.uuid,
            tx: document.getElementById("modal-tx").value,
        })
        .then(function (response) {
            location.reload();
        }).catch(function (err) {
            toastr.error("Something went wrong.");
        });
}

function openIdenaApp() {
    toastr.info("Openning Idena app");
    let address = global_variables.IDENA_WALLET;
    let amount = window.amount;
    let bscAddress = window.address;
    let callback_url = global_variables.BRIDGE_URL + "/swaps/assign?uuid=" + window.uuid + "&redirect=true";
    let url = `dna://send/v1?address=${address}&amount=${amount}&comment=BSCADDRESS${bscAddress}&callback_url=${encodeURI(callback_url)}`
    console.log(url);
    window.open(url, '_blank');

}
async function calculateBSCFees() {

    try {
        document.getElementById("card-fees").innerHTML = "Loading";
        let resp = await axios.get("/api/calculateFees/" + getLastItem(window.location.pathname));
        if (resp.status == 200 && resp.data.result) {
            document.getElementById("card-fees").innerHTML = '~' + parseFloat(resp.data.result).toFixed(2) + " iDNAs";
            return resp.data.result;
        } else {
            document.getElementById("card-fees").innerHTML = "Error";
        }
    } catch (error) {
        document.getElementById("card-fees").innerHTML = "Error";
        console.error(error);
    }
}
async function getIdenaPrice() {
    let resp = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=idena&vs_currencies=bnb");
    if (resp.status == 200 && resp.data.idena.bnb) {
        return resp.data.idena.bnb.toString();
    } else {
        return 0
    }
}
async function openMetamask() {
    if (window.ethereum) {
        try {
            toastr.success("Openning Metamask");
            await ethereum.enable();
            let web3API = new Web3(window.ethereum);
            contract = new web3API.eth.Contract(contractABI, global_variables.BSC_CONTRACT);
            contract.methods.customBurn(web3API.utils.toWei(window.amount.toString()), window.address).send({
                from: await web3API.eth.getCoinbase()
            }, async function (err, result) {
                if (await result) {
                    console.log(result);
                    toastr.success("Submitting Tx");
                    axios.post('/api/assign', {
                            uuid: window.uuid,
                            tx: result
                        })
                        .then(function (response) {
                            if (response.status == 200) {
                                location.reload();
                            } else {
                                toastr.error("Something went wrong.");
                            }
                        }).catch(function (err) {
                            toastr.error("Something went wrong.");
                        });
                } else {
                    toastr.error(err);
                }

            });
        } catch (err) {
            console.log("erro");
            console.error(err);
        }
    }
}