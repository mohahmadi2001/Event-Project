# Generated by Django 4.2.4 on 2023-08-17 09:34

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
            name='Candidate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_deleted', models.BooleanField(db_index=True, default=False)),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='First Name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='Last Name')),
                ('mobile', models.CharField(blank=True, max_length=11, null=True, unique=True, verbose_name='mobile number')),
                ('student_number', models.CharField(blank=True, max_length=50, null=True, verbose_name='student number')),
                ('registration_date', models.DateTimeField(auto_now_add=True, verbose_name='Registration Date')),
                ('is_approved', models.BooleanField(default=False, verbose_name='Approved')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Election',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_deleted', models.BooleanField(db_index=True, default=False)),
                ('title', models.CharField(max_length=50, verbose_name='Title')),
                ('description', models.TextField(verbose_name='description')),
                ('capacity', models.IntegerField(verbose_name='capacity')),
                ('candidate', models.ManyToManyField(related_name='election_as_candidate', to='elections.candidate')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='election_as_user', to=settings.AUTH_USER_MODEL, verbose_name='user id')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, core.models.TimeStampMixin),
        ),
        migrations.AddField(
            model_name='candidate',
            name='election',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='election_candidates', to='elections.election', verbose_name='candidates'),
        ),
        migrations.AddField(
            model_name='candidate',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_candidates', to=settings.AUTH_USER_MODEL, verbose_name='user id'),
        ),
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_deleted', models.BooleanField(db_index=True, default=False)),
                ('election', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='election_votes', to='elections.election')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'election')},
            },
        ),
    ]
