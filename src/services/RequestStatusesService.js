export const getRequestStatuses = async () => {
    const url = new URL('/v1/statuses', "http://localhost:9999");
    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};
