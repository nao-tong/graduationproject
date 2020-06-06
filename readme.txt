文件介绍：
.vscode 文件里面是配置文件，配置vscode的
Browser里面就是vue的文件
Client 文件里面是单纯的html、css、js文件
Mysql里面就是sql文件，用navicat可视化工具直接打开用就行
Server文件里面装的是服务端文件

开启服务：
后端：Vscode打开server文件，运行npm app,或者装nodemon这个包,运行nodemon app（文件保存会自动重启服务）。
前端：vscode打开browser文件，然后切换到里面的client文件，直接运行npm run dev
