const {
    findDrivers,
    dispatchRequestToDrivers,
    removeRequestFromDrivers
} = require("../configs/firebase.config");

let backupRadiuses = new Map();
let pendingEvents = new Map();
let drivers = new Map();

let config = {
    radius: 100,
    extraRadius: 10,
    numOfDrivers: 10,
    requestTimeout: 10,
    maxRadius: 200
};

const handleRequest = async (requestId, latitude, longitude, type) => {
    let radius = backupRadiuses.get(requestId) || config.radius;
    const { extraRadius, maxRadius } = config;
    let result = await findDrivers(latitude, longitude, radius, type);

    if (!result.length && radius < maxRadius) {
        radius = Math.min(radius + extraRadius, maxRadius);
        backupRadiuses.set(requestId, radius);
        handleRequest(requestId, latitude, longitude, type);
        return;
    }
    dispatchRequest(requestId, result);
    drivers.set(requestId, result);
};

const dispatchRequest = (requestId, list) => {
    const preDrivers = drivers.get(requestId) || [];
    const difference =
        (preDrivers.length && list.filter(d => !preDrivers.some(pd => pd.id === d.id))) || list;

    difference.length && dispatchRequestToDrivers(requestId, difference);
};

const assignTask = (requestId, latitude, longitude, type) => {
    const { radius, requestTimeout } = config;
    const task = setInterval(
        () => handleRequest(requestId, latitude, longitude, type),
        requestTimeout * 1000
    );

    backupRadiuses.set(requestId, radius);
    pendingEvents.set(requestId, task);
};

exports.pushEvent = request => {
    const { requestId, latitude, longitude, type } = request;

    handleRequest(requestId, latitude, longitude, type);
    assignTask(requestId, latitude, longitude, type);
};

exports.popEvent = requestId => {
    removeRequestFromDrivers(requestId, drivers.get(requestId));
    clearInterval(pendingEvents.get(requestId));
    pendingEvents.delete(requestId);
    drivers.delete(requestId);
    backupRadiuses.delete(requestId);
};

exports.updateConfig = newConfig => {
    config = newConfig;
};
