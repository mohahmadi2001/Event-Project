# Generated by Django 4.2.4 on 2023-08-25 08:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workshops', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='slug',
            field=models.SlugField(default='-', verbose_name='slug'),
        ),
    ]
