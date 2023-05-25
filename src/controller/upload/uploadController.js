const fs = require("fs")
const path = require("path")
const uploadService = require("../../service/upload/uploadService")
const { dirTime } = require("../../utils/tools")

class uploadController {
    /**
     * 上传文件逻辑
     */
    async uploadFile(ctx) {
        const { file } = ctx.request.files
        const oldPath = file.filepath; // 上传文件在服务器端的保存路径
        const newPath = `/upload/${dirTime()}/${file.newFilename}`; // 上传文件要被移动到的目标位置

        const dirPath = newPath.slice(0, newPath.lastIndexOf('/'));
        // console.log(newPath)
        // console.log('===')
        // console.log(dirPath)
        try {
            fs.mkdir(`../../../public${dirPath}`, { recursive: true }, (err) => {
                if (err && err.code !== 'EEXIST') throw err;
                console.log('文件夹已经创建或已经存在：' + dirPath);
            });
            fs.rename(oldPath, path.join(__dirname, `../../../public${newPath}`), (err) => {
                if (err) throw err;
                console.log('上传文件已经被移动到：' + path.join(__dirname, `../../../public${newPath}`));
            });
        } catch (err) {
            console.error(err)
            return "error!"
        }
        // 将文件路径替换一下
        const str = newPath;
        const newStr = str.replace("/upload/", '');
        ctx.body = {
            "imgurl": `http://localhost:8888/${newStr}`,
            "code": 200
        }
    }
}

module.exports = new uploadController()
