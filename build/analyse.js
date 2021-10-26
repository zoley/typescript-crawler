"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var Analyse = /** @class */ (function () {
    function Analyse() {
    }
    Analyse.getInstance = function () {
        if (!this.instance) {
            this.instance = new Analyse();
        }
        return this.instance;
    };
    /**
     * 分析数据
     * @param html
     */
    Analyse.prototype.analyseContentData = function (html) {
        var $ = cheerio_1.default.load(html);
        var uls = $('.cc-cd-cb-l.nano-content .cc-cd-cb-ll');
        var childData = [];
        uls.each(function (index, ele) {
            if (index > 9)
                return;
            var title = $(ele).find('.t').text();
            var exponent = $(ele).find('.e').text();
            var link = $(ele).parent().attr('href');
            childData.push({ title: title, exponent: exponent, link: link });
        });
        return {
            time: (new Date()).getTime(),
            data: childData
        };
    };
    /**
     * 生成json
     * @param machiningData e
     * @returns
     */
    Analyse.prototype.generateToJson = function (machiningData, filePath) {
        var content = {};
        if (fs_1.default.existsSync(filePath)) {
            content = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        content[machiningData.time] = machiningData.data;
        return content;
    };
    Analyse.prototype.analyseData = function (text, filePath) {
        var machiningData = this.analyseContentData(text);
        var tempData = this.generateToJson(machiningData, filePath);
        return JSON.stringify(tempData);
    };
    return Analyse;
}());
exports.default = Analyse;
