import { http } from './service.js'
import tip from '@/common/utils/tip.js'

const file = {

    // 获取七牛Token
    getQiniuToken(params) {
        return http.get('file/upload-token', { params: params })
    },

    // 上传文件到七牛云
    uploadImageToQiniu(key, file) {
        let that = this;
        return new Promise((resolve, reject) => {
            tip.loading("上传文件中....");
            that.getQiniuToken().then((res) => {
                console.log("token res", res);
                if (!res.data.success) reject(res.data.message)
                let token = res.data.result.token;
                let host = res.data.result.host;
                uni.uploadFile({
                    url: "https://up-z2.qiniup.com",
                    filePath: file,
                    fileType: "image",
                    name: "file",
                    formData: {
                        key: key,
                        token,
                    },
                    header: {
                        "Content-Type": "multipart/form-data",
                    },
                    success: (res) => {
                        console.log("su", res);
                        tip.loaded();
                        if (res.statusCode != 200) {
                            let data = JSON.parse(res.data)
                            reject("上回传七牛云失败：" + data.error)
                        } else {
                            console.log(`${host}${key}`);
                            resolve(`${host}${key}`)
                        }
                    },
                    fail: (err) => {
                        console.log("err", err);
                        tip.loaded();
                        reject(`上传图片失败`);
                    },
                });
            });
        })
    }
}

export default file;