const fs = require('fs')
const path = require('path')
const writeConfig = async (fromFile,toFile,key, value) => {
    let fromFullFile = getPath(fromFile);
    if (fs.existsSync(fromFullFile) == false) {
        fs.writeFileSync(fromFullFile, "{}", { encoding: 'utf8' }, err => {})
    }

    let contentText = fs.readFileSync(fromFullFile,'utf-8');
    if (contentText == "") {
        contentText = "{}";
    }
    let data = JSON.parse(contentText);
    data[key] = value;

    let toFullFile = getPath(toFile);
    fs.writeFileSync(toFullFile, JSON.stringify(data, null, 4), { encoding: 'utf8' }, err => {})
}

const readConfig = async (fromFile,key) => {
    let fromFullFile = path.resolve(getConfigPath(), './' + fromFile + '.json')
    let contentText = fs.readFileSync(fromFullFile,'utf-8');
    let data = JSON.parse(contentText);
    return data[key];
}

function getPath(fromFile){
    let dir =  path.resolve(__dirname, '../config');
    if (fs.existsSync(dir) == false) {
        fs.mkdirSync(dir)
    }
    return  path.resolve(__dirname, '../config/' + fromFile + '.json');
}

const getConfigPath = () => {
    //return "scripts/config"
    return path.resolve(__dirname, '.') + "/.././config"
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = {
    writeConfig,
    readConfig,
    sleep,
}