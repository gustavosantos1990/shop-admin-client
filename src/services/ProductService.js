export const getProducts = async includeDeleted => {
    const url = new URL('/v1/products', "http://192.168.1.100:9999");

    if (includeDeleted !== undefined && includeDeleted !== null) {
        url.searchParams.append("include_deleted", includeDeleted);
    }

    console.log(url);

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const getProductByID = async id => {
    const url = new URL(`/v1/products/${id}`, "http://192.168.1.100:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const saveNewProduct = async payload => {
    const url = new URL('/v1/products', "http://192.168.1.100:9999");

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

export const updateProduct = async payload => {
    const url = new URL(`/v1/products/${payload.id}`, "http://192.168.1.100:9999");

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

export const deleteProduct = async id => {
    const url = new URL(`/v1/products/${id}`, "http://192.168.1.100:9999");

    return new Promise((resolve, reject) =>
        resolve(fetch(url, { method: "DELETE" })
            .catch(err => reject(err)))
    );
};