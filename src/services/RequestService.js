export const getRequests = async () => {
    const url = new URL('/v1/requests', "http://192.168.1.13:9999");
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
};

export const getRequestByID = async id => {
    const url = new URL(`/v1/requests/${id}`, "http://192.168.1.13:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const saveNewRequest = async payload => {
    const url = new URL('/v1/requests', "http://192.168.1.13:9999");

    return new Promise((resolve, reject) =>
        resolve(
            fetch(url,
                {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            ).catch(err => reject(err))
        )
    );
};

export const updateRequest = async payload => {
    const url = new URL(`/v1/requests/${payload.id}`, "http://192.168.1.13:9999");

    return new Promise((resolve, reject) =>
        resolve(
            fetch(url,
                {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            ).catch(err => reject(err))
        )
    );
};