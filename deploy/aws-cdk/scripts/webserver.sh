yum update
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>hello world</h1>" > /var/www/html/index.html