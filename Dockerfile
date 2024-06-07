# 使用官方的Nginx作为基础镜像  
FROM nginx:stable-alpine  
  
# 复制本地构建文件到容器的/usr/share/nginx/html目录  
COPY ./build /usr/share/nginx/html  
  
# 如果你的React应用需要特定的Nginx配置，你可以将你的nginx.conf文件复制到容器中  
# 假设你的配置文件名为nginx.conf，它位于与Dockerfile相同的目录中  
# COPY nginx.conf /etc/nginx/conf.d/default.conf  

# 暴露80端口  
EXPOSE 80

# 设置默认命令，让Nginx在前台运行  
CMD ["nginx", "-g", "daemon off;"]
