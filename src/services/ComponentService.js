export const getRequests = async () => {
    const url = new URL('/v1/requests', "http://localhost:9999");
    url.searchParams.append("start_date", "2023-01-01");
    url.searchParams.append("end_date", "2023-12-31");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            })
            .then(res => resolve(res))
    );
;}