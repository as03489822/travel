const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main().then(() => {
    console.log("database connected");
}).catch(err => console.log(err))
 
let urlDb =  "mongodb+srv://asummad302:ZbTzcWxLFe9H4Okq@cluster0.d5fip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function main(){
    await mongoose.connect(urlDb);
}

let saveData = async() => {
    await Listing.deleteMany({});
    // initData.data.map((obj) => ({obj , owner :'66d7f6f9304e0c5c350d4843'}))
    for(let i=0 ; i<initData.data.length ; i++){
        initData.data[i].owner  = '66d7f6f9304e0c5c350d4843';  
        if(i <= 3){
            initData.data[i].category ="farm house";
        }
        else if(i>3 && i<=6){
            initData.data[i].category ="mountain city";
        }
        else if(i>6 && i<=8){
            initData.data[i].category ="room";
        }
        else if(i>8 && i<=10){
            initData.data[i].category ="cave";
        }
                else if(i>10 && i<=12){
            initData.data[i].category ="hotel";
        }
                else if(i>12 && i<=14){
            initData.data[i].category ="beach";
        }
        else if(i>14 && i<=16){
            initData.data[i].category ="pool";
        }
        else if(i>16 && i<=18){
            initData.data[i].category ="arctic";
        }
        else if(i>18 && i<=20){
            initData.data[i].category ="city";
        }
        else if(i>20 && i<=22){
            initData.data[i].category ="tower";
        }
        else if(i>22 && i<=24){
            initData.data[i].category ="golfing";
        }
        else if(i>24 && i<=26){
            initData.data[i].category ="boat";
        }
        else if(i>26 && i<=30){
            initData.data[i].category ="farm house";
        }
    }
    await Listing.insertMany(initData.data);
    console.log("data save");
}
saveData();