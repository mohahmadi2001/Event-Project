
import os

command = 'echo from core.models import User; User.objects.create_superuser("admin@admin.com", "admin") | py manage.py shell'
os.system(command)