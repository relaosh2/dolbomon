import paramiko
import os
import sys
import time

hostname = '192.168.219.118'
port = 8022
username = 'shoh'
password = 'Djflsdl21!'
tarball_path = '/Users/oseongho/Desktop/antigravity-platform/caregiver-os-app.tar.gz'
remote_tarball = '/var/services/homes/shoh/caregiver-os-app.tar.gz'
remote_app_dir = '/var/services/homes/shoh/caregiver-os-app'

print("Connecting to SSH on port 8022...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    ssh.connect(hostname, port=port, username=username, password=password, timeout=15, look_for_keys=False, allow_agent=False)
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)
print("Connected successfully!")

# Step 1: Upload the file by streaming it to `cat`
print("Step 1: Uploading caregiver-os-app.tar.gz to remote server...")
try:
    stdin, stdout, stderr = ssh.exec_command(f"cat > '{remote_tarball}'")
    with open(tarball_path, 'rb') as f:
        stdin.write(f.read())
    stdin.close()
    exit_status = stdout.channel.recv_exit_status()
    if exit_status != 0:
        print(f"Failed to upload tarball: exit code {exit_status}")
        print(stderr.read().decode('utf-8'))
        ssh.close()
        sys.exit(1)
except Exception as e:
    print(f"Upload error: {e}")
    ssh.close()
    sys.exit(1)
print("Upload complete!")

# Step 2: Extract the tarball
print("Step 2: Extracting tarball on remote server...")
extract_cmd = f"mkdir -p '{remote_app_dir}' && tar -xzf '{remote_tarball}' -C '{remote_app_dir}' --strip-components=1 && rm '{remote_tarball}'"
stdin, stdout, stderr = ssh.exec_command(extract_cmd)
exit_status = stdout.channel.recv_exit_status()
if exit_status != 0:
    print(f"Failed to extract tarball: exit code {exit_status}")
    print(stderr.read().decode('utf-8'))
    ssh.close()
    sys.exit(1)
print("Extraction complete!")

# Step 3: Start Docker Container Manager (requires sudo)
print("Step 3: Gaining root privileges and checking Docker/Container Manager...")
channel = ssh.invoke_shell()

def wait_and_read(channel, timeout=5):
    t_start = time.time()
    out = ""
    while time.time() - t_start < timeout:
        if channel.recv_ready():
            out += channel.recv(9999).decode('utf-8', errors='ignore')
        else:
            time.sleep(0.1)
    return out

# Wait for the login shell prompt
output = wait_and_read(channel)
print(output)

# Send sudo -i
print("Sending 'sudo -i'...")
channel.send("sudo -i\n")
output = wait_and_read(channel)
print(output)

# If it asks for password
if "Password" in output or "password" in output:
    print("Sending password for sudo...")
    channel.send(password + "\n")
    output = wait_and_read(channel)
    print(output)

# Start Container Manager/Docker
print("Starting Container Manager/Docker...")
start_docker_cmd = "synopkg start ContainerManager || synopkg start Docker || systemctl start pkg-ContainerManager.service || systemctl start pkg-Docker.service || true\n"
channel.send(start_docker_cmd)
output = wait_and_read(channel, timeout=8) # Wait for synopkg to run
print(output)

# Sleep to make sure docker is fully up
print("Sleeping for 5 seconds...")
time.sleep(5)

# Deploy using docker-compose
print("Building and running docker-compose...")
deploy_cmd = f"cd {remote_app_dir} && docker-compose down 2>/dev/null || true\n"
channel.send(deploy_cmd)
output = wait_and_read(channel)
print(output)

channel.send("docker-compose up -d --build\n")
output = wait_and_read(channel, timeout=30) # Wait for docker-compose to build and start
print(output)

channel.send("exit\n")
output = wait_and_read(channel)
channel.send("exit\n")

print("Deployment Process Finished!")
ssh.close()
