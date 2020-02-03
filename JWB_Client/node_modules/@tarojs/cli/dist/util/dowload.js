"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const request = require("request");
const GITHUB_API = 'https://api.github.com/';
const GITHUB = 'https://github.com/';
function getGithubRepoLatestReleaseVersion(repoName) {
    const latestReleaseApi = `${GITHUB_API}repos/${repoName}/releases/latest`;
    const p = new Promise((resolve, reject) => {
        request({
            url: latestReleaseApi,
            headers: {
                'User-Agent': 'Awesome-Octocat-App'
            }
        }, (err, response, body) => {
            if (err) {
                throw new Error('快应用容器版本请求失败，请重试！');
            }
            const res = JSON.parse(body);
            resolve(res.tag_name);
        });
    });
    return p;
}
exports.getGithubRepoLatestReleaseVersion = getGithubRepoLatestReleaseVersion;
function downloadGithubRepoLatestRelease(repoName, appPath, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const latestTagName = yield getGithubRepoLatestReleaseVersion(repoName);
        return new Promise((resolve, reject) => {
            const downloadUrl = `${GITHUB}${repoName}/archive/${latestTagName}.zip`;
            const downloadTemp = 'download_temp.zip';
            request({
                url: downloadUrl,
                headers: {
                    'User-Agent': 'Awesome-Octocat-App'
                }
            })
                .on('error', reject)
                .on('complete', () => {
                const downloadTempPath = path.join(appPath, downloadTemp);
                if (fs.existsSync(downloadTempPath)) {
                    fs.moveSync(downloadTempPath, path.join(dest, downloadTemp));
                    resolve();
                }
            })
                .pipe(fs.createWriteStream(downloadTemp));
        });
    });
}
exports.downloadGithubRepoLatestRelease = downloadGithubRepoLatestRelease;
