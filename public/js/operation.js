const getLastItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
document.addEventListener('DOMContentLoaded', function () {
    fetchData();
}, false);


function fetchData() {
    axios.get(global_variables.API_URL + '/swaps/info/' + getLastItem(window.location.pathname))
        .then(function (response) {
            window.amount = response.data.result.amount;
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
            document.getElementById("card-amount").innerHTML = response.data.result.amount;

            if (response.data.result.fees) {
                document.getElementById("card-fees").innerHTML = (parseFloat(response.data.result.fees)).toFixed(2);
            } else {
                if (response.data.result.type == 0) {
                    document.getElementById("card-fees").innerHTML = global_variables.IDENA_FEE + " iDNA";
                } else {
                    document.getElementById("card-fees").innerHTML = "<a href='#'onclick='calculateETHFees();'>Calculate</a>";
                }
            }

            document.getElementById("card-time").innerHTML = moment(response.data.result.time).local().format('YYYY.MM.DD hh:mm:ss A');
            if (response.data.result.address && response.data.result.type == 0) {
                document.getElementById("card-to").innerHTML = response.data.result.address.substring(0, 10) + "...." + response.data.result.address.substring(32, 42);
                document.getElementById("card-to").href = global_variables.ETH_EXPLORER + "/address/" + response.data.result.address;
            } else {
                document.getElementById("card-to").innerHTML = response.data.result.address.substring(0, 10) + "...." + response.data.result.address.substring(32, 42);
                document.getElementById("card-to").href = "https://scan.idena.io/address/" + response.data.result.address;
            }
            document.getElementById("card-uuid").innerHTML = response.data.result.uuid;
            if (response.data.result.type == 0) {
                document.getElementById("card-type").innerHTML = 'IDENA <i class="fas fa-angle-double-right"></i> ETH';
                document.getElementById("step1-title").innerHTML = "1. Send the required amount to the bridge's wallet";
                document.getElementById("step2-title").innerHTML = "2. The bridge will mint tokens for your ETH address";
                document.getElementById("action-button").onclick = openIdenaApp;
                document.getElementById("action-button").innerHTML = "Open Idena App";
                if (response.data.result.idena_tx) {
                    document.getElementById("step1-bottom").innerHTML = `TxHash : <a href="https://scan.idena.io/transaction/${response.data.result.idena_tx}">${response.data.result.idena_tx.substring(0, 10)}...${response.data.result.idena_tx.substring(30, 42)}</a>`;
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
                if (response.data.result.eth_tx) {
                    document.getElementById("step2-bottom").innerHTML = `TxHash : <a href=${global_variables.ETH_EXPLORER + "/tx/" + response.data.result.eth_tx}">${response.data.result.eth_tx.substring(0, 10)}...${response.data.result.eth_tx.substring(30, 42)}</a>`;
                    document.getElementById("step2-status").innerHTML = '<span class="text-success">Sent</span>';

                } else {
                    document.getElementById("step2-bottom").innerHTML = "";
                    document.getElementById("step2-status").innerHTML = '<span class="text-warning">Pending</span>';
                }
            } else {
                document.getElementById("card-type").innerHTML = 'ETH <i class="fas fa-angle-double-right"></i> IDENA';
                document.getElementById("step1-title").innerHTML = "1. Burn your tokens";
                document.getElementById("step2-title").innerHTML = "2. Native idena will be sent to your wallet";
                document.getElementById("action-button").onclick = openMetamask;
                document.getElementById("action-button").innerHTML = "Open Meta Mask";
                if (response.data.result.eth_tx) {
                    document.getElementById("step1-bottom").innerHTML = `TxHash : <a href=${global_variables.ETH_EXPLORER + "/tx/"+ response.data.result.eth_tx}">${response.data.result.eth_tx.substring(0, 10)}...${response.data.result.eth_tx.substring(30, 42)}</a>`;
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
                    document.getElementById("step2-bottom").innerHTML = `TxHash : <a href="https://scan.idena.io/transaction/${response.data.result.idena_tx}">${response.data.result.idena_tx.substring(0, 10)}...${response.data.result.idena_tx.substring(30, 42)}</a>`;
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
    axios.post(global_variables.API_URL + '/swaps/assign', {
            uuid: window.uuid,
            tx: document.getElementById("modal-tx").value
        })
        .then(function (response) {
            location.reload();
        }).catch(function (err) {
            toastr.error("Something went wrong.");
        });
}

function openIdenaApp() {
    toastr.success("Openning Idena app");
    let address = global_variables.IDENA_WALLET;
    let amount = window.amount;
    let url = `dna://send/v1?address=${address}&amount=${amount}&comment=IDENA-TO-THE-MOON`
    console.log(url);
    window.open(url, '_blank');

}
async function calculateETHFees() {
    try {
        var web3API = new Web3(window.ethereum);
        contract = new web3API.eth.Contract(contractABI, global_variables.ETH_CONTRACT);
        let contractFees = await contract.methods.burn(web3API.utils.toWei(window.amount.toString())).estimateGas({
            from: window.address
        });
        let gasPrice = await web3API.eth.getGasPrice();
        let idenaPrice = web3API.utils.toWei(await getIdenaPrice());
        let fees = (gasPrice * contractFees / idenaPrice);
        document.getElementById("card-fees").innerHTML = '~' + (parseFloat(global_variables.ETH_FEE) + parseFloat(fees)).toFixed(3) + " iDNA" || "-";
    } catch (error) {
        document.getElementById("card-fees").innerHTML = "Error";
    }
}
async function getIdenaPrice() {
    let resp = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=idena&vs_currencies=eth");
    if (resp.status == 200 && resp.data.idena.eth) {
        return resp.data.idena.eth.toString();
    } else {
        return 0
    }
}
async function openMetamask() {
    if (window.ethereum) {
        try {
            toastr.success("Openning Metamask");
            ethereum.enable();
            let web3API = new Web3(window.ethereum);
            contract = new web3API.eth.Contract(contractABI, global_variables.ETH_CONTRACT);
            contract.methods.burn(web3API.utils.toWei(window.amount.toString())).send({
                from: await web3API.eth.getCoinbase()
            }, function (err, result) {
                if (result) {
                    console.log(result);
                    toastr.success("Submitting Tx");
                    axios.post(global_variables.API_URL + '/swaps/assign', {
                            uuid: window.uuid,
                            tx: result
                        })
                        .then(function (response) {
                            if (response.data.status == 200) {
                                location.reload();
                            } else {
                                toastr.error("Something went wrong.");
                            }
                        }).catch(function (err) {
                            toastr.error("Something went wrong.");
                        });
                } else {
                    toastr.error("Error");
                }

            });
        } catch (err) {
            console.log("erro");
            console.error(err);
        }
    }
}