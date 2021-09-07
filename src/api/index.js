import { get, post, postForm, postJson, postFormdata } from "./request";

import user from "./config/user";

const apiList = {
    user
};

const fn = { get, post, postForm, postJson, postFormdata };

function proxy(url, method, config) {
    return function (data) {
        return fn[method](url, data, config);
    };
}

Object.keys(apiList).forEach(namespace => {
    Object.keys(apiList[namespace]).forEach(api => {
        const { url, method, config } = apiList[namespace][api];
        apiList[namespace][api] = proxy(url, method, config);
    });
});

export default apiList;
