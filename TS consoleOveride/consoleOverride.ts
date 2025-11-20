const originalLog = console.log;

console.log = (data: any): void => {
    if (typeof data === "object") {
        data = JSON.stringify(data, null, 2);
    }
    originalLog(data);
};

export {};
