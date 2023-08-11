# Generated by Django 4.2.1 on 2023-08-10 17:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50, verbose_name='Title')),
                ('description', models.TextField(verbose_name='description')),
                ('location', models.TextField(verbose_name='location')),
                ('start_date', models.DateTimeField(verbose_name='start date')),
                ('end_date', models.DateTimeField(verbose_name='end date')),
                ('participants', models.PositiveIntegerField(default=0, verbose_name='Participants')),
                ('capacity', models.PositiveIntegerField(default=0, verbose_name='Capacity')),
                ('event_image', models.ImageField(blank=True, null=True, upload_to='event_images/', verbose_name='Event Image')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events_as_student', to=settings.AUTH_USER_MODEL, verbose_name='student id')),
            ],
        ),
        migrations.CreateModel(
            name='EventType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=50, verbose_name='type')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workshops.event', verbose_name='event_id')),
            ],
        ),
    ]