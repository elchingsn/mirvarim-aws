# Generated by Django 2.2.6 on 2021-01-07 16:23

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salons', '0009_auto_20210107_1753'),
    ]

    operations = [
        migrations.AddField(
            model_name='salon',
            name='close',
            field=models.TimeField(blank=True, default=datetime.time(22, 0)),
        ),
        migrations.AddField(
            model_name='salon',
            name='open',
            field=models.TimeField(blank=True, default=datetime.time(8, 0)),
        ),
    ]
