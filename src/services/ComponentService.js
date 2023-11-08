export const getComponents = async includeDeleted => {
    const url = new URL('/v1/components', "http://localhost:9999");

    if (includeDeleted !== undefined && includeDeleted !== null) {
        url.searchParams.append("include_deleted", includeDeleted);
    }

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const getComponentsByID = async id => {
    const url = new URL(`/v1/components/${id}`, "http://localhost:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const saveNewComponent = async payload => {
    const url = new URL('/v1/components', "http://localhost:9999");

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

export const updateComponent = async payload => {
    const url = new URL(`/v1/components/${payload.id}`, "http://localhost:9999");

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

export const deleteComponent = async id => {
    const url = new URL(`/v1/components/${id}`, "http://localhost:9999");

    return new Promise((resolve, reject) =>
        resolve(fetch(url, { method: "DELETE" })
            .catch(err => reject(err)))
    );
};