# Generated by Django 2.2.6 on 2020-08-21 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salons', '0009_auto_20200818_1919'),
    ]

    operations = [
        migrations.AddField(
            model_name='salon',
            name='booking',
            field=models.BooleanField(default=False),
        ),
    ]
