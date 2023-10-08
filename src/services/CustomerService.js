export const getCustomers = async () => {
    const url = new URL('/v1/customers', "http://192.168.1.13:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};

export const getCustomersByPhone = async phone => {
    const url = new URL(`/v1/customers/${phone}`, "http://192.168.1.13:9999");

    return new Promise((resolve, reject) =>
        fetch(url, { method: "GET" })
            .catch(err => {
                console.log(err);
                reject();
            }).then(res => resolve(res))
    );
};