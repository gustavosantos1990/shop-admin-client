export const getCustomers = async () => {
    const url = new URL('/v1/customers', "http://192.168.1.100:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const getCustomersByPhone = async phone => {
    const url = new URL(`/v1/customers/${phone}`, "http://192.168.1.100:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const updateCustomer = async payload => {
    const url = new URL(`/v1/customers/${payload.id}`, "http://192.168.1.100:9999");

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