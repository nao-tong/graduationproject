/**
 * 验证码设置(前台验证)
 */

const express = require('express');
const svgCaptcha = require('svg-captcha');

let svg = express.Router();

//返回svg图片
svg.get('/svg', function (req, res) {
    let captcha = svgCaptcha.create();
    text = captcha.text;
	res.status(200).send(captcha);
});

module.exports = svg;