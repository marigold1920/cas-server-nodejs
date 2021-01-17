const {
    findDrivers,
    dispatchRequestToDrivers,
    removeRequestFromDrivers,
    createRequest
} = require("../configs/firebase.config");

/**
 * @description Data will be passed to re-assign task when all drivers rejected the request.
 * @see addToBlackList
 */
let eventData = new Map();

/**
 * @description setInterval(...args) instatiate with static data, when radius is increased, it can not be assigned to
 * scheduler event defined in assignTask(). Caching radius happens when having increased radius and is got when handleRequest()
 * is called by scheduler event.
 * @see handleRequest
 */
let backupRadiuses = new Map();

/**
 * @description Store all scheduler events when these were assigned. When event is canceled, it's necessary to
 * call clearInterval(task) to stop running in background.
 * @see popEvent
 */
let pendingEvents = new Map();

/**
 * @description Driver list of each term, using to compare to the list in next term or compare to black list.
 */
let drivers = new Map();

/**
 * @description Drivers who rejected the request.
 * @see addToBlackList
 */
let blackList = new Map();

let config = {
    radius: 50,
    extraRadius: 10,
    numOfDrivers: 10,
    requestTimeout: 1,
    maxRadius: 200
};

/**
 * @description Being called in the first term or a scheduler event is active to find drivers.
 * @param {*} request an object is passed to find drivers in firestore.
 */
const handleRequest = async ({ requestId, latitude, longitude, type }) => {
    let radius = backupRadiuses.get(requestId) || config.radius;
    const { extraRadius, maxRadius } = config;
    const result = await findDrivers(latitude, longitude, radius, type);
    const difference = findDifference(requestId, result); // Compare new list and the previous list to find new drivers

    // Dispatch request when having new drivers
    if (difference.length) {
        dispatchRequestToDrivers(requestId, difference); // Send request to confirmations pool in Firestore, see change in "requestIds"
        drivers.set(requestId, result); // Backup driver list to compare in next term
    }

    // No new driver, increase radius, keep pending event when current radius === maxRadius,
    // otherwise, take the next term with newRadius = current radius + extraRadius immediately
    if (!difference.length && radius < maxRadius) {
        radius = Math.min(radius + extraRadius, maxRadius);
        backupRadiuses.set(requestId, radius);
        handleRequest({ requestId, latitude, longitude, type });
        return;
    }
};

/**
 * @description Find new drivers from previous list.
 * @param {*} list Driver list of current term.
 */
const findDifference = (requestId, list) => {
    const preDrivers = drivers.get(requestId) || [];

    return (preDrivers.length && list.filter(d => !preDrivers.some(pd => pd === d))) || list;
};

/**
 * @description Schedule an event to take call handleRequest(...args) every period time.
 * Event if the system will waste some time to increase radius and find new drivers, this does not effect
 * to schudler timing.
 * @param {*} request an object is passed to assign new task.
 */
const assignTask = ({ requestId, latitude, longitude, type }) => {
    const { radius, requestTimeout } = config;
    const task = setInterval(
        () => handleRequest({ requestId, latitude, longitude, type }),
        requestTimeout * 60 * 1000
    );

    backupRadiuses.set(requestId, radius);
    pendingEvents.set(requestId, task);
};

/**
 * @description Call when new request was made, the system will find first driver list or take first term.
 * After that, an event is assigned to call handleRequest(...args) every period time.
 * @param {*} request an object is passed to assign new task.
 */
exports.pushEvent = request => {
    const { requestId } = request;

    createRequest(requestId);
    handleRequest(request);
    assignTask(request);
    eventData.set(requestId, request);
};

/**
 * @description Destroy scheduler event and clear request from driver list.
 * @param {*} requestId Identifier of scheduler event.
 */
exports.popEvent = requestId => {
    removeRequestFromDrivers(requestId, drivers.get(requestId));
    clearInterval(pendingEvents.get(requestId));
    pendingEvents.delete(requestId);
    drivers.delete(requestId);
    backupRadiuses.delete(requestId);
    blackList.delete(requestId);
    eventData.delete(requestId);
};

/**
 * @description Update black list, re-assign a scheduler event.
 * @param {*} requestId Identifier of scheduler event.
 * @param {*} username Driver who rejected the request.
 */
exports.addToBlackList = (requestId, username) => {
    const list = blackList.get(requestId) || [];

    list.push(username);
    removeRequestFromDrivers(requestId, [username]);
    // Find new drivers when all drivers rejected the request
    if (list.length == drivers.get(requestId).length) {
        const data = eventData.get(requestId);
        let task = pendingEvents.get(requestId);

        clearInterval(task); // Destroy old event
        handleRequest(data);
        assignTask(data); // Re-assign event
    }
    blackList.set(requestId, list); // Update black list
};

exports.updateConfig = newConfig => {
    config = newConfig;
};
