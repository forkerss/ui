import axios from "axios";
import { observable } from "mobx";
import { message } from "antd";
import cookie from 'react-cookies';
import moment from 'moment';
import { ComponentType, TaskStatus } from "../utils/constant";
import { genAPISign, isUrl } from "../utils/util";


class AppState {
    @observable componentsState = {
        select: {
            first: null,
            type: ComponentType.all,
            name: null
        },
        page: {
            cur: 0,
            per: 50,
            hasNext: true,
        },
        total: 0,
        loading: false,
        components: []
    }
    @observable scanState = {
        target: null,
        data: {
            status: null,
            doneat: null,
            result: null
        },
        done: {
            format: null,
            now: null
        }
    }
    selectvalue(type, value) {
        if (value === "" || value === undefined) value = null;
        let hasChange = false;
        switch (type) {
            case "first":
                if (this.componentsState.select.first != value) hasChange = true;
                this.componentsState.select.first = value;
                break;
            case "type":
                if (this.componentsState.select.type != value) hasChange = true;
                this.componentsState.select.type = value;
                break;
            case "name":
                if (this.componentsState.select.name != value) hasChange = true;
                this.componentsState.select.name = value;
                break;
        }
        if (hasChange) this.fetchComponents(hasChange);
    }
    componentMergeParams(selectHasChange) {
        // components page merge params
        let params = {};
        // filter
        params.per_page = this.componentsState.page.per;

        // page
        if (selectHasChange === true) {
            this.componentsState.page.cur = params.page = 1;
        } else {
            this.componentsState.page.cur = params.page = this.componentsState.page.cur === 0 ? 1 : this.componentsState.page.cur + 1;
        }
        if (this.componentsState.select.first != null) params.first = this.componentsState.select.first;
        if (this.componentsState.select.type != null) params.type = this.componentsState.select.type;
        if (this.componentsState.select.name != null) params.name = this.componentsState.select.name;
        return params;
    }
    updateComponentsData(res, selectHasChange) {
        // when `fetchData` error
        if (res == undefined) {
            this.componentsState.page.hasNext = false;
            message.error("网络链接异常");
            return
        }
        if (res.data.success != true) {
            this.componentsState.page.hasNext = false;
            if (res.data.code === 404) {
                message.warning("No more data!");
            } else message.error(res.data.message);
            return
        }
        this.componentsState.total = res.data.data["total_num"];
        this.componentsState.page.cur = res.data.data["cur_page_num"];
        this.componentsState.page.hasNext = res.data.data["has_next"];
        if (selectHasChange === true) {
            this.componentsState.components = res.data.data.components;
        } else {
            let _components = this.componentsState.components;
            this.componentsState.components = _components.concat(res.data.data.components);
        }
    }
    fetchComponents(selectHasChange) {
        axios.get(`${global.APIPRE}/v1/components`, {
            params: genAPISign(this.componentMergeParams(selectHasChange))
        })
            .then((res) => {
                console.log(res);
                this.updateComponentsData(res, selectHasChange);
            })
            .catch((error) => {
                console.log(error.response);
                this.updateComponentsData(error.response, selectHasChange);
            });
    }
    componentsHasMore() {
        return !this.componentsState.loading && this.componentsState.page.hasNext
    }
    componentsLoading() {
        return this.componentsState.loading && this.componentsState.page.hasNext
    }
    // scan
    scanTarget(target, retry) {
        if (!isUrl(target)) {
            message.warning("输入正确的URL");
            return
        }
        let params = { target: target };
        if (retry != undefined && retry === true) params.retry = true;
        axios.get(`${global.APIPRE}/v1/tasks`, {
            params: genAPISign(params),
            headers: {
                Ghuser: cookie.load("username")
            }
        })
            .then((res) => {
                console.log("succ", res, target, retry);
                this.handleScanRes(res, target, retry);
            })
            .catch((error) => {
                console.log("error", error, error.response);
                this.handleScanRes(error.response);
            });
    }
    handleScanRes(res, target, retry) {
        if (res === undefined) {
            message.error("网络链接异常");
            return
        }
        if (res.data.success != true) {
            switch (res.data.code) {
                case 404:
                    message.warning("Task not found!");
                    break
                case 1003:
                    message.warning("输入正确的URL");
                    break
                default:
                    message.error(res.data.message);
            }
            return
        }
        // 扫描新的目标时清空上一次的数据
        if (this.scanState.target != target || retry === true) {
            if (this.scanDoneNowTimer != undefined) {
                clearInterval(this.scanDoneNowTimer);
            }
            this.scanState.data.doneat = this.scanState.data.result = this.scanState.done.format = this.scanState.done.now = null;
        }
        this.scanState.target = target;
        this.scanState.data.status = res.data.data.status;
        switch (this.scanState.data.status) {
            case TaskStatus.succ:
                this.scanState.data.doneat = res.data.data.done_at;
                this.scanState.data.result = res.data.data.result;
                this.setScanDoneNow();
                break
            case TaskStatus.running:
                this.setGetTaskRunningResult();
                break
        }
    }
    setScanDoneNow() {
        // loop 显示 done.now
        if (this.scanState.data.doneat === null) {
            return null
        }
        this.scanState.done.format = moment(this.scanState.data.doneat).format('YYYY-MM-DD HH:mm:ss');
        this.scanState.done.now = moment(this.scanState.data.doneat).fromNow();
        if (this.scanDoneNowTimer != undefined) {
            clearInterval(this.scanDoneNowTimer);
        }
        this.scanDoneNowTimer = setInterval(
            () => { this.scanState.done.now = moment(this.scanState.data.doneat).fromNow() },
            1000 * 60 * 2
        );
    }
    setGetTaskRunningResult() {
        // loop 获取正在 running 的 task
        this.getRunningTaskResultTimer = setInterval(
            () => {
                axios.get(`${global.APIPRE}/v1/tasks`, {
                    params: genAPISign({ target: this.scanState.target }),
                    headers: {
                        Ghuser: cookie.load("username")
                    }
                })
                    .then((res) => {
                        console.log("succ", res);
                        this.scanState.data.status = res.data.data.status;
                        switch (this.scanState.data.status) {
                            case TaskStatus.succ:
                                this.scanState.data.doneat = res.data.data.done_at;
                                this.scanState.data.result = res.data.data.result;
                                this.setScanDoneNow();
                                clearInterval(this.getRunningTaskResultTimer);
                        }
                    })
                    .catch((error) => {
                        console.log("error", error.response);
                        clearInterval(this.getRunningTaskResultTimer);
                    });
            },
            1000 * 60
        );
    }
}

export default new AppState();