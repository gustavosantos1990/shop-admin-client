<<<<<<< HEAD
export const getRequests = async () => {
    const url = new URL('/v1/requests', "http://localhost:9999");
    url.searchParams.append("start_date", "2023-01-01");
    url.searchParams.append("end_date", "2023-12-31");
=======
export const getRequests = async (start, end) => {
    const url = new URL('/v1/requests', "http://localhost:9999");

    if (start && end) {
        url.searchParams.append("start_date", start.toISOString().split('T')[0]);
        url.searchParams.append("end_date", end.toISOString().split('T')[0]);
    }

    console.log(url.searchParams.values.toString);
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d

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
    const url = new URL(`/v1/requests/${id}`, "http://localhost:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const saveNewRequest = async payload => {
    const url = new URL('/v1/requests', "http://localhost:9999");

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
    const url = new URL(`/v1/requests/${payload.id}`, "http://localhost:9999");

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

export const updateRequestStatus = async (id, desiredStatus) => {
    const url = new URL(`/v1/requests/${id}/status/${desiredStatus}`, "http://localhost:9999");

    return new Promise((resolve, reject) =>
        resolve(
            fetch(url,
                {
                    method: "PATCH",
                    headers: { 'Content-Type': 'application/json' }
                }
            ).catch(err => reject(err))
        )
    );
};