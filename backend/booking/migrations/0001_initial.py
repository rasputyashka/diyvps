# Generated by Django 5.1.3 on 2024-11-22 21:31

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Machine',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                (
                    'status',
                    models.CharField(default='available', max_length=50),
                ),
                ('ipv4', models.GenericIPAddressField()),
                ('ipv6', models.GenericIPAddressField(blank=True, null=True)),
                ('password', models.CharField(max_length=50)),
                ('cpuCores', models.IntegerField()),
                ('ram', models.IntegerField()),
                ('ssd', models.IntegerField(blank=True, null=True)),
                ('hdd', models.IntegerField(blank=True, null=True)),
                ('operatingSystem', models.CharField(max_length=50)),
                ('bandwidth', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('bookedFrom', models.DateTimeField()),
                ('bookedUntil', models.DateTimeField()),
                (
                    'bookedBy',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    'machine',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to='booking.machine',
                    ),
                ),
            ],
        ),
    ]