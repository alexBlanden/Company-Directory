function resetObject(objectName) {
    let keys = Object.keys(objectName).forEach(key => objectName[key]=null);
}

function formIsFilled(objectName){
    let keys = Object.keys(objectName).forEach(key => {
        if(objectName[key] == null) {
            return false;
        }
        return true;
    });
}

export {
    resetObject,
    formIsFilled
}