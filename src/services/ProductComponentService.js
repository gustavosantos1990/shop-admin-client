export const getProductComponents = async id => {
    const url = new URL(`/v1/products/${id}/components`, "http://192.168.1.100:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const saveNewProductComponent = async (productID, payload) => {
    const url = new URL(`/v1/products/${productID}/components`, "http://192.168.1.100:9999");

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

export const updateProductComponent = async (productID, componentID, payload) => {
    const url = new URL(`/v1/products/${productID}/components/${componentID}`, "http://192.168.1.100:9999");

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

export const deleteProductComponent = async (productID, componentID) => {
    const url = new URL(`/v1/products/${productID}/components/${componentID}`, "http://192.168.1.100:9999");

    return new Promise((resolve, reject) =>
        resolve(fetch(url, { method: "DELETE" })
            .catch(err => reject(err)))
    );
};