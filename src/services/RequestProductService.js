export const getRequestProducts = async id => {
    const url = new URL(`/v1/requests/${id}/products`, "http://192.168.1.100:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const saveNewRequestProduct = async (requestID, payload) => {
    const url = new URL(`/v1/requests/${requestID}/products`, "http://192.168.1.100:9999");

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

export const updateRequestProduct = async (requestID, productID, payload) => {
    const url = new URL(`/v1/requests/${requestID}/products/${productID}`, "http://192.168.1.100:9999");

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

export const deleteRequestProduct = async (requestID, productID) => {
    const url = new URL(`/v1/requests/${requestID}/products/${productID}`, "http://192.168.1.100:9999");

    return new Promise((resolve, reject) =>
        resolve(fetch(url, { method: "DELETE" })
            .catch(err => reject(err)))
    );
};