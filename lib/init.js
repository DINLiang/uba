/**
 * 初始化模板
 */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const pathExists = require('path-exists');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const help = require('./help');

module.exports = (name) => {
	var root = path.resolve(name);
	if(!pathExists.sync(name)) {
		fs.mkdirSync(root);
	} else {
		help.error('当前文件夹`' + name + '` 已经存在了，当前操作终止.');
		process.exit(1);
	}
	fs.copySync(path.join(__dirname, '/../boilerplate'), root);
	fs.renameSync(path.join(root, '/gitignore'), path.join(root, '.gitignore'));
	help.info(name + " 创建成功，位于 " + root);
	help.info("开始执行 npm install 安装依赖");
	process.chdir(root); 
	var args = ['install'].filter(function(e) {
		return e;
	});
	var proc = spawn('npm', args, {
		stdio: 'inherit'
	});
	proc.on('close', function(code) {
		if(code !== 0) {
			console.error('`npm ' + args.join(' ') + '` failed');
			return;
		}
		help.info("开始依赖安装完毕.");
	});
}