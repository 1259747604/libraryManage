import { get, post, postForm, postJson, postFormdata } from "./request";

import user from "./config/user";
import upload from "./config/upload";

const apiList = {
    user,
    upload
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
