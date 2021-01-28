exports.calculateRemainingTime = (requests, timeout) => {
    const current = new Date().toISOString();

    return requests.map(r => ({
        ...r,
        remainingTime: calculateDifferenceTime(current, r.createdDate, r.createdTime, timeout),
        timeout: timeout * 60
    }));
};

const calculateDifferenceTime = (current, createdDate, createdTime, timeout) => {
    const start = `${createdDate}T${createdTime}Z`;
    const diff = 25200 - (new Date(start).getTime() - new Date(current).getTime()) / 1000;

    return timeout * 60 - Math.round(diff);
};
