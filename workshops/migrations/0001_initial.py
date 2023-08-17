# Generated by Django 4.2.4 on 2023-08-17 08:22

import core.models
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
                ('is_deleted', models.BooleanField(db_index=True, default=False)),
                ('title', models.CharField(max_length=50, verbose_name='Title')),
                ('description', models.TextField(verbose_name='description')),
                ('location', models.TextField(verbose_name='location')),
                ('capacity', models.PositiveIntegerField(default=0, verbose_name='Capacity')),
                ('price', models.FloatField(verbose_name='price')),
                ('image', models.ImageField(blank=True, null=True, upload_to='event_images/', verbose_name='Event Image')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to=settings.AUTH_USER_MODEL, verbose_name='user id')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, core.models.TimeStampMixin),
        ),
    ]
