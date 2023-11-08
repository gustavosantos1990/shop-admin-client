export const getMeasures = async () => {
    const url = new URL('/v1/measures', "http://localhost:9999");
    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};
