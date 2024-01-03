// ==UserScript==
// @name           DYX-LazyNigger3
// @namespace      test3
// @description    test
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @include http://monworks2.dyxnet.com/*
// @include http://patrol.dyxnet.com/*
// @include https://monworks2.dyxnet.com/*
// @include https://patrol.dyxnet.com/*

// ==/UserScript==
var today = new Date();
var yesterday = new Date(today);
var AutoOpen = true;
var doVIP = false;
yesterday.setDate(today.getDate() - 1);
//var isdayshift = false;
//if (today.getHours() >= 9 && today.getHours() < 21) {
//    isdayshift = true;
//} else {
//    isdayshift = false;
//}

//'<input id="AutoUpdate" type="checkbox">'
if (document.title.includes("Newalarm: Active Alarm")) { //if is Alarm MainPage
    //console.log("XXX"+GM_getValue("AutoUpdate"));

    //alert("GOT THERE");
    var myTrackNum = GM_getValue("TrackNum");
    myTrackNum = 0;
    if (!isNaN(myTrackNum)) {
        myTrackNum = parseInt(myTrackNum);
    }


    var newHTML = document.createElement('div');
    newHTML.setAttribute("id", "gmSomeID");

    function unEscape(htmlStr) {
        htmlStr = htmlStr.replace(/&lt;/g, "<");
        htmlStr = htmlStr.replace(/&gt;/g, ">");
        htmlStr = htmlStr.replace(/&quot;/g, "\"");
        htmlStr = htmlStr.replace(/&#39;/g, "\'");
        htmlStr = htmlStr.replace(/&amp;/g, "&");
        return htmlStr;
    }
    //let unEscapedStr +=
    let unEscapedStr = '<br>';
    unEscapedStr += unEscape('&lt;input id=&quot;ProcessVIP&quot; type=&quot;checkbox&quot;' + (GM_getValue("ProcessVIP") == true ? 'checked' : '') + '&gt;');
    unEscapedStr += '<label for="ProcessVIP">ProcessVIP</label><br>';
    unEscapedStr += unEscape('&lt;input id=&quot;AutoUpdate&quot; type=&quot;checkbox&quot;' + (GM_getValue("AutoUpdate") == true ? 'checked' : '') + '&gt;');
    unEscapedStr += '<label for="AutoUpdate">AutoUpdate</label><br>';
    //unEscapedStr += unEscape('&lt;br&gt;&lt;input id=&quot;TrackNum&quot; type=&quot;number&quot; min=&quot;1&quot; max=&quot;10&quot; placeholder=&quot;Tracked Number&quot; value=&quot;' + myTrackNum + '&quot;&gt;');
    newHTML.innerHTML = unEscapedStr;

    //<br>\
    //    <input id="AutoUndetermined" type="checkbox">
    //    <label for="AutoUndetermined">AutoUndetermined</label><br>\
    //    ' + AUCheckbox + '\
    //    <label for="AutoUpdate">AutoUpdate</label>\
    //    <br>\
    //    <input id="TrackNum" type="number" min="1" max="10" placeholder="Tracked Number" value=' + GM_getValue("TrackNum") + '>
    //    <br>\
    //    <input id="IPInput0" placeholder="IP Address" value=' + GM_getValue("IPInput0") + '>
    //    <input id="IPInput1" placeholder="IP Address" value=' + GM_getValue("IPInput1") + '>

    document.body.appendChild(newHTML);
    document.querySelectorAll("#gmSomeID > input").forEach(element => element.addEventListener('input', updateValue));

    var noUpdatesIndexes = 0;
    var Cache = []; //the payload of not updated table

    var AlarmTableSub = [];

    GM_getValue("ProcessVIP") == true ? doVIP = true : doVIP = false;

    function AlarmFilter(AlarmTable, index) {
        if (AlarmTable.children[index].children[14].innerHTML.includes("No update") == true) { //if is not updated{
            if (doVIP == false && AlarmTable.children[index].children[3].innerHTML.includes("vip.gif") == false && AlarmTable.children[index].children[3].innerHTML.includes("svip.gif") == false &&
                AlarmTable.children[index].children[2].innerHTML.includes("10000") == false &&
                AlarmTable.children[index].children[2].innerHTML.includes("10001") == false &&
                AlarmTable.children[index].children[2].innerHTML.includes("10002") == false &&
                AlarmTable.children[index].children[2].innerHTML.includes("56828") == false) { //If doesn't contains VIP Tag and doVIP switch is off
                noUpdatesIndexes += 1;
                Cache.push(AlarmTable.children[index]);
            } else if (doVIP == true &&
                AlarmTable.children[index].children[2].innerHTML.includes("10000") == false &&
                AlarmTable.children[index].children[2].innerHTML.includes("10001") == false &&
                AlarmTable.children[index].children[2].innerHTML.includes("10002") == false &&
                AlarmTable.children[index].children[2].innerHTML.includes("56828") == false){
                noUpdatesIndexes += 1;
                Cache.push(AlarmTable.children[index]);
            }
        }
    }

    AlarmTableSub = document.querySelector("[name='form1']").parentElement.children[1]; //top

    for (let i = 1; i < AlarmTableSub.children.length; i++) { //Loop each Main Box
        AlarmFilter(AlarmTableSub, i);
        if (AlarmTableSub.children[i].children[3].innerHTML.includes("Test IP")) {
            AlarmTableSub.children[i].innerHTML = "";
        } else {
            AlarmTableSub.children[i].firstElementChild.firstElementChild.style = "transform: scale(1.5);"
        }
    }



    var AlarmTableMain = [];
    AlarmTableMain = document.querySelector("[name='form1']").parentElement.children[2]; //main

    for (let i = 0; i < AlarmTableMain.children.length; i++) { //Loop each Main Box
        AlarmFilter(AlarmTableMain, i);
        if (AlarmTableMain.children[i].children[3].innerHTML.includes("Test IP")) { //Green
            AlarmTableMain.children[i].children[11].innerHTML = "";
            AlarmTableMain.children[i].children[13].innerHTML = "";
            AlarmTableMain.children[i].children[14].innerHTML = "";
        } else {
            AlarmTableMain.children[i].firstElementChild.firstElementChild.style = "transform: scale(1.5);"
        }
    }


    var delayedCounter = 1; //  set your counter to 1
    console.log("NoUpdatesIndexes:" + noUpdatesIndexes); //count how many updated
    function myLoop() { //  create a loop function
        setTimeout(function() { //  call a 3s setTimeout when the loop is called
            console.log(Cache[delayedCounter - 1]);
            Cache[delayedCounter - 1].children[14].children[0].click(); //click first one
            delayedCounter++; //  increment the counter
            if (delayedCounter <= noUpdatesIndexes) { //  if the counter < 10, call the loop function
                myLoop(); //  ..  again which will trigger another
            } //  ..  setTimeout()
        }, 2500)
    }
    if (Cache[0] != undefined && GM_getValue("AutoUpdate") == true) {
        myLoop(); //  start the loop
    }
}

function updateValue(e) {
    console.log(e.target.id);
    if (e.target.id === "AutoUpdate") {
        if (this.checked) {
            GM_setValue("AutoUpdate", true);
        } else {
            GM_setValue("AutoUpdate", false);
        }
    }
    if (e.target.id === "ProcessVIP") {
        if (this.checked) {
            GM_setValue("ProcessVIP", true);
        } else {
            GM_setValue("ProcessVIP", false);
        }
    }
    //if (e.target.id === "TrackNum") {
    //    GM_setValue("TrackNum", e.target.value);
    //    document.getElementById("TrackNum").value = GM_getValue("TrackNum");
    //}
    //if (e.target.id === "IPInput0") {
    //    GM_setValue("IPInput0", e.target.value);
    //    document.getElementById("IPInput0").value = GM_getValue("IPInput0");
    //} else if (e.target.id === "IPInput1") {
    //    GM_setValue("IPInput1", e.target.value);
    //    document.getElementById("IPInput1").value = GM_getValue("IPInput1");
    //}
}

if (document.title.includes("Search")) { //if is Search MainPage
    if (document.querySelector("body > table:nth-child(2)").innerHTML.includes("group_update.php")) { //if don't have more than 1 page
        var Tabler = document.querySelector("body > table:nth-child(3) > tbody");
    } else {
        var Tabler = document.querySelector("body > table:nth-child(4) > tbody");
    }
    //console.log(Tabler.children.length);
    for (let i = 1; i < Tabler.children.length; i++) {
        if (Tabler.children[i].children[3].innerHTML.includes("Test IP")) {
            Tabler.children[i].innerHTML = "";
        } else {
            Tabler.children[i].firstElementChild.firstElementChild.style = "transform: scale(1.5);"
        }
    }
    //Tabler.children[1].children[3].innerHTML = "";
    //Tabler.children[1].innerHTML = "";

}

function alertupdater(handle, cid, remark) {
    //console.log(document.getElementById("handle_type").value);
    if (document.getElementById("handle_type").value === "") {
        //alert(document.getElementById("handle_type").value);

        document.getElementById("handle_type").value = handle;
        if (cid != undefined) {
            document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(18) > td:nth-child(2) > input[type=text]").value = cid;
        }
        if (remark != undefined) {
            document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(19) > td:nth-child(2) > input[type=text]").value = remark;
        }
        document.querySelector("body > div:nth-child(1) > p > table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=submit]:nth-child(1)").click();
    } else if (document.getElementById("handle_type").value == "Undetermined alarm") {
        console.log("Unexcepted Type");
        return;
    } else {
        close();
    }
    //setTimeout(() => {
    //	if (document.querySelector("body > div:nth-child(1) > p > table > tbody ").innerHTML.includes("successful") == true) {
    //		close();
    //	}
    //}, 5000)
}

if (document.URL.includes("group_update.php")) {
    document.querySelector("body > form > table > tbody > tr:nth-child(1) > td:nth-child(2)").style = "font-size:16px"
    document.querySelector("body > form > table > tbody > tr:nth-child(17) > td:nth-child(2) > select").style = "font-size:32px; width:100%"
    document.querySelector("body > form > table > tbody > tr:nth-child(18) > td:nth-child(2) > input[type=text]").style = "font-size:32px"
    document.querySelector("body > form > table > tbody > tr:nth-child(19) > td:nth-child(2) > input[type=text]").style = "font-size:32px"
    document.querySelector("body > form > p > table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=submit]:nth-child(1)").style = "font-size:64px"
}

if (document.URL.includes("details.php")) {
    const alarmProcess = {
        //--
        "10.202.25.118": ["Circuit Instability", "", ""],
        "10.202.96.166": ["Customer Problem", "", "印度班加洛"],
        "10.202.92.166": ["Customer Problem", "", "印度班加洛"],
        "10.202.92.218": ["Customer Problem", "", "IPSec Reconnect"], //上海乔篷
        "10.202.76.6": ["Customer Problem", "", "no log on ce"], //巨宝数码
        "10.200.47.114": ["Stop Monitor", "1865973", ""],
        "10.200.117.126": ["Power Off", "2161483", ""], //JETSHOES
        "10.202.119.214": ["Power Off", "", ""], //DATA SYSTEMS
        "10.202.119.222": ["Power Off", "", ""], //DATA SYSTEMS
        "10.202.119.234": ["Power Off", "", ""], //DATA SYSTEMS
        "10.202.119.210": ["Power Off", "", ""], //DATA SYSTEMS !!
        "10.202.119.198": ["Power Off", "", ""], //DATA SYSTEMS !!
        "10.202.27.98": ["Power Off", "", ""], //ARTCERA
        "10.202.88.233": ["Power Off", "", ""], //ARTCERA
        "10.202.57.114": ["Power Off", "", ""], //ARTCERA
        "10.210.8.166": ["Power Off", "", ""], //Rakuten
        "10.210.9.166": ["Power Off", "", ""], //Rakuten
        "10.210.8.162": ["Power Off", "", ""], //Rakuten
        "10.210.9.162": ["Power Off", "", ""], //Rakuten
        "10.202.153.98": ["Power Off", "", ""], //Dongguan
        "10.202.152.98": ["Power Off", "", ""], //Dongguan
        "10.202.170.86": ["Customer Problem", "", "IPSec Reconnect"], //TRANSOUND
        "10.210.8.86": ["Customer Problem", "", "IPSec Reconnect"], //Topco
        "10.200.47.122": ["Customer Problem", "", "IPSec Reconnect"], //	EMPEROR
        "10.202.170.6": ["Customer Problem", "", "IPSec Reconnect"], // TIMOTION
        "10.202.172.198": ["Customer Problem", "", "IPSec Reconnect"], //	Forward
        "10.202.152.102": ["Customer Problem", "", "IPSec Reconnect"], //	Uis Abler
        "10.200.47.154": ["Customer Problem", "", "IPSec Reconnect"], //	Lee Bou
        "10.200.47.98": ["Customer Problem", "", "IPSec Reconnect"], //	HANGZHOU
        "10.202.26.70": ["Customer Problem", "115967", ""], //YUAN JEN
        "10.202.60.194": ["Customer Problem", "1908227", ""], //kingcooler
        "10.202.182.254": ["Customer Problem", "", "HINET Routing down"], //hokei
        "10.202.152.38": ["Customer Problem", "", "Clear ARP後恢復"], //深圳市振云
        "192.168.178.182": ["Customer Problem", "", "Clear ARP後恢復"], //GODEX
        "192.168.187.78": ["Customer Problem", "", "海防"], //CHEE SIANG
        "10.202.92.142": ["Customer Problem", "", "胡志明"], //CHEE SIANG
        "10.202.86.62": ["Power Off", "", ""], //BAPE
        "10.210.11.166": ["Power Off", "", ""], //BAPE
        "10.210.10.166": ["Power Off", "", ""] //BAPE
    };
    let foundip = document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2) > a:nth-child(1)").innerHTML;
    //console.log(alarmProcess[foundip]);
    if (alarmProcess[foundip] != undefined && GM_getValue("AutoUpdate") == true) { //if is on the alarmProcess list
        alertupdater(alarmProcess[foundip][0], alarmProcess[foundip][1], alarmProcess[foundip][2]); //update this
    }
    document.querySelector("#handle_type").style = "width:100%;font-size:18px"
    document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(17) > td:nth-child(2) > form").style = 'margin:0px'
    document.querySelectorAll("input[type=text]")[0].style = "width:100%;font-size:18px"
    document.querySelectorAll("input[type=text]")[1].style = "width:100%;font-size:18px"
    document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(18) > td:nth-child(2)").style = "font-size:0px"
    document.querySelectorAll("body > div:nth-child(1) > table > tbody > tr:nth-child(18) > td:nth-child(2) > a").forEach(element => element.remove())
    document.querySelector("input[type=submit]").style = "width:14em;font-size:32px"; //bigger button
    document.querySelector("body > div:nth-child(1) > p > table > tbody > tr:nth-child(3)").remove() //delete group update
    setTimeout(() => {
        if (document.querySelector("body > div:nth-child(1) > p > table > tbody ").innerHTML.includes("successful") == true) {
            close();
        }
    }, 1500)
    //if (document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2) > a:nth-child(1)").innerHTML.includes("10.202.86.170")) {
    //alertupdater("Power Off", "125912");
    //}
    //if (document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2) > a:nth-child(1)").innerHTML.includes("10.202.86.170")) {
    //alertupdater("Power Off", "125912");
    //}
    //if (document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2) > a:nth-child(1)").innerHTML.includes("10.202.32.14")) {
    //alertupdater("Power Off", "125912");
    //}
    //if (document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2) > a:nth-child(1)").innerHTML.includes("192.168.148.10")) {
    //alertupdater("Circuit Instability", "125817");
    //}
    //if (document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2) > a:nth-child(1)").innerHTML.includes("10.202.26.70")) {
    //alertupdater("115967", "Customer Problem");
    //}
    //if (document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2) > a:nth-child(1)").innerHTML.includes("10.202.60.194")) {
    //alertupdater("1908227", "Customer Problem");
    //}
}


//if (collection[0].children[0].children[3].innerHTML.includes("img") == true) { //if is VIP/SVIP
//  alert(collection[0].children.length);
// alert("VIP!");
//}
//if (collection[0].children[0].children[2].innerHTML.includes("10000") == true)

//document.querySelector("body > div:nth-child(1) > table > tbody > tr:nth-child(18) > td:nth-child(2) > input[type=text]")

//if (collection[0].children[0].children[3].innerHTML.includes("Test IP") == true) { //if is TestIP
//  collection[0].children[0].children[14].innerHTML = "";
//  console.log(collection[0].children.length);
//}

function dayshifter(inputDate, inputTime) {
    var isdayshift = false;

    if (today.getHours() >= 6 && today.getHours() < 21) {
        document.querySelector(inputTime).value = "09:30:00";
    } else {
        document.querySelector(inputTime).value = "21:30:00";
    }
    if (today.getHours() >= 0 && today.getHours() < 6) { // if is midnight, date set to yesterday
        document.querySelector(inputDate).value = yesterday.getFullYear() + "-" + ('0' + (yesterday.getMonth() + 1)).slice(-2) + "-" + ('0' + yesterday.getDate()).slice(-2);
    }
}

//const AirconDictLoads = {};

if (document.URL == 'https://patrol.dyxnet.com/aircon.php?sitecode=TPA') { //if is patrol page
    let AirconDictLoads = AirconTableLoader();
    dayshifter("body > form > table:nth-child(2) > tbody > tr > td:nth-child(1) > input[type=text]", "body > form > table:nth-child(2) > tbody > tr > td:nth-child(2) > select");
    document.querySelectorAll("body > form > input[type=radio]:nth-child(8n+6)").forEach(element => element.checked = true); //check every radio box
    document.querySelectorAll("body > form > table:nth-child(8n+10) > tbody > tr > td:nth-child(2) > input[type=text]").forEach(function(element, i) {
        if (i <= 2) { //top 3 need load Humidity
            element.addEventListener('input', updateAirconA);
            element.value = AirconDictLoads[element.name];
        } else {
            element.value = -1;
        }
    });

    document.querySelectorAll("body > form > table:nth-child(8n+10) > tbody > tr > td:nth-child(1) > input[type=text]").forEach(function(value) {
        value.addEventListener('input', updateAirconA);
        value.value = AirconDictLoads[value.name];
    });
}

function AirconTableLoader() { //get the GM value, then convert it into dict
    if (GM_getValue("SavedAirconLoads") == null) {
        GM_setValue("SavedAirconLoads", "0")
    }
    let AirconDictLoads = {}; //make a empty dict
    let ReadAirconLoads = JSON.stringify(GM_getValue("SavedAirconLoads")).slice(1).slice(0, -1).replaceAll("\"", '').split(',');
    ReadAirconLoads.forEach(function(value, i) { //fill dict with GMvalue
        ReadAirconLoadsto2D = ReadAirconLoads[i].split(":"); //split title and value
        AirconDictLoads[ReadAirconLoadsto2D[0]] = ReadAirconLoadsto2D[1]; //rebuild dict
    })
    return AirconDictLoads
}

function updateAirconA(e) {
    let AirconDictLoads = AirconTableLoader();
    AirconDictLoads[e.target.name] = e.target.value; //find the value in the table, then change to inputed one.
    GM_setValue("SavedAirconLoads", AirconDictLoads); //save the current inputted value to GM
    console.log(AirconDictLoads);
}



if (document.URL == 'https://patrol.dyxnet.com/fm200.php?sitecode=TPA') { //if is patrol page
    dayshifter("body > form > table > tbody > tr > td:nth-child(1) > input[type=text]", "body > form > table > tbody > tr > td:nth-child(2) > select");
    document.querySelector("body > form > input[type=radio]:nth-child(6)").checked = true;
    document.querySelector("body > form > p:nth-child(8) > table > tbody > tr > td:nth-child(2) > input[type=checkbox]").checked = true;

}


//let ReadUPSLoads = JSON.stringify(GM_getValue("SavedUPSLoads")).slice(1).slice(0, -1).replaceAll("\"", '').split(',');
//ReadUPSLoads.forEach(function(value, i) {
//
//    ReadUPSLoadsto2D = ReadUPSLoads[i].split(":");//split title and value
//    UPSLoads[ReadUPSLoadsto2D[0]] = ReadUPSLoadsto2D[1]; //rebuild dict
//})


//const UPSDictLoads = {};

if (document.URL == 'https://patrol.dyxnet.com/ups.php?sitecode=TPA') { //if is patrol page
    let UPSDictLoads = UPSTableLoader();
    dayshifter("body > form > table > tbody > tr > td:nth-child(1) > input[type=text]", "body > form > table > tbody > tr > td:nth-child(2) > select");
    document.querySelectorAll("body > form > p:nth-child(n+8) > table > tbody > tr > td:nth-child(n+2) > input[type=checkbox]").forEach(element => element.checked = true);
    document.querySelector("body > form > input[type=radio]:nth-child(6)").checked = true;
    document.querySelectorAll("body > form > p:nth-child(n+8) > input[type=radio]:nth-child(6)").forEach(element => element.checked = true);
    document.querySelectorAll("body > form > p:nth-child(n+8) > table > tbody > tr:nth-child(2) > td:nth-child(n+2) > input[type=text]").forEach(function(value, i) { //Red Yello Blue part
        //console.log(value, i);
        value.addEventListener('input', updateElectricA);
        /*
        if (i <= 2){
          value.value = GM_getValue("upsl"+(i+1)+"[1]A"); //load the GM saved value
        }else if(i > 2 && i <= 5){
          value.value = GM_getValue("upsl"+(i-2)+"[2]A"); //load the GM saved value
        }else if(i > 5 && i <= 8){
          value.value = GM_getValue("upsl"+(i-5)+"[3]A"); //load the GM saved value
        }else if(i > 8 && i <= 11){
          value.value = GM_getValue("upsl"+(i-8)+"[4]A"); //load the GM saved value
        }
        */

        value.value = UPSDictLoads[value.name];
    });

    document.querySelectorAll("body > form > p:nth-child(n+8) > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]").forEach(function(value, i) {
        value.addEventListener('input', updateElectricA);
        value.value = UPSDictLoads[value.name];
    });


    console.log("L1:" + (parseInt(UPSDictLoads["upsl1[1]"]) + parseInt(UPSDictLoads["upsl1[2]"]) + parseInt(UPSDictLoads["upsl1[3]"]) + parseInt(UPSDictLoads["upsl1[4]"])));
    console.log("L2:" + (parseInt(UPSDictLoads["upsl2[1]"]) + parseInt(UPSDictLoads["upsl2[2]"]) + parseInt(UPSDictLoads["upsl2[3]"]) + parseInt(UPSDictLoads["upsl2[4]"])));
    console.log("L3:" + (parseInt(UPSDictLoads["upsl3[1]"]) + parseInt(UPSDictLoads["upsl3[2]"]) + parseInt(UPSDictLoads["upsl3[3]"]) + parseInt(UPSDictLoads["upsl3[4]"])));
}

function UPSTableLoader() { //get the GM value, then convert it into dict
    if (GM_getValue("SavedUPSLoads") == null) {
        GM_setValue("SavedUPSLoads", "0")
    }
    let UPSDictLoads = {}; //make a empty dict
    let ReadUPSLoads = JSON.stringify(GM_getValue("SavedUPSLoads")).slice(1).slice(0, -1).replaceAll("\"", '').split(',');
    ReadUPSLoads.forEach(function(value, i) { //fill dict with GMvalue

        ReadUPSLoadsto2D = ReadUPSLoads[i].split(":"); //split title and value
        UPSDictLoads[ReadUPSLoadsto2D[0]] = ReadUPSLoadsto2D[1]; //rebuild dict
    })
    return UPSDictLoads
}

function updateElectricA(e) {
    let UPSDictLoads = UPSTableLoader();
    UPSDictLoads[e.target.name] = e.target.value; //find the value in the table, then change to inputed one.
    GM_setValue("SavedUPSLoads", UPSDictLoads); //save the current inputted value to GM
}

if (document.URL == 'https://patrol.dyxnet.com/genset.php?sitecode=TPA') { //if is patrol page
    dayshifter("body > form > table > tbody > tr > td:nth-child(1) > input[type=text]", "body > form > table > tbody > tr > td:nth-child(2) > select");
    document.querySelector("body > form > input[type=radio]:nth-child(6)").checked = true;
    document.querySelector("body > form > p:nth-child(8) > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=text]").value = "25";
}

if (document.URL == 'https://patrol.dyxnet.com/mainelect.php?sitecode=TPA') { //if is patrol page
    dayshifter("body > form > table > tbody > tr > td:nth-child(1) > input[type=text]", "body > form > table > tbody > tr > td:nth-child(2) > select");
    document.querySelector("body > form > input[type=radio]:nth-child(5)").checked = true;
    document.querySelector("body > form > p:nth-child(8) > input[type=radio]:nth-child(4)").checked = true;
    document.querySelector("body > form > p:nth-child(10) > input[type=radio]:nth-child(4)").checked = true;

    document.querySelectorAll("body > form > p:nth-child(2n+7) > table > tbody > tr > td:nth-child(n+2) > input[type=checkbox]").forEach(element => element.checked = true);
    document.querySelectorAll("body > form > p:nth-child(9) > table > tbody > tr:nth-child(2) > td:nth-child(n+2) > input[type=text]").forEach(element => element.value = 190);

    let UPSDictLoads = UPSTableLoader();
    let UPSSum = [(parseInt(UPSDictLoads["upsl1[1]"]) + parseInt(UPSDictLoads["upsl1[2]"]) + parseInt(UPSDictLoads["upsl1[3]"]) + parseInt(UPSDictLoads["upsl1[4]"])),
        (parseInt(UPSDictLoads["upsl2[1]"]) + parseInt(UPSDictLoads["upsl2[2]"]) + parseInt(UPSDictLoads["upsl2[3]"]) + parseInt(UPSDictLoads["upsl2[4]"])),
        (parseInt(UPSDictLoads["upsl3[1]"]) + parseInt(UPSDictLoads["upsl3[2]"]) + parseInt(UPSDictLoads["upsl3[3]"]) + parseInt(UPSDictLoads["upsl3[4]"]))
    ] //L1 L2 L3
    document.querySelectorAll("body > form > p:nth-child(11) > table > tbody > tr:nth-child(2) > td:nth-child(n+2) > input[type=text]").forEach(function(element, i) {
        element.value = UPSSum[i];
    })
}
