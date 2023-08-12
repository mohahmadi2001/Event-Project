# Generated by Django 4.2.1 on 2023-08-12 05:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('elections', '0002_remove_election_end_date_remove_election_start_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='election',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='electionoption',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='vote',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_deleted', models.BooleanField(db_index=True, default=False)),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='First Name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='Last Name')),
                ('registration_date', models.DateTimeField(auto_now_add=True, verbose_name='Registration Date')),
                ('is_approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('description', models.TextField(blank=True, null=True, verbose_name='Description')),
                ('election', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='election_candidates', to='elections.election', verbose_name='candidates')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_candidates', to=settings.AUTH_USER_MODEL, verbose_name='student id')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
