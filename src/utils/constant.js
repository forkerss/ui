const ComponentType = {
    all: null,
    cms: 'cms',
    os: 'os',
    middleware: 'middleware',
    database: 'database',
    device: 'device',
    service: 'service',
    serviceProvider: 'service_provider',
    general: 'general',
    others: 'others'
}
const Letters = [null, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const TaskStatus = {
    succ: "success",
    fail: "failed",
    running: "running"
}

export { ComponentType, Letters, TaskStatus };